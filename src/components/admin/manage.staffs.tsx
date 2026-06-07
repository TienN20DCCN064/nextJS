"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  notification,
  Typography,
  Table,
  Popconfirm,
  Select,
  Modal,
  Upload,
  Image,
} from "antd";
import { createStaff, deleteStaff, fetchDepartments, fetchStaffs, updateStaff } from "@/hooks/apiHooks";
import { EditTwoTone, DeleteTwoTone, UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "@/utils/helpers";
import { Row, Col } from "antd";
import dayjs from "dayjs";

interface StaffData {
  id?: number;
  name?: string;
  position?: string;
  phone?: string;
  email?: string;
  image?: string;
  bio?: string;
  departmentId?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface DepartmentData {
  id?: number;
  name: string;
}

interface ManageStaffsProps {
  token: string | undefined;
}

const ManageStaffs = ({ token }: ManageStaffsProps) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [staffs, setStaffs] = useState<StaffData[]>([]);
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [editing, setEditing] = useState<StaffData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const loadDepartments = async () => {
    try {
      const data = await fetchDepartments();
      setDepartments(data);
    } catch {
      notification.error({ message: "Lỗi khi tải danh sách phòng ban" });
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStaffs(token);
      setStaffs(data);
    } catch {
      notification.error({ message: "Lỗi khi tải dữ liệu nhân sự" });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  const openModal = (record?: StaffData) => {
    if (record) {
      setEditing(record);
      form.setFieldsValue(record);
      setPreviewImage(record.image || "");
    } else {
      setEditing(null);
      form.resetFields();
      form.setFieldsValue({
        name: "",
        position: "",
        phone: "",
        email: "",
        image: "",
        bio: "",
        departmentId: undefined,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setPreviewImage("");
    form.resetFields();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Staff form validation failed:", errorInfo);
    notification.error({
      message: "Vui lòng điền đúng thông tin nhân sự",
      description: errorInfo.errorFields?.[0]?.errors?.[0],
    });
  };

  const submit = async (values: any) => {
    setLoading(true);
    try {
      const { name, position, phone, email, image, bio, departmentId } = values;
      const payload = {
        name,
        position,
        phone,
        email,
        image,
        bio,
        departmentId: departmentId || null,
      };
      let response;
      if (editing?.id) {
        await updateStaff(editing.id, payload, token);
      } else {
        await createStaff(payload, token);
      }
      notification.success({ message: "Lưu nhân sự thành công" });
      handleCloseModal();
      fetchData();
    } catch (error: any) {
      notification.error({
        message: "Lỗi",
        description: error?.message || "Cập nhật thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    setLoading(true);
    try {
      await deleteStaff(id, token);
      notification.success({ message: "Xóa thành công" });
      fetchData();
    } catch {
      notification.error({ message: "Lỗi khi xóa" });
    } finally {
      setLoading(false);
    }
  };

  const departmentName = (id?: number) => {
    return departments.find((item) => item.id === id)?.name || "";
  };

  return (
    <Card title="Quản lý Nhân sự" style={{ minHeight: "calc(100vh - 240px)" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Typography.Paragraph style={{ margin: 0 }}>
          Thêm/sửa/xóa nhân sự sẽ hiển thị tại /admin/staffs.
        </Typography.Paragraph>
        <Button type="primary" onClick={() => openModal()}>
          Thêm mới
        </Button>
      </div>
      <Modal
        title={editing ? "Chỉnh sửa Nhân sự" : "Thêm mới Nhân sự"}
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
          initialValues={
            editing || {
              name: "",
              position: "",
              phone: "",
              email: "",
              image: "",
              bio: "",
              departmentId: undefined,
            }
          }
          onFinish={submit}
          onFinishFailed={onFinishFailed}
          key={editing?.id || "new"}
        >
          {editing && (
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
              
            </div>
          )}
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên nhân sự" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Chức vụ"
            name="position"
            rules={[{ required: true, message: "Vui lòng nhập chức vụ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Vui lòng nhập email hợp lệ",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Phòng ban" name="departmentId">
            <Select
              options={departments.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              placeholder="Chọn phòng ban"
              allowClear
            />
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
          <Form.Item label="Tiểu sử" name="bio">
            <Input.TextArea rows={4} />
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
        scroll={{ y: "calc(100vh - 400px)", x: "max-content" }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50", "100"],
          defaultPageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong tổng số ${total} mục`,
        }}
        dataSource={staffs}
        rowKey="id"
        columns={[
          {
            title: "STT",
            render: (_: any, record: any, index: any) => {
              return <>{index + 1}</>;
            },
            width: 60,
          },
          { title: "Họ tên", dataIndex: "name", ellipsis: true },
          {
            title: "Ảnh",
            dataIndex: "image",
            width: 80,
            render: (img: string) => img ? <Image src={img} width={40} height={40} style={{ objectFit: 'cover', borderRadius: 4 }} alt="staff" /> : null,
          },
          { title: "Chức vụ", dataIndex: "position", width: 150 },
          { title: "Phòng ban", dataIndex: "departmentId", width: 150, render: (id: number) => departmentName(id) || '-' },
          { title: "Email", dataIndex: "email", width: 180 },
          {
            title: "Hành động",
            width: 120,
            render: (_: any, record: StaffData) => (
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <EditTwoTone
                  twoToneColor="#f57800"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setEditing(record);
                    form.setFieldsValue({
                      ...record,
                    });
                    setPreviewImage(record.image || "");
                    setIsModalOpen(true);
                  }}
                />
                <Popconfirm
                  title="Xóa?"
                  onConfirm={() => remove(record.id as any)}
                >
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

export default ManageStaffs;
