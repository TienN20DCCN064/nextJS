'use client'

import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Divider } from "antd";
import { 
    FileTextOutlined, 
    NotificationOutlined, 
    TeamOutlined, 
    ArrowRightOutlined,
    SafetyCertificateOutlined,
    CustomerServiceOutlined
} from "@ant-design/icons";
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
    return (
        <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            {/* Hero Section */}
            <div style={{ 
                background: 'linear-gradient(135deg, #1890ff 0%, #001529 100%)', 
                padding: '80px 20px', 
                textAlign: 'center', 
                color: 'white',
                marginBottom: 40
            }}>
                <Title style={{ color: 'white', marginBottom: 20 }}>
                    Cổng Thông Tin Điện Tử Chính Quy
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, maxWidth: 800, margin: '0 auto 40px' }}>
                    Tra cứu thủ tục hành chính, cập nhật tin tức đời sống xã hội và kết nối trực tiếp với cơ quan quản lý nhà nước tại địa phương.
                </Paragraph>
                <Space size="large">
                    <Link href="/news">
                        <Button type="primary" size="large" icon={<FileTextOutlined />}>Xem tin tức</Button>
                    </Link>
                    <Link href="/procedures">
                        <Button size="large" ghost icon={<SafetyCertificateOutlined />}>Thủ tục hành chính</Button>
                    </Link>
                </Space>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 60px' }}>
                {/* Statistics / Highlights */}
                <Row gutter={[24, 24]} style={{ marginTop: -80, marginBottom: 60 }}>
                    <Col xs={24} sm={8}>
                        <Card hoverable style={{ borderRadius: 12, textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: 32, color: '#1890ff', marginBottom: 12 }}><FileTextOutlined /></div>
                            <Title level={4}>Dịch vụ công</Title>
                            <Text type="secondary">Tra cứu hơn 50+ thủ tục hành chính công ngay tại nhà.</Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card hoverable style={{ borderRadius: 12, textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: 32, color: '#52c41a', marginBottom: 12 }}><NotificationOutlined /></div>
                            <Title level={4}>Thông báo</Title>
                            <Text type="secondary">Nhận các thông báo mới nhất về lịch làm việc, tiêm chủng...</Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card hoverable style={{ borderRadius: 12, textAlign: 'center', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: 32, color: '#f5222d', marginBottom: 12 }}><CustomerServiceOutlined /></div>
                            <Title level={4}>Hỗ trợ</Title>
                            <Text type="secondary">Phản ánh kiến nghị và nhận giải đáp từ ban lãnh đạo xã.</Text>
                        </Card>
                    </Col>
                </Row>

                {/* Main Content Sections */}
                <Row gutter={[40, 40]}>
                    <Col lg={16} md={24} xs={24}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'baseline',
                            marginBottom: 24 
                        }}>
                            <Title level={3} style={{ margin: 0, position: 'relative', display: 'inline-block' }}>
                                Tin tức nổi bật
                                <span style={{ 
                                    position: 'absolute', 
                                    bottom: -8, 
                                    left: 0, 
                                    width: 40, 
                                    height: 3, 
                                    backgroundColor: '#1890ff' 
                                }} />
                            </Title>
                            <Link href="/news" style={{ color: '#1890ff' }}>
                                Xem tất cả <ArrowRightOutlined />
                            </Link>
                        </div>

                        <Card bordered={false} style={{ borderRadius: 12, overflow: 'hidden' }}>
                            <Row gutter={[24, 24]}>
                                <Col sm={12} xs={24}>
                                    <img 
                                        src="https://vnanet.vn/Data/Images/logo.png" 
                                        alt="Main article" 
                                        style={{ width: '100%', borderRadius: 8, height: 200, objectFit: 'cover' }} 
                                    />
                                </Col>
                                <Col sm={12} xs={24}>
                                    <Tag color="red">Mới nhất</Tag>
                                    <Title level={4} style={{ marginTop: 12 }}>Đẩy mạnh số hóa thủ tục hành chính tại địa phương</Title>
                                    <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                                        Nhằm nâng cao hiệu quả phục vụ người dân, UBND xã đã ra mắt hệ thống tra cứu thủ tục trực tuyến, giúp tiết kiệm thời gian và chi phí đi lại...
                                    </Paragraph>
                                    <Button type="link" style={{ padding: 0 }}>Đọc tiếp</Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col lg={8} md={24} xs={24}>
                        <Title level={3} style={{ marginBottom: 24, position: 'relative', display: 'inline-block' }}>
                            Thông báo mới
                            <span style={{ 
                                position: 'absolute', 
                                bottom: -8, 
                                left: 0, 
                                width: 40, 
                                height: 3, 
                                backgroundColor: '#52c41a' 
                            }} />
                        </Title>
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            {[
                                "Thông báo lịch cắt điện luân phiên tuần tới",
                                "Kế hoạch tiêm chủng mở rộng đợt 4",
                                "Mời tham gia ý kiến về quy hoạch sử dụng đất"
                            ].map((item, idx) => (
                                <Card size="small" key={idx} hoverable style={{ borderLeft: '4px solid #1890ff' }}>
                                    <Text strong>{item}</Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 12 }}>Ngày đăng: 03/10/2026</Text>
                                </Card>
                            ))}
                        </Space>
                    </Col>
                </Row>
            </div>
            
            {/* Footer decoration */}
            <div style={{ backgroundColor: '#fff', padding: '60px 20px', borderTop: '1px solid #eee' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
                    <Title level={2}>Xây dựng cộng đồng văn minh, hiện đại</Title>
                    <Paragraph type="secondary" style={{ fontSize: 16 }}>
                        Hợp tác - Chia sẻ - Phát triển
                    </Paragraph>
                </div>
            </div>
        </div>
    )
}

// Simple Helper Tag
const Tag = ({ children, color }: { children: React.ReactNode, color: string }) => (
    <span style={{ 
        backgroundColor: color === 'red' ? '#fff1f0' : '#e6f7ff',
        color: color === 'red' ? '#f522d' : '#1890ff',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 'bold',
        border: `1px solid ${color === 'red' ? '#ffa39e' : '#91d5ff'}`
    }}>
        {children}
    </span>
);

export default HomePage;
