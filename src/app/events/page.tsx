import Link from 'next/link';

const fetchEvents = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không lấy được sự kiện.');
  const json = await res.json();
  return json.data || json;
};

export default async function EventsPage() {
  const items = await fetchEvents();

  return (
    <main style={{ padding: 30 }}>
      <h1>Lịch công tác</h1>
      <ul>
        {items?.map((item: any) => (
          <li key={item._id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>{item.location}</p>
            <p>{new Date(item.startTime).toLocaleString()} - {item.endTime ? new Date(item.endTime).toLocaleString() : '...'} </p>
          </li>
        ))}
      </ul>
      <p><Link href="/">← Về trang chủ</Link></p>
    </main>
  );
}
