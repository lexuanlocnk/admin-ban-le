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
import { cilArrowBottom, cilArrowTop, cilMoney, cilOptions } from '@coreui/icons'
import { Link } from 'react-router-dom'

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
          style={{ paddingBottom: 16 }}
          color="primary"
          value={
            <div className="d-flex justify-content-between align-items-center">
              <span>26K </span>
            </div>
          }
          title="Tổng đơn hàng"
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
          style={{ paddingBottom: 16 }}
          color="info"
          value={<>$6.200 </>}
          title="Tổng sản phẩm"
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
          style={{ paddingBottom: 16 }}
          color="warning"
          value={<>2.49% </>}
          title="Lượt truy cập"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>
                  <Link to={'/'}>Xem chi tiết</Link>
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
        />
      </CCol>
      <CCol sm={6} xl={3} xxl={3}>
        <CWidgetStatsA
          style={{ paddingBottom: 16 }}
          color="danger"
          value={<>44K</>}
          title="Tổng thành viên"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>
                  <Link to={'/'}>Xem chi tiết</Link>
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
