import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'
import { axiosClient } from '../axiosConfig'

export const AppSidebarNav = ({ items }) => {
  const [dataNotSeen, setDataNotSeen] = useState({})
  useEffect(() => {
    const fetchNotSeenData = async () => {
      try {
        const response = await axiosClient.get('/admin/no-approved-statistics')

        if (response.data.status === true) {
          setDataNotSeen(response.data)
        }
      } catch (error) {
        console.error('Fetch data not seen is error', error)
      }
    }

    fetchNotSeenData()
  }, [])

  const navLink = (name, icon, badge, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        <div className="nav-label-text flex-grow-1">{name && name}</div>
        {badge && <span className="shopify-nav-badge">{badge.text}</span>}
        {name == 'QUẢN LÝ ĐƠN HÀNG' && dataNotSeen?.countOrderSum > 0 && (
          <span className="shopify-nav-badge">{dataNotSeen?.countOrderSum}</span>
        )}
        {name == 'QUẢN LÝ TUYỂN DỤNG' && dataNotSeen?.countCandidates > 0 && (
          <span className="shopify-nav-badge">{dataNotSeen?.countCandidates}</span>
        )}
        {name == 'Quản lý hồ sơ ứng tuyển' && dataNotSeen?.countCandidates > 0 && (
          <span className="shopify-nav-badge">{dataNotSeen?.countCandidates}</span>
        )}
        {name == 'QUẢN LÝ COMMENT' && dataNotSeen?.countComment > 0 && (
          <span className="shopify-nav-badge">{dataNotSeen?.countComment}</span>
        )}
        {name == 'QUẢN LÝ LIÊN HỆ' && dataNotSeen?.countContactQoute > 0 && (
          <span className="shopify-nav-badge">{dataNotSeen?.countContactQoute}</span>
        )}
        {name == 'QUẢN LÝ NEWSLETTER' && dataNotSeen?.countMailList > 0 && (
          <span className="shopify-nav-badge">{dataNotSeen?.countMailList}</span>
        )}
      </>
    )
  }

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink {...(rest.to && { as: NavLink })} {...rest}>
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  const navGroup = (item, index) => {
    const { component, name, icon, items, to, ...rest } = item
    const Component = component
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true),
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
