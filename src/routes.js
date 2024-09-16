import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// TAB QUẢN TRỊ

const AdminInfo = React.lazy(() => import('./views/admin/AdminInfo'))
const AdminGroup = React.lazy(() => import('./views/admin/AdminGroup'))
const AdminList = React.lazy(() => import('./views/admin/AdminList'))
const AdminLog = React.lazy(() => import('./views/admin/AdminLog'))

// permission group
const PermissionGroup = React.lazy(() => import('./views/admin/PermissionGroup'))
const EditPermission = React.lazy(() => import('./views/admin/EditPermissions'))

// PRODUCT

const ProductBrand = React.lazy(() => import('./views/product/productBrand'))
const ProductCategory = React.lazy(() => import('./views/product/category/productCategory'))
const AddProductCategory = React.lazy(() => import('./views/product/category/AddProductCategory'))
const EditProductCategory = React.lazy(() => import('./views/product/category/EditProductCategory'))

const ProductProperties = React.lazy(() => import('./views/product/properties/productProperties'))
const AddProductProperties = React.lazy(
  () => import('./views/product/properties/AddProductProperties'),
)
const EditProductProperties = React.lazy(
  () => import('./views/product/properties/EditProductProperties'),
)

const ProductBanner = React.lazy(() => import('./views/product/banner/productBanner'))
const ProductStatus = React.lazy(() => import('./views/product/status/productStatus'))

// product detail
const ProductDetail = React.lazy(() => import('./views/product/detail/ProductDetail'))
const AddProductDetail = React.lazy(() => import('./views/product/detail/AddProductDetail'))
const EditProductDetail = React.lazy(() => import('./views/product/detail/EditProductDetail'))

// product hot
const ProductHot = React.lazy(() => import('./views/product/productShow/productHot'))
const ProductFlashSale = React.lazy(() => import('./views/product/productShow/productFlashSale'))

// product configuration
const ProductConfig = React.lazy(() => import('./views/product/ProductConfig'))

//  ORDER
const OrderList = React.lazy(() => import('./views/order/orderInfo/orderList'))
const EditOrder = React.lazy(() => import('./views/order/orderInfo/EditOrder'))

const OrderStatus = React.lazy(() => import('./views/order/orderStatus'))
const PaymentMethod = React.lazy(() => import('./views/order/paymentMethod'))
const ShippingMethod = React.lazy(() => import('./views/order/shippingMethod'))

// COUPON
const Coupon = React.lazy(() => import('./views/coupon/Coupon'))
const AddCoupon = React.lazy(() => import('./views/coupon/AddCoupon'))
const EditCoupon = React.lazy(() => import('./views/coupon/EditCoupon'))

// GIFT
const Gift = React.lazy(() => import('./views/gift/Gift'))
const AddGift = React.lazy(() => import('./views/gift/AddGift'))
const EditGift = React.lazy(() => import('./views/gift/EditGift'))

// MEMBER
const Member = React.lazy(() => import('./views/member/Member'))
const EditMember = React.lazy(() => import('./views/member/EditMember'))

// PROMOTION
const PromotionDetail = React.lazy(
  () => import('./views/promotion/promotionDetail/promotionDetail'),
)
const AddPromotionDetail = React.lazy(
  () => import('./views/promotion/promotionDetail/AddPromotionDetail'),
)
const EditPromotionDetail = React.lazy(
  () => import('./views/promotion/promotionDetail/EditPromotionDetail'),
)

// promotion news
const PromotionNews = React.lazy(() => import('./views/promotion/promotionNews/promotionNews'))
const AddPromotionNews = React.lazy(
  () => import('./views/promotion/promotionNews/AddPromotionNews'),
)
const EditPromotionNews = React.lazy(
  () => import('./views/promotion/promotionNews/EditPromotionNews'),
)

// SUPPORT
const Support = React.lazy(() => import('./views/support/Support'))
const GroupSupport = React.lazy(() => import('./views/support/GroupSupport'))

// COMMENT
const Comment = React.lazy(() => import('./views/comment/Comment'))
const AddComment = React.lazy(() => import('./views/comment/AddComment'))
const EditComment = React.lazy(() => import('./views/comment/EditComment'))

const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// NEWS CATEGORY
const NewsCategory = React.lazy(() => import('./views/news/category/NewsCategory'))

// NEWS DETAIL
const News = React.lazy(() => import('./views/news/detail/News'))
const AddNews = React.lazy(() => import('./views/news/detail/AddNews'))
const EditNews = React.lazy(() => import('./views/news/detail/EditNews'))

// ADVERTISE

// advertise category
const AdvertiseCategory = React.lazy(() => import('./views/advertise/category/AdvertiseCategory'))

// advertise detail
const Advertise = React.lazy(() => import('./views/advertise/detail/Advertise'))
const AddAdvertise = React.lazy(() => import('./views/advertise/detail/AddAdvertise'))
const EditAdvertise = React.lazy(() => import('./views/advertise/detail/EditAdvertise'))

// INTRODUCE
const Introduce = React.lazy(() => import('./views/introduce/Introduce'))
const AddIntroduce = React.lazy(() => import('./views/introduce/AddIntroduce'))
const EditIntroduce = React.lazy(() => import('./views/introduce/EditIntroduce'))

// SERVICE
const Service = React.lazy(() => import('./views/services/Service'))
const AddService = React.lazy(() => import('./views/services/AddService'))
const EditService = React.lazy(() => import('./views/services/EditService'))

// INSTRUCTION
const Instruction = React.lazy(() => import('./views/instruction/Instruction'))
const AddInstruction = React.lazy(() => import('./views/instruction/AddInstruction'))
const EditInstruction = React.lazy(() => import('./views/instruction/EditInstruction'))

// CONSULTANT

const ConsultantCategory = React.lazy(
  () => import('./views/consultant/category/ConsultantCategory'),
)

// consultant detail
const Consultant = React.lazy(() => import('./views/consultant/detail/Consultant'))
const AddConsultant = React.lazy(() => import('./views/consultant/detail/AddConsultant'))
const EditConsultant = React.lazy(() => import('./views/consultant/detail/EditConsultant'))

// CONTACT

// PRICE MANAGEMENT
const PriceManagement = React.lazy(() => import('./views/contact/priceManagement/priceManagement'))
const EditPriceManagement = React.lazy(
  () => import('./views/contact/priceManagement/EditPriceManagement'),
)

// ADDRESS MANAGEMENT
const AddressManagement = React.lazy(
  () => import('./views/contact/addressManagement/addressManagement'),
)
const EditAddressManagement = React.lazy(
  () => import('./views/contact/addressManagement/EditAddressManagement'),
)

// CONTACT MANAGEMENT
const ContactManagement = React.lazy(
  () => import('./views/contact/contactManagement/contactManagement'),
)
const EditContactManagement = React.lazy(
  () => import('./views/contact/contactManagement/EditContactManagement'),
)

// DEPARTMENT
const Department = React.lazy(() => import('./views/contact/department/department'))

/** ------------------------------------------------------------------------------------------------------------------ */
// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },

  { path: '/admin', name: 'Admin', element: AdminInfo, exact: true },
  { path: '/admin/information', name: 'AdminInfo', element: AdminInfo },
  { path: '/admin/groups', name: 'AdminGroup', element: AdminGroup },
  { path: '/admin/list', name: 'AdminList', element: AdminList },
  { path: '/admin/log', name: 'AdminLog', element: AdminLog },
  { path: '/admin', name: 'Admin', element: AdminInfo, exact: true },

  {
    path: '/admin/permissions-group',
    name: 'PermissionGroup',
    element: PermissionGroup,
    exact: true,
  },

  {
    path: '/admin/groups/edit',
    name: 'EditPermission',
    element: EditPermission,
    exact: true,
  },

  // product detail

  { path: '/product', name: 'ProductDetail', element: ProductDetail },

  {
    path: '/product/add',
    name: 'AddProductDetail',
    element: AddProductDetail,
    exact: true,
  },
  {
    path: '/product/edit',
    name: 'EditProductCategory',
    element: EditProductDetail,
    exact: true,
  },

  // show product
  {
    path: '/product/product-hot',
    name: 'ProductHot',
    element: ProductHot,
    exact: true,
  },

  {
    path: '/product/product-flash-sale',
    name: 'ProductFlashSale',
    element: ProductFlashSale,
    exact: true,
  },

  //product brand
  { path: '/product/brand', name: 'ProductBrand', element: ProductBrand, exact: true },

  //product categories
  { path: '/product/category', name: 'ProductCategory', element: ProductCategory, exact: true },
  {
    path: '/product/category/add',
    name: 'AddProductCategory',
    element: AddProductCategory,
    exact: true,
  },
  {
    path: '/product/category/edit',
    name: 'EditProductCategory',
    element: EditProductCategory,
    exact: true,
  },

  // product properties
  {
    path: '/product/properties',
    name: 'ProductProperties',
    element: ProductProperties,
    exact: true,
  },

  {
    path: '/product/properties/add',
    name: 'AddProductProperties',
    element: AddProductProperties,
    exact: true,
  },

  {
    path: '/product/properties/edit',
    name: 'EditProductProperties',
    element: EditProductProperties,
    exact: true,
  },

  // product banner
  {
    path: '/product/banner',
    name: 'ProductBanner',
    element: ProductBanner,
    exact: true,
  },

  // product status
  {
    path: '/product/status',
    name: 'ProductStatus',
    element: ProductStatus,
    exact: true,
  },

  {
    path: '/product/config',
    name: 'ProductConfig',
    element: ProductConfig,
    exact: true,
  },

  // coupon
  { path: '/coupon', name: 'Coupon', element: Coupon, exact: true },
  {
    path: 'coupon/add',
    name: 'AddCoupon',
    element: AddCoupon,
    exact: true,
  },
  {
    path: 'coupon/edit',
    name: 'EditCoupon',
    element: EditCoupon,
    exact: true,
  },

  // gift
  { path: '/gift', name: 'Gift', element: Gift, exact: true },
  {
    path: 'gift/add',
    name: 'AddGift',
    element: AddGift,
    exact: true,
  },
  {
    path: 'gift/edit',
    name: 'EditGift',
    element: EditGift,
    exact: true,
  },

  //order
  {
    path: '/order',
    name: 'OrderList',
    element: OrderList,
    exact: true,
  },
  {
    path: '/order/edit',
    name: 'EditOrder',
    element: EditOrder,
    exact: true,
  },

  // order status
  {
    path: '/order/status',
    name: 'OrderStatus',
    element: OrderStatus,
    exact: true,
  },

  // payment-method
  {
    path: '/order/payment-method',
    name: 'PaymentMethod',
    element: PaymentMethod,
    exact: true,
  },

  // shipping-method
  {
    path: '/order/shipping-method',
    name: 'ShippingMethod',
    element: ShippingMethod,
    exact: true,
  },

  // member
  {
    path: '/member',
    name: 'Member',
    element: Member,
    exact: true,
  },

  {
    path: '/member/edit',
    name: 'EditMember',
    element: EditMember,
    exact: true,
  },

  //promotion
  { path: '/promotion-detail', name: 'Promotion', element: PromotionDetail, exact: true },
  {
    path: 'promotion-detail/add',
    name: 'AddPromotionDetail',
    element: AddPromotionDetail,
    exact: true,
  },
  {
    path: 'promotion-detail/edit',
    name: 'EditPromotionDetail',
    element: EditPromotionDetail,
    exact: true,
  },

  { path: '/promotion-news', name: 'Promotion', element: PromotionNews, exact: true },
  {
    path: 'promotion-news/add',
    name: 'AddPromotionNews',
    element: AddPromotionNews,
    exact: true,
  },
  {
    path: 'promotion-news/edit',
    name: 'EditPromotionNews',
    element: EditPromotionNews,
    exact: true,
  },

  // support
  {
    path: '/group-support',
    name: 'GroupSupport',
    element: GroupSupport,
    exact: true,
  },

  {
    path: '/support',
    name: 'Support',
    element: Support,
    exact: true,
  },

  // comment
  {
    path: '/comment',
    name: 'Comment',
    element: Comment,
    exact: true,
  },

  {
    path: 'comment/edit',
    name: 'EditComment',
    element: EditComment,
    exact: true,
  },

  // news
  { path: '/news', name: 'News', element: News, exact: true },
  {
    path: 'news/add',
    name: 'AddNews',
    element: AddNews,
    exact: true,
  },
  {
    path: 'news/edit',
    name: 'EditNews',
    element: EditNews,
    exact: true,
  },

  // category
  {
    path: 'news/category',
    name: 'NewsCategory',
    element: NewsCategory,
    exact: true,
  },

  // advertise category
  {
    path: 'advertise/category',
    name: 'AdvertiseCategory',
    element: AdvertiseCategory,
    exact: true,
  },

  // advertise
  { path: '/advertise', name: 'Advertise', element: Advertise, exact: true },
  {
    path: 'advertise/add',
    name: 'AddAdvertise',
    element: AddAdvertise,
    exact: true,
  },
  {
    path: 'advertise/edit',
    name: 'EditAdvertise',
    element: EditAdvertise,
    exact: true,
  },

  // introduce
  { path: '/introduce', name: 'Introduce', element: Introduce, exact: true },
  {
    path: 'introduce/add',
    name: 'AddIntroduce',
    element: AddIntroduce,
    exact: true,
  },
  {
    path: 'introduce/edit',
    name: 'EditIntroduce',
    element: EditIntroduce,
    exact: true,
  },

  // service
  { path: '/service', name: 'Service', element: Service, exact: true },
  {
    path: 'service/add',
    name: 'AddService',
    element: AddService,
    exact: true,
  },
  {
    path: 'service/edit',
    name: 'EditService',
    element: EditService,
    exact: true,
  },

  // instruction
  { path: '/instruction', name: 'Instruction', element: Instruction, exact: true },
  {
    path: 'instruction/add',
    name: 'AddInstruction',
    element: AddInstruction,
    exact: true,
  },
  {
    path: 'instruction/edit',
    name: 'EditInstruction',
    element: EditInstruction,
    exact: true,
  },

  // consultant

  // category
  {
    path: 'consultant/category',
    name: 'ConsultantCategory',
    element: ConsultantCategory,
    exact: true,
  },

  //detail

  { path: '/consultant', name: 'Consultant', element: Consultant, exact: true },
  {
    path: 'consultant/add',
    name: 'AddConsultant',
    element: AddConsultant,
    exact: true,
  },
  {
    path: 'consultant/edit',
    name: 'EditConsultant',
    element: EditConsultant,
    exact: true,
  },

  // contact

  // bao gia
  { path: '/price-management', name: 'PriceManagement', element: PriceManagement, exact: true },
  {
    path: 'price-management/edit',
    name: 'EditPriceManagement',
    element: EditPriceManagement,
    exact: true,
  },

  // so dia chi
  {
    path: '/address',
    name: 'AddressManagement',
    element: AddressManagement,
    exact: true,
  },
  {
    path: 'address/edit',
    name: 'EditAddressManagement',
    element: EditAddressManagement,
    exact: true,
  },

  // lien he

  {
    path: '/contact',
    name: 'ContactManagement',
    element: ContactManagement,
    exact: true,
  },
  {
    path: 'contact/edit',
    name: 'EditContactManagement',
    element: EditContactManagement,
    exact: true,
  },

  // phong ban

  {
    path: '/department',
    name: 'Department',
    element: Department,
    exact: true,
  },

  /** ------------------------------------------------------------------------------------------------------ */

  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
