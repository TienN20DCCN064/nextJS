'use client'

import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Button, Typography, Space, Divider, Skeleton } from "antd";
import {
    FileTextOutlined,
    NotificationOutlined,
    SolutionOutlined,
    TeamOutlined,
    ArrowRightOutlined,
    AreaChartOutlined,
    PlusCircleOutlined,
    SafetyCertificateOutlined,
    GlobalOutlined
} from "@ant-design/icons";
import Link from "next/link";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

interface DashboardStats {
    news: number;
    announcements: number;
    procedures: number;
    staffs: number;
}

const AdminCard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            try {
                const [newsRes, announceRes, procRes, staffRes] = await Promise.all([
                    fetch(`${baseUrl}/api/v1/posts/count?type=news`).then(res => res.json()),
                    fetch(`${baseUrl}/api/v1/posts/count?type=announcement`).then(res => res.json()),
                    fetch(`${baseUrl}/api/v1/procedures/count`).then(res => res.json()),
                    fetch(`${baseUrl}/api/v1/staffs/count`).then(res => res.json())
                ]);

                setStats({
                    news: newsRes.data ?? 0,
                    announcements: announceRes.data ?? 0,
                    procedures: procRes.data ?? 0,
                    staffs: staffRes.data ?? 0
                });
            } catch (err) {
                console.error("Dashboard stats fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const quickLinks = [
        { title: "Đăng tin tức mới", icon: <PlusCircleOutlined />, color: "#1890ff", href: "/admin/news", desc: "Cập nhật tin tức quan trọng nhanh chóng" },
        { title: "Tạo thông báo", icon: <NotificationOutlined />, color: "#faad14", href: "/admin/announcements", desc: "Gửi thông báo mới đến người dân" },
        { title: "Thêm thủ tục", icon: <SolutionOutlined />, color: "#52c41a", href: "/admin/procedures", desc: "Hướng dẫn thực hiện các dịch vụ hành chính" },
        { title: "Cập nhật nhân sự", icon: <TeamOutlined />, color: "#722ed1", href: "/admin/staffs", desc: "Quản lý danh sách cán bộ, nhân viên xã" },
    ];

    if (loading) {
        return (
            <div style={{ padding: '10px 0' }}>
                <Skeleton active paragraph={{ rows: 8 }} />
            </div>
        );
    }

    return (
        <div className="dashboard-container" style={{ padding: '10px 0' }}>
            <div className="welcome-banner" style={{ 
                marginBottom: 32, 
                padding: '32px', 
                background: 'linear-gradient(135deg, #001529 0%, #004e92 100%)', 
                borderRadius: '16px',
                color: 'white',
                boxShadow: '0 10px 25px rgba(0, 78, 146, 0.2)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 800 }}>Chào mừng trở lại, Quản trị viên!</Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginTop: 8 }}>
                        Hôm nay là {dayjs().format('dddd, [ngày] DD [tháng] MM [năm] YYYY')}. Đây là tổng quan về trạng thái nội dung của Cổng thông tin xã.
                    </Paragraph>
                    <div style={{ display: 'flex', gap: '12px', marginTop: 16 }}>
                        <Button type="primary" size="large" ghost style={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}>
                            <GlobalOutlined /> Xem trang chủ
                        </Button>
                        <Button type="primary" size="large" style={{ borderRadius: '8px', background: '#00ccff', border: 'none', color: '#001529', fontWeight: 'bold' }}>
                            <AreaChartOutlined /> Báo cáo chi tiết
                        </Button>
                    </div>
                </div>
                <div style={{ 
                    position: 'absolute', 
                    top: '-50px', 
                    right: '-50px', 
                    fontSize: '200px', 
                    color: 'rgba(255,255,255,0.05)',
                    transform: 'rotate(-15deg)',
                    pointerEvents: 'none'
                }}>
                    <SafetyCertificateOutlined />
                </div>
            </div>

            {/* Stats Row */}
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Statistic 
                            title={<Text type="secondary" strong>TIN TỨC</Text>} 
                            value={stats?.news} 
                            prefix={<FileTextOutlined style={{ color: '#1890ff', marginRight: 8 }} />} 
                            valueStyle={{ fontWeight: 800, color: '#001529' }}
                        />
                        <div style={{ marginTop: 8, fontSize: '12px', color: '#52c41a' }}>+2 tin mới tuần này</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Statistic 
                            title={<Text type="secondary" strong>THÔNG BÁO</Text>} 
                            value={stats?.announcements} 
                            prefix={<NotificationOutlined style={{ color: '#faad14', marginRight: 8 }} />} 
                            valueStyle={{ fontWeight: 800, color: '#001529' }}
                        />
                        <div style={{ marginTop: 8, fontSize: '12px', color: '#bfbfbf' }}>Không có biến động</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Statistic 
                            title={<Text type="secondary" strong>THỦ TỤC</Text>} 
                            value={stats?.procedures} 
                            prefix={<SolutionOutlined style={{ color: '#52c41a', marginRight: 8 }} />} 
                            valueStyle={{ fontWeight: 800, color: '#001529' }}
                        />
                        <div style={{ marginTop: 8, fontSize: '12px', color: '#52c41a' }}>1 thủ tục đang chờ duyệt</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Statistic 
                            title={<Text type="secondary" strong>NHÂN SỰ</Text>} 
                            value={stats?.staffs} 
                            prefix={<TeamOutlined style={{ color: '#722ed1', marginRight: 8 }} />} 
                            valueStyle={{ fontWeight: 800, color: '#001529' }}
                        />
                        <div style={{ marginTop: 8, fontSize: '12px', color: '#bfbfbf' }}>Dữ liệu đầy đủ</div>
                    </Card>
                </Col>
            </Row>

            <Title level={4} style={{ marginBottom: 24, fontWeight: 700, color: '#003a66' }}>Lối tắt quản lý nhanh</Title>
            
            <Row gutter={[24, 24]}>
                {quickLinks.map((link, index) => (
                    <Col xs={24} sm={6} key={index}>
                        <Link href={link.href}>
                            <Card 
                                hoverable 
                                style={{ borderRadius: '12px', height: '100%', transition: 'all 0.3s' }}
                                bodyStyle={{ padding: '24px' }}
                            >
                                <div style={{ 
                                    width: '48px', 
                                    height: '48px', 
                                    background: `${link.color}15`, 
                                    borderRadius: '12px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    marginBottom: 16,
                                    fontSize: '20px',
                                    color: link.color
                                }}>
                                    {link.icon}
                                </div>
                                <Text strong style={{ fontSize: '15px', display: 'block', marginBottom: 8 }}>{link.title}</Text>
                                <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ fontSize: '13px', marginBottom: 16 }}>
                                    {link.desc}
                                </Paragraph>
                                <div style={{ color: link.color, fontWeight: 600, fontSize: '13px' }}>
                                    Truy cập ngay <ArrowRightOutlined />
                                </div>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>

            <Divider style={{ margin: '40px 0' }} />

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card title={<Text strong>Trạng thái hệ thống</Text>} extra={<Link href="/admin/pages">Xem chi tiết</Link>} style={{ borderRadius: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Space>
                                    <div style={{ width: 8, height: 8, background: '#52c41a', borderRadius: '50%' }} />
                                    <Text>Backend API Server</Text>
                                </Space>
                                <Text type="secondary">Hoạt động (100%)</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Space>
                                    <div style={{ width: 8, height: 8, background: '#52c41a', borderRadius: '50%' }} />
                                    <Text>Database Connection</Text>
                                </Space>
                                <Text type="secondary">Hoạt động - {process.env.NEXT_PUBLIC_DB_TYPE || 'MySQL'}</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Space>
                                    <div style={{ width: 8, height: 8, background: '#52c41a', borderRadius: '50%' }} />
                                    <Text>Dung lượng lưu trữ</Text>
                                </Space>
                                <Text type="secondary">Cảnh báo: 12% / 100%</Text>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title={<Text strong>Tác vụ hôm nay</Text>} style={{ borderRadius: '12px' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Card size="small" style={{ background: '#f0faff', border: '1px solid #cceeff' }}>
                                <Text strong style={{ fontSize: '13px' }}>Kiểm tra bình luận mới</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: '12px' }}>Có 3 phản hồi đang chờ</Text>
                            </Card>
                            <Card size="small" style={{ background: '#fff7e6', border: '1px solid #ffe7ba' }}>
                                <Text strong style={{ fontSize: '13px' }}>Cập nhật giới thiệu xã</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: '12px' }}>Nội dung cần chỉnh sửa</Text>
                            </Card>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminCard;