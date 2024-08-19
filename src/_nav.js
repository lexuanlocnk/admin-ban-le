import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilDevices,
  cilTags,
  cilMoney,
  cilPeople,
  cilGift,
  cilCommentBubble,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Bảng điều khiển',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavTitle,
  //   name: 'Theme',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Colors',
  //   to: '/theme/colors',
  //   icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Typography',
  //   to: '/theme/typography',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },
  {
    component: CNavTitle,
    name: 'Tab Quản trị',
  },
  {
    component: CNavGroup,
    name: 'THÔNG TIN QUẢN TRỊ',
    to: '/admin',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Thông tin admin',
        to: '/admin/information',
      },
      {
        component: CNavItem,
        name: 'Quản lý nhóm admin',
        to: '/admin/groups',
      },
      {
        component: CNavItem,
        name: 'Quản lý tài khoản admin',
        to: '/admin/list',
      },
      {
        component: CNavItem,
        name: 'Thêm quyền hạn',
        to: '/admin/permissions-group',
      },
      {
        component: CNavItem,
        name: 'Lịch sử hoạt động admin',
        to: '/admin/log',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'QUẢN LÝ SẢN PHẨM',
    to: '/product',
    icon: <CIcon icon={cilDevices} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Thương hiệu sản phẩm',
        to: '/product/brand',
      },
      {
        component: CNavItem,
        name: 'Danh mục sản phẩm',
        to: '/product/category',
      },
      {
        component: CNavItem,
        name: 'Thuộc tính sản phẩm',
        to: '/product/properties',
      },
      {
        component: CNavItem,
        name: 'Trạng thái sản phẩm',
        to: '/product/status',
      },
      {
        component: CNavItem,
        name: 'Sản phẩm flash sale',
        to: '/product/product-flash-sale',
      },
      {
        component: CNavItem,
        name: 'Sản phẩm hot',
        to: '/product/product-hot',
      },
      {
        component: CNavItem,
        name: 'Banner sản phẩm',
        to: '/product/banner',
      },
      {
        component: CNavItem,
        name: 'Thêm mới sản phẩm',
        to: '/product/add',
      },
      {
        component: CNavItem,
        name: 'Quản lý sản phẩm',
        to: '/product',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'QUẢN LÝ COUPON',
    to: '/coupon',
    icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Quản lý Coupon',
        to: '/coupon',
      },
      {
        component: CNavItem,
        name: 'Thêm mới Coupon',
        to: '/coupon/add',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'QUẢN LÝ ĐƠN HÀNG',
    to: '/order',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Trạng thái đơn hàng',
        to: '/order/status',
      },
      {
        component: CNavItem,
        name: 'Phương thức vận chuyển',
        to: '/order/shipping-method',
      },
      {
        component: CNavItem,
        name: 'Phương thức thanh toán',
        to: '/order/payment-method',
      },
      {
        component: CNavItem,
        name: 'Quản lý đơn hàng',
        to: '/order',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'QUẢN LÝ THÀNH VIÊN',
    to: '/member',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Quản lý thành viên',
        to: '/member',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'QUẢN LÝ QÙA TẶNG',
    to: '/gift',
    icon: <CIcon icon={cilGift} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Quản lý quà tặng',
        to: '/gift',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'QUẢN LÝ KHUYẾN MÃI',
    to: '/promotion',
    icon: <CIcon icon={cilGift} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Quản lý khuyến mãi',
        to: '/promotion-detail',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'QUẢN LÝ SUPPORT',
    to: '/support',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Quản lý nhóm',
        to: '/group-support',
      },
      {
        component: CNavItem,
        name: 'Quản lý support',
        to: '/support',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'QUẢN LÝ COMMENT',
    to: '/comment',
    icon: <CIcon icon={cilCommentBubble} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Quản lý bình luận',
        to: '/comment',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Base',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Accordion',
        to: '/base/accordion',
      },
      {
        component: CNavItem,
        name: 'Breadcrumb',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Cards',
        to: '/base/cards',
      },
      {
        component: CNavItem,
        name: 'Carousel',
        to: '/base/carousels',
      },
      {
        component: CNavItem,
        name: 'Collapse',
        to: '/base/collapses',
      },
      {
        component: CNavItem,
        name: 'List group',
        to: '/base/list-groups',
      },
      {
        component: CNavItem,
        name: 'Navs & Tabs',
        to: '/base/navs',
      },
      {
        component: CNavItem,
        name: 'Pagination',
        to: '/base/paginations',
      },
      {
        component: CNavItem,
        name: 'Placeholders',
        to: '/base/placeholders',
      },
      {
        component: CNavItem,
        name: 'Popovers',
        to: '/base/popovers',
      },
      {
        component: CNavItem,
        name: 'Progress',
        to: '/base/progress',
      },
      {
        component: CNavItem,
        name: 'Spinners',
        to: '/base/spinners',
      },
      {
        component: CNavItem,
        name: 'Tables',
        to: '/base/tables',
      },
      {
        component: CNavItem,
        name: 'Tooltips',
        to: '/base/tooltips',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Buttons',
    to: '/buttons',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Buttons',
        to: '/buttons/buttons',
      },
      {
        component: CNavItem,
        name: 'Buttons groups',
        to: '/buttons/button-groups',
      },
      {
        component: CNavItem,
        name: 'Dropdowns',
        to: '/buttons/dropdowns',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Forms',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Form Control',
        to: '/forms/form-control',
      },
      {
        component: CNavItem,
        name: 'Select',
        to: '/forms/select',
      },
      {
        component: CNavItem,
        name: 'Checks & Radios',
        to: '/forms/checks-radios',
      },
      {
        component: CNavItem,
        name: 'Range',
        to: '/forms/range',
      },
      {
        component: CNavItem,
        name: 'Input Group',
        to: '/forms/input-group',
      },
      {
        component: CNavItem,
        name: 'Floating Labels',
        to: '/forms/floating-labels',
      },
      {
        component: CNavItem,
        name: 'Layout',
        to: '/forms/layout',
      },
      {
        component: CNavItem,
        name: 'Validation',
        to: '/forms/validation',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Charts',
    to: '/charts',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Icons',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'CoreUI Free',
        to: '/icons/coreui-icons',
        badge: {
          color: 'success',
          text: 'NEW',
        },
      },
      {
        component: CNavItem,
        name: 'CoreUI Flags',
        to: '/icons/flags',
      },
      {
        component: CNavItem,
        name: 'CoreUI Brands',
        to: '/icons/brands',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Notifications',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Alerts',
        to: '/notifications/alerts',
      },
      {
        component: CNavItem,
        name: 'Badges',
        to: '/notifications/badges',
      },
      {
        component: CNavItem,
        name: 'Modal',
        to: '/notifications/modals',
      },
      {
        component: CNavItem,
        name: 'Toasts',
        to: '/notifications/toasts',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Widgets',
    to: '/widgets',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Extras',
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Docs',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
]

export default _nav
