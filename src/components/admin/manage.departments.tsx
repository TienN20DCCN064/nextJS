"use client";
import { useCallback, useEffect, useState } from "react";
import { Form, Input, Button, Card, notification, Typography, Table, Popconfirm, Modal } from "antd";
import { createDepartment, deleteDepartment, fetchDepartments, updateDepartment } from "@/hooks/apiHooks";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { Row, Col } from "antd";
import dayjs from "dayjs";

interface DepartmentData {
  id?: number;
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface ManageDepartmentsProps {
  token: string | undefined;
}

const ManageDepartments = ({ token }: ManageDepartmentsProps) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<DepartmentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDepartments(token);
      setDepartments(data);
    } catch {
      notification.error({ message: "Lỗi khi tải dữ liệu" });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = (record?: DepartmentData) => {
    if (record) {
      setEditingId(record.id || null);
      setEditingData(record);
    } else {
      setEditingId(null);
      setEditingData(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setEditingData(null);
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
      const { name, phone, email, description } = values;
      const payload = { name, phone, email, description };
      if (editingId) {
        await updateDepartment(editingId, payload, token);
      } else {
        await createDepartment(payload, token);
      }
      notification.success({ message: "Lưu phòng ban thành công" });
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
      await deleteDepartment(id, token);
      notification.success({ message: "Xóa thành công" });
      fetchData();
    } catch {
      notification.error({ message: "Lỗi khi xóa" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Quản lý Phòng ban" style={{ minHeight: "calc(100vh - 240px)" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Paragraph style={{ margin: 0 }}>
          Thêm/sửa/xóa phòng ban sẽ hiển thị tại /admin/departments.
        </Typography.Paragraph>
        <Button type="primary" onClick={() => openModal()}>
          Thêm mới
        </Button>
      </div>
      <Modal
        title={editingId ? "Chỉnh sửa Phòng ban" : "Thêm mới Phòng ban"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={submit}
          onFinishFailed={onFinishFailed}
          key={editingId || "new"}
          initialValues={editingData || { name: "", description: "", phone: "", email: "" }}
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
              
            </div>
          )}
          <Form.Item label="Tên phòng ban" name="name" rules={[{ required: true, message: "Vui lòng nhập tên phòng ban" }]}> <Input /> </Form.Item>
          <Form.Item label="Số điện thoại" name="phone"> <Input /> </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ type: 'email', message: 'Email không đúng định dạng' }]}> <Input /> </Form.Item>
          <Form.Item label="Mô tả" name="description"> <Input.TextArea rows={3} /> </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>{editingId ? "Cập nhật" : "Thêm mới"}</Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCloseModal}>Hủy</Button>
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
        dataSource={departments}
        rowKey="id"
        columns={[
          {
            title: "STT",
            render: (_: any, record: any, index: any) => {
              return <>{index + 1}</>;
            },
            width: 60,
          },
          { title: "Tên phòng ban", dataIndex: "name", ellipsis: true },
          { title: "Số điện thoại", dataIndex: "phone", width: 150 },
          { title: "Email", dataIndex: "email", width: 220 },
          {
            title: "Hành động",
            width: 120,
            render: (_: any, record: DepartmentData) => (
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <EditTwoTone
                  twoToneColor="#f57800"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setEditingId(record.id || null);
                    setEditingData(record);
                    form.setFieldsValue({
                      ...record,
                    });
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

export default ManageDepartments;
