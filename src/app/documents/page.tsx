import Link from 'next/link';

const placeholderImage = 'https://res.cloudinary.com/dew5knmoh/image/upload/v1774157192/main-sample.png';

const fetchDocuments = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/documents`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`API documents trả lỗi ${res.status}: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || json;
  } catch (error) {
    console.error('[DocumentsPage] fetchDocuments failed', error);
    throw new Error('Không lấy được văn bản. Vui lòng kiểm tra kết nối đến backend.');
  }
};

export default async function DocumentsPage() {
  let items: any[] = [];
  let errorMessage = '';

  try {
    items = await fetchDocuments();
  } catch (error: any) {
    errorMessage = error?.message || 'Lỗi không xác định khi tải dữ liệu.';
  }

  return (
    <main style={{ padding: 30, background: '#f7f9fc', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 16 }}>Văn bản / Tài liệu</h1>

        {errorMessage ? (
          <div style={{ padding: 16, border: '1px solid #f44336', background: '#ffeaea', color: '#a90b0b', borderRadius: 8 }}>
            <strong>Lỗi:</strong> {errorMessage}
            <p style={{ marginTop: 8 }}>
              Vui lòng kiểm tra:
              <br />- NEXT_PUBLIC_BACKEND_URL trong .env
              <br />- Backend NestJS đang chạy và trả dữ liệu /documents
              <br />- Dữ liệu schema có bản ghi (isPublished=true) trong MongoDB.
            </p>
          </div>
        ) : null}

        <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {(items?.length > 0 ? items : Array.from({ length: 4 }, (_, i) => ({ _id: `placeholder-${i}`, title: 'Tài liệu mẫu', documentNumber: 'MB-000', description: 'Mô tả tài liệu mẫu', fileUrl: '#', imageUrl: placeholderImage }))).map((doc: any) => (
            <article key={doc._id} style={{ flex: '1 1 calc(50% - 16px)', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', minWidth: 250 }}>
              <div style={{ height: 180, overflow: 'hidden' }}>
                <img
                  src={doc.imageUrl || placeholderImage}
                  alt={doc.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: 14 }}>
                <h2 style={{ fontSize: 18, marginBottom: 8 }}>{doc.title || 'Văn bản mới'}</h2>
                <p style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>Mã văn bản: {doc.documentNumber || 'Chưa có'}</p>
                <p style={{ color: '#333', minHeight: 40 }}>{doc.description || 'Chưa có mô tả.'}</p>
                <p style={{ marginTop: 12 }}>
                  <a href={doc.fileUrl || '#'} target="_blank" rel="noreferrer" style={{ color: '#1677ff' }}>
                    Tải file
                  </a>
                </p>
              </div>
            </article>
          ))}
        </div>

        <p style={{ marginTop: 30 }}>
          <Link href="/">← Về trang chủ</Link>
        </p>
      </div>
    </main>
  );
}
