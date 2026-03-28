import Link from 'next/link';
import './TopBar.css';

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-content">
        <span className="topbar-item">
          <span className="icon">🔖</span>
          Chương trình Chuyển đổi số quốc gia
        </span>
        <span className="topbar-item">
          <span className="icon">📞</span>
          (024) 3782 1766
        </span>
        <span className="topbar-item">
          <span className="icon">✉️</span>
          ubqg.cds@mic.gov.vn
        </span>
        <div className="topbar-actions">
          <Link href="/login" className="topbar-login">ĐĂNG NHẬP</Link>
          <span className="topbar-lang">
            <span className="flag">🇻🇳</span>
            <span className="flag">🇺🇸</span>
          </span>
        </div>
      </div>
    </div>
  );
}
