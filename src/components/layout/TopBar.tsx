"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchTopBarInfo, getDefaultTopBarInfo, getTopBarInfoFromStore, TopBarInfo } from '@/store/topBarStore';


export default function TopBar() {
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
    <div className="topbar bg-slate-900 text-slate-400 border-none">
      <div className="topbar-content max-w-7xl mx-auto flex items-center justify-between py-1 px-4">
        <div className="flex items-center gap-3">
          <span className="topbar-item flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.15em] hover:text-white transition-colors cursor-default">
            <span className="w-4 h-4 rounded-lg bg-white/5 flex items-center justify-center text-[8px]">🔖</span>
            {info.title}
          </span>
          <span className="topbar-item flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.15em] hover:text-white transition-colors cursor-pointer">
            <span className="w-4 h-4 rounded-lg bg-white/5 flex items-center justify-center text-[8px]">📞</span>
            {info.phone}
          </span>
          <span className="topbar-item flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.15em] hover:text-white transition-colors cursor-pointer">
            <span className="w-4 h-4 rounded-lg bg-white/5 flex items-center justify-center text-[8px]">✉️</span>
            {info.email}
          </span>
        </div>
        <div className="topbar-actions flex items-center gap-3">
          <Link href="/login" className="text-[8px] font-black uppercase tracking-[0.18em] text-blue-400 hover:text-blue-300 transition-all hover:scale-105">ĐĂNG NHẬP</Link>
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
