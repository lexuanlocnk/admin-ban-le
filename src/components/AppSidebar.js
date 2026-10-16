import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CImage,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { sygnet } from '../assets/brand/sygnet'

import logo from '../assets/images/logo/logo CN.png'

// sidebar nav config
import navigation from '../_nav'
import { Link } from 'react-router-dom'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const sidebarWidth = useSelector((state) => state.sidebarWidth) || 290
  const [isResizing, setIsResizing] = useState(false)

  const startResizing = useCallback(
    (mouseDownEvent) => {
      mouseDownEvent.preventDefault()
      setIsResizing(true)
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'col-resize'

      const onMouseMove = (moveEvent) => {
        const newWidth = Math.min(Math.max(moveEvent.clientX, 220), 550)
        dispatch({ type: 'set', sidebarWidth: newWidth })
        try {
          localStorage.setItem('admin_sidebar_width', newWidth)
        } catch (err) {}
      }

      const onMouseUp = () => {
        setIsResizing(false)
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [dispatch],
  )

  return (
    <CSidebar
      className={`border-end shopify-sidebar ${isResizing ? 'is-resizing' : ''}`}
      colorScheme="dark"
      position="fixed"
      visible={sidebarShow}
      style={{
        '--cui-sidebar-width': `${sidebarWidth}px`,
        width: `${sidebarWidth}px`,
      }}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      {/* Resizer handle on right edge */}
      <div
        className="sidebar-resizer"
        onMouseDown={startResizing}
        title="Nhấn giữ và kéo sang trái/phải để điều chỉnh độ rộng menu"
      />
      <CSidebarHeader
        className="border-bottom"
        style={{ justifyContent: 'center', padding: '14px 16px', background: '#212631' }}
      >
        <CSidebarBrand to="/">
          <Link to={'/'}>
            <CImage rounded src={logo} width={150} />
          </Link>
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          title="Đóng sidebar"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
