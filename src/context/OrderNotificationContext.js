import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { toast } from 'react-toastify'

import { axiosClient } from '../axiosConfig'
import {
  NOTIFICATION_DROPDOWN_LIMIT,
  ORDER_NOTIFICATION_EVENT,
  SOCKET_ORDER_NOTIFICATION_URL,
  ORDER_NOTIFICATION_STATUS,
} from '../constants/orderNotifications'
import {
  getOrderNotificationContent,
  isValidOrderNotificationPayload,
  normalizeOrderNotification,
  getOrderNotificationStatusKey,
} from '../helper/orderNotifications'

const OrderNotificationContext = createContext(null)

export const OrderNotificationProvider = ({ children }) => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [unreadNewOrderCount, setUnreadNewOrderCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [latestSocketEvent, setLatestSocketEvent] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchNotificationHistory = useCallback(async (page = 1) => {
    try {
      const response = await axiosClient.get(`admin/order-notifies?page=${page}`)
      const responseData = response.data

      console.log('fetchNotificationHistory', responseData)

      if (responseData?.status !== true) {
        return {
          status: false,
          items: [],
          pagination: null,
          noPermission: responseData?.mess === 'no permission',
        }
      }

      const responseItems = Array.isArray(responseData?.data?.items) ? responseData.data.items : []
      const normalizedItems = responseItems.map(normalizeOrderNotification)
      const pageUnreadCount = normalizedItems.filter((item) => item.isUnread).length
      const pageUnreadNewOrderCount = normalizedItems.filter(
        (item) => item.isUnread && item.statusKey === ORDER_NOTIFICATION_STATUS.PENDING,
      ).length

      if (page === 1) {
        setItems(normalizedItems.slice(0, NOTIFICATION_DROPDOWN_LIMIT))
        setUnreadCount(pageUnreadCount)
        setUnreadNewOrderCount(pageUnreadNewOrderCount)
      }

      return {
        status: true,
        items: normalizedItems,
        pagination: responseData?.data?.pagination || null,
        noPermission: false,
      }
    } catch (error) {
      console.error('Fetch order notifications error', error)
      return {
        status: false,
        items: [],
        pagination: null,
        noPermission: false,
      }
    }
  }, [])

  const refreshNotifications = useCallback(
    async (page = 1) => {
      setIsLoading(true)
      const result = await fetchNotificationHistory(page)
      setIsLoading(false)
      return result
    },
    [fetchNotificationHistory],
  )

  const openOrderNotification = useCallback(
    (notification) => {
      const detailUrl = notification?.detailUrl || notification?.detail_url || ''
      if (detailUrl) {
        if (/^https?:\/\//i.test(detailUrl)) {
          window.location.assign(detailUrl)
        } else {
          navigate(detailUrl)
        }
        return true
      }

      if (!notification?.order_id) {
        return false
      }

      navigate(`/order/edit?id=${notification.order_id}`, {
        state: {
          fromNotification: true,
          notificationId: notification?.id || null,
        },
      })

      return true
    },
    [navigate],
  )

  useEffect(() => {
    refreshNotifications(1)
  }, [refreshNotifications])

  // --- AUDIO EFFECT (Global unlock & chime) ---
  useEffect(() => {
    let audioCtx = null

    const unlockAudio = () => {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (AudioContext) {
          audioCtx = new AudioContext()
          if (audioCtx.state === 'suspended') {
            audioCtx.resume()
          }
        }
      } else if (audioCtx.state === 'suspended') {
        audioCtx.resume()
      }
    }

    window.addEventListener('pointerdown', unlockAudio, { once: true })
    window.addEventListener('keydown', unlockAudio, { once: true })

    window.__playNewOrderChime = () => {
      if (!audioCtx || audioCtx.state === 'suspended') {
        return
      }

      try {
        const playTone = (freq, startTime, duration, type = 'sine', vol = 1.0) => {
          const osc = audioCtx.createOscillator()
          const gainNode = audioCtx.createGain()
          osc.type = type
          osc.frequency.setValueAtTime(freq, startTime)

          gainNode.gain.setValueAtTime(0, startTime)
          // Âm báo to hơn (vol lớn hơn)
          gainNode.gain.linearRampToValueAtTime(vol, startTime + 0.05)
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

          osc.connect(gainNode)
          gainNode.connect(audioCtx.destination)

          osc.start(startTime)
          osc.stop(startTime + duration)
        }

        const now = audioCtx.currentTime
        // Chuỗi âm thanh Ting - Ting - Ting vui tai, dồn dập và to hơn
        playTone(783.99, now, 0.25, 'triangle', 1.0) // G5
        playTone(1046.5, now + 0.15, 0.25, 'sine', 1.2) // C6
        playTone(1318.51, now + 0.35, 0.5, 'sine', 1.5) // E6
      } catch (e) {
        // Bỏ qua lỗi audio
      }
    }

    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close().catch(() => {})
      }
      delete window.__playNewOrderChime
    }
  }, [])

  // --- TAB BADGE EFFECT (Title & Favicon) ---
  useEffect(() => {
    if (window.__originalTitle === undefined) {
      window.__originalTitle = document.title
    }

    const link = document.querySelector("link[rel~='icon']")
    if (window.__originalFavicon === undefined) {
      window.__originalFavicon = link ? link.href : ''
    }

    let titleInterval

    if (unreadNewOrderCount > 0) {
      // Hiệu ứng nhấp nháy title để gây chú ý
      let isAlt = false
      titleInterval = setInterval(() => {
        document.title = (isAlt ? '(🔔) Đơn hàng mới! - ' : '') + window.__originalTitle
        isAlt = !isAlt
      }, 1000)

      if (link && window.__originalFavicon) {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width || 32
          canvas.height = img.height || 32
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          const radius = Math.max(canvas.width / 5, 5)
          const centerX = canvas.width - radius
          const centerY = canvas.height - radius // Đưa xuống right bottom

          // Vẽ chấm đỏ
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
          ctx.fillStyle = '#ff4d4f'
          ctx.fill()

          // Viền trắng cho nổi bật
          ctx.lineWidth = 1.5
          ctx.strokeStyle = '#ffffff'
          ctx.stroke()

          // Thêm số lượng hiển thị bên trong chấm đỏ
          ctx.fillStyle = '#ffffff'
          ctx.font = `bold ${radius * 1.3}px Arial`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          const countText = unreadNewOrderCount > 9 ? '9+' : unreadNewOrderCount.toString()
          ctx.fillText(countText, centerX, centerY + Math.max(radius * 0.1, 1))

          link.href = canvas.toDataURL('image/png')
        }
        img.src = window.__originalFavicon
      }
    } else {
      document.title = window.__originalTitle
      if (link && window.__originalFavicon) {
        link.href = window.__originalFavicon
      }
    }

    return () => {
      if (titleInterval) {
        clearInterval(titleInterval)
      }
    }
  }, [unreadNewOrderCount])

  useEffect(() => {
    const socket = io(SOCKET_ORDER_NOTIFICATION_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
    })

    const handleOrderUpdate = async (payload) => {
      if (!isValidOrderNotificationPayload(payload)) {
        return
      }

      if (process.env.NODE_ENV === 'development') {
        console.debug('[order_update]', payload)
      }

      const statusKey = getOrderNotificationStatusKey(payload.status)
      if (statusKey === ORDER_NOTIFICATION_STATUS.PENDING) {
        if (typeof window.__playNewOrderChime === 'function') {
          window.__playNewOrderChime()
        }
        // Cố gắng focus vào tab hiện tại
        if (typeof window.focus === 'function') {
          window.focus()
        }
      }

      const content = getOrderNotificationContent(payload)
      toast.info(content.title)
      setLatestSocketEvent({
        payload,
        receivedAt: Date.now(),
      })
      await refreshNotifications(1)
    }

    socket.on(ORDER_NOTIFICATION_EVENT, handleOrderUpdate)
    socket.on('connect_error', (error) => {
      console.error('Order notification socket connection error', error)
    })

    return () => {
      socket.off(ORDER_NOTIFICATION_EVENT, handleOrderUpdate)
      socket.disconnect()
    }
  }, [refreshNotifications])

  const value = useMemo(
    () => ({
      items,
      unreadCount,
      isLoading,
      latestSocketEvent,
      currentPage,
      setCurrentPage,
      fetchNotificationHistory,
      refreshNotifications,
      openOrderNotification,
    }),
    [
      currentPage,
      fetchNotificationHistory,
      isLoading,
      items,
      latestSocketEvent,
      openOrderNotification,
      refreshNotifications,
      unreadCount,
    ],
  )

  return (
    <OrderNotificationContext.Provider value={value}>{children}</OrderNotificationContext.Provider>
  )
}

export const useOrderNotifications = () => {
  const context = useContext(OrderNotificationContext)

  if (!context) {
    throw new Error('useOrderNotifications must be used within OrderNotificationProvider')
  }

  return context
}
