"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { fetchTopBarInfo, getDefaultTopBarInfo, getTopBarInfoFromStore, TopBarInfo } from '@/store/topBarStore';


export default function Footer() {
  const [info, setInfo] = useState<TopBarInfo>(getDefaultTopBarInfo());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const storeInfo = getTopBarInfoFromStore();
    if (storeInfo) {
      setInfo(storeInfo);
    }
    fetchTopBarInfo()
      .then(setInfo)
      .catch(() => setInfo(getDefaultTopBarInfo()));
  }, []);

  if (!isHydrated) return null; // Or return a static placeholder that exactly matches server

  return (
    <footer className="footer bg-slate-900 pt-12 pb-6 overflow-hidden border-t border-white/5 relative -mt-20">
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
       <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' }}>
        {/* Left: Info */}
        <div style={{ flex: '1 1 280px', minWidth: 260, maxWidth: 360 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', overflow: 'hidden' }}>
                <img src={info.logo} alt="Logo" className="premium-logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 900, color: 'white', letterSpacing: '-0.025em', lineHeight: 1 }}>{info.name}</div>
              <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#94a3b8', marginTop: '4px' }}>{info.agency}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}>📍</span>
                {info.address}
             </span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}>📞</span>
                {info.phone}
             </span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}>✉️</span>
                {info.email}
             </span>
          </div>
        </div>

        {/* Center: Links */}
        <div style={{ flex: '1 1 320px', display: 'flex', gap: '20px', minWidth: 260 }}>
          <div style={{ minWidth: 120 }}>
             <h4 style={{ color: 'white', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '10px', marginBottom: '12px', paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'inline-block' }}>Khám phá</h4>
             <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
               {[
                  { href: "/", label: "Trang chủ" },
                  { href: "/about", label: "Giới thiệu" },
                  { href: "/news", label: "Tin tức - Sự kiện" },
                  { href: "/announcements", label: "Thông báo" },
               ].map(link => (
                  <li key={link.href}>
                     <a href={link.href} style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#1e293b' }}></span>
                        {link.label}
                     </a>
                  </li>
               ))}
             </ul>
          </div>
          <div style={{ minWidth: 120 }}>
             <h4 style={{ color: 'white', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '10px', marginBottom: '12px', paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'inline-block' }}>Dịch vụ số</h4>
             <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
               {[
                  { href: "/procedures", label: "Thủ tục hành chính" },
                  { href: "/contact", label: "Liên hệ công tác" },
                  { href: "/login", label: "Quản trị hệ thống" },
               ].map(link => (
                  <li key={link.href}>
                     <a href={link.href} style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#1e293b' }}></span>
                        {link.label}
                     </a>
                  </li>
               ))}
             </ul>
          </div>
        </div>

        {/* Right: Map */}
        <div style={{ flex: '1 1 280px', minWidth: 260, maxWidth: 360 }}>
          <h4 style={{ color: 'white', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '10px', marginBottom: '12px', paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'inline-block' }}>Bản đồ số</h4>
          <div style={{ width: '100%', height: '112px', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', position: 'relative', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }} onClick={() => window.location.href='/contact'}>
             <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} alt="Map Demo" />
          </div>
          <div style={{ marginTop: '8px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '8px', fontWeight: 900 }}>Map Demo</div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: 9, textAlign: 'center', flex: '1 1 320px' }}>
          © {new Date().getFullYear()} {info.name}. Toàn bộ bản quyền được bảo lưu.
        </div>
        <div className="flex items-center gap-6 text-[8px] font-black uppercase tracking-[0.18em] text-slate-600 italic">
           <span>Xây dựng & Phát triển bởi Antigravity Team</span>
        </div>
      </div>
    </footer>
  );
}
