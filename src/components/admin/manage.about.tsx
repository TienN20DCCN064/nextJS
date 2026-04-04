'use client';

import { useEffect, useState, useCallback } from 'react';
import { Form, Input, Button, Card, notification, Typography, Modal, Switch, Table, Popconfirm, Space, Upload } from 'antd';
import { createPage, updatePage, deletePage, fetchPages } from '@/hooks/api/pages';
import { EditTwoTone, DeleteTwoTone, UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "@/utils/helpers";

const { TextArea } = Input;

interface PageData {
  id?: number;
  type?: string;
  title: string;
  content: string;
  slug: string;
  image?: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ManageAboutProps {
  initialData: PageData[];
  token: string | undefined;
}

const ManageAbout = ({ initialData, token }: ManageAboutProps) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [pages, setPages] = useState<PageData[]>(initialData || []);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<PageData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPages(token);
      setPages(data);
    } catch {
      notification.error({ message: "Lỗi khi tải dữ liệu trang" });
    } finally {
      setLoading(false);
    }
  }, [token]);

  const openModal = (record?: PageData) => {
    if (record) {
      setEditingId(record.id || null);
      setEditingData(record);
      setPreviewImage(record.image || "");
    } else {
      setEditingId(null);
      setEditingData(null);
      form.resetFields();
      setPreviewImage("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setEditingData(null);
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
      const payload = {
        ...values,
        isPublished: values.isPublished ?? true,
      };

      if (editingId) {
        await updatePage(editingId, payload, token);
      } else {
        await createPage(payload, token);
      }

      notification.success({ message: editingId ? 'Cập nhật trang thành công' : 'Thêm trang mới thành công' });
      handleCloseModal();
      fetchData();
    } catch (error: any) {
      notification.error({ message: 'Lỗi', description: error?.message || 'Thao tác thất bại' });
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: any) => {
    setLoading(true);
    try {
      await deletePage(id, token);
      notification.success({ message: "Xóa trang thành công" });
      fetchData();
    } catch {
      notification.error({ message: "Lỗi khi xóa trang" });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "STT",
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    { title: "Loại", dataIndex: "type", key: "type" },
    { 
      title: "Trạng thái", 
      dataIndex: "isPublished", 
      render: (val: boolean) => val ? <Typography.Text type="success">Hiển thị</Typography.Text> : <Typography.Text type="secondary">Ẩn</Typography.Text>
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_: any, record: PageData) => (
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <EditTwoTone
            twoToneColor="#f57800"
            style={{ cursor: "pointer" }}
            onClick={() => openModal(record)}
          />
          <Popconfirm title="Xóa trang này?" onConfirm={() => remove(record.id)}>
            <span style={{ cursor: "pointer" }}>
              <DeleteTwoTone twoToneColor="#ff4d4f" />
            </span>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Card title="Quản lý Các Trang Nội dung" style={{ minHeight: 'calc(100vh - 240px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Paragraph style={{ margin: 0 }}>
          Quản lý toàn bộ thông tin trong bảng pages (Giới thiệu, Liên hệ, Chính sách...).
        </Typography.Paragraph>
        <Button type="primary" onClick={() => openModal()}>
          Thêm trang mới
        </Button>
      </div>

      <Table 
        dataSource={pages} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
      />

      <Modal
        title={editingId ? "Chỉnh sửa Trang" : "Thêm trang mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        maskClosable={false}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={submit}
          onFinishFailed={onFinishFailed}
          key={editingId || "new"}
          initialValues={editingData || { type: 'general', slug: '', isPublished: true }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item label="Loại trang" name="type" rules={[{ required: true }]}>
              <Input placeholder="ví dụ: about, contact, policy" />
            </Form.Item>
            <Form.Item label="Đường dẫn (Slug)" name="slug" rules={[{ required: true }]}>
              <Input placeholder="ví dụ: gioi-thieu" />
            </Form.Item>
          </div>

          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Tiêu đề trang" />
          </Form.Item>

          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea rows={12} placeholder="Nội dung chi tiết của trang" />
          </Form.Item>
          
          <Form.Item name="image" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="Ảnh đại diện (Upload)">
            <Upload
              maxCount={1}
              beforeUpload={async (file) => {
                const base64 = await getBase64(file);
                form.setFieldValue('image', base64);
                setPreviewImage(base64);
                return false;
              }}
              onRemove={() => { form.setFieldValue('image', null); setPreviewImage(""); }}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {previewImage && (
              <img src={previewImage} alt="preview" style={{ marginTop: 8, maxWidth: '100%', maxHeight: 120, objectFit: 'contain', borderRadius: 4, border: '1px solid #d9d9d9' }} />
            )}
          </Form.Item>

          <Form.Item label="Hiển thị" name="isPublished" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={handleCloseModal} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingId ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageAbout;

