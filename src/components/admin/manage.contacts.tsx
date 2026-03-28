"use client";
import { useEffect, useState } from "react";
import { Form, Input, Button, Card, notification, Typography, Table, Popconfirm } from "antd";
import { sendRequest } from "@/utils/api";

interface ContactData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isPublished?: boolean;
}

interface ManageContactsProps {
  token: string | undefined;
}

const ManageContacts = ({ token }: ManageContactsProps) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [editing, setEditing] = useState<ContactData | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/contacts`,
        method: "GET",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setContacts(res.data || []);
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
      const payload = { ...values, isPublished: values.isPublished ?? true };
      let response;
      if (editing?._id) {
        response = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/contacts/${editing._id}`,
          method: "PATCH",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
          body: payload,
        });
      } else {
        response = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/contacts`,
          method: "POST",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
          body: payload,
        });
      }
      if ((response as any)?.statusCode && (response as any).statusCode >= 400) {
        throw new Error((response as any).message || "Cập nhật thất bại");
      }
      notification.success({ message: "Lưu liên hệ thành công" });
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
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/contacts/${id}`,
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
    <Card title="Quản lý Liên hệ" style={{ minHeight: "calc(100vh - 240px)" }}>
      <Typography.Paragraph>Thêm/sửa/xóa các liên hệ sẽ hiển thị tại /contact.</Typography.Paragraph>
      <Form
        form={form}
        layout="vertical"
        initialValues={editing || { name: "", email: "", phone: "", message: "", isPublished: true }}
        onFinish={submit}
        key={editing?._id || "new"}
      >
        <Form.Item label="Tên" name="name" rules={[{ required: true, message: "Vui lòng nhập tên" }]}> <Input /> </Form.Item>
        <Form.Item label="Email" name="email" rules={[
          { required: true, message: "Vui lòng nhập email" },
          { type: "email", message: "Email không hợp lệ" }
        ]}> <Input /> </Form.Item>
        <Form.Item label="Số điện thoại" name="phone" rules={[
          { required: true, message: "Vui lòng nhập số điện thoại" },
          { pattern: /^\d{9,15}$/, message: "Số điện thoại không hợp lệ" }
        ]}> <Input /> </Form.Item>
        <Form.Item label="Nội dung" name="message" rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}> <Input.TextArea rows={3} /> </Form.Item>
        <Form.Item name="isPublished" valuePropName="checked" initialValue={true}>
          <Button type="primary" htmlType="submit" loading={loading}>{editing ? "Cập nhật" : "Thêm mới"}</Button>
          {editing && <Button style={{ marginLeft: 8 }} onClick={() => { setEditing(null); form.resetFields(); }}>Hủy</Button>}
        </Form.Item>
      </Form>
      <Table
        dataSource={contacts}
        rowKey="_id"
        columns={[
          { title: "Tên", dataIndex: "name" },
          { title: "Email", dataIndex: "email" },
          { title: "Số điện thoại", dataIndex: "phone" },
          { title: "Nội dung", dataIndex: "message" },
          { title: "Trạng thái", dataIndex: "isPublished", render: (v: boolean) => v ? "Hiển thị" : "Ẩn" },
          {
            title: "Hành động",
            render: (_: any, record: ContactData) => (
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

export default ManageContacts;
