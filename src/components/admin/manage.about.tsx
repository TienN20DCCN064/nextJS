'use client';
import { useEffect, useState, useCallback } from 'react';
import { Form, Input, Button, Card, notification, Typography, Modal, Switch, Table, Popconfirm, Space, Upload, Row, Col, Tabs } from 'antd';
import { createPage, updatePage, deletePage, fetchPages } from '@/hooks/api/pages';
import { EditTwoTone, DeleteTwoTone, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { getBase64 } from "@/utils/helpers";
import dayjs from "dayjs";

const { TextArea } = Input;

const SYSTEM_TYPES = [
  { type: 'location', title: 'Vị trí bản đồ (Location)', slug: 'location' },
  { type: 'contact', title: 'Thông tin Liên hệ', slug: 'contact' },
  { type: 'about', title: 'Bài Giới thiệu chung', slug: 'about' },
  { type: 'phone', title: 'Số điện thoại', slug: 'phone' },
  { type: 'email', title: 'Email liên hệ', slug: 'email' },
  { type: 'name', title: 'Tên hệ thống / cơ quan', slug: 'name' },
  { type: 'logo', title: 'Logo hiển thị', slug: 'logo' },
  { type: 'agency', title: 'Cơ quan chủ quản', slug: 'agency' },
  { type: 'address', title: 'Địa chỉ trụ sở', slug: 'address' },
];

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
  isSystemMissing?: boolean;
  isSystem?: boolean;
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
  const [isSystemModal, setIsSystemModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
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

  const openModal = (record?: PageData, isSystem = false) => {
    setIsSystemModal(isSystem);
    if (record) {
      setEditingId(record.id || null);
      setEditingData(record);
      if (!record.id) {
          form.setFieldsValue({
              type: record.type,
              slug: record.slug,
              title: record.title,
              isPublished: true,
          });
      } else {
          form.setFieldsValue({ ...record });
      }
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
      const { type, slug, title, content, image, isPublished } = values;
      const payload = {
        type,
        slug,
        title,
        content,
        image,
        isPublished: isPublished ?? true,
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

  const systemItems = SYSTEM_TYPES.map(sys => {
    const existing = pages.find(p => p.type === sys.type);
    if (existing) return { ...existing, isSystem: true };
    return { 
      title: sys.title, 
      type: sys.type, 
      slug: sys.slug, 
      content: '', 
      isSystemMissing: true, 
      isSystem: true 
    };
  });

  const otherItems = pages.filter(p => !SYSTEM_TYPES.some(s => s.type === p.type));

  let tableData: PageData[] = [];
  if (filterType === 'all') {
    tableData = [...systemItems, ...otherItems];
  } else if (filterType === 'required') {
    tableData = systemItems;
  } else {
    tableData = otherItems;
  }

  const columns = [
    {
      title: "STT",
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    { title: "Tiêu đề", dataIndex: "title", key: "title", ellipsis: true },
    { title: "Slug", dataIndex: "slug", key: "slug", width: 150 },
    { title: "Loại", dataIndex: "type", key: "type", width: 100 },
    { 
      title: "Ngày tạo", 
      dataIndex: "createdAt", 
      width: 150,
      render: (v: any) => v ? dayjs(v).format('DD/MM/YYYY HH:mm') : '-'
    },
    { 
      title: "Trạng thái", 
      dataIndex: "isPublished", 
      width: 100,
      render: (val: boolean) => val ? <Typography.Text type="success">Hiển thị</Typography.Text> : <Typography.Text type="secondary">Ẩn</Typography.Text>
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_: any, record: PageData) => {
        if (record.isSystemMissing) {
          return (
            <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => openModal(record, true)}>
              Thêm
            </Button>
          );
        }
        return (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer" }}
              onClick={() => openModal({ ...record, isSystem: record.isSystem }, record.isSystem)}
            />
            {!record.isSystem && (
              <Popconfirm title="Xóa trang này?" onConfirm={() => remove(record.id)}>
                <span style={{ cursor: "pointer" }}>
                  <DeleteTwoTone twoToneColor="#ff4d4f" />
                </span>
              </Popconfirm>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Card title="Quản lý Các Trang Nội dung" style={{ minHeight: 'calc(100vh - 240px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Paragraph style={{ margin: 0 }}>
          Quản lý toàn bộ thông tin hệ thống. Bạn có thể thiết lập các thông tin bắt buộc hoặc thêm các thông tin mở rộng khác.
        </Typography.Paragraph>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal(undefined, false)}>
          Thêm thông tin khác
        </Button>
      </div>

      <Tabs 
        activeKey={filterType} 
        onChange={setFilterType} 
        items={[
          { key: 'all', label: 'Tất cả', children: null },
          { key: 'required', label: 'Thông tin hệ thống', children: null },
          { key: 'other', label: 'Thông tin khác', children: null }
        ]} 
        style={{ marginBottom: 16 }}
      />

      <Table
        scroll={{ y: "calc(100vh - 400px)", x: "max-content" }} 
        dataSource={tableData} 
        columns={columns} 
        rowKey={(record) => record.id ? record.id.toString() : record.type!} 
        loading={loading}
        pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50', '100'],
            defaultPageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} trong tổng số ${total} mục`,
        }}
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
          {editingId && (
            <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #e8e8e8' }}>
              <Typography.Text strong style={{ display: 'block', marginBottom: '12px', fontSize: '12px', color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Thông tin hệ thống (Chỉ đọc)
              </Typography.Text>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="ID" name="id">
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Ngày tạo" name="createdAt">
                    <Input disabled value={editingData?.createdAt ? dayjs(editingData.createdAt).format('DD/MM/YYYY HH:mm:ss') : ''} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Cập nhật cuối" name="updatedAt">
                    <Input disabled value={editingData?.updatedAt ? dayjs(editingData.updatedAt).format('DD/MM/YYYY HH:mm:ss') : ''} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item label="Loại trang" name="type" rules={[{ required: true }]}>
              <Input placeholder="ví dụ: about, contact, policy" disabled={isSystemModal} />
            </Form.Item>
            <Form.Item label="Đường dẫn (Slug)" name="slug" rules={[{ required: true }]}>
              <Input placeholder="ví dụ: gioi-thieu" disabled={isSystemModal} />
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

