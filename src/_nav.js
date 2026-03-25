import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDescription,
  cilSpeedometer,
  cilUser,
  cilDevices,
  cilTags,
  cilMoney,
  cilPeople,
  cilGift,
  cilCommentBubble,
  cilNewspaper,
  cilImage,
  cilSettings,
  cilBook,
  cilPhone,
  cilEnvelopeClosed,
  cilCog,
  cilShareAlt,
  cilPaperPlane,
  cilChart,
  cilColorPalette,
  cilUserPlus,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  // ─────────────────────────────────────────────────────────────
  // TAB 1: TỔNG QUAN
  // ─────────────────────────────────────────────────────────────
  {
    component: CNavTitle,
    name: 'TỔNG QUAN',
  },
  {
    // Trang tổng hợp thống kê & điều hướng chính
    component: CNavItem,
    name: 'BẢNG ĐIỀU KHIỂN',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  // ─────────────────────────────────────────────────────────────
  // TAB 2: QUẢN TRỊ HỆ THỐNG
  // ─────────────────────────────────────────────────────────────
  {
    component: CNavTitle,
    name: 'QUẢN TRỊ HỆ THỐNG',
  },
  {
    // Quản lý tài khoản, nhóm, quyền hạn và lịch sử hoạt động admin
    component: CNavGroup,
    name: 'THÔNG TIN QUẢN TRỊ',
    to: '/admin',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Thông tin admin', to: '/admin/information' },
      { component: CNavItem, name: 'Quản lý nhóm admin', to: '/admin/groups' },
      { component: CNavItem, name: 'Quản lý tài khoản admin', to: '/admin/list' },
      { component: CNavItem, name: 'Thêm quyền hạn', to: '/admin/permissions-group' },
      { component: CNavItem, name: 'Lịch sử hoạt động admin', to: '/admin/log' },
    ],
  },
  {
    // Cấu hình hệ thống, quản lý & backup dữ liệu
    component: CNavGroup,
    name: 'THÔNG TIN HỆ THỐNG',
    to: '/system',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Cấu hình hệ thống', to: '/system-config' },
      { component: CNavItem, name: 'Quản lý dữ liệu', to: '/system-data' },
      { component: CNavItem, name: 'Backup dữ liệu', to: '/system-backup' },
    ],
  },
  {
    // Theo dõi lượt truy cập website
    component: CNavGroup,
    name: 'THỐNG KÊ TRUY CẬP',
    to: '/access-statistics',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
    items: [{ component: CNavItem, name: 'Thống kê truy cập', to: '/access-statistics' }],
  },

  // ─────────────────────────────────────────────────────────────
  // TAB 3: KINH DOANH
  // ─────────────────────────────────────────────────────────────
  {
    component: CNavTitle,
    name: 'KINH DOANH',
  },
  {
    // Quản lý toàn bộ sản phẩm, danh mục, thuộc tính, flash sale, hot deal
    component: CNavGroup,
    name: 'QUẢN LÝ SẢN PHẨM',
    to: '/product',
    icon: <CIcon icon={cilDevices} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Quản lý sản phẩm', to: '/product' },
      { component: CNavItem, name: 'Thêm mới sản phẩm', to: '/product/add' },
      { component: CNavItem, name: 'Sản phẩm không đồng bộ', to: '/product/out-of-sync' },
      { component: CNavItem, name: 'Cập nhật TSKT Excel', to: '/product/update-excel-price' },
      { component: CNavItem, name: 'Cấu hình sản phẩm', to: '/product/config' },
      { component: CNavItem, name: 'Thương hiệu sản phẩm', to: '/product/brand' },
      { component: CNavItem, name: 'Danh mục sản phẩm', to: '/product/category' },
      { component: CNavItem, name: 'Thuộc tính sản phẩm', to: '/product/properties' },
      { component: CNavItem, name: 'Trạng thái sản phẩm', to: '/product/status' },
      { component: CNavItem, name: 'Nhu cầu sản phẩm', to: '/product/demand' },
      { component: CNavItem, name: 'Sản phẩm flash sale', to: '/product/product-flash-sale' },
      { component: CNavItem, name: 'Sản phẩm hot', to: '/product/product-hot' },
      { component: CNavItem, name: 'Banner sản phẩm', to: '/product/banner' },
      { component: CNavItem, name: 'Banner sản phẩm hot deal', to: '/product/banner-hot-deal' },
    ],
  },
  {
    // Tạo và quản lý mã giảm giá
    component: CNavGroup,
    name: 'QUẢN LÝ COUPON',
    to: '/coupon',
    icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Quản lý Coupon', to: '/coupon' },
      { component: CNavItem, name: 'Thêm mới Coupon', to: '/coupon/add' },
    ],
  },
  {
    // Theo dõi đơn hàng, trạng thái, vận chuyển và thanh toán
    component: CNavGroup,
    name: 'QUẢN LÝ ĐƠN HÀNG',
    to: '/order',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Quản lý đơn hàng', to: '/order' },
      { component: CNavItem, name: 'Trạng thái đơn hàng', to: '/order/status' },
      { component: CNavItem, name: 'Phương thức vận chuyển', to: '/order/shipping-method' },
      { component: CNavItem, name: 'Phương thức thanh toán', to: '/order/payment-method' },
    ],
  },
  {
    // Quản lý tài khoản khách hàng / thành viên
    component: CNavGroup,
    name: 'QUẢN LÝ THÀNH VIÊN',
    to: '/member',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [{ component: CNavItem, name: 'Quản lý thành viên', to: '/member' }],
  },
  {
    // Quản lý quà tặng kèm theo sản phẩm
    component: CNavGroup,
    name: 'QUẢN LÝ QÙA TẶNG',
    to: '/gift',
    icon: <CIcon icon={cilGift} customClassName="nav-icon" />,
    items: [{ component: CNavItem, name: 'Quản lý quà tặng', to: '/gift' }],
  },
  {
    // Chương trình khuyến mãi và tin tức khuyến mãi
    component: CNavGroup,
    name: 'QUẢN LÝ KHUYẾN MÃI',
    to: '/promotion',
    icon: <CIcon icon={cilGift} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Quản lý khuyến mãi', to: '/promotion-detail' },
      { component: CNavItem, name: 'Quản lý tin khuyến mãi', to: '/promotion' },
      { component: CNavItem, name: 'Thêm mới tin khuyến mãi', to: '/promotion/add' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // TAB 4: QUẢN TRỊ GIA DỤNG
  // ─────────────────────────────────────────────────────────────
  {
    component: CNavTitle,
    name: 'QUẢN TRỊ GIA DỤNG',
  },
  {
    // Quảng cáo dành riêng cho danh mục gia dụng
    component: CNavGroup,
    name: 'QUẢN LÝ ADS GIA DỤNG',
    to: '/household',
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Quản lý vị trí', to: '/household/category' },
      { component: CNavItem, name: 'Quản lý ads gia dụng', to: '/household' },
      { component: CNavItem, name: 'Thêm mới ads gia dụng', to: '/household/add' },
    ],
  },

  {
    // Footer dành riêng cho danh mục gia dụng
    component: CNavGroup,
    name: 'FOOTER GIA DỤNG',
    to: '/household/footer',
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
    items: [{ component: CNavItem, name: 'Quản lý footer gia dụng', to: '/household/footer' }],
  },

  {
    // Bình luận & đánh giá sản phẩm gia dụng
    component: CNavGroup,
    name: 'COMMENT GIA DỤNG',
    to: '/household/comment',
    icon: <CIcon icon={cilCommentBubble} customClassName="nav-icon" />,
    items: [{ component: CNavItem, name: 'Quản lý bình luận gia dụng', to: '/household/comment' }],
  },

  // ─────────────────────────────────────────────────────────────
  // TAB 5: NỘI DUNG & TRUYỀN THÔNG
  // ─────────────────────────────────────────────────────────────
  {
    component: CNavTitle,
    name: 'NỘI DUNG & TRUYỀN THÔNG',
  },
  {
    // Nhóm và nhân viên hỗ trợ khách hàng
    component: CNavGroup,
    name: 'QUẢN LÝ SUPPORT',
    to: '/support',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Quản lý nhóm', to: '/group-support' },
      { component: CNavItem, name: 'Quản lý support', to: '/support' },
    ],
  },
  {
    // Kiểm duyệt bình luận của người dùng
    component: CNavGroup,
    name: 'QUẢN LÝ COMMENT',
    to: '/comment',
    icon: <CIcon icon={cilCommentBubble} customClassName="nav-icon" />,
    items: [{ component: CNavItem, name: 'Quản lý bình luận', to: '/comment' }],
  },
  {
    // Bài viết tin tức theo danh mục
    component: CNavGroup,
    name: 'QUẢN LÝ TIN TỨC',
    to: '/news',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Quản lý danh mục', to: '/news/category' },
      { component: CNavItem, name: 'Quản lý tin tức', to: '/news' },
      { component: CNavItem, name: 'Thêm tin tức mới', to: '/news/add' },
    ],
  },
  {
    // Banner quảng cáo theo vị trí hiển thị
    component: CNavGroup,
    name: 'QUẢN LÝ ADVERTISE',
    to: '/advertise',
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Quản lý vị trí', to: '/advertise/category' },
      { component: CNavItem, name: 'Quản lý advertise', to: '/advertise' },
      { component: CNavItem, name: 'Thêm mới advertise', to: '/advertise/add' },
    ],
  },

  {
    // Nội dung trang giới thiệu công ty
    component: CNavGroup,
    name: 'QUẢN LÝ GIỚI THIỆU',
    to: '/about',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Quản lý giới thiệu', to: '/about' },
      { component: CNavItem, name: 'Thêm mới giới thiệu', to: '/about/add' },
    ],
  },
  {
    // Các dịch vụ cung cấp tới khách hàng
    component: CNavGroup,
    name: 'QUẢN LÝ DỊCH VỤ',
    to: '/service',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Quản lý dịch vụ', to: '/service' },
      { component: CNavItem, name: 'Thêm mới dịch vụ', to: '/service/add' },
    ],
  },
  {
    // Bài viết hướng dẫn sử dụng sản phẩm
    component: CNavGroup,
    name: 'QUẢN LÝ HƯỚNG DẪN',
    to: '/guide',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Quản lý hướng dẫn', to: '/guide' },
      { component: CNavItem, name: 'Thêm mới hướng dẫn', to: '/guide/add' },
    ],
  },
  {
    // Yêu cầu tư vấn từ khách hàng theo danh mục
    component: CNavGroup,
    name: 'QUẢN LÝ TƯ VẤN',
    to: '/consultant',
    icon: <CIcon icon={cilPhone} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Quản lý danh mục', to: '/consultant/category' },
      { component: CNavItem, name: 'Quản lý tư vấn', to: '/consultant' },
      { component: CNavItem, name: 'Thêm tư vấn mới', to: '/consultant/add' },
    ],
  },
  {
    // Danh sách email đăng ký nhận bản tin
    component: CNavGroup,
    name: 'QUẢN LÝ NEWSLETTER',
    to: '/newsletter',
    icon: <CIcon icon={cilPaperPlane} customClassName="nav-icon" />,
    items: [{ component: CNavItem, name: 'Quản lý newsletter', to: '/newsletter' }],
  },

  // ─────────────────────────────────────────────────────────────
  // TAB 5: CÀI ĐẶT & LIÊN KẾT
  // ─────────────────────────────────────────────────────────────
  {
    component: CNavTitle,
    name: 'CÀI ĐẶT & LIÊN KẾT',
  },
  {
    // Liên hệ, địa chỉ, phòng ban và báo giá
    component: CNavGroup,
    name: 'QUẢN LÝ LIÊN HỆ',
    to: '/contact',
    icon: <CIcon icon={cilEnvelopeClosed} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Quản lý phòng ban', to: '/department' },
      { component: CNavItem, name: 'Quản lý sổ địa chỉ', to: '/address' },
      { component: CNavItem, name: 'Quản lý báo giá', to: '/price-management' },
      { component: CNavItem, name: 'Quản lý liên hệ', to: '/contact' },
    ],
  },
  {
    // Danh mục, bài đăng tuyển dụng và hồ sơ ứng viên
    component: CNavGroup,
    name: 'QUẢN LÝ TUYỂN DỤNG',
    to: '/hire',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Quản lý danh mục tuyển dụng', to: '/hire/category' },
      { component: CNavItem, name: 'Quản lý bài đăng tuyển dụng', to: '/hire/post' },
      { component: CNavItem, name: 'Quản lý hồ sơ ứng tuyển', to: '/hire/candidate-CV' },
    ],
  },
  {
    // Cấu hình menu hiển thị và mẫu email hệ thống
    component: CNavGroup,
    name: 'HÌNH THỨC, NỘI DUNG',
    to: '/content',
    icon: <CIcon icon={cilColorPalette} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Quản lý Menu', to: '/content/menu' },
      { component: CNavItem, name: 'Quản lý mail template', to: '/content/mail-temp' },
    ],
  },
  {
    // SEO, mạng xã hội, sitemap và redirect link
    component: CNavGroup,
    name: 'SEO-MẠNG XÃ HỘI',
    to: '/seo',
    icon: <CIcon icon={cilShareAlt} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Quản lý Icon MXH', to: '/seo/social-icons' },
      { component: CNavItem, name: 'Quản lý link website', to: '/seo/links' },
      { component: CNavItem, name: 'Quản lý link redirect', to: '/seo/links-redirect' },
      { component: CNavItem, name: 'Sitemap XML website', to: '/seo/sitemap' },
    ],
  },
]

export default _nav
