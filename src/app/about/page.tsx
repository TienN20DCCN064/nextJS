import { notFound } from 'next/navigation';

const fetchAbout = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/pages/slug/about`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
};

export default async function AboutPage() {
  const aboutData = await fetchAbout();

  const title = aboutData?.title || 'Giới thiệu chung';
  const content = aboutData?.content || 'Nội dung giới thiệu chưa có, vui lòng admin vào /admin/pages để cập nhật.';

  return (
    <main style={{ padding: 30 }}>
      <h1>{title}</h1>
      <section>
        <div style={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
          {content}
        </div>
      </section>
    </main>
  );
}