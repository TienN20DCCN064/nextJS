"use client";
import { useEffect, useState } from "react";
import { Form, Input, Button, Card, notification, Typography, Table, Popconfirm, Modal, Switch, Select, DatePicker, Upload, Image } from "antd";
import { createAnnouncement, deleteAnnouncement, fetchAnnouncements, updateAnnouncement, fetchCategories } from "@/hooks/apiHooks";
import dayjs from "dayjs";
import { EditTwoTone, DeleteTwoTone, UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "@/utils/helpers";

interface AnnouncementData {
  id?: number;
  title: string;
  summary: string;
  content: string;
  thumbnail?: string;
  categoryId?: number;
  isFeatured?: boolean;
  isPublished?: boolean;
  publishedAt?: string | Date;
}

interface CategoryData {
  id: number;
  name: string;
}

interface ManageAnnouncementsProps {
  token: string | undefined;
}

const ManageAnnouncements = ({ token }: ManageAnnouncementsProps) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [editing, setEditing] = useState<AnnouncementData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [previewImage, setPreviewImage] = useState<string>("");

  const loadCategories = async () => {
    try {
      const data = await fetchCategories(token);
      setCategories(data);
    } catch {
      console.error("Failed to load categories");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchAnnouncements(token, statusFilter);
      setAnnouncements(data);
    } catch {
      notification.error({ message: "Lỗi khi tải dữ liệu" });
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { 
    fetchData(); 
    loadCategories();
  }, [token, statusFilter]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setPreviewImage("");
    form.resetFields();
  };

  const onFinishFailed = (errorInfo: any) => {
    notification.error({
      message: 'Vui lòng kiểm tra lại thông tin',
      description: errorInfo.errorFields?.[0]?.errors?.[0],
    });
  };

  const submit = async (values: any) => {
    setLoading(true);
    try {
      const generateSlug = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
      const payload = { 
        ...values, 
        slug: generateSlug(values.title),
        thumbnail: values.thumbnail,
        categoryId: values.categoryId,
        isFeatured: values.isFeatured ?? false,
        isPublished: values.isPublished ?? true, 
        publishedAt: values.publishedAt ? values.publishedAt.toDate() : null,
        type: "announcement" 
      };
      let response;
      if (editing?.id) {
        await updateAnnouncement(editing.id, payload, token);
      } else {
        await createAnnouncement(payload, token);
      }
      notification.success({ message: "Lưu thông báo thành công" });
      handleCloseModal();
      fetchData();
    } catch (error: any) {
      notification.error({ message: "Lỗi", description: error?.message || "Cập nhật thất bại" });
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    setLoading(true);
    try {
      await deleteAnnouncement(id, token);
      notification.success({ message: "Xóa thành công" });
      fetchData();
    } catch {
      notification.error({ message: "Lỗi khi xóa" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Quản lý Thông báo" style={{ minHeight: "calc(100vh - 240px)" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Paragraph style={{ margin: 0 }}>
          Thêm/sửa/xóa các thông báo sẽ hiển thị tại /announcements.
        </Typography.Paragraph>
        <div style={{ display: 'flex', gap: 12 }}>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'published', label: 'Đang hiển thị' },
              { value: 'draft', label: 'Bản nháp' },
            ]}
          />
          <Button type="primary" onClick={() => { setEditing(null); form.resetFields(); setIsModalOpen(true); }}>
            Thêm mới
          </Button>
        </div>
      </div>
      <Modal
        title={editing ? "Chỉnh sửa Thông báo" : "Thêm mới Thông báo"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        maskClosable={false}
        destroyOnClose
      >
        <Form
        form={form}
        layout="vertical"
        initialValues={editing ? {
          ...editing,
          publishedAt: editing.publishedAt ? dayjs(editing.publishedAt) : null
        } : { title: "", summary: "", content: "", thumbnail: "", categoryId: undefined, isFeatured: false, isPublished: true, publishedAt: null }}
        onFinish={submit}
        onFinishFailed={onFinishFailed}
        key={editing?.id || "new"}
      >
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Tóm tắt" name="summary" rules={[{ required: true, message: "Vui lòng nhập tóm tắt" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="thumbnail" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="Ảnh đại diện (Upload)">
          <Upload
            maxCount={1}
            beforeUpload={async (file) => {
              const base64 = await getBase64(file);
              form.setFieldValue('thumbnail', base64);
              setPreviewImage(base64);
              return false;
            }}
            onRemove={() => { form.setFieldValue('thumbnail', null); setPreviewImage(""); }}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
          {previewImage && (
            <img src={previewImage} alt="preview" style={{ marginTop: 8, maxWidth: '100%', maxHeight: 120, objectFit: 'contain', borderRadius: 4, border: '1px solid #d9d9d9' }} />
          )}
        </Form.Item>
        <Form.Item label="Tác giả" name="author">
          <Input />
        </Form.Item>
        <Form.Item label="Nội dung" name="content" rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}>
          <Input.TextArea rows={6} />
        </Form.Item>
        <Form.Item label="Danh mục" name="categoryId">
          <Select 
            options={categories.map(c => ({ value: c.id, label: c.name }))}
            placeholder="Chọn danh mục"
            allowClear
          />
        </Form.Item>
        <Form.Item label="Ngày xuất bản" name="publishedAt">
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Nổi bật" name="isFeatured" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Hiển thị" name="isPublished" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Button onClick={handleCloseModal} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {editing ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form.Item>
      </Form>
      </Modal>
      <Table
        dataSource={announcements}
        rowKey="id"
        columns={[
          {
            title: "STT",
            render: (_: any, record: any, index: any) => {
              return <>{index + 1}</>;
            },
            width: 60,
          },
          { title: "Tiêu đề", dataIndex: "title" },
          {
            title: "Ảnh",
            dataIndex: "thumbnail",
            width: 80,
            render: (thumb: string) => thumb ? <Image src={thumb} width={40} height={40} style={{ objectFit: 'cover', borderRadius: 4 }} alt="thumbnail" /> : null,
          },
          { title: "Trạng thái", dataIndex: "isPublished", render: (v: boolean) => v ? "Hiển thị" : "Ẩn", width: 100 },
          {
            title: "Hành động",
            width: 120,
            render: (_: any, record: AnnouncementData) => (
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <EditTwoTone
                  twoToneColor="#f57800"
                  style={{ cursor: "pointer" }}
                  onClick={() => { 
                    setEditing(record); 
                    form.setFieldsValue({
                      ...record,
                      publishedAt: record.publishedAt ? dayjs(record.publishedAt) : null
                    }); 
                    setPreviewImage(record.thumbnail || "");
                    setIsModalOpen(true); 
                  }}
                />
                <Popconfirm title="Xóa?" onConfirm={() => remove(record.id as any)}>
                  <span style={{ cursor: "pointer" }}>
                    <DeleteTwoTone twoToneColor="#ff4d4f" />
                  </span>
                </Popconfirm>
              </div>
            ),
          },
        ]}
        style={{ marginTop: 24 }}
        loading={loading}
      />
    </Card>
  );
};

export default ManageAnnouncements;
