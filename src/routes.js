import React from 'react'

// ══════════════════════════════════════════════════════════════
// TỔNG QUAN
// ══════════════════════════════════════════════════════════════
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// ══════════════════════════════════════════════════════════════
// QUẢN TRỊ HỆ THỐNG
// ══════════════════════════════════════════════════════════════

// --- Thông tin quản trị (admin accounts, groups, permissions, log) ---
const AdminInfo = React.lazy(() => import('./views/admin/AdminInfo'))
const AdminGroup = React.lazy(() => import('./views/admin/AdminGroup'))
const AdminList = React.lazy(() => import('./views/admin/AdminList'))
const AdminLog = React.lazy(() => import('./views/admin/AdminLog'))
const PermissionGroup = React.lazy(() => import('./views/admin/PermissionGroup'))
const EditPermission = React.lazy(() => import('./views/admin/EditPermissions'))

// --- Hệ thống (cấu hình, dữ liệu, backup) ---
const SystemConfig = React.lazy(() => import('./views/system/SystemConfig'))
const SystemData = React.lazy(() => import('./views/system/SystemData'))
const SystemBackup = React.lazy(() => import('./views/system/SystemBackup'))

// --- Thống kê truy cập ---
const AccessStatistics = React.lazy(() => import('./views/accessstatistics/AccessStatistics'))

// ══════════════════════════════════════════════════════════════
// KINH DOANH
// ══════════════════════════════════════════════════════════════

// --- Sản phẩm (danh sách, thêm/sửa, cấu hình, đồng bộ Excel) ---
const AdminUpdateExcelPrice = React.lazy(() => import('./views/admin/AdminExcelUpdatePrice'))
const ProductOutOfSync = React.lazy(() => import('./views/product/productOutOfSync.js'))
const ProductDetail = React.lazy(() => import('./views/product/detail/ProductDetail'))
const AddProductDetail = React.lazy(() => import('./views/product/detail/AddProductDetail'))
const EditProductDetail = React.lazy(() => import('./views/product/detail/EditProductDetail'))
const ProductConfig = React.lazy(() => import('./views/product/ProductConfig'))

// --- Thương hiệu & Danh mục sản phẩm ---
const ProductBrand = React.lazy(() => import('./views/product/productBrand'))
const ProductCategory = React.lazy(() => import('./views/product/category/productCategory'))
const AddProductCategory = React.lazy(() => import('./views/product/category/AddProductCategory'))
const EditProductCategory = React.lazy(() => import('./views/product/category/EditProductCategory'))

// --- Thuộc tính sản phẩm ---
const ProductProperties = React.lazy(() => import('./views/product/properties/productProperties'))
const AddProductProperties = React.lazy(
  () => import('./views/product/properties/AddProductProperties'),
)
const EditProductProperties = React.lazy(
  () => import('./views/product/properties/EditProductProperties'),
)

// --- Banner sản phẩm ---
const ProductBanner = React.lazy(() => import('./views/product/banner/productBanner'))
const ProductBannerHotDeal = React.lazy(() => import('./views/product/banner/productBannerHotDeal'))

// --- Trạng thái & Nhu cầu sản phẩm ---
const ProductStatus = React.lazy(() => import('./views/product/status/productStatus'))
const ProductDemand = React.lazy(() => import('./views/product/demand/ProductDemand.js'))

// --- Sản phẩm nổi bật (hot, flash sale) ---
const ProductHot = React.lazy(() => import('./views/product/productShow/productHot'))
const ProductFlashSale = React.lazy(() => import('./views/product/productShow/productFlashSale'))

// --- Coupon ---
const Coupon = React.lazy(() => import('./views/coupon/Coupon'))
const AddCoupon = React.lazy(() => import('./views/coupon/AddCoupon'))
const EditCoupon = React.lazy(() => import('./views/coupon/EditCoupon'))
const DetailCoupon = React.lazy(() => import('./views/coupon/DetailCoupon'))
const Text = React.lazy(() => import('./views/coupon/Text'))

// --- Đơn hàng (danh sách, trạng thái, vận chuyển, thanh toán) ---
const OrderList = React.lazy(() => import('./views/order/orderInfo/orderList'))
const EditOrder = React.lazy(() => import('./views/order/orderInfo/EditOrder'))
const OrderStatus = React.lazy(() => import('./views/order/orderStatus'))
const PaymentMethod = React.lazy(() => import('./views/order/paymentMethod'))
const ShippingMethod = React.lazy(() => import('./views/order/shippingMethod'))

// --- Thành viên ---
const Member = React.lazy(() => import('./views/member/Member'))
const EditMember = React.lazy(() => import('./views/member/EditMember'))

// --- Quà tặng ---
const Gift = React.lazy(() => import('./views/gift/Gift'))
const AddGift = React.lazy(() => import('./views/gift/AddGift'))
const EditGift = React.lazy(() => import('./views/gift/EditGift'))

// --- Khuyến mãi (chương trình & tin bài) ---
const PromotionDetail = React.lazy(
  () => import('./views/promotion/promotionDetail/promotionDetail'),
)
const AddPromotionDetail = React.lazy(
  () => import('./views/promotion/promotionDetail/AddPromotionDetail'),
)
const EditPromotionDetail = React.lazy(
  () => import('./views/promotion/promotionDetail/EditPromotionDetail'),
)
const PromotionNews = React.lazy(() => import('./views/promotion/promotionNews/promotionNews'))
const AddPromotionNews = React.lazy(
  () => import('./views/promotion/promotionNews/AddPromotionNews'),
)
const EditPromotionNews = React.lazy(
  () => import('./views/promotion/promotionNews/EditPromotionNews'),
)

// ══════════════════════════════════════════════════════════════
// QUẢN TRỊ GIA DỤNG
// ══════════════════════════════════════════════════════════════

// --- Ads gia dụng (vị trí, danh sách, thêm/sửa) ---
const HouseHoldCategory = React.lazy(
  () => import('./views/houseHold/advertiseCategory/HouseHoldCategory'),
)
const HouseHold = React.lazy(() => import('./views/houseHold/advertiseDetail/HouseHold'))
const AddHouseHold = React.lazy(() => import('./views/houseHold/advertiseDetail/AddHouseHold'))
const EditHouseHold = React.lazy(() => import('./views/houseHold/advertiseDetail/EditHouseHold'))

// --- Footer gia dụng (cấu hình footer toàn trang) ---
const HouseHoldFooters = React.lazy(() => import('./views/houseHold/footer/HouseHoldFooters'))

// --- Comment gia dụng (bình luận & đánh giá sản phẩm gia dụng) ---
const HouseHoldComments = React.lazy(() => import('./views/houseHold/comment/Comments'))
const EditHouseHoldComment = React.lazy(() => import('./views/houseHold/comment/EditComment'))

// ══════════════════════════════════════════════════════════════
// NỘI DUNG & TRUYỀN THÔNG
// ══════════════════════════════════════════════════════════════

// --- Support (nhóm & nhân viên hỗ trợ) ---
const Support = React.lazy(() => import('./views/support/Support'))
const GroupSupport = React.lazy(() => import('./views/support/GroupSupport'))

// --- Comment (bình luận sản phẩm/bài viết) ---
const Comment = React.lazy(() => import('./views/comment/Comment'))
const AddComment = React.lazy(() => import('./views/comment/AddComment'))
const EditComment = React.lazy(() => import('./views/comment/EditComment'))

// --- Tin tức (danh mục & bài viết) ---
const NewsCategory = React.lazy(() => import('./views/news/category/NewsCategory'))
const News = React.lazy(() => import('./views/news/detail/News'))
const AddNews = React.lazy(() => import('./views/news/detail/AddNews'))
const EditNews = React.lazy(() => import('./views/news/detail/EditNews'))

// --- Advertise (vị trí & banner quảng cáo) ---
const AdvertiseCategory = React.lazy(() => import('./views/advertise/category/AdvertiseCategory'))
const Advertise = React.lazy(() => import('./views/advertise/detail/Advertise'))
const AddAdvertise = React.lazy(() => import('./views/advertise/detail/AddAdvertise'))
const EditAdvertise = React.lazy(() => import('./views/advertise/detail/EditAdvertise'))

// --- Giới thiệu công ty ---
const Introduce = React.lazy(() => import('./views/introduce/Introduce'))
const AddIntroduce = React.lazy(() => import('./views/introduce/AddIntroduce'))
const EditIntroduce = React.lazy(() => import('./views/introduce/EditIntroduce'))

// --- Dịch vụ ---
const Service = React.lazy(() => import('./views/services/Service'))
const AddService = React.lazy(() => import('./views/services/AddService'))
const EditService = React.lazy(() => import('./views/services/EditService'))

// --- Hướng dẫn sử dụng ---
const Instruction = React.lazy(() => import('./views/instruction/Instruction'))
const AddInstruction = React.lazy(() => import('./views/instruction/AddInstruction'))
const EditInstruction = React.lazy(() => import('./views/instruction/EditInstruction'))

// --- Tư vấn (danh mục & chi tiết) ---
const ConsultantCategory = React.lazy(
  () => import('./views/consultant/category/ConsultantCategory'),
)
const Consultant = React.lazy(() => import('./views/consultant/detail/Consultant'))
const AddConsultant = React.lazy(() => import('./views/consultant/detail/AddConsultant'))
const EditConsultant = React.lazy(() => import('./views/consultant/detail/EditConsultant'))

// --- Newsletter ---
const Newsletter = React.lazy(() => import('./views/newsletter/Newsletter'))
const AddNewsletter = React.lazy(() => import('./views/newsletter/AddNewsletter'))
const EditNewsletter = React.lazy(() => import('./views/newsletter/EditNewsletter'))

// ══════════════════════════════════════════════════════════════
// CÀI ĐẶT & LIÊN KẾT
// ══════════════════════════════════════════════════════════════

// --- Liên hệ (phòng ban, sổ địa chỉ, báo giá, liên hệ) ---
const Department = React.lazy(() => import('./views/contact/department/department'))
const AddressManagement = React.lazy(
  () => import('./views/contact/addressManagement/addressManagement'),
)
const EditAddressManagement = React.lazy(
  () => import('./views/contact/addressManagement/EditAddressManagement'),
)
const PriceManagement = React.lazy(() => import('./views/contact/priceManagement/priceManagement'))
const EditPriceManagement = React.lazy(
  () => import('./views/contact/priceManagement/EditPriceManagement'),
)
const ContactManagement = React.lazy(
  () => import('./views/contact/contactManagement/contactManagement'),
)
const EditContactManagement = React.lazy(
  () => import('./views/contact/contactManagement/EditContactManagement'),
)

// --- Tuyển dụng (danh mục, bài đăng, hồ sơ ứng viên) ---
const HireCategory = React.lazy(() => import('./views/hire/HireCategory.js'))
const HireDetail = React.lazy(() => import('./views/hire/HireDetail.js'))
const AddHirePost = React.lazy(() => import('./views/hire/AddHirePost.js'))
const EditHirePost = React.lazy(() => import('./views/hire/EditHirePost.js'))
const CandidateCV = React.lazy(() => import('./views/hire/CandidateCV.js'))
const EditCandidateCV = React.lazy(() => import('./views/hire/EditCandidateCV.js'))

// --- Hình thức & Nội dung (menu, mail template) ---
const Menu = React.lazy(() => import('./views/content/Menu'))
const MailTemp = React.lazy(() => import('./views/content/mailTemp/MailTemplate'))
const AddMailTemp = React.lazy(() => import('./views/content/mailTemp/AddMailTemplate'))
const EditMailTemp = React.lazy(() => import('./views/content/mailTemp/EditMailTemplate'))

// --- SEO & Mạng xã hội (social icons, links, sitemap) ---
const Seo = React.lazy(() => import('./views/seo/SocialsIcon'))
const Sitemap = React.lazy(() => import('./views/seo/SitempaXML'))
const Links = React.lazy(() => import('./views/seo/LinkManagement'))
const LinksRedirect = React.lazy(() => import('./views/seo/LinkRedirect'))

// ══════════════════════════════════════════════════════════════
// KHÁC
// ══════════════════════════════════════════════════════════════
const Library = React.lazy(() => import('./views/library/Library.js'))

/** ============================================================
 *  ROUTES ARRAY
 *  Các section được sắp xếp theo thứ tự tab trong _nav.js:
 *  1. Tổng quan
 *  2. Quản trị hệ thống
 *  3. Kinh doanh
 *  4. Quản trị gia dụng
 *  5. Nội dung & truyền thông
 *  6. Cài đặt & liên kết
 *  7. Khác
 * ============================================================ */
const routes = [
  // ── 1. TỔNG QUAN ──────────────────────────────────────────
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', exact: true, name: 'Theme', element: Colors },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },

  // ── 2. QUẢN TRỊ HỆ THỐNG ──────────────────────────────────
  // 2a. Thông tin quản trị
  { path: '/admin', exact: true, name: 'Admin', element: AdminInfo },
  { path: '/admin/information', name: 'AdminInfo', element: AdminInfo },
  { path: '/admin/groups', name: 'AdminGroup', element: AdminGroup },
  { path: '/admin/list', name: 'AdminList', element: AdminList },
  { path: '/admin/log', name: 'AdminLog', element: AdminLog },
  {
    path: '/admin/permissions-group',
    exact: true,
    name: 'PermissionGroup',
    element: PermissionGroup,
  },
  { path: '/admin/groups/edit', exact: true, name: 'EditPermission', element: EditPermission },

  // 2b. Hệ thống
  { path: '/system-config', exact: true, name: 'SystemConfig', element: SystemConfig },
  { path: '/system-data', exact: true, name: 'SystemData', element: SystemData },
  { path: '/system-backup', exact: true, name: 'SystemBackup', element: SystemBackup },

  // 2c. Thống kê truy cập
  { path: '/access-statistics', exact: true, name: 'AccessStatistics', element: AccessStatistics },

  // ── 3. KINH DOANH ─────────────────────────────────────────
  // 3a. Sản phẩm
  {
    path: '/product/update-excel-price',
    name: 'AdminUpdateExcelPrice',
    element: AdminUpdateExcelPrice,
  },
  { path: '/product/out-of-sync', name: 'ProductOutOfSync', element: ProductOutOfSync },
  { path: '/product', name: 'ProductDetail', element: ProductDetail },
  { path: '/product/add', exact: true, name: 'AddProductDetail', element: AddProductDetail },
  { path: '/product/edit', exact: true, name: 'EditProductDetail', element: EditProductDetail },
  { path: '/product/config', exact: true, name: 'ProductConfig', element: ProductConfig },

  // Thương hiệu & Danh mục
  { path: '/product/brand', exact: true, name: 'ProductBrand', element: ProductBrand },
  { path: '/product/category', exact: true, name: 'ProductCategory', element: ProductCategory },
  {
    path: '/product/category/add',
    exact: true,
    name: 'AddProductCategory',
    element: AddProductCategory,
  },
  {
    path: '/product/category/edit',
    exact: true,
    name: 'EditProductCategory',
    element: EditProductCategory,
  },

  // Thuộc tính
  {
    path: '/product/properties',
    exact: true,
    name: 'ProductProperties',
    element: ProductProperties,
  },
  {
    path: '/product/properties/add',
    exact: true,
    name: 'AddProductProperties',
    element: AddProductProperties,
  },
  {
    path: '/product/properties/edit',
    exact: true,
    name: 'EditProductProperties',
    element: EditProductProperties,
  },

  // Banner
  { path: '/product/banner', exact: true, name: 'ProductBanner', element: ProductBanner },
  {
    path: '/product/banner-hot-deal',
    exact: true,
    name: 'ProductBannerHotDeal',
    element: ProductBannerHotDeal,
  },

  // Trạng thái & Nhu cầu
  { path: '/product/status', exact: true, name: 'ProductStatus', element: ProductStatus },
  { path: '/product/demand', exact: true, name: 'ProductDemand', element: ProductDemand },

  // Hot & Flash Sale
  { path: '/product/product-hot', exact: true, name: 'ProductHot', element: ProductHot },
  {
    path: '/product/product-flash-sale',
    exact: true,
    name: 'ProductFlashSale',
    element: ProductFlashSale,
  },

  // 3b. Coupon
  { path: '/coupon', exact: true, name: 'Coupon', element: Coupon },
  { path: '/coupon/add', exact: true, name: 'AddCoupon', element: AddCoupon },
  { path: '/coupon/edit', exact: true, name: 'EditCoupon', element: EditCoupon },
  { path: '/detail-coupon', exact: true, name: 'DetailCoupon', element: DetailCoupon },
  { path: '/text', exact: true, name: 'Text', element: Text },

  // 3c. Đơn hàng
  { path: '/order', exact: true, name: 'OrderList', element: OrderList },
  { path: '/order/edit', exact: true, name: 'EditOrder', element: EditOrder },
  { path: '/order/status', exact: true, name: 'OrderStatus', element: OrderStatus },
  { path: '/order/payment-method', exact: true, name: 'PaymentMethod', element: PaymentMethod },
  { path: '/order/shipping-method', exact: true, name: 'ShippingMethod', element: ShippingMethod },

  // 3d. Thành viên
  { path: '/member', exact: true, name: 'Member', element: Member },
  { path: '/member/edit', exact: true, name: 'EditMember', element: EditMember },

  // 3e. Quà tặng
  { path: '/gift', exact: true, name: 'Gift', element: Gift },
  { path: '/gift/add', exact: true, name: 'AddGift', element: AddGift },
  { path: '/gift/edit', exact: true, name: 'EditGift', element: EditGift },

  // 3f. Khuyến mãi
  { path: '/promotion-detail', exact: true, name: 'PromotionDetail', element: PromotionDetail },
  {
    path: '/promotion-detail/add',
    exact: true,
    name: 'AddPromotionDetail',
    element: AddPromotionDetail,
  },
  {
    path: '/promotion-detail/edit',
    exact: true,
    name: 'EditPromotionDetail',
    element: EditPromotionDetail,
  },
  { path: '/promotion', exact: true, name: 'PromotionNews', element: PromotionNews },
  { path: '/promotion/add', exact: true, name: 'AddPromotionNews', element: AddPromotionNews },
  { path: '/promotion/edit', exact: true, name: 'EditPromotionNews', element: EditPromotionNews },

  // ── 4. QUẢN TRỊ GIA DỤNG ──────────────────────────────────
  {
    path: '/household/category',
    exact: true,
    name: 'HouseHoldCategory',
    element: HouseHoldCategory,
  },
  { path: '/household', exact: true, name: 'HouseHold', element: HouseHold },
  { path: '/household/add', exact: true, name: 'AddHouseHold', element: AddHouseHold },
  { path: '/household/edit', exact: true, name: 'EditHouseHold', element: EditHouseHold },
  // Footer cấu hình gia dụng
  { path: '/household/footer', exact: true, name: 'HouseHoldFooters', element: HouseHoldFooters },
  // Comment gia dụng
  {
    path: '/household/comment',
    exact: true,
    name: 'HouseHoldComments',
    element: HouseHoldComments,
  },
  {
    path: '/household/comment/edit',
    exact: true,
    name: 'EditHouseHoldComment',
    element: EditHouseHoldComment,
  },

  // ── 5. NỘI DUNG & TRUYỀN THÔNG ────────────────────────────
  // 5a. Support
  { path: '/group-support', exact: true, name: 'GroupSupport', element: GroupSupport },
  { path: '/support', exact: true, name: 'Support', element: Support },

  // 5b. Comment
  { path: '/comment', exact: true, name: 'Comment', element: Comment },
  { path: '/comment/add', exact: true, name: 'AddComment', element: AddComment },
  { path: '/comment/edit', exact: true, name: 'EditComment', element: EditComment },

  // 5c. Tin tức
  { path: '/news/category', exact: true, name: 'NewsCategory', element: NewsCategory },
  { path: '/news', exact: true, name: 'News', element: News },
  { path: '/news/add', exact: true, name: 'AddNews', element: AddNews },
  { path: '/news/edit', exact: true, name: 'EditNews', element: EditNews },

  // 5d. Advertise
  {
    path: '/advertise/category',
    exact: true,
    name: 'AdvertiseCategory',
    element: AdvertiseCategory,
  },
  { path: '/advertise', exact: true, name: 'Advertise', element: Advertise },
  { path: '/advertise/add', exact: true, name: 'AddAdvertise', element: AddAdvertise },
  { path: '/advertise/edit', exact: true, name: 'EditAdvertise', element: EditAdvertise },

  // 5e. Giới thiệu
  { path: '/about', exact: true, name: 'Introduce', element: Introduce },
  { path: '/about/add', exact: true, name: 'AddIntroduce', element: AddIntroduce },
  { path: '/about/edit', exact: true, name: 'EditIntroduce', element: EditIntroduce },

  // 5f. Dịch vụ
  { path: '/service', exact: true, name: 'Service', element: Service },
  { path: '/service/add', exact: true, name: 'AddService', element: AddService },
  { path: '/service/edit', exact: true, name: 'EditService', element: EditService },

  // 5g. Hướng dẫn
  { path: '/guide', exact: true, name: 'Instruction', element: Instruction },
  { path: '/guide/add', exact: true, name: 'AddInstruction', element: AddInstruction },
  { path: '/guide/edit', exact: true, name: 'EditInstruction', element: EditInstruction },

  // 5h. Tư vấn
  {
    path: '/consultant/category',
    exact: true,
    name: 'ConsultantCategory',
    element: ConsultantCategory,
  },
  { path: '/consultant', exact: true, name: 'Consultant', element: Consultant },
  { path: '/consultant/add', exact: true, name: 'AddConsultant', element: AddConsultant },
  { path: '/consultant/edit', exact: true, name: 'EditConsultant', element: EditConsultant },

  // 5i. Newsletter
  { path: '/newsletter', exact: true, name: 'Newsletter', element: Newsletter },
  { path: '/newsletter/add', exact: true, name: 'AddNewsletter', element: AddNewsletter },
  { path: '/newsletter/edit', exact: true, name: 'EditNewsletter', element: EditNewsletter },

  // ── 6. CÀI ĐẶT & LIÊN KẾT ────────────────────────────────
  // 6a. Liên hệ
  { path: '/department', exact: true, name: 'Department', element: Department },
  { path: '/address', exact: true, name: 'AddressManagement', element: AddressManagement },
  {
    path: '/address/edit',
    exact: true,
    name: 'EditAddressManagement',
    element: EditAddressManagement,
  },
  { path: '/price-management', exact: true, name: 'PriceManagement', element: PriceManagement },
  {
    path: '/price-management/edit',
    exact: true,
    name: 'EditPriceManagement',
    element: EditPriceManagement,
  },
  { path: '/contact', exact: true, name: 'ContactManagement', element: ContactManagement },
  {
    path: '/contact/edit',
    exact: true,
    name: 'EditContactManagement',
    element: EditContactManagement,
  },

  // 6b. Tuyển dụng
  { path: '/hire/category', exact: true, name: 'HireCategory', element: HireCategory },
  { path: '/hire/post', exact: true, name: 'HireDetail', element: HireDetail },
  { path: '/hire/post/add', exact: true, name: 'AddHirePost', element: AddHirePost },
  { path: '/hire/post/edit', exact: true, name: 'EditHirePost', element: EditHirePost },
  { path: '/hire/candidate-cv', exact: true, name: 'CandidateCV', element: CandidateCV },
  {
    path: '/hire/candidate-cv/edit',
    exact: true,
    name: 'EditCandidateCV',
    element: EditCandidateCV,
  },

  // 6c. Hình thức & Nội dung
  { path: '/content/menu', exact: true, name: 'Menu', element: Menu },
  { path: '/content/mail-temp', exact: true, name: 'MailTemp', element: MailTemp },
  { path: '/content/mail-temp/add', exact: true, name: 'AddMailTemp', element: AddMailTemp },
  { path: '/content/mail-temp/edit', exact: true, name: 'EditMailTemp', element: EditMailTemp },

  // 6d. SEO & Mạng xã hội
  { path: '/seo/social-icons', exact: true, name: 'Seo', element: Seo },
  { path: '/seo/sitemap', exact: true, name: 'Sitemap', element: Sitemap },
  { path: '/seo/links', exact: true, name: 'Links', element: Links },
  { path: '/seo/links-redirect', exact: true, name: 'LinksRedirect', element: LinksRedirect },

  // ── 7. KHÁC ───────────────────────────────────────────────
  { path: '/library', exact: true, name: 'Library', element: Library },
]

export default routes
