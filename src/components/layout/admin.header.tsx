'use client'
import { AdminContext } from '@/library/admin.context';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import { useContext } from 'react';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

const AdminHeader = (props: any) => {
    // const { data: session, status } = useSession();
    const { session } = props;

    const { Header } = Layout;
    const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span>
                    Settings
                </span>
            ),
        },

        {
            key: '4',
            danger: true,
            label: <span onClick={() => signOut()}>Đăng xuất</span>,
        },
    ];

    return (
        <>
            <Header
                style={{
                    padding: '0 24px',
                    display: "flex",
                    background: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0, 102, 255, 0.1)",
                    borderBottom: "1px solid #e6f0ff",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 10,
                }} >

                <Button
                    type="text"
                    icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapseMenu(!collapseMenu)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
                <Space style={{ marginRight: 20 }}>
                    <span style={{ color: '#004080', fontWeight: 500 }}>Welcome <strong style={{ color: '#0066ff' }}>{session?.user?.email ?? ""}</strong></span>
                    <Button type="primary" danger onClick={() => signOut()} style={{ marginLeft: 10, borderRadius: 6, fontWeight: 600 }}>
                        Đăng xuất
                    </Button>
                </Space>
            </Header>
        </>
    )
}

export default AdminHeader;