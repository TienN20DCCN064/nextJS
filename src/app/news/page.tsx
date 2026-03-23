import Link from 'next/link';

const fetchPosts = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/posts`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`API trả về lỗi ${res.status}: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || json;
  } catch (error) {
    console.error('[NewsPage] fetchPosts failed', error);
    throw new Error('Không lấy được bài viết. Vui lòng kiểm tra kết nối đến backend.');
  }
};

export default async function NewsPage() {
  let items: any[] = [];
  let errorMessage = '';

  try {
    items = await fetchPosts();
  } catch (error: any) {
    errorMessage = error?.message || 'Lỗi không xác định khi tải dữ liệu.';
  }

  return (
    <main style={{ padding: 30 }}>
      <h1>Tin tức - Sự kiện</h1>
      {errorMessage ? (
        <div style={{ padding: 16, border: '1px solid #f00', color: '#900', marginBottom: 20 }}>
          <strong>Lỗi:</strong> {errorMessage}
          <p>Kiểm tra `.env`:
            <br />NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
            <br />hoặc URL backend hợp lệ.
          </p>
        </div>
      ) : (
        <ul>
          {items?.map((item: any) => (
            <li key={item._id}>
              <strong>{item.title}</strong> - {item.summary}
              <p>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}</p>
            </li>
          ))}
        </ul>
      )}
      <p><Link href="/">← Về trang chủ</Link></p>
    </main>
  );
}