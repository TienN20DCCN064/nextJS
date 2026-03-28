import Link from 'next/link';
import './Navbar.css';

export default function Navbar({ fixedTop }: { fixedTop?: boolean }) {
  return (
    <nav className={fixedTop ? "navbar navbar-offset" : "navbar"}>
      <div className="navbar-container">
        <Link href="/">
          <span className="navbar-logo">
            <img src="/logo.png" alt="Logo" height={40} />
            <span className="navbar-title">CỔNG THÔNG TIN ĐIỆN TỬ CHUYỂN ĐỔI SỐ QUỐC GIA</span>
          </span>
        </Link>
        <ul className="navbar-menu">
          <li><Link href="/">Trang chủ</Link></li>
          <li><Link href="/about">Hoạt động</Link></li>
          <li><Link href="/documents">Văn bản</Link></li>
          <li><Link href="/news">Tri thức</Link></li>
          <li><Link href="/faq">Hỏi đáp</Link></li>
          <li><Link href="/contact">Liên hệ</Link></li>
        </ul>
      </div>
    </nav>
  );
}
