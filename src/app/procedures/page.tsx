"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Skeleton, Card, Avatar, Button } from 'antd';
import ProcedureDetailModal from '@/components/common/ProcedureDetailModal';
import { 
  FolderOpenOutlined, 
  FieldTimeOutlined, 
  DollarOutlined, 
  HomeOutlined,
  SearchOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { Input } from 'antd';

const fetchProcedures = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/v1/procedures`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không lấy được thủ tục.');
  const json = await res.json();
  return json.data || json;
};

function ProceduresSkeleton() {
  return (
    <div style={{ padding: 30, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <Skeleton.Input active style={{ width: 360, height: 36 }} />
      </div>
      <Skeleton.Input active style={{ width: 480, height: 20, marginBottom: 30 }} />
      <div style={{ display: 'grid', gap: 16 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} style={{ borderRadius: 12, border: '1px solid #e8e8e8' }} bodyStyle={{ padding: 24 }}>
            <Skeleton active paragraph={{ rows: 2 }} title={{ width: '40%' }} />
            <div style={{ display: 'flex', gap: 32, marginTop: 12 }}>
              <Skeleton.Input active size="small" style={{ width: 140 }} />
              <Skeleton.Input active size="small" style={{ width: 120 }} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ProceduresPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProcedure, setSelectedProcedure] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchProcedures()
      .then(setItems)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleOpenDetail = (proc: any) => {
    setSelectedProcedure(proc);
    setModalOpen(true);
  };

  if (isLoading) return <ProceduresSkeleton />;

  return (
    <main className="bg-slate-50 min-h-screen pb-24">
      {/* Premium Header */}
      <section className="bg-white border-b border-slate-100 py-20 mb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link href="/" className="text-slate-400 hover:text-primary transition-colors font-bold flex items-center gap-2 mb-6 uppercase tracking-widest text-[10px] animate-fade-in-up">
             <HomeOutlined /> Trang chủ / Thủ tục hành chính
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-black text-slate-800 mb-6 tracking-tight animate-fade-in-up">
                <FolderOpenOutlined className="text-primary mr-3" /> 
                Thủ tục hành chính
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Hệ thống tra cứu quy trình, hồ sơ và lệ phí cho các dịch vụ công tại địa phương. Minh bạch - Nhanh chóng.
              </p>
            </div>
            <div className="w-full lg:w-96 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Input 
                  placeholder="Tìm kiếm thủ tục..." 
                  prefix={<SearchOutlined className="text-slate-300" />}
                  size="large"
                  className="rounded-2xl h-14 border-slate-200 shadow-sm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems?.map((item: any, index: number) => (
            <Card 
              key={item.id} 
              className="premium-card animate-fade-in-up group overflow-hidden"
              style={{ animationDelay: `${0.1 + (index % 6) * 0.05}s` }}
              bodyStyle={{ padding: 0 }}
              onClick={() => handleOpenDetail(item)}
            >
              <div className="p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                       <FolderOpenOutlined className="text-xl" />
                    </div>
                    <ArrowRightOutlined className="text-slate-200 group-hover:text-primary transition-colors translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-primary transition-colors tracking-tight leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed mb-8 text-sm line-clamp-3">
                    {item.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                  <div className="flex gap-6">
                    <span className="flex items-center gap-2">
                       <FieldTimeOutlined className="text-slate-300" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.processingTime || "N/A"}</span>
                    </span>
                    <span className="flex items-center gap-2">
                       <DollarOutlined className="text-slate-300" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.fee || "Miễn lệ phí"}</span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {filteredItems?.length === 0 && (
            <div className="col-span-full">
               <Card className="premium-card text-center py-20">
                  <span className="text-slate-400 font-bold">Không tìm thấy thủ tục phù hợp với từ khóa tìm kiếm.</span>
               </Card>
            </div>
          )}
        </div>
        
        <div className="text-center mt-24 animate-fade-in-up">
           <Button icon={<HomeOutlined />} href="/" size="large" className="rounded-2xl px-12 h-16 font-black border-slate-200 text-slate-800 hover:text-primary hover:border-primary">
             TRỞ VỀ TRANG CHỦ
           </Button>
        </div>
      </div>

      <ProcedureDetailModal 
        procedure={selectedProcedure} 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </main>
  );
}
