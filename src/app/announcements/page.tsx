import Link from 'next/link';

const fetchPosts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không lấy được thông báo.');
  const json = await res.json();
  return json.data || json;
};

export default async function AnnouncementsPage() {
  const items = await fetchPosts();

  return (
    <main style={{ padding: 30 }}>
      <h1>Thông báo</h1>
      <ul>
        {items?.map((item: any) => (
          <li key={item._id}>
            <strong>{item.title}</strong>
            <p>{item.summary}</p>
          </li>
        ))}
      </ul>
      <p><Link href="/">← Về trang chủ</Link></p>
    </main>
  );
}
