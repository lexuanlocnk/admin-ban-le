import React, { useEffect, useState } from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormCheck,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from '../../assets/images/avatars/1.jpg'
import avatar2 from '../../assets/images/avatars/2.jpg'
import avatar3 from '../../assets/images/avatars/3.jpg'
import avatar4 from '../../assets/images/avatars/4.jpg'
import avatar5 from '../../assets/images/avatars/5.jpg'
import avatar6 from '../../assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import { axiosClient } from '../../axiosConfig'
import moment from 'moment'

import './css/dashboard.css'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [adminLogData, setAdminLogData] = useState([])

  const [timePeriod, setTimePeriod] = useState('Tuần')

  const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'India', flag: cifIn },
      usage: {
        value: 74,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibCcStripe },
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'France', flag: cifFr },
      usage: {
        value: 98,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Spain', flag: cifEs },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Poland', flag: cifPl },
      usage: {
        value: 43,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibCcAmex },
      activity: 'Last week',
    },
  ]

  const fetchAdminLogData = async () => {
    try {
      const response = await axiosClient.get(`/admin-log`)

      if (response.data.status === true) {
        setAdminLogData(response.data.listLog)
      }
    } catch (error) {
      console.error('Fetch admin log data is error', error)
    }
  }

  useEffect(() => {
    fetchAdminLogData()
  }, [])

  const columnsVisited = [
    {
      key: 'index',
      label: 'Thứ tự',
      _props: { scope: 'col' },
    },
    {
      key: 'visited',
      label: 'Lượt truy cập',
      _props: { scope: 'col' },
    },
    {
      key: 'username',
      label: 'Name',
      _props: { scope: 'col' },
    },
    {
      key: 'url',
      label: 'Link truy cập',
      _props: { scope: 'col' },
    },

    {
      key: 'ip',
      label: 'IP Address',
      _props: { scope: 'col' },
    },
  ]

  const itemsVisited = [
    {
      index: '1',
      visited: '189',
      username: 'Rồng Thần',
      url: (
        <Link to={'https://chinhnhan.vn/san-pham'}>Màn hình HP S5 524SF 94C18AA 23.8inch FHD</Link>
      ),
      ip: '192.168.245.134',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      index: '2',
      visited: '189',
      username: 'Rồng Thần',
      url: (
        <Link to={'https://chinhnhan.vn/san-pham'}>Màn hình HP S5 524SF 94C18AA 23.8inch FHD</Link>
      ),
      ip: '192.168.245.134',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      index: '3',
      visited: '189',
      username: 'Rồng Thần',
      url: (
        <Link to={'https://chinhnhan.vn/san-pham'}>Màn hình HP S5 524SF 94C18AA 23.8inch FHD</Link>
      ),
      ip: '192.168.245.134',
      _cellProps: { id: { scope: 'row' } },
    },
    {
      index: '4',
      visited: '189',
      username: 'Rồng Thần',
      url: (
        <Link to={'https://chinhnhan.vn/san-pham'}>Màn hình HP S5 524SF 94C18AA 23.8inch FHD</Link>
      ),
      ip: '192.168.245.134',
      _cellProps: { id: { scope: 'row' } },
    },
  ]

  const columns = [
    {
      key: 'username',
      label: 'Username',
      _props: { scope: 'col' },
    },
    {
      key: 'page',
      label: 'Page',
      _props: { scope: 'col' },
    },
    {
      key: 'actions',
      label: 'Action',
      _props: { scope: 'col' },
    },
    {
      key: 'nameID',
      label: 'Name/ID',
      _props: { scope: 'col' },
    },

    {
      key: 'ip',
      label: 'IP Address',
      _props: { scope: 'col' },
    },
  ]

  const items =
    adminLogData?.data && adminLogData?.data.length > 0
      ? adminLogData?.data.map((log) => ({
          username: log?.username,
          page: log?.cat,
          actions: log?.action,
          nameID: log?.display_name,
          ip: log?.ip,
          _cellProps: { id: { scope: 'row' } },
        }))
      : []

  const getDateRange = (period) => {
    const today = moment()
    let startDate

    if (period === 'Tuần') {
      startDate = today.clone().startOf('week') // Bắt đầu của tuần hiện tại
    } else if (period === 'Tháng') {
      startDate = today.clone().startOf('month') // Bắt đầu của tháng hiện tại
    } else if (period === 'Năm') {
      startDate = today.clone().startOf('year') // Bắt đầu của năm hiện tại
    }

    return `${moment(startDate).format('DD/MM/YYYY')} - ${moment(today).format('DD/MM/YYYY')}`
  }

  const dateRange = getDateRange(timePeriod)

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h5 id="traffic" className="card-title mb-0">
                Thống kê lượt truy cập
              </h5>
              <div className="small text-body-secondary">{dateRange}</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end" size="sm">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Tuần', 'Tháng', 'Năm'].map((value) => (
                  <CButton
                    size="sm"
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === timePeriod}
                    onClick={() => setTimePeriod(value)}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <MainChart timePeriod={timePeriod} />
        </CCardBody>
        {/* <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  'd-none d-xl-block': index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} ({item.percent}%)
                </div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter> */}
      </CCard>
      {/* <WidgetsBrand className="mb-4" withCharts /> */}
      {/* <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Traffic {' & '} Sales</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <div className="text-body-secondary text-truncate small">New Clients</div>
                        <div className="fs-5 fw-semibold">9,123</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Recurring Clients
                        </div>
                        <div className="fs-5 fw-semibold">22,643</div>
                      </div>
                    </CCol>
                  </CRow>
                  <hr className="mt-0" />
                  {progressGroupExample1.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-prepend">
                        <span className="text-body-secondary small">{item.title}</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="info" value={item.value1} />
                        <CProgress thin color="danger" value={item.value2} />
                      </div>
                    </div>
                  ))}
                </CCol>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Pageviews</div>
                        <div className="fs-5 fw-semibold">78,623</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Organic</div>
                        <div className="fs-5 fw-semibold">49,123</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                  {progressGroupExample2.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">{item.value}%</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="warning" value={item.value} />
                      </div>
                    </div>
                  ))}

                  <div className="mb-5"></div>

                  {progressGroupExample3.map((item, index) => (
                    <div className="progress-group" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">
                          {item.value}{' '}
                          <span className="text-body-secondary small">({item.percent}%)</span>
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="success" value={item.percent} />
                      </div>
                    </div>
                  ))}
                </CCol>
              </CRow>

              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Country
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Usage</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Payment Method
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-body-secondary text-nowrap">
                          <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                          {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-between text-nowrap">
                          <div className="fw-semibold">{item.usage.value}%</div>
                          <div className="ms-3">
                            <small className="text-body-secondary">{item.usage.period}</small>
                          </div>
                        </div>
                        <CProgress thin color={item.usage.color} value={item.usage.value} />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.payment.icon} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Last login</div>
                        <div className="fw-semibold text-nowrap">{item.activity}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> */}

      <CRow>
        <h6>Khách hàng có lượt truy cập nhiều nhất</h6>
        <CCol>
          <CTable
            bordered
            style={{ fontSize: 14 }}
            className="mt-2 mb-4"
            columns={columnsVisited}
            items={itemsVisited}
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol md={8}>
          <h6 style={{ fontWeight: 'bold' }}>Lịch sử hoạt động admin</h6>
          <CTable style={{ fontSize: 13 }} className="mt-2" columns={columns} items={items} />
        </CCol>
        <CCol md={4} className="mb-4">
          <div className="system-info">
            <h6 style={{ fontWeight: 'bold' }}>Thông tin hệ thống</h6>
            <ul>
              <li>
                <span role="img" aria-label="icon">
                  📄
                </span>
                <strong>PHP Version</strong>: 7.1.33
              </li>
              <li>
                <span role="img" aria-label="icon">
                  📄
                </span>
                <strong>MySQL Version</strong>: 5.5.5-10.3.34-MariaDB
              </li>
              <li>
                <span role="img" aria-label="icon">
                  📄
                </span>
                <strong>Server Software</strong>: LiteSpeed
              </li>
              <li>
                <span role="img" aria-label="icon">
                  📄
                </span>
                <strong>Client Browser</strong>: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
                AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36
              </li>
              <li>
                <span role="img" aria-label="icon">
                  📄
                </span>
                <strong>IP Address</strong>: 115.79.38.83
              </li>
              <li>
                <span role="img" aria-label="icon">
                  📄
                </span>
                <strong>Version</strong>: 3.1.9
              </li>
            </ul>
          </div>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
