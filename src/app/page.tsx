"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Row, Col, Card, Statistic, Table, Tag, Button, Space } from 'antd';

type AboutData = {
  title?: string;
  content?: string;
};

const quickLinks = [
  { href: '/about', title: 'Giới thiệu', desc: 'Thông tin chung' },
  { href: '/news', title: 'Tin tức', desc: 'Tin tức sự kiện' },
  { href: '/announcements', title: 'Thông báo', desc: 'Thông báo chính sách' },
  { href: '/documents', title: 'Văn bản', desc: 'Văn bản/Tài liệu' },
  { href: '/procedures', title: 'Thủ tục', desc: 'Thủ tục hành chính' },
  { href: '/contact', title: 'Liên hệ', desc: 'Gửi phản hồi' },
];

const recentItems = [
  { key: '1', title: 'Sự kiện công tác', category: 'Sự kiện', status: 'Mới' },
  { key: '2', title: 'Thông báo khẩn', category: 'Thông báo', status: 'Quan trọng' },
  { key: '3', title: 'Văn bản QĐ', category: 'Văn bản', status: 'Chuẩn bị' },
];

const columns = [
  { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
  { title: 'Loại', dataIndex: 'category', key: 'category' },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const color = status === 'Mới' ? 'green' : status === 'Quan trọng' ? 'red' : 'orange';
      return <Tag color={color}>{status}</Tag>;
    },
  },
];

export default function Home() {
  const [aboutData, setAboutData] = useState<AboutData>({ title: '', content: '' });
  const [aboutError, setAboutError] = useState('');

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/pages/slug/about`, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(`Không lấy được giới thiệu. status=${res.status}`);
        }
        const json = await res.json();
        setAboutData({ title: json.title, content: json.content });
      } catch (err: any) {
        console.error('[Home] fetchAbout error', err);
        setAboutError(err?.message || 'Lỗi tải dữ liệu giới thiệu');
      }
    };

    fetchAbout();
  }, []);

  return (
    <main className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">UBND Xã - Cổng Thông Tin</h1>
          <p className="text-slate-600">Giao diện quản trị đơn giản với Ant Design + style Tailwind-style</p>
        </header>

        <section className="mb-8 px-4 py-4 rounded-lg bg-white shadow-sm border border-slate-100">
          <h2 className="text-2xl font-semibold mb-2">Giới thiệu xã</h2>
          {aboutError ? (
            <p className="text-red-600">{aboutError}. Vui lòng kiểm tra backend và config .env</p>
          ) : aboutData?.title ? (
            <>
              <h3 className="text-xl font-bold">{aboutData.title}</h3>
              <p className="whitespace-pre-line leading-relaxed">{aboutData.content}</p>
            </>
          ) : (
            <p>Đang tải nội dung...</p>
          )}
        </section>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} lg={6}>
            <Card>
              <Statistic title="Tin tức" value={124} />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card>
              <Statistic title="Thông báo" prefix="+" value={23} />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card>
              <Statistic title="Văn bản" value={78} />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card>
              <Statistic title="Hỏi đáp" suffix="câu hỏi" value={57} />
            </Card>
          </Col>
        </Row>

        <div className="mt-8">
          <Card title="Liên kết nhanh" bordered>
            <Row gutter={[12, 12]}>
              {quickLinks.map((item) => (
                <Col key={item.href} xs={24} sm={12} md={8} lg={6}>
                  <Card size="small" hoverable>
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-slate-500 text-sm mb-3">{item.desc}</p>
                    <Link href={item.href} className="text-blue-600 hover:text-blue-800">
                      Vào trang
                    </Link>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </div>

        <div className="mt-8">
          <Card title="Mục gần đây" extra={<Button type="primary">Tải lại</Button>}>
            <Table columns={columns} dataSource={recentItems} pagination={false} />
          </Card>
        </div>

        <div className="mt-8 text-right">
          <Space>
            <Button type="default" href="/about">Giới thiệu</Button>
            <Button type="primary" href="/news">Tin tức</Button>
          </Space>
        </div>
      </div>
    </main>
  );
}
