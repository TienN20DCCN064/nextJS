"use client";

import { Spin } from 'antd';

export default function Loading() {
  return (
    <div className="loading-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.45)', // Màn che bóng mờ
      backdropFilter: 'blur(5px)', // Hiệu ứng mờ nền
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999, // Đảm bảo luôn nằm trên cùng
    }}>
      <div style={{
        padding: '30px 50px',
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <Spin size="large" tip="Đang tải trang..." />
        <span style={{ 
          color: '#1677ff', 
          fontSize: '16px', 
          fontWeight: 600,
          fontFamily: 'inherit'
        }}>
          Vui lòng đợi trong giây lát
        </span>
      </div>
    </div>
  );
}
