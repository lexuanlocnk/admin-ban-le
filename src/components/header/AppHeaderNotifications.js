import React, { useState } from 'react'
import { CDropdown, CDropdownMenu, CDropdownToggle, CSpinner } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilCheckCircle } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

import { useOrderNotifications } from '../../context/OrderNotificationContext'
import '../css/orderNotifications.css'

const AppHeaderNotifications = () => {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const { items, unreadCount, isLoading, refreshNotifications, openOrderNotification } =
    useOrderNotifications()

  console.log('items', items)

  const handleNotificationKeyDown = (event, notification) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openOrderNotification(notification)
    }
  }

  const handleVisibleChange = (nextVisible) => {
    setVisible(nextVisible)

    if (nextVisible) {
      refreshNotifications(1)
    }
  }

  return (
    <CDropdown
      variant="nav-item"
      alignment="end"
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <CDropdownToggle caret={false} className="order-notification-toggle">
        <span className="order-notification-bell">
          <CIcon icon={cilBell} size="lg" />
          {unreadCount > 0 && <span className="order-notification-bell__badge"></span>}
        </span>
      </CDropdownToggle>
      <CDropdownMenu className="order-notification-dropdown pt-0" placement="bottom-end">
        <div className="order-notification-dropdown__header">
          <span className="order-notification-dropdown__title">Tin nhắn hệ thống</span>
        </div>

        <div className="order-notification-dropdown__body">
          {isLoading ? (
            <div className="order-notification-dropdown__state">
              <CSpinner color="primary" size="sm" />
            </div>
          ) : items.length === 0 ? (
            <div className="order-notification-dropdown__state">
              Chưa có thông báo đơn hàng nào.
            </div>
          ) : (
            items.map((notification) => (
              <div
                key={
                  notification.id ||
                  `${notification.order_id || 'order'}-${notification.created_at}`
                }
                className={`order-notification-card order-notification-card--dropdown ${
                  notification.isUnread ? 'order-notification-card--unread' : ''
                } ${notification.canOpen ? 'order-notification-card--clickable' : ''}`}
                role={notification.canOpen ? 'button' : undefined}
                tabIndex={notification.canOpen ? 0 : -1}
                aria-disabled={!notification.canOpen}
                onClick={() => {
                  if (!notification.canOpen) {
                    return
                  }

                  setVisible(false)
                  openOrderNotification(notification)
                }}
                onKeyDown={(event) =>
                  notification.canOpen && handleNotificationKeyDown(event, notification)
                }
              >
                <div className="order-notification-card__top">
                  <div className="order-notification-card__title">{notification.title}</div>
                  {!notification.isUnread && (
                    <span className="order-notification-card__read-badge">
                      <CIcon icon={cilCheckCircle} size="sm" />
                      Đã đọc
                    </span>
                  )}
                </div>
                <div className="order-notification-card__description order-notification-card__description--dropdown">
                  {notification.description}
                </div>
                <div className="order-notification-card__meta">
                  <span className="order-notification-card__time">{notification.created_at}</span>
                  {notification.canOpen && (
                    <button
                      type="button"
                      className="order-notification-card__link"
                      onClick={(event) => {
                        event.stopPropagation()
                        setVisible(false)
                        openOrderNotification(notification)
                      }}
                    >
                      {notification.detailLabel}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="order-notification-dropdown__footer">
          <button
            type="button"
            className="order-notification-dropdown__view-all"
            onClick={() => {
              setVisible(false)
              navigate('/order/notifications')
            }}
          >
            Xem tất cả
          </button>
        </div>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderNotifications
