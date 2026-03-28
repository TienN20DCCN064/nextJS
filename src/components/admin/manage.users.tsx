"use client";
import { useEffect, useState } from "react";
import { Form, Input, Button, Card, notification, Typography, Table, Popconfirm, Select } from "antd";
import { sendRequest } from "@/utils/api";

interface UserData {
  _id?: string;
  username: string;
  email: string;
  role: string;
  isActive?: boolean;
}

interface ManageUsersProps {
  token: string | undefined;
}

const ManageUsers = ({ token }: ManageUsersProps) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [users, setUsers] = useState<UserData[]>([]);
  const [editing, setEditing] = useState<UserData | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: "GET",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setUsers(res.data || []);
    } catch {
      notification.error({ message: "Lỗi khi tải dữ liệu" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [token]);

  const submit = async (values: any) => {
    setLoading(true);
    try {
      const payload = { ...values, isActive: values.isActive ?? true };
      let response;
      if (editing?._id) {
        response = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${editing._id}`,
          method: "PATCH",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
          body: payload,
        });
      } else {
        response = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
          method: "POST",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
          body: payload,
        });
      }
      if ((response as any)?.statusCode && (response as any).statusCode >= 400) {
        throw new Error((response as any).message || "Cập nhật thất bại");
      }
      notification.success({ message: "Lưu người dùng thành công" });
      setEditing(null);
      form.resetFields();
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
      await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${id}`,
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
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
      <Typography.Paragraph>Thêm/sửa/xóa người dùng sẽ hiển thị tại /dashboard/user.</Typography.Paragraph>
      <Form
        form={form}
        layout="vertical"
        initialValues={editing || { username: "", email: "", role: "user", isActive: true }}
        onFinish={submit}
        key={editing?._id || "new"}
      >
        <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}> <Input /> </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: "Vui lòng nhập email" }]}> <Input /> </Form.Item>
        <Form.Item label="Vai trò" name="role" rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}> <Select options={[{ value: "user", label: "Người dùng" }, { value: "admin", label: "Quản trị viên" }]} /> </Form.Item>
        <Form.Item name="isActive" valuePropName="checked" initialValue={true}>
          <Button type="primary" htmlType="submit" loading={loading}>{editing ? "Cập nhật" : "Thêm mới"}</Button>
          {editing && <Button style={{ marginLeft: 8 }} onClick={() => { setEditing(null); form.resetFields(); }}>Hủy</Button>}
        </Form.Item>
      </Form>
      <Table
        dataSource={users}
        rowKey="_id"
        columns={[
          { title: "Tên đăng nhập", dataIndex: "username" },
          { title: "Email", dataIndex: "email" },
          { title: "Vai trò", dataIndex: "role" },
          { title: "Trạng thái", dataIndex: "isActive", render: (v: boolean) => v ? "Hoạt động" : "Khóa" },
          {
            title: "Hành động",
            render: (_: any, record: UserData) => (
              <>
                <Button size="small" onClick={() => { setEditing(record); form.setFieldsValue(record); }}>Sửa</Button>
                <Popconfirm title="Xóa?" onConfirm={() => remove(record._id)}><Button size="small" danger style={{ marginLeft: 8 }}>Xóa</Button></Popconfirm>
              </>
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
