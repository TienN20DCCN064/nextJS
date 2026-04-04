"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Row, Col, Card, Statistic, Table, Tag, Button, Space, Skeleton, Typography, Empty, Avatar } from 'antd';
import { 
  ArrowRightOutlined, 
  ReadOutlined, 
  NotificationOutlined, 
  FileTextOutlined, 
  UserOutlined,
  CalendarOutlined,
  GlobalOutlined,
  EyeOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import PostDetailModal from '@/components/common/PostDetailModal';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Title, Paragraph, Text } = Typography;

type AboutData = {
  title?: string;
  content?: string;
};

// Dynamicized below in the Home component

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
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [aboutError, setAboutError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
  const [stats, setStats] = useState({
    news: 0,
    announcements: 0,
    procedures: 0,
    staffs: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      // Fetch Stats
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
        console.error('Fetch stats error:', err);
      }

      // Fetch About
      try {
        const res = await fetch(`${baseUrl}/api/v1/pages/slug/about?published=true`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const page = json.data || json; 
          if (page && page.title) {
            setAboutData({ title: page.title, content: page.content });
          }
        }
      } catch (err: any) {
        setAboutError('Lỗi tải dữ liệu giới thiệu');
      } finally {
        setIsLoading(false);
      }

      // Fetch All Posts (Latest News for Hero)
      try {
        const res = await fetch(`${baseUrl}/api/v1/posts?type=news&limit=1000`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const items = json.data || json;
          setAllPosts(items);
        }
      } catch (err) {
        console.error('Fetch posts error:', err);
      } finally {
        setIsNewsLoading(false);
      }

      // Fetch Recent Announcements for Table
      try {
        const res = await fetch(`${baseUrl}/api/v1/posts?type=announcement&limit=5`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const items = (json.data || json).map((item: any) => ({
            key: item.id || item._id,
            title: item.title,
            category: 'Thông báo',
            status: item.isFeatured ? 'Quan trọng' : 'Mới',
            ...item
          }));
          setRecentAnnouncements(items);
        }
      } catch (err) {
        console.error('Fetch announcements table error:', err);
      }
    };

    fetchData();
  }, []);

  const handleOpenDetail = (post: any) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // Slicing data for Hero Section
  const featuredPost = allPosts.find(p => p.isFeatured) || allPosts[0];
  const remainingPosts = allPosts.filter(p => p.id !== featuredPost?.id);
  const leftNews = remainingPosts; // Hiện tất cả bài viết còn lại
  const rightNews = remainingPosts.slice(8, 16);
  const announcementList = recentAnnouncements.slice(0, 6);

  const defaultImage = "https://vnanet.vn/Data/Images/logo.png";

  return (
    <main className="bg-white min-h-screen pb-24">
      {/* Dynamic News Hero Section */}
      <section className="bg-white border-b border-slate-100 pt-8 pb-12 overflow-hidden mb-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <Row gutter={[24, 24]} align="top">
            <Col xs={24} lg={6}>
              <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 4, height: 20, background: '#1890ff' }} />
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#003a66', textTransform: 'uppercase', margin: 0 }}>
                    TIN TỔNG HỢP
                  </h2>
                </div>
                <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 600, overflowY: 'auto', paddingRight: 10 }}>
                  {leftNews.map((item) => (
                    <div key={item.id || item._id} style={{ cursor: 'pointer', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 12, alignItems: 'flex-start' }} onClick={() => handleOpenDetail(item)}>
                      <div style={{ width: 90, height: 60, flexShrink: 0, borderRadius: 6, overflow: 'hidden', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <img 
                          src={item.thumbnail || defaultImage} 
                          alt={item.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#0f172a', fontWeight: 600, lineHeight: 1.3, marginBottom: 8, fontSize: 13, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.title}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748b', fontSize: 11 }}>
                           <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                             <ClockCircleOutlined /> {dayjs(item.publishedAt).format('DD/MM/YYYY')}
                           </span>
                           {(typeof item.author === 'object' ? item.author?.name : item.author) && (
                             <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                               <EyeOutlined /> {typeof item.author === 'object' ? item.author?.name : item.author}
                             </span>
                           )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <div style={{ paddingRight: 8 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, textTransform: 'uppercase', marginBottom: 24, color: '#003a66', letterSpacing: '-0.5px' }}>
                  TIN MỚI NHẤT
                </h2>
                {featuredPost ? (
                  <div style={{ cursor: 'pointer' }} onClick={() => handleOpenDetail(featuredPost)}>
                    <div style={{ position: 'relative', width: '100%', paddingBottom: '62.5%', overflow: 'hidden', marginBottom: 16, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <img
                        src={featuredPost.thumbnail || defaultImage}
                        alt={featuredPost.title}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
                      />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 12, lineHeight: 1.2 }}>
                        {featuredPost.title}
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, color: '#64748b', fontSize: 13, fontWeight: 500 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <ClockCircleOutlined /> {dayjs(featuredPost.publishedAt).fromNow()}
                        </span>
                        {(typeof featuredPost.author === 'object' ? featuredPost.author?.name : featuredPost.author) && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <EyeOutlined /> {typeof featuredPost.author === 'object' ? featuredPost.author?.name : featuredPost.author}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 16 }}>
                    <Skeleton.Button active block style={{ height: 350 }} />
                    <Skeleton active title={{ width: '80%' }} paragraph={{ rows: 2 }} />
                  </div>
                )}
              </div>
            </Col>

            <Col xs={24} lg={6}>
              <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 4, height: 20, background: '#1890ff' }} />
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#003a66', textTransform: 'uppercase', margin: 0 }}>
                    THÔNG BÁO
                  </h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 460, overflowY: 'auto', paddingRight: 10 }}>
                  {announcementList.length > 0 ? announcementList.map((item) => (
                    <div
                      key={item.key || item.id || item._id}
                      style={{ cursor: 'pointer', paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}
                      onClick={() => handleOpenDetail(item)}
                    >
                      <h4 style={{ color: '#0f172a', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                        {item.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 12 }}>
                        <NotificationOutlined /> {dayjs(item.publishedAt).format('DD/MM/YYYY')}
                      </div>
                    </div>
                  )) : (
                    [1,2,3,4].map(i => (
                      <Skeleton key={i} active paragraph={{ rows: 1 }} title={{ width: '70%' }} />
                    ))
                  )}
                </div>
                <Link href="/announcements" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 12, fontWeight: 700, color: '#1890ff', textTransform: 'uppercase' }}>
                  XEM TẤT CẢ <ArrowRightOutlined style={{ fontSize: 10 }} />
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Statistics Grid */}
        <Row gutter={[24, 24]} className="mb-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {[
            { title: 'Tin tức', value: stats.news, icon: <ReadOutlined className="text-indigo-600"/>, suffix: '+', bg: 'bg-indigo-50/50', href: '/news' },
            { title: 'Thông báo', value: stats.announcements, icon: <NotificationOutlined className="text-amber-500"/>, suffix: '', bg: 'bg-amber-50/50', href: '/announcements' },
            { title: 'Thủ tục', value: stats.procedures, icon: <FileTextOutlined className="text-emerald-500"/>, suffix: '', bg: 'bg-emerald-50/50', href: '/procedures' },
            { title: 'Nhân sự', value: stats.staffs, icon: <UserOutlined className="text-blue-500"/>, suffix: '', bg: 'bg-blue-50/50', href: '/contact' },
          ].map((stat, i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Link href={stat.href} className="no-underline block h-full">
                <Card className="premium-card text-center py-6 group hover:scale-[1.02] transition-all duration-500 cursor-pointer shadow-premium border-white rounded-2xl h-full">
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-4 text-base group-hover:scale-110 transition-transform duration-500`}>
                     {stat.icon}
                  </div>
                  <Statistic 
                    title={<span className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-1 block group-hover:text-primary transition-colors">{stat.title}</span>} 
                    value={stat.value} 
                    suffix={stat.suffix}
                    valueStyle={{ fontWeight: 900, fontSize: '1.5rem', color: '#1e293b', letterSpacing: '-0.02em' }}
                  />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>

        {/* About Section */}
        <section className="mb-20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title text-3xl m-0">Giới thiệu xã</h2>
            <Link href="/about" className="text-primary font-bold hover:underline flex items-center gap-2 uppercase tracking-tighter text-sm">
              Tìm hiểu thêm <ArrowRightOutlined size={14}/>
            </Link>
          </div>
          
          <Card className="premium-card glass-panel" bodyStyle={{ padding: 0 }}>
            <div className="flex flex-col md:flex-row min-h-[300px]">
              <div className="flex-1 p-10 flex flex-col justify-center">
                 {isLoading ? (
                   <Skeleton active />
                 ) : aboutData?.title ? (
                    <>
                      <h3 className="text-2xl font-black mb-6 text-slate-800 leading-tight">{aboutData.title}</h3>
                      <p className="text-slate-600 leading-relaxed text-lg mb-0 font-medium italic relative">
                         <span className="text-6xl text-slate-100 absolute -top-8 -left-4 font-serif pointer-events-none">“</span>
                         {aboutData.content?.substring(0, 350)}...
                      </p>
                    </>
                 ) : (
                    <Empty description="Đang cập nhật giới thiệu..." />
                 )}
              </div>
              <div className="md:w-2/5 p-10 bg-slate-50/50 flex items-center justify-center border-l border-slate-100">
                <div className="text-center group">
                  <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                     <GlobalOutlined className="text-4xl text-blue-600" />
                  </div>
                  <div className="font-black text-slate-800 text-xl mb-1">Cổng thông tin</div>
                  <div className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Chính thức & Minh bạch</div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Notification & Procedures Highlights */}
        <Row gutter={[40, 40]} className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
           <Col xs={24} lg={16}>
              <h2 className="section-title text-3xl font-black uppercase tracking-tighter mb-8">Thông báo quan trọng</h2>
              <Card className="premium-card shadow-premium overflow-hidden" bodyStyle={{ padding: 0 }}>
                <Table 
                  columns={columns} 
                  dataSource={recentAnnouncements} 
                  pagination={false} 
                  className="premium-table"
                  rowClassName="hover:bg-slate-50 transition-colors cursor-pointer group"
                  onRow={(record) => ({
                    onClick: () => handleOpenDetail(record),
                  })}
                />
              </Card>
           </Col>
           <Col xs={24} lg={8}>
              <h2 className="section-title text-3xl font-black uppercase tracking-tighter mb-8">Tin tức khác</h2>
              <div className="flex flex-col gap-5">
                  {rightNews.map((item) => (
                    <div key={item.id} className="flex gap-4 group cursor-pointer pb-5 border-b border-slate-50 last:border-0" onClick={() => handleOpenDetail(item)}>
                       <div className="w-[120px] h-[80px] rounded-sm overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
                          <img 
                            src={item.thumbnail || defaultImage} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                       </div>
                       <div className="flex flex-col justify-start flex-1">
                          <h4 className="text-[15px] font-bold text-slate-800 leading-[1.35] group-hover:text-primary transition-colors line-clamp-3">
                            {item.title}
                          </h4>
                          {(typeof item.author === 'object' ? item.author?.name : item.author) && (
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-2">
                               <EyeOutlined /> {typeof item.author === 'object' ? item.author?.name : item.author}
                            </div>
                          )}
                       </div>
                    </div>
                  ))}
              </div>
           </Col>
        </Row>
      </div>

      <PostDetailModal 
        post={selectedPost} 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}
