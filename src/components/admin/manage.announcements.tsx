"use client";
import { useEffect, useState } from "react";
import { Form, Input, Button, Card, notification, Typography, Table, Popconfirm } from "antd";
import { sendRequest } from "@/utils/api";

interface AnnouncementData {
  _id?: string;
  title: string;
  summary: string;
  content: string;
  isPublished?: boolean;
}

interface ManageAnnouncementsProps {
  token: string | undefined;
}

const ManageAnnouncements = ({ token }: ManageAnnouncementsProps) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [editing, setEditing] = useState<AnnouncementData | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts?type=announcement`,
        method: "GET",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setAnnouncements(res.data || []);
    } catch {
      notification.error({ message: "Lỗi khi tải dữ liệu" });
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, [token]);

  const submit = async (values: any) => {
    setLoading(true);
    try {
      const payload = { ...values, isPublished: values.isPublished ?? true, type: "announcement" };
      let response;
      if (editing?._id) {
        response = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/${editing._id}`,
          method: "PATCH",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
          body: payload,
        });
      } else {
        response = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts`,
          method: "POST",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
          body: payload,
        });
      }
      if ((response as any)?.statusCode && (response as any).statusCode >= 400) {
        throw new Error((response as any).message || "Cập nhật thất bại");
      }
      notification.success({ message: "Lưu thông báo thành công" });
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
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts/${id}`,
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
    <Card title="Quản lý Thông báo" style={{ minHeight: "calc(100vh - 240px)" }}>
      <Typography.Paragraph>Thêm/sửa/xóa các thông báo sẽ hiển thị tại /announcements.</Typography.Paragraph>
      <Form
        form={form}
        layout="vertical"
        initialValues={editing || { title: "", summary: "", content: "", isPublished: true }}
        onFinish={submit}
        key={editing?._id || "new"}
      >
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}> <Input /> </Form.Item>
        <Form.Item label="Tóm tắt" name="summary" rules={[{ required: true, message: "Vui lòng nhập tóm tắt" }]}> <Input /> </Form.Item>
        <Form.Item label="Nội dung" name="content" rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}> <Input.TextArea rows={6} /> </Form.Item>
        <Form.Item name="isPublished" valuePropName="checked" initialValue={true}>
          <Button type="primary" htmlType="submit" loading={loading}>{editing ? "Cập nhật" : "Thêm mới"}</Button>
          {editing && <Button style={{ marginLeft: 8 }} onClick={() => { setEditing(null); form.resetFields(); }}>Hủy</Button>}
        </Form.Item>
      </Form>
      <Table
        dataSource={announcements}
        rowKey="_id"
        columns={[
          { title: "Tiêu đề", dataIndex: "title" },
          { title: "Tóm tắt", dataIndex: "summary" },
          { title: "Trạng thái", dataIndex: "isPublished", render: (v: boolean) => v ? "Hiển thị" : "Ẩn" },
          {
            title: "Hành động",
            render: (_: any, record: AnnouncementData) => (
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

export default ManageAnnouncements;
