'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    AppstoreOutlined,
    MailOutlined,
    TeamOutlined,
    DashboardOutlined,
    FileTextOutlined,
    NotificationOutlined,
    SolutionOutlined,
    ApartmentOutlined,
} from '@ant-design/icons';
import React, { useContext } from 'react';
import { AdminContext } from "@/library/admin.context";
import type { MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuItem = Required<MenuProps>['items'][number];

const AdminSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(AdminContext)!;
    const pathname = usePathname();

    // Map pathname → menu key
    const getSelectedKey = (path: string): string => {
        if (path === '/admin' || path === '/dashboard') return 'dashboard';
        if (path.startsWith('/admin/about')) return 'about';
        if (path.startsWith('/admin/news')) return 'news';
        if (path.startsWith('/admin/announcements')) return 'announcements';
        if (path.startsWith('/admin/procedures')) return 'procedures';
        if (path.startsWith('/admin/departments')) return 'departments';
        if (path.startsWith('/admin/staffs')) return 'staffs';
        if (path.startsWith('/admin/pages')) return 'pages';
        if (path.startsWith('/admin/other-news')) return 'other-news';
        if (path.startsWith('/dashboard/user')) return 'users';
        return 'dashboard';
    };

    const selectedKey = getSelectedKey(pathname);

    const items: MenuItem[] = [
        {
            key: 'grp',
            label: <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px' }}>Quản lý</span>,
            type: 'group',
            children: [
                {
                    key: "dashboard",
                    label: <Link href={"/admin"}>Dashboard</Link>,
                    icon: <DashboardOutlined />,
                },
                {
                    key: "users",
                    label: <Link href={"/dashboard/user"}>Quản lý người dùng</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    key: "about",
                    label: <Link href={"/admin/about"}>Quản lý Giới thiệu</Link>,
                    icon: <FileTextOutlined />,
                },
                {
                    key: "news",
                    label: <Link href={"/admin/news"}>Quản lý Tin tức</Link>,
                    icon: <NotificationOutlined />,
                },
                {
                    key: "announcements",
                    label: <Link href={"/admin/announcements"}>Quản lý Thông báo</Link>,
                    icon: <MailOutlined />,
                },
                {
                    key: "other-news",
                    label: <Link href={"/admin/other-news"}>Quản lý Thông tin khác</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: "procedures",
                    label: <Link href={"/admin/procedures"}>Quản lý Thủ tục</Link>,
                    icon: <SolutionOutlined />,
                },
                {
                    key: "departments",
                    label: <Link href={"/admin/departments"}>Quản lý Phòng ban</Link>,
                    icon: <ApartmentOutlined />,
                },
                {
                    key: "staffs",
                    label: <Link href={"/admin/staffs"}>Quản lý Nhân sự</Link>,
                    icon: <TeamOutlined />,
                },
            ],
        },
    ];

    return (
        <Sider collapsed={collapseMenu} width={260}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'linear-gradient(180deg, #001f4d 0%, #004080 100%)' }}>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={items}
                    style={{ 
                        flex: 1,
                        background: 'transparent',
                        borderRight: 'none',
                    }}
                />
                {!collapseMenu && (
                    <div style={{ padding: '16px 10px', textAlign: 'center', color: '#a6c1e1', fontSize: '11px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        Hệ thống Quản lý Hành chính<br/>UBND Xã ©{new Date().getFullYear()}
                    </div>
                )}
            </div>
        </Sider>
    );
};

export default AdminSideBar;