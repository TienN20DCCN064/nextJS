import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src="/logo.png" alt="Logo" height={40} />
          <span>CỔNG THÔNG TIN ĐIỆN TỬ CHUYỂN ĐỔI SỐ QUỐC GIA</span>
        </div>
        <div className="footer-info">
          <p>Cơ quan thường trực: Văn phòng Ủy ban Quốc gia về chuyển đổi số</p>
          <p>Địa chỉ: Tòa nhà VNTA, 68 Dương Đình Nghệ, Cầu Giấy, Hà Nội</p>
          <p>Số điện thoại: 024 3782 1766</p>
          <p>Email: ubqg.cds@mic.gov.vn</p>
        </div>
        <div className="footer-links">
          <a href="/">Ưu đãi</a> | <a href="/support">Hỗ trợ</a> | <a href="/about">Hoạt động</a> | <a href="/contact">Liên hệ</a>
        </div>
        <div className="footer-copy">© 2023 Chuyển đổi số quốc gia</div>
      </div>
    </footer>
  );
}
