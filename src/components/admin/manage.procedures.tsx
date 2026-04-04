"use client";
import { useEffect, useState } from "react";
import { Form, Input, Button, Card, notification, Typography, Table, Popconfirm, Modal, Divider, Space, Upload, Image } from "antd";
import { PlusOutlined, MinusCircleOutlined, EditTwoTone, DeleteTwoTone, UploadOutlined } from '@ant-design/icons';
import { createProcedure, deleteProcedure, fetchProcedures, updateProcedure } from "@/hooks/apiHooks";
import { getBase64 } from "@/utils/helpers";

interface ProcedureStep {
  title: string;
  detail: string;
}

interface ProcedureData {
  id?: number;
  title: string;
  description: string;
  content: string;
  requiredDocuments?: string;
  processingTime?: string;
  fee?: string;
  formUrl?: string;
  steps?: ProcedureStep[];
  thumbnail?: string;
}

interface ManageProceduresProps {
  token: string | undefined;
}

const ManageProcedures = ({ token }: ManageProceduresProps) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [procedures, setProcedures] = useState<ProcedureData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<ProcedureData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchProcedures();
      setProcedures(data);
    } catch {
      notification.error({ message: "Lỗi khi tải dữ liệu" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [token]);

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
      if (editingId) {
        await updateProcedure(editingId, values, token);
      } else {
        await createProcedure(values, token);
      }
      notification.success({ message: "Lưu thủ tục thành công" });
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
      await deleteProcedure(id, token);
      notification.success({ message: "Xóa thành công" });
      fetchData();
    } catch {
      notification.error({ message: "Lỗi khi xóa" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Quản lý Thủ tục" style={{ minHeight: "calc(100vh - 240px)" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Paragraph style={{ margin: 0 }}>
          Thêm/sửa/xóa các thủ tục sẽ hiển thị tại /procedures.
        </Typography.Paragraph>
        <Button type="primary" onClick={() => {
          setEditingId(null);
          form.resetFields();
          setIsModalOpen(true);
        }}>
          Thêm mới
        </Button>
      </div>
      <Modal
        title={editingId ? "Chỉnh sửa Thủ tục" : "Thêm mới Thủ tục"}
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
          initialValues={editingData || { title: "", description: "", content: "", thumbnail: "", requiredDocuments: "", processingTime: "", fee: "", formUrl: "" }}
        >
          <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}> <Input /> </Form.Item>
          <Form.Item label="Mô tả ngắn" name="description" rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}> <Input.TextArea rows={2} /> </Form.Item>
          <Form.Item label="Hồ sơ yêu cầu" name="requiredDocuments"> <Input.TextArea rows={3} placeholder="Ví dụ: Giấy CMND, Sổ hộ khẩu..." /> </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Thời gian giải quyết" name="processingTime"> <Input placeholder="Ví dụ: 3 ngày làm việc" /> </Form.Item>
            <Form.Item label="Lệ phí" name="fee"> <Input placeholder="Ví dụ: Miễn phí" /> </Form.Item>
          </div>
          <Form.Item label="Link biểu mẫu (URL)" name="formUrl"> <Input placeholder="Dẫn link Google Drive hoặc file..." /> </Form.Item>
          
          <Divider orientation="left">Trình tự thực hiện (Dòng thời gian)</Divider>
          <Form.List name="steps">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8, border: '1px dashed #ddd', padding: 8, borderRadius: 4 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      rules={[{ required: true, message: 'Nhập tên bước' }]}
                    >
                      <Input placeholder="Tên bước (Ví dụ: Bước 1)" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'detail']}
                      rules={[{ required: true, message: 'Nhập chi tiết' }]}
                    >
                      <Input.TextArea placeholder="Nội dung chi tiết..." />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm bước tiếp theo
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item label="Nội dung chi tiết khác" name="content"> <Input.TextArea rows={4} placeholder="Ghi chú thêm nếu cần..." /> </Form.Item>
          <Form.Item name="thumbnail" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="Ảnh đại diện (Upload)">
            <Upload
              maxCount={1}
              beforeUpload={async (file) => {
                const base64 = await getBase64(file);
                form.setFieldValue('thumbnail', base64);
                setPreviewImage(base64);
                return false;
              }}
              onRemove={() => { form.setFieldValue('thumbnail', null); setPreviewImage(""); }}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {previewImage && (
              <img src={previewImage} alt="preview" style={{ marginTop: 8, maxWidth: '100%', maxHeight: 120, objectFit: 'contain', borderRadius: 4, border: '1px solid #d9d9d9' }} />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>{editingId ? "Cập nhật" : "Thêm mới"}</Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCloseModal}>Hủy</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={procedures}
        rowKey="id"
        columns={[
          {
            title: "STT",
            render: (_: any, record: any, index: any) => {
              return <>{index + 1}</>;
            },
            width: 60,
          },
          { title: "Tiêu đề", dataIndex: "title" },
          {
            title: "Ảnh",
            dataIndex: "thumbnail",
            width: 80,
            render: (thumb: string) => thumb ? <Image src={thumb} width={40} height={40} style={{ objectFit: 'cover', borderRadius: 4 }} alt="thumbnail" /> : null,
          },
          { 
            title: "Mô tả", 
            dataIndex: "description",
            ellipsis: true,
          },
          {
            title: "Hành động",
            width: 120,
            render: (_: any, record: ProcedureData) => (
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <EditTwoTone
                  twoToneColor="#f57800"
                  style={{ cursor: "pointer" }}
                  onClick={() => { 
                    setEditingId(record.id || null); 
                    setEditingData(record);
                    setPreviewImage(record.thumbnail || "");
                    setIsModalOpen(true); 
                  }}
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

export default ManageProcedures;
