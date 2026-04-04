"use client";

import { useEffect, useState } from 'react';
import { 
  Skeleton, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Avatar, 
  List, 
  Divider, 
  Space, 
  Tag, 
  Button,
  Empty,
  Modal,
  Descriptions
} from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined, 
  TeamOutlined, 
  HomeOutlined,
  GlobalOutlined,
  LinkedinOutlined,
  FacebookOutlined,
  UserOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

type PageData = {
  title?: string;
  content?: string;
  location?: string;
  phone?: string;
  email?: string;
  address?: string;
};

type Department = {
  id: number;
  name: string;
};

type StaffData = {
  id: number;
  name: string;
  position?: string;
  phone?: string;
  email?: string;
  departmentId?: number;
  image?: string;
  bio?: string;
};

function ContactSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <Skeleton active title={{ width: 400 }} paragraph={{ rows: 2 }} className="mb-12" />
      <Row gutter={[40, 48]}>
        <Col xs={24} lg={16}>
          <Card className="premium-card">
            <Skeleton active paragraph={{ rows: 12 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="premium-card">
            <Skeleton active avatar paragraph={{ rows: 6 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default function ContactPage() {
  const [page, setPage] = useState<PageData | null>(null);
  const [staffs, setStaffs] = useState<StaffData[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffData | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
        const [pagesRes, staffRes, deptRes] = await Promise.all([
          fetch(`${baseUrl}/api/v1/pages?published=true`, { cache: 'no-store' }),
          fetch(`${baseUrl}/api/v1/staffs`, { cache: 'no-store' }),
          fetch(`${baseUrl}/api/v1/departments`, { cache: 'no-store' })
        ]);

        if (pagesRes.ok) {
          const json = await pagesRes.json();
          const allPages = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
          
          if (allPages.length > 0) {
            const findRecord = (type: string) => allPages.find((p: any) => p.type?.toLowerCase() === type.toLowerCase());
            const locationHtml = findRecord('location')?.content || "";

            const contactContent = allPages.find((p: any) => p.slug === 'contact');

            setPage({
              title: contactContent?.title || 'Liên hệ',
              content: contactContent?.content || 'Đang cập nhật...',
              phone: findRecord('phone')?.content,
              email: findRecord('email')?.content,
              address: findRecord('address')?.content,
              location: locationHtml
            });
          }
        }

        if (staffRes.ok) {
          const staffJson = await staffRes.json();
          const results = staffJson.data || staffJson;
          setStaffs(Array.isArray(results) ? results : []);
        }

        if (deptRes.ok) {
           const deptJson = await deptRes.json();
           const depts = deptJson.data || deptJson;
           setDepartments(Array.isArray(depts) ? depts : []);
        }
      } catch (err: any) {
        setError('Lỗi tải dữ liệu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <ContactSkeleton />;

  if (error && !page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Empty 
          description={<span className="text-slate-400 font-bold">{error || 'Không thể tải dữ liệu liên hệ.'}</span>} 
        >
          <Button type="primary" onClick={() => window.location.reload()}>Tải lại trang</Button>
        </Empty>
      </div>
    );
  }

  const isEmbedCode = page?.location?.includes('<iframe');
  const isUrl = page?.location?.startsWith('http');
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  // Function to get the query for the embed API
  const getEmbedSource = () => {
    if (isEmbedCode) return null; // Handled by dangerouslySetInnerHTML
    
    // We prioritize the 'address' field for the visual map as it's more likely to resolve
    // than a short URL in an iframe.
    const query = page?.address || page?.location;
    if (!query) return null;

    // Use the official Embed API if key is present, else use the universal embed
    if (mapsApiKey) {
      return `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${encodeURIComponent(query)}`;
    }
    
    // Universal embed (no key required for simple search)
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  };

  return (
    <main className="bg-slate-50 min-h-screen pb-24">
      {/* Premium Header */}
      <section className="bg-white border-b border-slate-100 py-20 mb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
          <Link href="/" className="text-slate-400 no-underline hover:text-primary transition-colors font-bold flex items-center gap-2 mb-6 uppercase tracking-widest text-[11px] animate-fade-in-up">
             <HomeOutlined /> Trang chủ / Liên hệ
          </Link>
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight animate-fade-in-up">
            <PhoneOutlined className="text-primary mr-3" />
            Liên hệ công tác
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto md:mx-0 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
             Kênh kết nối chính thức. Chúng tôi luôn sẵn sàng hỗ trợ giải đáp mọi thắc mắc của người dân và tổ chức.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <Row gutter={[24, 24]}>
          {/* Map Section */}
          <Col xs={24} lg={16}>
            <Card className="premium-card shadow-sm animate-fade-in-up border-none" bodyStyle={{ padding: 0 }}>
              <div className="p-8 md:p-10">
                 <div className="flex items-center gap-2 mb-6">
                    <EnvironmentOutlined className="text-sm text-primary" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Vị trí thực tế</span>
                 </div>

                 <div className="aspect-[21/9] bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-100 group shadow-sm">
                    {isEmbedCode ? (
                       <div 
                          className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
                          dangerouslySetInnerHTML={{ __html: page?.location || "" }}
                       />
                    ) : (
                       <div className="w-full h-full relative">
                          {(page?.location || page?.address) ? (
                             <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                src={getEmbedSource() || ""}
                             ></iframe>
                          ) : (
                             <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-50">
                                <EnvironmentOutlined className="text-3xl text-slate-200 mb-4" />
                                <h3 className="text-lg font-black text-slate-800 mb-2">Bản đồ đang cập nhật</h3>
                                <p className="text-slate-400 max-w-xs font-medium text-sm leading-relaxed">
                                   Thông tin vị trí chưa được thiết lập. 
                                </p>
                             </div>
                          )}
                          
                          {(page?.location || page?.address) && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
                                <Button 
                                  type="primary" 
                                  size="large"
                                  className="rounded-xl h-12 px-8 font-black shadow-lg bg-slate-900 border-none uppercase tracking-widest text-[10px] hover:scale-105 transition-all"
                                  href={isUrl ? page?.location : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(page?.location || page?.address || '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                   Mở Google Maps
                                </Button>
                            </div>
                          )}
                       </div>
                    )}
                 </div>

                 <Divider className="my-10 opacity-20" />
                 
                 <div className="flex items-center gap-2 mb-6">
                    <GlobalOutlined className="text-[12px] text-emerald-600" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Cơ quan chủ quản</span>
                 </div>
                 <div className="text-slate-600 text-sm leading-relaxed italic font-medium">
                    {page?.content}
                 </div>
              </div>
            </Card>
          </Col>

          {/* Quick Contact & Info (Micro) */}
          <Col xs={24} lg={8}>
            <div className="sticky top-28 space-y-6 animate-fade-in-up">
              <Card 
                title={<span className="font-black text-[11px] uppercase tracking-widest text-slate-400">Thông tin nhanh</span>} 
                className="premium-card border-none"
                bodyStyle={{ padding: '0 24px 24px 24px' }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    { icon: <PhoneOutlined className="text-primary"/>, label: 'Đường dây nóng', value: page?.phone },
                    { icon: <MailOutlined className="text-primary"/>, label: 'Thư điện tử', value: page?.email },
                    { icon: <EnvironmentOutlined className="text-primary"/>, label: 'Địa chỉ trụ sở', value: page?.address },
                  ]}
                  renderItem={(item) => (
                    <List.Item className="border-none py-5 first:pt-2">
                      <List.Item.Meta
                        avatar={<div className="w-10 h-10 bg-slate-50 text-primary rounded-xl flex items-center justify-center">{item.icon}</div>}
                        title={<span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1 block">{item.label}</span>}
                        description={<span className="text-[15px] font-bold text-slate-800 tracking-tight leading-tight block">{item.value || 'Đang cập nhật...'}</span>}
                      />
                    </List.Item>
                  )}
                />
              </Card>

              <Card className="premium-card border-none" bodyStyle={{ padding: 24 }}>
                <div className="flex flex-col gap-4">
                   <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Dịch vụ trực tuyến</span>
                   <Button type="primary" block className="h-14 rounded-xl font-black bg-slate-900 border-none uppercase tracking-widest text-[11px] shadow-sm hover:translate-y-[-2px] transition-all">
                      Gửi yêu cầu hỗ trợ
                   </Button>
                </div>
              </Card>
            </div>
          </Col>

          {/* Staff Directory (Micro) */}
          <Col span={24}>
            <div className="mt-12 animate-fade-in-up">
              <div className="flex items-center justify-between mb-10 border-l-[6px] border-primary pl-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 m-0 tracking-tight">Đội ngũ cán bộ địa phương</h2>
                  <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-[10px]">Tiếp dân & Giải quyết thủ tục</p>
                </div>
                <Tag className="px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border-none bg-primary/10 text-primary shadow-sm flex items-center">
                  NHIỆM KỲ 2021 - 2026
                </Tag>
              </div>

              {staffs.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {staffs.map((staff) => (
                    <Col key={staff.id} xs={24} sm={12} md={8} xl={6}>
                      <Card 
                        hoverable 
                        className="premium-card group border-none" 
                        bodyStyle={{ padding: 28 }}
                        onClick={() => {
                           setSelectedStaff(staff);
                           setDetailOpen(true);
                        }}
                      >
                         <div className="flex flex-col items-center text-center">
                            <Avatar 
                              size={80} 
                              src={staff.image || undefined} 
                              icon={!staff.image && <UserOutlined />}
                              className="shadow-md border-4 border-white mb-6 group-hover:scale-105 transition-transform duration-500"
                            />
                            <h3 className="text-lg font-black text-slate-900 mb-1 tracking-tight">{staff.name}</h3>
                            <span className="text-[11px] font-black uppercase tracking-widest text-primary mb-6">{staff.position || 'Cán bộ địa phương'}</span>
                            
                            <div className="w-full space-y-3 pt-6 border-t border-slate-50">
                               <div className="flex items-center justify-center gap-3">
                                  <PhoneOutlined className="text-slate-300" />
                                  <span className="text-[13px] font-bold text-slate-600">{staff.phone || 'Đang cập nhật'}</span>
                               </div>
                               <div className="flex items-center justify-center gap-3">
                                  <MailOutlined className="text-slate-300" />
                                  <span className="text-[13px] font-medium text-slate-500 truncate max-w-full italic">{staff.email || 'N/A'}</span>
                               </div>
                            </div>
                         </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty description={<span className="text-[8px] font-black uppercase text-slate-400">Đang cập nhật...</span>} />
              )}

              {/* Detail Modal */}
              <Modal
                title={<span className="font-black text-slate-800 uppercase tracking-widest">Thông tin chi tiết</span>}
                open={detailOpen}
                onCancel={() => setDetailOpen(false)}
                footer={null}
                width={600}
                centered
                className="premium-modal"
                styles={{ body: { padding: 0 } }}
              >
                {selectedStaff && (
                  <div className="overflow-hidden rounded-lg">
                    {/* Header Section with Background */}
                    <div className="bg-slate-50 px-8 py-10 border-b border-slate-100 flex flex-col gap-6 items-center text-center">
                       <div className="w-36 h-36 flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-premium border-2 border-white relative group">
                          {selectedStaff.image ? (
                             <img 
                                src={selectedStaff.image} 
                                alt={selectedStaff.name} 
                                className="w-full h-full object-cover object-center" 
                             />
                          ) : (
                             <div className="w-full h-full flex flex-col items-center justify-center text-slate-100 bg-white">
                                <UserOutlined style={{ fontSize: 32 }} />
                                <span className="text-[8px] font-black uppercase tracking-widest mt-2">No Image</span>
                             </div>
                          )}
                          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl pointer-events-none"></div>
                       </div>
                       
                       <div className="flex-1">
                          <div className="mb-4">
                             <div className="inline-block px-3 py-1 bg-blue-600 text-white rounded-md text-[9px] font-black uppercase tracking-widest mb-4 shadow-sm">
                                {selectedStaff.position || "Cán bộ xã"}
                             </div>
                             <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{selectedStaff.name}</h2>
                          </div>
                          <div className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-blue-500/30 pl-4 py-1">
                             {selectedStaff.bio || "Thành viên tích cực trong bộ máy chính quyền địa phương, luôn tận tâm phục vụ nhân dân."}
                          </div>
                       </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                       <Descriptions bordered column={1} className="premium-descriptions rounded-xl overflow-hidden border-slate-100">
                          <Descriptions.Item label={<span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Đơn vị</span>}>
                             <span className="font-bold text-slate-700">{selectedStaff.departmentId 
                                    ? departments.find(d => d.id === selectedStaff.departmentId)?.name || `Phòng ban ID: ${selectedStaff.departmentId}`
                                    : "Cổng thông tin địa phương"
                                 }</span>
                          </Descriptions.Item>
                          <Descriptions.Item label={<span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Email công vụ</span>}>
                             <span className="font-bold text-slate-600 italic underline decoration-blue-200 decoration-2 underline-offset-4">{selectedStaff.email || "Đang cập nhật..."}</span>
                          </Descriptions.Item>
                          <Descriptions.Item label={<span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Số điện thoại</span>}>
                             <span className="font-black text-slate-800 font-serif tracking-tight text-lg">{selectedStaff.phone || "N/A"}</span>
                          </Descriptions.Item>
                       </Descriptions>
                    </div>
                  </div>
                )}
              </Modal>
            </div>
          </Col>
        </Row>
      </div>
    </main>
  );
}
