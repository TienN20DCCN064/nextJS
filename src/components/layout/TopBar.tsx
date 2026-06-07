"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchTopBarInfo, getDefaultTopBarInfo, getTopBarInfoFromStore, TopBarInfo } from '@/store/topBarStore';
import { useSession, signOut } from 'next-auth/react';


export default function TopBar() {
  const { data: session, status } = useSession();
  const [info, setInfo] = useState<TopBarInfo>(getDefaultTopBarInfo());

  useEffect(() => {
    const localInfo = getTopBarInfoFromStore();
    if (localInfo) {
      setInfo(localInfo);
    }
    fetchTopBarInfo()
      .then(setInfo)
      .catch(() => {
        setInfo(getDefaultTopBarInfo());
      });
  }, []);
  console.log("TopBar info:", info);

  return (
    <div className="topbar text-white border-none" style={{ background: '#004080', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div className="topbar-content max-w-[1440px] mx-auto flex items-center justify-between py-1 px-10 lg:px-20">
        <div className="flex items-center gap-4">
          <span className="topbar-item flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white hover:text-blue-200 transition-colors cursor-default">
            <span className="w-4 h-4 rounded-md bg-white/10 flex items-center justify-center text-[10px]">🔖</span>
            {info.title}
          </span>
          <span className="topbar-item flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white hover:text-blue-200 transition-colors cursor-pointer">
            <span className="w-4 h-4 rounded-md bg-white/10 flex items-center justify-center text-[10px]">📞</span>
            {info.phone}
          </span>
          <span className="topbar-item flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white hover:text-blue-200 transition-colors cursor-pointer">
            <span className="w-4 h-4 rounded-md bg-white/10 flex items-center justify-center text-[10px]">✉️</span>
            {info.email}
          </span>
        </div>
        <div className="topbar-actions flex items-center gap-3">
          {status === 'authenticated' ? (
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-300 hover:text-white transition-all hover:scale-105">QUẢN LÝ</Link>
              <button onClick={() => signOut()} className="text-[10px] font-bold uppercase tracking-[0.1em] text-rose-300 hover:text-white transition-all hover:scale-105">ĐĂNG XUẤT</button>
            </div>
          ) : (
            <Link href="/login" className="text-[10px] font-bold uppercase tracking-[0.1em] text-white hover:text-blue-200 transition-all hover:scale-105">ĐĂNG NHẬP</Link>
          )}
          <div className="flex items-center gap-2 pl-4 border-l border-white/10">
              <span className="cursor-pointer grayscale hover:grayscale-0 transition-all hover:scale-110 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1280px-Flag_of_Vietnam.svg.png" alt="VN" style={{ width: '20px', height: '14px', objectFit: 'cover', borderRadius: '2px' }} />
              </span>
              
              <span className="cursor-pointer grayscale hover:grayscale-0 transition-all hover:scale-110 opacity-50 flex items-center justify-center">
                <img src="https://xdcs.cdnchinhphu.vn/446259493575335936/2023/3/10/dangky-1678414634214362948075.jpg" alt="VN" style={{ width: '20px', height: '14px', objectFit: 'cover', borderRadius: '2px' }} />
              </span>
          </div>
        </div>
      </div>
    </div>
  );
}
