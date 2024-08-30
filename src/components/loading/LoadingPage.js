import React from 'react'
import '../css/loadingPage.css'

function LoadingPage() {
  const username = localStorage.getItem('username')

  return (
    <div className="loading-container">
      <div className="title">ĐĂNG NHẬP THÀNH CÔNG</div>
      <div className="subtitle">VỚI TÀI KHOẢN {username}</div>
      <div className="logo"></div>
      <div className="processing">(Đang xử lý. Xin vui lòng đợi hoặc click vào đây.)</div>
      <div className="footer">.:| Thiết kế web nguyenkim-it-group |:.</div>
    </div>
  )
}

export default LoadingPage
