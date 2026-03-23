import Link from 'next/link';

const fetchFaqs = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/faqs`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không lấy được FAQ');
  const json = await res.json();
  return json.data || json;
};

export default async function FAQPage() {
  const items = await fetchFaqs();

  return (
    <main style={{ padding: 30 }}>
      <h1>Hỏi đáp / Phản ánh</h1>
      <ul>
        {items?.map((item: any) => (
          <li key={item._id}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </li>
        ))}
      </ul>
      <p><Link href="/">← Về trang chủ</Link></p>
    </main>
  );
}
