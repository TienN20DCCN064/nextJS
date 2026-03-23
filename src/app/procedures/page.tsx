import Link from 'next/link';

const fetchProcedures = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/procedures`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không lấy được thủ tục.');
  const json = await res.json();
  return json.data || json;
};

export default async function ProceduresPage() {
  const items = await fetchProcedures();

  return (
    <main style={{ padding: 30 }}>
      <h1>Thủ tục hành chính</h1>
      <ul>
        {items?.map((item: any) => (
          <li key={item._id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>Hồ sơ: {item.requiredDocuments?.join(', ')}</p>
            <p>Tiếp nhận: {item.processingTime}, Phí: {item.fee}</p>
            {item.formUrl && (<a href={item.formUrl} target="_blank" rel="noreferrer">Tải biểu mẫu</a>)}
          </li>
        ))}
      </ul>
      <p><Link href="/">← Về trang chủ</Link></p>
    </main>
  );
}
