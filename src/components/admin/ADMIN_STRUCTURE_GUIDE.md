# Hướng dẫn Cấu trúc Trang Quản lý (Admin)

## 📋 Nguyên tắc chung

Khi tạo một trang quản lý (danh sách + tạo/sửa), hãy tuân theo cấu trúc dưới đây:

### 1. **Danh sách (List/Table)**
- Chỉ hiển thị **3-5 thông tin chính** của bảng
- Thêm cột **STT** (số thứ tự) ở đầu
- Cột **Actions** ở cuối (Sửa, Xóa)
- Tối ưu chiều rộng với `width` property

### 2. **Form (Create/Update)**
- Hiển thị **đầy đủ tất cả các trường** của entity
- Khi edit, tự động điền dữ liệu hiện tại từ record được chọn
- Lưu callback `onSuccess()` để **refresh danh sách sau khi thêm/sửa**

---

## ✅ Pattern chuẩn

### Ví dụ 1: Danh sách + Form trong 1 file (Đơn giản)

```tsx
// manage.staffs.tsx - Quản lý nhân sự
"use client";
import { useCallback, useEffect, useState } from "react";
import { Form, Input, Button, Card, notification, Typography, Table, Popconfirm, Select, Modal } from "antd";

const ManageStaffs = ({ token }: ManageStaffsProps) => {
  const [staffs, setStaffs] = useState<StaffData[]>([]);
  const [editing, setEditing] = useState<StaffData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    // Lấy dữ liệu từ API
    const data = await fetchStaffs(token);
    setStaffs(data);
  }, [token]);

  const openModal = (record?: StaffData) => {
    if (record) {
      setEditing(record);
      form.setFieldsValue(record); // ✅ Populate data khi edit
    } else {
      setEditing(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const submit = async (values: any) => {
    if (editing?._id) {
      await updateStaff(editing._id, values, token);
    } else {
      await createStaff(values, token);
    }
    notification.success({ message: "Lưu thành công" });
    setIsModalOpen(false);
    fetchData(); // ✅ Refresh danh sách
  };

  return (
    <Card>
      {/* Form Modal */}
      <Modal
        title={editing ? "Chỉnh sửa" : "Thêm mới"}
        open={isModalOpen}
      >
        <Form onFinish={submit}>
          {/* Hiển thị ĐẦY ĐỦ tất cả fields */}
          <Form.Item label="Họ tên" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Chức vụ" name="position">
            <Input />
          </Form.Item>
          <Form.Item label="SĐT" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Phòng ban" name="departmentId">
            <Select placeholder="Chọn phòng ban" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Danh sách - Chỉ 3-5 cột chính */}
      <Table
        dataSource={staffs}
        columns={[
          {
            title: "STT",
            render: (_: any, _: any, index: any) => index + 1,
            width: 60,
          },
          {
            title: "Họ tên",
            dataIndex: "name",
          },
          {
            title: "Chức vụ",
            dataIndex: "position",
          },
          {
            title: "Email",
            dataIndex: "email",
          },
          {
            title: "Hành động",
            width: 120,
            render: (_: any, record: StaffData) => (
              <>
                <Button size="small" onClick={() => openModal(record)}>
                  Sửa
                </Button>
                <Popconfirm
                  title="Xóa?"
                  onConfirm={() => remove(record._id)}
                >
                  <Button size="small" danger>
                    Xóa
                  </Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default ManageStaffs;
```

---

### Ví dụ 2: Tách thành component riêng (Nâng cao)

Khi form phức tạp hoặc file quá dài, tách thành component riêng:

```
components/admin/
├── user.table.tsx      (Danh sách)
├── user.create.tsx     (Form tạo)
├── user.update.tsx     (Form sửa)
└── manage.users.tsx    (Trang chính)
```

#### user.table.tsx
```tsx
interface IProps {
  users: any[];
  onRefresh?: () => void; // ✅ Callback để refresh
}

const UserTable = (props: IProps) => {
  const { users, onRefresh } = props;

  const columns = [
    {
      title: "STT",
      render: (_: any, _: any, index: any) => index + 1,
      width: 60,
    },
    { 
      title: "Email", 
      dataIndex: "email" 
    },
    { 
      title: "Name", 
      dataIndex: "name" 
    },
    { 
      title: "Phone", 
      dataIndex: "phone" 
    },
    {
      title: "Actions",
      width: 100,
      render: (_, record) => (
        <>
          <EditTwoTone onClick={() => setIsUpdateModalOpen(true)} />
          <Popconfirm onConfirm={async () => {
            await handleDeleteUserAction(record?._id);
            onRefresh?.(); // ✅ Gọi refresh sau xóa
          }}>
            <DeleteTwoTone twoToneColor="#ff4d4f" />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={users} columns={columns} />
      
      {/* Truyền onSuccess callback */}
      <UserCreate onSuccess={() => onRefresh?.()} />
      <UserUpdate onSuccess={() => onRefresh?.()} />
    </>
  );
};
```

#### user.create.tsx
```tsx
interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
  onSuccess?: () => void; // ✅ Callback khi thêm thành công
}

const UserCreate = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen, onSuccess } = props;

  const onFinish = async (values: any) => {
    const res = await handleCreateUserAction(values);
    if (res?.data) {
      message.success("Create succeed!");
      onSuccess?.(); // ✅ Gọi callback
      setIsCreateModalOpen(false);
    }
  };

  return (
    <Modal open={isCreateModalOpen}>
      <Form onFinish={onFinish}>
        {/* Form fields */}
      </Form>
    </Modal>
  );
};
```

#### user.update.tsx
```tsx
interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: any;
  setDataUpdate: any;
  onSuccess?: () => void; // ✅ Callback khi sửa thành công
}

const UserUpdate = (props: IProps) => {
  const { onSuccess } = props;

  const onFinish = async (values: any) => {
    const res = await handleUpdateUserAction({...});
    if (res?.data) {
      message.success("Update succeed!");
      onSuccess?.(); // ✅ Gọi callback
    }
  };

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        name: dataUpdate.name,
        email: dataUpdate.email,
        phone: dataUpdate.phone,
        address: dataUpdate.address,
      }); // ✅ Populate dữ liệu
    }
  }, [dataUpdate]);

  return (
    <Modal open={isUpdateModalOpen}>
      <Form onFinish={onFinish}>
        {/* Form fields đầy đủ */}
      </Form>
    </Modal>
  );
};
```

---

## 🎯 Checklist khi tạo trang quản lý mới

- [ ] **Danh sách**: Chỉ 3-5 cột chính + STT + Actions
- [ ] **Form**: Hiển thị tất cả fields
- [ ] **Edit**: Click edit → auto fill form bằng `form.setFieldsValue()`
- [ ] **Refresh**: Thêm `onSuccess()` callback để refresh danh sách
- [ ] **Validation**: Thêm rules cho required fields
- [ ] **Loading states**: Xử lý loading khi loading dữ liệu
- [ ] **Error handling**: Show notification khi có lỗi
- [ ] **Delete confirm**: Thêm Popconfirm trước khi xóa

---

## 📝 Qui tắc đặt tên

```
manage.{entityName}.tsx    - Trang quản lý (danh sách + form toàn bộ)
{entityName}.table.tsx     - Thành phần danh sách
{entityName}.create.tsx    - Form tạo
{entityName}.update.tsx    - Form sửa
{entityName}.detail.tsx    - Chi tiết (nếu cần)
```

**Ví dụ:**
```
manage.staffs.tsx
staff.table.tsx
staff.create.tsx
staff.update.tsx
```

---

## 🚀 Best Practices

1. **Callback pattern** cho refresh data:
   ```tsx
   <UserCreate onSuccess={fetchData} />
   ```

2. **Populate form khi edit**:
   ```tsx
   useEffect(() => {
     if (editData) form.setFieldsValue(editData);
   }, [editData]);
   ```

3. **Minimize table columns**:
   ```tsx
   columns={[
     { title: "STT", width: 60, ... },
     { title: "Main Info", ... },
     { title: "Secondary Info", ... },
     { title: "Actions", width: 120, ... }
   ]}
   ```

4. **Form validation**:
   ```tsx
   rules={[
     { required: true, message: "Vui lòng nhập..." }
   ]}
   ```

---

Generated: 2026-04-03
