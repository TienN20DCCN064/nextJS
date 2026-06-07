import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchTopBarInfo, getDefaultTopBarInfo, getTopBarInfoFromStore, TopBarInfo } from '@/store/topBarStore';


export default function Navbar({ fixedTop }: { fixedTop?: boolean }) {
  const [info, setInfo] = useState<TopBarInfo>(getDefaultTopBarInfo());

  useEffect(() => {
    // Try to get from store first (client-only)
    const localInfo = getTopBarInfoFromStore();
    if (localInfo) {
      setInfo(localInfo);
    }

    fetchTopBarInfo()
      .then(setInfo)
      .catch(() => setInfo(getDefaultTopBarInfo()));
  }, []);

  return (
    <nav className={(fixedTop ? "navbar navbar-offset sticky top-0" : "navbar") + " z-50 py-2 transition-all duration-500 border-b border-primary/10 bg-white/90 backdrop-blur-md shadow-sm"}>
      <div className="navbar-container max-w-[1440px] mx-auto px-10 lg:px-20" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <Link href="/" className="group no-underline" style={{ display: 'flex', alignItems: 'center', gap: '12px', transition: 'transform 0.3s' }}>
            <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', overflow: 'hidden', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', flexShrink: 0, border: '1px solid #f8fafc' }}>
               <img src={info.logo} alt="Logo" className="premium-logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
               {info.agency && <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '2px' }}>{info.agency}</span>}
               <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em', lineHeight: 1, textTransform: 'uppercase' }}>{info.name}</span>
            </div>
        </Link>
        <ul className="navbar-menu m-0 p-0 list-none" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {[
            { href: '/', label: 'Trang chủ' },
            { href: '/about', label: 'Giới thiệu' },
            { href: '/news', label: 'Tin tức' },
            { href: '/announcements', label: 'Thông báo' },
            { href: '/procedures', label: 'Thủ tục' },
            { href: '/contact', label: 'Liên hệ' },
          ].map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className="hover:text-primary transition-all relative py-2 group/item no-underline"
                style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1e293b', paddingBottom: '4px' }}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover/item:w-full"></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
