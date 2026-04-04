"use client";
import { useCallback, useEffect, useState } from "react";
import { Form, Input, Button, Card, notification, Typography, Table, Popconfirm, Select, Modal, Switch, Upload, Image } from "antd";
import { createUser, deleteUser, fetchUsers, updateUser } from "@/hooks/apiHooks";
import { EditTwoTone, DeleteTwoTone, UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "@/utils/helpers";

interface UserData {
  id?: number;
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  address?: string;
  image?: string;
  role?: string;
  isActive: boolean;
}

interface ManageUsersProps {
  token: string | undefined;
}

const ManageUsers = ({ token }: ManageUsersProps) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [users, setUsers] = useState<UserData[]>([]);
  const [editing, setEditing] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUsers(token);
      setUsers(data);
    } catch {
      notification.error({ message: "Lỗi khi tải dữ liệu" });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openModal = (record?: UserData) => {
    if (record) {
      setEditing(record);
      form.setFieldsValue(record);
      setPreviewImage(record.image || "");
    } else {
      setEditing(null);
      form.resetFields();
      form.setFieldsValue({
        email: "",
        password: "",
        name: "",
        phone: "",
        address: "",
        image: "",
        role: "USER",
        isActive: true,
      });
    }
    setPreviewImage("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setPreviewImage("");
    form.resetFields();
  };

  const onFinishFailed = (errorInfo: any) => {
    notification.error({
      message: "Vui lòng kiểm tra lại thông tin",
      description: errorInfo.errorFields?.[0]?.errors?.[0],
    });
  };

  const submit = async (values: any) => {
    setLoading(true);
    try {
      const payload = { ...values, isActive: values.isActive ?? true };
      if (editing && !payload.password) {
        delete payload.password;
      }
      if (editing?.id) {
        await updateUser(editing.id, payload, token);
      } else {
        await createUser(payload, token);
      }
      notification.success({ message: "Lưu người dùng thành công" });
      handleCloseModal();
      fetchData();
    } catch (error: any) {
      notification.error({ message: "Lỗi", description: error?.message || "Cập nhật thất bại" });
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: any) => {
    setLoading(true);
    try {
      await deleteUser(id, token);
      notification.success({ message: "Xóa thành công" });
      fetchData();
    } catch {
      notification.error({ message: "Lỗi khi xóa" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Quản lý Người dùng" style={{ minHeight: "calc(100vh - 240px)" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Paragraph style={{ margin: 0 }}>
          Thêm/sửa/xóa người dùng sẽ hiển thị tại /dashboard/user.
        </Typography.Paragraph>
        <Button type="primary" onClick={() => openModal()}>
          Thêm mới
        </Button>
      </div>
      <Modal
        title={editing ? "Chỉnh sửa Người dùng" : "Thêm mới Người dùng"}
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
          initialValues={editing || { email: "", password: "", name: "", phone: "", address: "", image: "", role: "USER", isActive: true }}
          onFinish={submit}
          onFinishFailed={onFinishFailed}
          key={editing?.id || "new"}
        >
          <Form.Item
            label="Họ tên"
            name="name"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: "Vui lòng nhập email hợp lệ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            tooltip={editing ? "Để trống nếu không muốn đổi mật khẩu" : ""}
            rules={[{ required: !editing, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password placeholder={editing ? "********" : ""} />
          </Form.Item>
          <Form.Item label="Quyền hạn" name="role" rules={[{ required: true, message: "Vui lòng chọn quyền hạn" }]}>
            <Select>
              <Select.Option value="ADMIN">Quản trị viên (ADMIN)</Select.Option>
              <Select.Option value="USER">Người dùng (USER)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
          >
            <Input />
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
          <Form.Item
            label="Kích hoạt"
            name="isActive"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>{editing ? "Cập nhật" : "Thêm mới"}</Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCloseModal}>Hủy</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={users}
        rowKey="id"
        columns={[
          {
            title: "STT",
            render: (_: any, record: any, index: any) => {
              return <>{index + 1}</>;
            },
            width: 60,
          },
          { title: "Họ tên", dataIndex: "name" },
          { title: "Email", dataIndex: "email" },
          {
            title: "Ảnh",
            dataIndex: "image",
            width: 80,
            render: (img: string) => img ? <Image src={img} width={40} height={40} style={{ objectFit: 'cover', borderRadius: 4 }} alt="avatar" /> : null,
          },
          { 
            title: "Quyền", 
            dataIndex: "role",
            render: (role: string) => role === "ADMIN" ? <Typography.Text type="danger">ADMIN</Typography.Text> : "USER"
          },
          { title: "Số điện thoại", dataIndex: "phone" },
          { 
            title: "Trạng thái", 
            dataIndex: "isActive", 
            render: (isActive: boolean) => isActive ? <Typography.Text type="success">Hoạt động</Typography.Text> : <Typography.Text type="secondary">Khóa</Typography.Text>
          },
          {
            title: "Hành động",
            width: 120,
            render: (_: any, record: UserData) => (
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <EditTwoTone
                  twoToneColor="#f57800"
                  style={{ cursor: "pointer" }}
                  onClick={() => openModal(record)}
                />
                <Popconfirm title="Xóa?" onConfirm={() => remove(record.id)}>
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

export default ManageUsers;
