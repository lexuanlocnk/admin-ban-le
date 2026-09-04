import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {
  cilArrowBottom,
  cilArrowTop,
  cilBarChart,
  cilCart,
  cilList,
  cilMoney,
  cilOptions,
  cilUser,
} from '@coreui/icons'
import { Link } from 'react-router-dom'
import './css/widgetDropdown.css'

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={3} xxl={3}>
        <CWidgetStatsA
          className="widget-stat-card widget-stat-primary"
          style={{ paddingBottom: 16 }}
          color="primary"
          value={
            <div className="d-flex justify-content-between align-items-center">
              <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.5px' }}>
                {props?.dashBoardData?.order !== undefined && props?.dashBoardData?.order !== null
                  ? Number(props.dashBoardData.order).toLocaleString('vi-VN')
                  : 0}
              </span>
              <CIcon icon={cilMoney} size="3xl" style={{ opacity: 0.85 }} />
            </div>
          }
          title={
            <span style={{ fontSize: 13.5, fontWeight: 600, opacity: 0.95 }}>Tổng đơn hàng</span>
          }
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>
                  <Link to={'/order'}>Xem chi tiết</Link>
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
        />
      </CCol>
      <CCol sm={6} xl={3} xxl={3}>
        <CWidgetStatsA
          className="widget-stat-card widget-stat-info"
          style={{ paddingBottom: 16 }}
          color="info"
          value={
            <div className="d-flex justify-content-between align-items-center">
              <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.5px' }}>
                {props?.dashBoardData?.product !== undefined &&
                props?.dashBoardData?.product !== null
                  ? Number(props.dashBoardData.product).toLocaleString('vi-VN')
                  : 0}
              </span>
              <CIcon icon={cilCart} size="3xl" style={{ opacity: 0.85 }} />
            </div>
          }
          title={
            <span style={{ fontSize: 13.5, fontWeight: 600, opacity: 0.95 }}>Tổng sản phẩm</span>
          }
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>
                  <Link to={'/product'}>Xem chi tiết</Link>
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
        />
      </CCol>

      <CCol sm={6} xl={3} xxl={3}>
        <CWidgetStatsA
          className="widget-stat-card widget-stat-danger"
          style={{ paddingBottom: 16 }}
          color="danger"
          value={
            <div className="d-flex justify-content-between align-items-center">
              <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.5px' }}>
                {props?.dashBoardData?.member !== undefined && props?.dashBoardData?.member !== null
                  ? Number(props.dashBoardData.member).toLocaleString('vi-VN')
                  : 0}
              </span>
              <CIcon icon={cilUser} size="3xl" style={{ opacity: 0.85 }} />
            </div>
          }
          title={
            <span style={{ fontSize: 13.5, fontWeight: 600, opacity: 0.95 }}>Tổng thành viên</span>
          }
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>
                  <Link to={'/member'}>Xem chi tiết</Link>
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
        />
      </CCol>

      <CCol sm={6} xl={3} xxl={3}>
        <CWidgetStatsA
          className="widget-stat-card widget-stat-warning"
          style={{ paddingBottom: 16 }}
          color="warning"
          value={
            <div className="d-flex justify-content-between align-items-center">
              <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.5px' }}>
                {props?.dashBoardData?.statistics !== undefined &&
                props?.dashBoardData?.statistics !== null
                  ? Number(props.dashBoardData.statistics).toLocaleString('vi-VN')
                  : 0}
              </span>
              <CIcon icon={cilBarChart} size="3xl" style={{ opacity: 0.85 }} />
            </div>
          }
          title={
            <span style={{ fontSize: 13.5, fontWeight: 600, opacity: 0.95 }}>Lượt truy cập</span>
          }
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>
                  <Link to={'/access-statistics'}>Xem chi tiết</Link>
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
        />
      </CCol>
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
