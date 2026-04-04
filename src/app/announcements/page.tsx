"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { 
  HomeOutlined, 
  NotificationOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  ArrowRightOutlined,
  SearchOutlined 
} from '@ant-design/icons';
import { Skeleton, Card, Typography, Empty, Button, Space, Avatar, Tag, Input } from 'antd';
import PostDetailModal from '@/components/common/PostDetailModal';
import dayjs from 'dayjs';

const { Paragraph } = Typography;

const fetchAnnouncements = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/v1/posts?type=announcement&limit=1000`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không lấy được thông báo.');
  const json = await res.json();
  return json.data || json;
};

function AnnouncementsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Skeleton active title={{ width: 300 }} paragraph={{ rows: 2 }} className="mb-12" />
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="premium-card">
            <Skeleton active avatar paragraph={{ rows: 2 }} />
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AnnouncementsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const defaultImage = "https://vnanet.vn/Data/Images/logo.png";

  const filteredItems = items.filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchAnnouncements()
      .then(setItems)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleOpenDetail = (post: any) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  if (isLoading) return <AnnouncementsSkeleton />;

  return (
    <main className="bg-slate-50 min-h-screen pb-24">
      {/* Premium Header */}
      <section className="bg-white border-b border-slate-100 py-20 mb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
          <Link href="/" className="text-slate-400 hover:text-primary transition-colors font-bold flex items-center gap-2 mb-6 uppercase tracking-widest text-[10px] animate-fade-in-up">
             <HomeOutlined /> Trang chủ / Thông báo
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-black text-slate-800 mb-6 animate-fade-in-up tracking-tight">
                <NotificationOutlined className="text-primary mr-3" />
                Thông báo & Văn bản
              </h1>
              <p className="text-lg text-slate-500 animate-fade-in-up md:mx-0 mx-auto leading-relaxed" style={{ animationDelay: '0.1s' }}>
                Thông tin kịp thời về các quyết định, chính sách mới và các thông báo khẩn từ địa phương.
              </p>
            </div>
            <div className="w-full lg:w-96 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Input 
                  placeholder="Tìm kiếm thông báo..." 
                  prefix={<SearchOutlined className="text-slate-300" />}
                  size="large"
                  className="rounded-2xl h-14 border-slate-200 shadow-sm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-50/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {filteredItems?.length > 0 ? (
          <div className="max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-8">
              {filteredItems?.map((item: any, index: number) => (
                <Card 
                  key={item.id || item._id} 
                  hoverable
                  className="premium-card animate-fade-in-up group overflow-hidden"
                  style={{ animationDelay: `${0.2 + (index % 5) * 0.1}s` }}
                  bodyStyle={{ padding: 0 }}
                  onClick={() => handleOpenDetail(item)}
                >
                  <div className="flex flex-col md:flex-row items-stretch">
                    <div className="relative w-full md:w-80 aspect-video md:aspect-auto md:h-64 flex-shrink-0 overflow-hidden bg-slate-100">
                      <img 
                        src={item.thumbnail || defaultImage} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {item.isFeatured && (
                        <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded shadow-lg uppercase tracking-widest">Tiêu điểm</div>
                      )}
                    </div>
                    
                    <div className="flex-1 p-8 flex flex-col justify-center bg-white">
                    <div className="flex items-center gap-3 text-slate-400 text-[11px] font-bold mb-4 uppercase tracking-widest">
                       <CalendarOutlined className="text-primary" /> {item.publishedAt ? dayjs(item.publishedAt).format('DD/MM/YYYY') : 'Mới đây'}
                       <span className="mx-2 text-slate-200">|</span>
                       <UserOutlined /> {item.author || "TTXVN"}
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-primary transition-colors leading-tight">
                      {item.title}
                    </h3>
                    
                    <Paragraph className="text-slate-500 text-sm mb-0 line-clamp-2 leading-relaxed">
                       {item.summary}
                    </Paragraph>
                  </div>

                  <div className="hidden md:flex p-10 items-center justify-center border-l border-slate-50 bg-slate-50/20">
                    <ArrowRightOutlined className="text-xl text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
          <div className="text-center py-24 animate-fade-in-up">
            <Empty description={<span className="text-slate-400 font-bold">Không tìm thấy thông báo phù hợp.</span>} />
          </div>
        )}

        <div className="text-center mt-24 animate-fade-in-up">
           <Button icon={<HomeOutlined />} href="/" size="large" className="rounded-2xl px-12 h-16 font-black border-slate-200 text-slate-800 hover:text-primary hover:border-primary">
             TRỞ VỀ TRANG CHỦ
           </Button>
        </div>
      </div>

      <PostDetailModal 
        post={selectedPost} 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </main>
  );
}
