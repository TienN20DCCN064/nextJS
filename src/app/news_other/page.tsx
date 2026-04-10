"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Skeleton,
  Card,
  Row,
  Col,
  Typography,
  Empty,
  Button,
  Input,
  Tag,
} from "antd";
import {
  CalendarOutlined,
  HomeOutlined,
  ArrowRightOutlined,
  ReadOutlined,
  SearchOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import PostDetailModal from "@/components/common/PostDetailModal";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const fetchOtherNews = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  const res = await fetch(
    `${baseUrl}/api/v1/posts?type=other&limit=1000`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Không lấy được tin tức khác.");
  const json = await res.json();
  return json.data || json;
};

function NewsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <Skeleton active title={{ width: 300 }} paragraph={{ rows: 1 }} />
      <Row gutter={[24, 24]} className="mt-10">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Col key={i} xs={24} sm={12} lg={8}>
            <Card className="rounded-2xl">
              <div className="h-[200px] w-full bg-slate-100 mb-4 animate-pulse rounded-t-lg" />
              <div className="p-4">
                <Skeleton active title={{ width: '80%' }} paragraph={{ rows: 2 }} className="mt-2" />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default function OtherNewsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const defaultImage = "https://vnanet.vn/Data/Images/logo.png";

  const filteredItems = items.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchOtherNews()
      .then(setItems)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleOpenDetail = (post: any) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  if (isLoading) return <NewsSkeleton />;

  return (
    <main className="bg-[#f8fafc] min-h-screen pb-24">
      {/* HEADER SECTION */}
      <section className="bg-white border-b border-slate-100 pt-16 pb-12 mb-10">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 mb-6">
            <Link href="/" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
              <HomeOutlined /> Trang chủ
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-primary text-xs font-bold uppercase tracking-wider">Tin tức khác</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-xl">
                  <AppstoreOutlined />
                </div>
                <Tag color="blue" className="rounded-full px-3 font-bold uppercase text-[10px] tracking-widest border-0 bg-blue-50 text-blue-600 m-0">
                  Thông tin đa dạng
                </Tag>
              </div>
              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                Tin tức & Sự kiện khác
              </h1>
              <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
                Các thông tin, hoạt động và sự kiện đa dạng khác đang diễn ra tại địa phương chúng tôi.
              </p>
            </div>

            <div className="lg:w-96">
              <Input
                placeholder="Tìm kiếm nội dung..."
                prefix={<SearchOutlined className="text-slate-400" />}
                size="large"
                className="rounded-2xl border-slate-200 shadow-sm hover:border-primary focus:border-primary h-14"
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-6">
        {filteredItems.length > 0 ? (
          <Row gutter={[32, 40]}>
            {filteredItems.map((item) => (
              <Col xs={24} sm={12} lg={8} key={item.id || item._id}>
                <Card
                  hoverable
                  onClick={() => handleOpenDetail(item)}
                  bodyStyle={{ padding: 0 }}
                  className="overflow-hidden group h-full flex flex-col rounded-3xl border-0 shadow-sm hover:shadow-xl transition-all duration-500 bg-white"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={item.thumbnail || defaultImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 left-4">
                      <Tag className="bg-white/90 backdrop-blur-md border-0 rounded-lg font-bold text-slate-800 shadow-sm text-[10px] py-1 px-3">
                        TIN KHÁC
                      </Tag>
                    </div>
                  </div>

                  <div className="flex-1 p-8 flex flex-col">
                    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <CalendarOutlined className="text-primary" />
                        {dayjs(item.publishedAt).format("DD/MM/YYYY")}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-xl text-slate-800 line-clamp-2 md:line-clamp-3 mb-4 group-hover:text-primary transition-colors leading-tight">
                      {item.title}
                    </h3>

                    <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed mb-6">
                      {item.summary || "Nhấn để xem chi tiết bài viết này..."}
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                       <span className="text-xs font-black text-primary uppercase tracking-tighter flex items-center gap-1 group-hover:gap-2 transition-all">
                        Xem chi tiết <ArrowRightOutlined />
                       </span>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm">
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
              description={<Text className="text-slate-400 font-medium italic">Không tìm thấy tin tức nào phù hợp</Text>} 
            />
            <Button 
                onClick={() => setSearchTerm("")} 
                className="mt-6 rounded-xl h-12 px-8 font-bold"
                icon={<ReadOutlined />}
            >
                Hiển thị tất cả
            </Button>
          </div>
        )}

        <div className="text-center mt-20">
          <Button 
            icon={<HomeOutlined />} 
            href="/" 
            size="large" 
            className="rounded-2xl h-14 px-10 font-black text-slate-700 border-slate-200 hover:text-primary hover:border-primary transition-all shadow-sm"
          >
            Quay về trang chủ
          </Button>
        </div>
      </div>

      <PostDetailModal
        post={selectedPost}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <style jsx global>{`
        .ant-card-hoverable:hover {
          transform: translateY(-8px);
        }
      `}</style>
    </main>
  );
}
