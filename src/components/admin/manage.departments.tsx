"use client";
import { useCallback, useEffect, useState } from "react";
import { Form, Input, Button, Card, notification, Typography, Table, Popconfirm, Modal } from "antd";
import { createDepartment, deleteDepartment, fetchDepartments, updateDepartment } from "@/hooks/apiHooks";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";

interface DepartmentData {
  id?: number;
  name: string;
  description?: string;
  phone?: string;
  email?: string;
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
      if (editingId) {
        await updateDepartment(editingId, values, token);
      } else {
        await createDepartment(values, token);
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
          { title: "Tên phòng ban", dataIndex: "name" },
          { title: "Số điện thoại", dataIndex: "phone" },
          { title: "Email", dataIndex: "email" },
          {
            title: "Hành động",
            width: 120,
            render: (_: any, record: DepartmentData) => (
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

export default ManageDepartments;
