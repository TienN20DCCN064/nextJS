import Link from 'next/link';

const fetchMedia = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/media`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không lấy được media.');
  const json = await res.json();
  return json.data || json;
};

export default async function MediaPage() {
  const items = await fetchMedia();

  return (
    <main style={{ padding: 30 }}>
      <h1>Thư viện</h1>
      <ul>
        {items?.map((item: any) => (
          <li key={item._id}>
            <strong>{item.title}</strong> ({item.type})
            <div>
              {item.type === 'image' ? (
                <img src={item.url} alt={item.title} style={{ maxWidth: 400 }} />
              ) : (
                <video src={item.url} controls style={{ maxWidth: 400 }} />
              )}
            </div>
          </li>
        ))}
      </ul>
      <p><Link href="/">← Về trang chủ</Link></p>
    </main>
  );
}
