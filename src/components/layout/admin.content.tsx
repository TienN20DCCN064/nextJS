'use client'

import { Layout } from "antd";

const AdminContent = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { Content } = Layout;

    return (
        <Content style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div
                style={{
                    padding: 24,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    background: "#f0f5ff",
                }}
            >
                {children}
            </div>
        </Content>
    )
}

export default AdminContent;