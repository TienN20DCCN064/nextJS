"use client";

import { Card, Typography } from "antd";
import { useEffect, useState } from "react";

const { Title } = Typography;

export default function AboutPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/pages/slug/about`
      );

      if (!res.ok) return;

      const json = await res.json();
      setData(json);
    };

    fetchAbout();
  }, []);

  if (!data) return <div>Loading...</div>;

  const { title, content, updatedAt } = data.data;

  return (
    <main className="flex justify-center bg-gray-50 min-h-screen py-10 px-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-xl rounded-2xl">
          {/* Title */}
          <div className="text-center mb-6">
            <Title level={2}>{title}</Title>
            <p className="text-gray-500 text-sm">
              Cập nhật: {new Date(updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="border-t mb-6" />

          {/* Content đẹp */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Card>
      </div>
    </main>
  );
}