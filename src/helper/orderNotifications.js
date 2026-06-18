import moment from 'moment'

import {
  ORDER_NOTIFICATION_STATUS,
  ORDER_NOTIFICATION_STATUS_TEXT_MAP,
} from '../constants/orderNotifications'

const DEFAULT_CUSTOMER_NAME = 'Khách hàng không xác định'
const DEFAULT_ORDER_LABEL = 'Đơn hàng không xác định'

const ORDER_NOTIFICATION_COPY = {
  [ORDER_NOTIFICATION_STATUS.PENDING]: {
    title: (orderLabel) => `Đơn hàng ${orderLabel} đang chờ xử lý`,
    description: (customerName) => `Khách hàng ${customerName} vừa tạo đơn hàng và đang chờ xử lý.`,
  },
  [ORDER_NOTIFICATION_STATUS.WAITING_PAYMENT]: {
    title: (orderLabel) => `Đơn hàng ${orderLabel} đang chờ thanh toán`,
    description: (customerName) => `Đơn hàng của ${customerName} đang chờ xác nhận thanh toán.`,
  },
  [ORDER_NOTIFICATION_STATUS.PAID]: {
    title: (orderLabel) => `Đơn hàng ${orderLabel} đã thanh toán`,
    description: (customerName) =>
      `Khách hàng ${customerName} đã hoàn tất thanh toán cho đơn hàng.`,
  },
  [ORDER_NOTIFICATION_STATUS.SHIPPING]: {
    title: (orderLabel) => `Đơn hàng ${orderLabel} đang được giao`,
    description: (customerName) =>
      `Đơn hàng của ${customerName} đã chuyển sang trạng thái giao hàng.`,
  },
  [ORDER_NOTIFICATION_STATUS.COMPLETED]: {
    title: (orderLabel) => `Đơn hàng ${orderLabel} đã hoàn tất`,
    description: (customerName) => `Đơn hàng của ${customerName} đã hoàn tất thành công.`,
  },
  [ORDER_NOTIFICATION_STATUS.CANCELLED]: {
    title: (orderLabel) => `Đơn hàng ${orderLabel} đã bị hủy`,
    description: (customerName) => `Đơn hàng của ${customerName} đã bị hủy trong hệ thống.`,
  },
  [ORDER_NOTIFICATION_STATUS.CUSTOMER_CANCELLED]: {
    title: (orderLabel) => `Khách hàng đã hủy đơn ${orderLabel}`,
    description: (customerName) => `Khách hàng ${customerName} đã yêu cầu hủy đơn hàng.`,
  },
}

export const getOrderNotificationStatusKey = (statusText) => {
  if (typeof statusText !== 'string') {
    return ORDER_NOTIFICATION_STATUS.UNKNOWN
  }

  return ORDER_NOTIFICATION_STATUS_TEXT_MAP[statusText.trim()] || ORDER_NOTIFICATION_STATUS.UNKNOWN
}

export const getOrderNotificationOrderLabel = ({ order_code, order_id }) => {
  if (typeof order_code === 'string' && order_code.trim() !== '') {
    return order_code.trim()
  }

  if (order_id !== undefined && order_id !== null && order_id !== '') {
    return `#${order_id}`
  }

  return DEFAULT_ORDER_LABEL
}

export const getOrderNotificationCustomerName = (customerName) => {
  if (typeof customerName === 'string' && customerName.trim() !== '') {
    return customerName.trim()
  }

  return DEFAULT_CUSTOMER_NAME
}

export const getOrderNotificationContent = (notification) => {
  const statusKey = getOrderNotificationStatusKey(notification?.status)
  const orderLabel = getOrderNotificationOrderLabel(notification || {})
  const customerName = getOrderNotificationCustomerName(notification?.customer_name)
  const copy = ORDER_NOTIFICATION_COPY[statusKey]

  if (!copy) {
    return {
      statusKey,
      title: `Đơn hàng ${orderLabel} vừa được cập nhật`,
      description: `Khách hàng ${customerName} vừa có thay đổi mới trên đơn hàng.`,
      detailLabel: 'Xem chi tiết',
    }
  }

  return {
    statusKey,
    title: copy.title(orderLabel),
    description: copy.description(customerName),
    detailLabel: 'Xem chi tiết',
  }
}

export const formatOrderNotificationTime = (value) => {
  if (!value) {
    return ''
  }

  const date = moment(value)
  if (!date.isValid()) {
    return ''
  }

  return date.format('DD/MM/YYYY HH:mm')
}

export const normalizeOrderNotification = (notification) => {
  const content = getOrderNotificationContent(notification)
  const detailUrl =
    notification?.detail_url ||
    notification?.payload?.detail_url ||
    notification?.payload?.detailUrl ||
    ''
  const sourceSystem =
    notification?.source_system ||
    notification?.payload?.source_system ||
    notification?.payload?.sourceSystem ||
    ''

  return {
    ...notification,
    ...content,
    detailUrl,
    sourceSystem,
    isHousehold: sourceSystem === 'giadung',
    createdAtLabel: formatOrderNotificationTime(notification?.created_at),
    canOpen: Boolean(detailUrl || notification?.order_id),
    isUnread: notification?.is_read === false,
  }
}

export const isValidOrderNotificationPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return false
  }

  const hasOrderId =
    payload.order_id !== undefined && payload.order_id !== null && payload.order_id !== ''
  const hasOrderCode = typeof payload.order_code === 'string' && payload.order_code.trim() !== ''

  return (
    (hasOrderId || hasOrderCode) &&
    typeof payload.status === 'string' &&
    payload.status.trim() !== ''
  )
}
