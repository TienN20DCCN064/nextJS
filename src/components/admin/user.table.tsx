"use client";
import { handleDeleteUserAction } from "@/utils/actions";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Image, Popconfirm, Table } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import UserCreate from "./user.create";
import UserUpdate from "./user.update";

interface IProps {
  users: any;
  meta?: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  onRefresh?: () => void;
}
const UserTable = (props: IProps) => {
  const { users, meta, onRefresh } = props;
  const safeMeta = meta ?? { current: 1, pageSize: 10, pages: 1, total: 0 };
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<any>(null);
  const columns = [
    {
      title: "STT",
      render: (_: any, record: any, index: any) => {
        return <>{index + 1 + (safeMeta.current - 1) * safeMeta.pageSize}</>;
      },
      width: 60,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      width: 80,
      render: (image: string) => image ? <Image src={image} width={40} height={40} style={{ objectFit: 'cover', borderRadius: 4 }} alt="avatar" /> : null,
    },
    {
      title: "Actions",
      width: 100,
      render: (text: any, record: any, index: any) => {
        return (
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setIsUpdateModalOpen(true);
                setDataUpdate(record);
              }}
            />

            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa user"}
              description={"Bạn có chắc chắn muốn xóa user này ?"}
              onConfirm={async () => {
                await handleDeleteUserAction(record?.id);
                onRefresh?.();
              }}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer" }}>
                <DeleteTwoTone twoToneColor="#ff4d4f" />
              </span>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    if (pagination && pagination.current) {
      const params = new URLSearchParams(searchParams);
      params.set("current", pagination.current);
      replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <span>Manager Users</span>
        <Button onClick={() => setIsCreateModalOpen(true)}>Create User</Button>
      </div>
      <Table
        bordered
        dataSource={users}
        columns={columns}
        rowKey={"id"}
        pagination={{
          current: safeMeta.current,
          pageSize: safeMeta.pageSize,
          showSizeChanger: true,
          total: safeMeta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {" "}
                {range[0]}-{range[1]} trên {total} rows
              </div>
            );
          },
        }}
        onChange={onChange}
      />

      <UserCreate
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        onSuccess={() => {
          onRefresh?.();
        }}
      />

      <UserUpdate
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        onSuccess={() => {
          onRefresh?.();
        }}
      />
    </>
  );
};

export default UserTable;
