'use client'
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    AppstoreOutlined,
    MailOutlined,
    TeamOutlined,

} from '@ant-design/icons';
import React, { useContext } from 'react';
import { AdminContext } from "@/library/admin.context";
import type { MenuProps } from 'antd';
import Link from 'next/link'

type MenuItem = Required<MenuProps>['items'][number];
const AdminSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(AdminContext)!;
    const items: MenuItem[] = [
        {
            key: 'grp',
            label: 'Quản trị',
            type: 'group',
            children: [
                {
                    key: "dashboard",
                    label: <Link href={"/dashboard"}>Dashboard</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: "users",
                    label: <Link href={"/dashboard/user"}>Quản lý người dùng</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    key: "about",
                    label: <Link href={"/admin/about"}>Quản lý Giới thiệu</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: "news",
                    label: <Link href={"/admin/news"}>Quản lý Tin tức</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: "announcements",
                    label: <Link href={"/admin/announcements"}>Quản lý Thông báo</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: "documents",
                    label: <Link href={"/admin/documents"}>Quản lý Văn bản</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: "procedures",
                    label: <Link href={"/admin/procedures"}>Quản lý Thủ tục</Link>,
                    icon: <AppstoreOutlined />,
                },
                {
                    key: "contact",
                    label: <Link href={"/admin/contact"}>Quản lý Liên hệ</Link>,
                    icon: <MailOutlined />,
                },
            ],
        },
    ];
    return (
        <Sider
            collapsed={collapseMenu}
        >

            <Menu
                mode="inline"
                defaultSelectedKeys={['dashboard']}
                items={items}
                style={{ height: '100vh' }}
            />
        </Sider>
    )
}

export default AdminSideBar;