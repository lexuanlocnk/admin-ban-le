import React, { useCallback, useEffect, useState } from 'react'
import { CButton, CCol, CContainer, CRow } from '@coreui/react'
import { Link, useSearchParams } from 'react-router-dom'
import ReactPaginate from 'react-paginate'

import Loading from '../../components/loading/Loading'
import { useOrderNotifications } from '../../context/OrderNotificationContext'
import '../../components/css/orderNotifications.css'

const DEFAULT_PAGINATION = {
  current_page: 1,
  last_page: 1,
  per_page: 20,
  total: 0,
}

function OrderNotifications() {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageFromUrl = parseInt(searchParams.get('page')) || 1
  const {
    currentPage,
    setCurrentPage,
    fetchNotificationHistory,
    latestSocketEvent,
    openOrderNotification,
  } = useOrderNotifications()
  const [notifications, setNotifications] = useState([])
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION)
  const [isLoading, setIsLoading] = useState(false)
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  useEffect(() => {
    if (pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl)
    }
  }, [currentPage, pageFromUrl, setCurrentPage])

  useEffect(() => {
    setSearchParams({ page: currentPage })
  }, [currentPage, setSearchParams])

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await fetchNotificationHistory(currentPage)

      if (result.noPermission) {
        setIsPermissionCheck(false)
        setNotifications([])
        setPagination(DEFAULT_PAGINATION)
        return
      }

      setIsPermissionCheck(true)

      if (result.status) {
        setNotifications(result.items)
        setPagination(result.pagination || DEFAULT_PAGINATION)
      }
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, fetchNotificationHistory])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  useEffect(() => {
    if (!latestSocketEvent) {
      return
    }

    loadNotifications()
  }, [latestSocketEvent, loadNotifications])

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1)
    window.scrollTo(0, 0)
  }

  const handleNotificationKeyDown = (event, notification) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openOrderNotification(notification)
    }
  }

  return (
    <CContainer>
      {!isPermissionCheck ? (
        <h5>
          <div>Bạn không đủ quyền để thao tác trên danh mục quản trị này.</div>
          <div className="mt-4">
            Vui lòng quay lại trang chủ <Link to={'/dashboard'}>(Nhấn vào để quay lại)</Link>
          </div>
        </h5>
      ) : (
        <>
          <CRow className="mb-3">
            <CCol>
              <h3>THÔNG BÁO ĐƠN HÀNG</h3>
            </CCol>
            <CCol md={{ span: 4, offset: 4 }}>
              <div className="d-flex justify-content-end">
                <Link to={`/order`}>
                  <CButton color="primary" type="submit" size="sm">
                    Danh sách đơn hàng
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>

          {isLoading ? (
            <Loading />
          ) : notifications.length === 0 ? (
            <div className="order-notification-page__empty">Chưa có thông báo đơn hàng nào.</div>
          ) : (
            <div className="order-notification-page__list">
              {notifications.map((notification) => (
                <div
                  key={
                    notification.id ||
                    `${notification.order_id || 'order'}-${notification.created_at}`
                  }
                  className={`order-notification-card order-notification-card--page ${
                    notification.isUnread ? 'order-notification-card--unread' : ''
                  } ${notification.canOpen ? 'order-notification-card--clickable' : ''}`}
                  role={notification.canOpen ? 'button' : undefined}
                  tabIndex={notification.canOpen ? 0 : -1}
                  aria-disabled={!notification.canOpen}
                  onClick={() => notification.canOpen && openOrderNotification(notification)}
                  onKeyDown={(event) =>
                    notification.canOpen && handleNotificationKeyDown(event, notification)
                  }
                >
                  <div className="order-notification-card__title">{notification.title}</div>
                  <div className="order-notification-card__description">
                    {notification.description}
                  </div>
                  <div className="order-notification-card__meta">
                    <span>{notification.createdAtLabel}</span>
                    {notification.canOpen && (
                      <button
                        type="button"
                        className="order-notification-card__link"
                        onClick={(event) => {
                          event.stopPropagation()
                          openOrderNotification(notification)
                        }}
                      >
                        {notification.detailLabel}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="d-flex justify-content-end">
            <ReactPaginate
              pageCount={pagination?.last_page || 1}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              onPageChange={handlePageChange}
              containerClassName={'pagination'}
              activeClassName={'active'}
              previousLabel={'<<'}
              nextLabel={'>>'}
              forcePage={currentPage - 1}
            />
          </div>
        </>
      )}
    </CContainer>
  )
}

export default OrderNotifications
