"use client";
import { useEffect, useState } from "react";
import { Form, Input, Button, Card, notification, Typography, Table, Popconfirm } from "antd";
import { sendRequest } from "@/utils/api";

interface DocumentData {
  _id?: string;
  title: string;
  documentNumber: string;
  description: string;
  fileUrl: string;
  imageUrl?: string;
  isPublished?: boolean;
}

interface ManageDocumentsProps {
  token: string | undefined;
}

const ManageDocuments = ({ token }: ManageDocumentsProps) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [editing, setEditing] = useState<DocumentData | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/documents`,
        method: "GET",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setDocuments(res.data || []);
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
      const payload = { ...values, isPublished: values.isPublished ?? true };
      let response;
      if (editing?._id) {
        response = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/documents/${editing._id}`,
          method: "PATCH",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
          body: payload,
        });
      } else {
        response = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/documents`,
          method: "POST",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
          body: payload,
        });
      }
      if ((response as any)?.statusCode && (response as any).statusCode >= 400) {
        throw new Error((response as any).message || "Cập nhật thất bại");
      }
      notification.success({ message: "Lưu văn bản thành công" });
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
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/documents/${id}`,
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
    <Card title="Quản lý Văn bản" style={{ minHeight: "calc(100vh - 240px)" }}>
      <Typography.Paragraph>Thêm/sửa/xóa các văn bản sẽ hiển thị tại /documents.</Typography.Paragraph>
      <Form
        form={form}
        layout="vertical"
        initialValues={editing || { title: "", documentNumber: "", description: "", fileUrl: "", isPublished: true }}
        onFinish={submit}
        key={editing?._id || "new"}
      >
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}> <Input /> </Form.Item>
        <Form.Item label="Mã văn bản" name="documentNumber" rules={[{ required: true, message: "Vui lòng nhập mã văn bản" }]}> <Input /> </Form.Item>
        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}> <Input.TextArea rows={3} /> </Form.Item>
        <Form.Item label="File URL" name="fileUrl" rules={[{ required: true, message: "Vui lòng nhập link file" }]}> <Input /> </Form.Item>
        <Form.Item label="Ảnh đại diện (tùy chọn)" name="imageUrl"> <Input /> </Form.Item>
        <Form.Item name="isPublished" valuePropName="checked" initialValue={true}>
          <Button type="primary" htmlType="submit" loading={loading}>{editing ? "Cập nhật" : "Thêm mới"}</Button>
          {editing && <Button style={{ marginLeft: 8 }} onClick={() => { setEditing(null); form.resetFields(); }}>Hủy</Button>}
        </Form.Item>
      </Form>
      <Table
        dataSource={documents}
        rowKey="_id"
        columns={[
          { title: "Tiêu đề", dataIndex: "title" },
          { title: "Mã VB", dataIndex: "documentNumber" },
          { title: "Mô tả", dataIndex: "description" },
          { title: "Trạng thái", dataIndex: "isPublished", render: (v: boolean) => v ? "Hiển thị" : "Ẩn" },
          {
            title: "Hành động",
            render: (_: any, record: DocumentData) => (
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

export default ManageDocuments;
