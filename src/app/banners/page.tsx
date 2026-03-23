import Link from 'next/link';

const fetchBanners = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/banners`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không lấy được banner');
  const json = await res.json();
  return json.data || json;
};

export default async function BannersPage() {
  const items = await fetchBanners();

  return (
    <main style={{ padding: 30 }}>
      <h1>Slider / Thông tin nổi bật</h1>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
        {items?.map((item: any) => (
          <div key={item._id} style={{ minWidth: 280, border: '1px solid #ccc', padding: 10 }}>
            <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: 180, objectFit: 'cover' }}/>
            <h3>{item.title}</h3>
            <Link href={item.link || '/'}>Xem chi tiết</Link>
          </div>
        ))}
      </div>
      <p><Link href="/">← Về trang chủ</Link></p>
    </main>
  );
}
