import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import './css/member.scss'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'
import DeletedModal from '../../components/deletedModal/DeletedModal'

const fakeData = [
  {
    username: 'dntcamera',
    memberInfo: {
      fullName: 'Mr Nhựt',
      pointsAccumulated: 0,
      pointsUsed: 0,
    },
    orderStatus: 'Chưa có',
    registrationDate: '17:28, 18/05/2024',
    lastLogin: '00:29, 19/05/2024',
    accountStatus: 'Đang hoạt động',
  },
  {
    username: 'a123011',
    memberInfo: {
      fullName: 'wangfu wangfugui',
      pointsAccumulated: 0,
      pointsUsed: 0,
    },
    orderStatus: 'Chưa có',
    registrationDate: '01:39, 20/04/2024',
    lastLogin: '08:39, 20/04/2024',
    accountStatus: 'Đang hoạt động',
  },
]

function Member() {
  const navigate = useNavigate()
  const [isCollapse, setIsCollapse] = useState(false)
  // search input
  const [dataSearch, setDataSearch] = useState('')

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  // show deleted Modal
  const [visible, setVisible] = useState(false)

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  // pagination data
  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1
    if (newPage < 2) {
      setPageNumber(newPage)
      window.scrollTo(0, 0)
      return
    }
    window.scrollTo(0, 0)
    setPageNumber(newPage)
  }

  // search Data
  const handleSearch = (keyword) => {
    fetchDataById(keyword)
  }

  const handleEditClick = (id) => {
    navigate(`/member/edit?id=${id}`)
  }

  // delete row
  const handleDelete = (id) => {
    setVisible(true)
  }

  const [sortConfig, setSortConfig] = React.useState({ key: '', direction: 'ascending' })

  const handleSort = (columnKey) => {
    let direction = 'ascending'
    if (sortConfig.key === columnKey && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key: columnKey, direction })
  }

  const columns = [
    { key: 'id', label: '#' },
    { key: 'username', label: 'Username' },
    { key: 'customerInfo', label: 'Thông tin khách hàng' },
    { key: 'orderYet', label: 'Đơn hàng' },
    { key: 'createDate', label: 'Ngày đăng ký' },
    { key: 'login', label: 'Đăng nhập gần đây' },
    { key: 'status', label: 'Trạng thái tài khoản' },
    { key: 'actions', label: 'Tác vụ' },
  ]

  const items =
    fakeData &&
    fakeData.length > 0 &&
    fakeData.map((customer) => ({
      id: <CFormCheck id="flexCheckDefault" />,
      username: (
        <>
          <div className="customer-username">{customer.username}</div>
          <div className="customer-userid">{`#KH-2010`}</div>
        </>
      ),
      customerInfo: (
        <React.Fragment>
          <div>
            <span>Họ tên: </span>
            <span className="customer-name">{customer?.memberInfo.fullName}</span>
          </div>
          <div>
            <span>Điểm tích lũy: </span>
            <span className="customer-pointsAccumulated">
              {customer?.memberInfo.pointsAccumulated}
            </span>
          </div>
          <div>
            <span>Điểm đã sử dụng: </span>
            <span className="customer-pointsUsed">{customer?.memberInfo.pointsUsed}</span>
          </div>
        </React.Fragment>
      ),
      orderYet: <span className="customer-order">{customer.orderStatus}</span>,
      createDate: <span className="customer-registrationDate">{customer?.registrationDate}</span>,
      login: customer?.lastLogin,
      status: <span className="customer-status">{`[${customer?.accountStatus}]`}</span>,
      actions: (
        <div>
          <button onClick={() => handleEditClick(1)} className="button-action mr-2 bg-info">
            <CIcon icon={cilColorBorder} className="text-white" />
          </button>
          <button onClick={() => handleDelete(1)} className="button-action bg-danger">
            <CIcon icon={cilTrash} className="text-white" />
          </button>
        </div>
      ),
      _cellProps: { id: { scope: 'row' } },
    }))

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items]
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [items, sortConfig])

  return (
    <CContainer>
      <DeletedModal visible={visible} setVisible={setVisible} />

      <CRow className="mb-3">
        <CCol>
          <h3>QUẢN LÝ THÀNH VIÊN</h3>
        </CCol>
        <CCol md={{ span: 4, offset: 4 }}>
          <div className="d-flex justify-content-end">
            <Link to={`/member`}>
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <table className="filter-table">
          <thead>
            <tr>
              <th colSpan="2">
                <div className="d-flex justify-content-between">
                  <span>Bộ lọc tìm kiếm</span>
                  <span className="toggle-pointer" onClick={handleToggleCollapse}>
                    {isCollapse ? '▼' : '▲'}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          {!isCollapse && (
            <tbody>
              <tr>
                <td>Tổng cộng</td>
                <td className="total-count">6</td>
              </tr>
              <tr>
                <td>Tìm kiếm</td>
                <td>
                  <div className="mt-2">
                    <input
                      type="text"
                      className="search-input"
                      value={dataSearch}
                      onChange={(e) => setDataSearch(e.target.value)}
                    />
                    <button onClick={handleSearch} className="submit-btn">
                      Submit
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </CRow>

      <CRow className="mt-3">
        <CTable>
          <thead>
            <tr>
              {columns.map((column) => (
                <CTableHeaderCell
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className="prevent-select"
                >
                  {column.label}
                  {sortConfig.key === column.key
                    ? sortConfig.direction === 'ascending'
                      ? ' ▼'
                      : ' ▲'
                    : ''}
                </CTableHeaderCell>
              ))}
            </tr>
          </thead>
          <CTableBody>
            {sortedItems.map((item, index) => (
              <CTableRow key={index}>
                {columns.map((column) => (
                  <CTableDataCell key={column.key}>{item[column.key]}</CTableDataCell>
                ))}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CRow>
    </CContainer>
  )
}

export default Member
