"use client";

import { Card, Typography, Divider, Empty, Skeleton, Tag } from "antd";
import { useEffect, useState } from "react";

const { Title, Paragraph } = Typography;

function AboutSkeleton() {
  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Skeleton.Input active style={{ width: 320, height: 40, marginBottom: 16 }} />
          <br />
          <Skeleton.Input active style={{ width: 480, height: 20, marginBottom: 16 }} />
          <Divider />
        </div>
        <div className="space-y-12">
          {[1, 2].map((i) => (
            <Card
              key={i}
              className="premium-card shadow-md"
              bodyStyle={{ padding: '32px' }}
            >
              <div className="flex flex-col gap-8">
                <Skeleton.Image active style={{ width: '100%', height: 240, borderRadius: 12 }} />
                <div>
                  <Skeleton active paragraph={{ rows: 5 }} title={{ width: '40%' }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function AboutPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
        const url = `${baseUrl}/api/v1/pages?published=true`;
        const res = await fetch(url);

        if (!res.ok) {
          setError(`HTTP Error: ${res.status}`);
          return;
        }

        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : [];
        const displayPages = data.filter((p: any) => p.isPublished && !['phone', 'email', 'title'].includes(p.type));
        setPages(displayPages);
      } catch (err: any) {
        console.error("Fetch pages failed:", err);
        setError(err.message || 'Lỗi kết nối mạng');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();
  }, []);

  if (isLoading) return <AboutSkeleton />;
  if (error) return <div className="text-center p-24 text-red-500 font-black text-xl">Lỗi tải trang: {error}</div>;

  return (
    <main className="bg-slate-50 min-h-screen pb-24">
      <section className="bg-white border-b border-slate-100 py-20 mb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight animate-fade-in-up">Giới thiệu & Thông tin</h1>
          <Paragraph className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
            Tổng hợp các trang thông tin chính thức về lịch sử, truyền thống và các hoạt động phát triển của địa phương.
          </Paragraph>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </section>

      <div className="max-w-7xl mx-auto px-6">

        {pages.length === 0 ? (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card className="premium-card text-center py-24">
              <Empty description={<span className="text-slate-400 font-bold">Hiện chưa có thông tin nào được công khai.</span>} />
            </Card>
          </div>
        ) : (
          <div className="space-y-20">
            {pages.map((page, index) => (
              <Card 
                key={page.id} 
                className="premium-card overflow-hidden animate-fade-in-up shadow-premium"
                style={{ animationDelay: `${0.2 + (index % 4) * 0.1}s` }}
                bodyStyle={{ padding: 0 }}
              >
                <div className="flex flex-col">
                  {page.image && (
                    <div className="w-full h-80 md:h-[450px] relative overflow-hidden">
                      <img 
                        src={page.image} 
                        alt={page.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  )}
                  
                  <div className="p-10 md:p-16 flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                      <h2 className="text-4xl m-0 font-black text-slate-800 tracking-tight leading-tight">{page.title}</h2>
                      <Tag color="blue" className="rounded-full px-5 py-1.5 font-black uppercase tracking-widest text-[10px] border-none bg-blue-50 text-blue-600">
                        {page.type || 'Nội dung'}
                      </Tag>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-10 uppercase tracking-widest">
                       Lần cập nhật cuối: {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString('vi-VN') : 'Mới đây'}
                    </div>

                    <Divider className="my-10 opacity-30" />

                    <div className="prose max-w-none text-slate-600 leading-loose text-lg whitespace-pre-wrap font-medium">
                      {page.content}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}