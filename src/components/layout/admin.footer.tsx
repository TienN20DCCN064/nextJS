'use client'
import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                Hệ thống Quản lý Hành chính - UBND Xã ©{new Date().getFullYear()}
            </Footer>
        </>
    )
}

export default AdminFooter;