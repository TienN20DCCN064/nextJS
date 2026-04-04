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
} from "antd";
import {
  CalendarOutlined,
  HomeOutlined,
  ArrowRightOutlined,
  BookOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import PostDetailModal from "@/components/common/PostDetailModal";
import dayjs from "dayjs";

const { Title } = Typography;

const fetchNews = async () => {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
    }/api/v1/posts?type=news&limit=1000`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Không lấy được tin tức.");
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
            <Card>
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

export default function NewsPage() {
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
    fetchNews()
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
    <main className="bg-slate-50 min-h-screen pb-24">
      {/* HEADER */}
      <section className="bg-white border-b py-16 mb-10">
        <div className="max-w-7xl mx-auto px-6">
          <Link
            href="/"
            className="text-slate-400 hover:text-primary flex items-center gap-2 mb-4 text-xs font-bold uppercase"
          >
            <HomeOutlined /> Trang chủ / Tin tức
          </Link>

          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 mb-3">
                <BookOutlined className="mr-2 text-primary" />
                Tin tức & Sự kiện
              </h1>
              <p className="text-slate-500">
                Cập nhật thông tin mới nhất tại địa phương
              </p>
            </div>

            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              size="large"
              className="lg:w-80 rounded-xl"
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </div>
        </div>
      </section>

      {/* LIST */}
      <div className="max-w-7xl mx-auto px-6">
        {filteredItems.length > 0 ? (
          <Row gutter={[24, 24]}>
            {filteredItems.map((item, index) => (
              <Col xs={24} sm={12} lg={8} key={item.id || item._id}>
                <Card
                  hoverable
                  onClick={() => handleOpenDetail(item)}
                  bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
                  className="overflow-hidden group h-full flex flex-col rounded-2xl"
                >
                  {/* IMAGE */}
                  <div className="w-full h-[200px] flex-shrink-0 overflow-hidden bg-slate-100">
                    {/* <img
                      src={item.thumbnail || defaultImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    /> */}
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                        <CalendarOutlined />
                        {item.publishedAt
                          ? dayjs(item.publishedAt).format("DD/MM/YYYY")
                          : "Mới đây"}
                      </div>

                      <h3 className="font-bold text-lg text-slate-800 line-clamp-2 md:line-clamp-3 mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-sm text-slate-500 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>

                    <div className="text-primary text-xs font-bold flex items-center justify-end gap-1 mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      XEM CHI TIẾT <ArrowRightOutlined />
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-20">
            <Empty description="Không có dữ liệu" />
          </div>
        )}

        <div className="text-center mt-16">
          <Button icon={<HomeOutlined />} href="/" size="large">
            Trang chủ
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