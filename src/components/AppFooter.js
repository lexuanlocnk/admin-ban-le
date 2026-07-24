import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <CFooter className="px-4 py-2 bg-white border-top fs-7 text-secondary mt-auto m-0">
      <div className="d-flex align-items-center gap-2">
        <a
          href="https://chinhnhan.vn"
          target="_blank"
          rel="noopener noreferrer"
          className="fw-bold text-primary text-decoration-none"
        >
          Chính Nhân
        </a>
        <span>&copy; {currentYear} chinhnhan.vn</span>
        <span className="text-muted">|</span>
        <a
          href="https://chinhnhan.net"
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary text-decoration-none"
        >
          https://chinhnhan.net
        </a>
      </div>
      <div className="ms-auto d-flex align-items-center gap-1">
        <span className="text-muted">Powered by</span>
        <a
          href="https://chinhnhan.net"
          target="_blank"
          rel="noopener noreferrer"
          className="fw-semibold text-dark text-decoration-none"
        >
          Chính Nhân IT
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
