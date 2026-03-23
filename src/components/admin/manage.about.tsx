'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Button, Card, notification, Typography } from 'antd';
import { sendRequest } from '@/utils/api';

const { TextArea } = Input;

interface AboutPageData {
  _id?: string;
  title: string;
  content: string;
  slug: string;
  isPublished?: boolean;
}

interface ManageAboutProps {
  initialData: AboutPageData | null;
  token: string | undefined;
}

const ManageAbout = ({ initialData, token }: ManageAboutProps) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [pageData, setPageData] = useState<AboutPageData>(
    initialData || { title: '', content: '', slug: 'about', isPublished: true }
  );

  useEffect(() => {
    if (initialData) {
      setPageData(initialData);
      form.setFieldsValue({
        title: initialData.title,
        content: initialData.content,
        isPublished: initialData.isPublished,
      });
    } else {
      form.setFieldsValue({
        title: '',
        content: '',
        isPublished: true,
      });
    }
  }, [initialData, form]);

  const submit = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title,
        slug: 'about',
        content: values.content,
        isPublished: values.isPublished ?? true,
      };

      let response;
      if (pageData?._id) {
        response = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/pages/slug/about`,
          method: 'PATCH',
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
          body: payload,
        });
      } else {
        response = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/pages`,
          method: 'POST',
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
          body: payload,
        });
      }

      if ((response as any)?.statusCode && (response as any).statusCode >= 400) {
        throw new Error((response as any).message || 'Cập nhật thất bại');
      }

      notification.success({ message: 'Cập nhật Nội dung Giới thiệu thành công' });
      setPageData(response);
    } catch (error: any) {
      notification.error({ message: 'Lỗi', description: error?.message || 'Cập nhật thất bại' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Quản lý Trang Giới thiệu" style={{ minHeight: 'calc(100vh - 240px)' }}>
      <Typography.Paragraph>
        Chỉnh sửa nội dung trang Giới thiệu, nội dung này sẽ hiển thị tại /about.
      </Typography.Paragraph>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: pageData.title,
          content: pageData.content,
          isPublished: pageData?.isPublished ?? true,
        }}
        onFinish={submit}
      >
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input placeholder="Tiêu đề giới thiệu" />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
        >
          <TextArea rows={10} placeholder="Nội dung mô tả xã" />
        </Form.Item>

        <Form.Item name="isPublished" valuePropName="checked" initialValue={pageData?.isPublished ?? true}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu nội dung
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ManageAbout;
