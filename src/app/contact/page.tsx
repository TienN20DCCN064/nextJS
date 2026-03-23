"use client";

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Đang gửi...');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) setStatus('Gửi thành công!');
    else setStatus('Lỗi khi gửi thông tin');
  };

  return (
    <main style={{ padding: 30 }}>
      <h1>Liên hệ</h1>
      <p>Địa chỉ: Xã ABC. Hotline: 0123456789. Email: abc@gmail.com.</p>
      <p>Bản đồ:</p>
      <div style={{ width: '100%', height: 300, background: '#eee', marginBottom: 16 }}>Embed map ở đây</div>

      <form onSubmit={submit} style={{ maxWidth: 500, display: 'grid', gap: 8 }}>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Họ tên" required />
        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" required />
        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Số điện thoại" />
        <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Nội dung" required />
        <button type="submit">Gửi</button>
      </form>
      <p>{status}</p>
      <a href="/">← Về trang chủ</a>
    </main>
  );
}
