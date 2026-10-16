import React from 'react'
import { useSelector } from 'react-redux'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

import { OrderNotificationProvider } from '../context/OrderNotificationContext'
import ScrollUpButton from '../components/scrollUp/ScrollUpButton'

const DefaultLayout = () => {
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const sidebarWidth = useSelector((state) => state.sidebarWidth) || 290
  const sidebarOffset = sidebarShow ? `${sidebarWidth}px` : '0px'
  return (
    <div
      style={{
        fontSize: 14,
        minHeight: '100vh',
      }}
    >
      <ScrollUpButton />
      <OrderNotificationProvider>
        <AppSidebar />
        <div
          className="wrapper admin-layout d-flex flex-column min-vh-100"
          style={{ '--admin-sidebar-offset': sidebarOffset }}
        >
          <AppHeader />
          <div className="body flex-grow-1">
            <AppContent />
          </div>
          <AppFooter />
        </div>
      </OrderNotificationProvider>
    </div>
  )
}

export default DefaultLayout
