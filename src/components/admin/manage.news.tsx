"use client";
import { useEffect, useState } from "react";
import { Form, Input, Button, Card, notification, Typography, Table, Popconfirm } from "antd";
import { sendRequest } from "@/utils/api";

const { TextArea } = Input;

interface NewsData {
  _id?: string;
  title: string;
  summary: string;
  content: string;
  isPublished?: boolean;
}

interface ManageNewsProps {
  token: string | undefined;
}

const ManageNews = ({ token }: ManageNewsProps) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [newsList, setNewsList] = useState<NewsData[]>([]);
  const [editing, setEditing] = useState<NewsData | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts?type=news`,
        method: "GET",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setNewsList(res.data || []);
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
      const payload = {
        title: values.title,
        summary: values.summary,
        content: values.content,
        isPublished: values.isPublished ?? true,
        type: "news",
      };
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
      notification.success({ message: "Lưu tin tức thành công" });
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
    <Card title="Quản lý Tin tức" style={{ minHeight: "calc(100vh - 240px)" }}>
      <Typography.Paragraph>
        Thêm/sửa/xóa các tin tức sẽ hiển thị tại /news.
      </Typography.Paragraph>
      <Form
        form={form}
        layout="vertical"
        initialValues={editing || { title: "", summary: "", content: "", isPublished: true }}
        onFinish={submit}
        key={editing?._id || "new"}
      >
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}> <Input /> </Form.Item>
        <Form.Item label="Tóm tắt" name="summary" rules={[{ required: true, message: "Vui lòng nhập tóm tắt" }]}> <Input /> </Form.Item>
        <Form.Item label="Nội dung" name="content" rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}> <TextArea rows={10} /> </Form.Item>
        <Form.Item name="isPublished" valuePropName="checked" initialValue={true}>
          <Button type="primary" htmlType="submit" loading={loading}>{editing ? "Cập nhật" : "Thêm mới"}</Button>
          {editing && <Button style={{ marginLeft: 8 }} onClick={() => { setEditing(null); form.resetFields(); }}>Hủy</Button>}
        </Form.Item>
      </Form>
      <Table
        dataSource={newsList}
        rowKey="_id"
        columns={[
          { title: "Tiêu đề", dataIndex: "title" },
          { title: "Tóm tắt", dataIndex: "summary" },
          { title: "Trạng thái", dataIndex: "isPublished", render: (v: boolean) => v ? "Hiển thị" : "Ẩn" },
          {
            title: "Hành động",
            render: (_: any, record: NewsData) => (
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

export default ManageNews;
