import React, { useState } from 'react'

import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormSelect,
  CImage,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import DatePicker from 'react-datepicker'
import { Link, useNavigate } from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'

import '../css/orderList.scss'

function OrderList() {
  const navigate = useNavigate()
  const [isCollapse, setIsCollapse] = useState(false)

  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  // search input
  const [dataSearch, setDataSearch] = useState('')

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  // date picker
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [errors, setErrors] = useState({ startDate: '', endDate: '' })

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  const handleEditClick = (id) => {
    navigate(`/order/edit?id=${id}`)
  }

  const handleUpdateClick = (id) => {
    navigate(`/order/edit?id=${id}`)
  }

  // validate for date start - date end
  const validateDates = (start, end) => {
    const newErrors = { startDate: '', endDate: '' }
    if (start && end && start > end) {
      newErrors.startDate = 'Ngày bắt đầu không được sau ngày kết thúc'
      newErrors.endDate = 'Ngày kết thúc không được trước ngày bắt đầu'
    }
    setErrors(newErrors)
  }

  const handleStartDateChange = (date) => {
    setStartDate(date)
    validateDates(date, endDate)
  }

  const handleEndDateChange = (date) => {
    setEndDate(date)
    validateDates(startDate, date)
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
    { key: 'orderCode', label: 'Mã đơn hàng' },
    { key: 'customerInfo', label: 'Thông tin khách hàng' },
    { key: 'orderDate', label: 'Ngày đặt hàng' },
    { key: 'total', label: 'Tổng tiền' },
    { key: 'status', label: 'Trạng thái' },
    { key: 'actions', label: 'Tác vụ' },
  ]

  const items = [
    {
      id: <CFormCheck id="flexCheckDefault" />,
      orderCode: <span className="order-code">1348-20240704</span>,
      customerInfo: (
        <React.Fragment>
          <div>
            <span>Họ tên: </span>
            <span className="customer-name">Ngọc </span>
            <span className="customer-type">(Khách vãng lai)</span>
          </div>
          <div>
            <span>Điện thoại: </span>
            <span className="customer-phone">0843332929 </span>
          </div>
          <div>
            <span>Email: </span>
            <span className="customer-email">nhquoc99@gmail.com </span>
          </div>
        </React.Fragment>
      ),
      orderDate: '23:36, 04/07/2024',
      total: <span className="total">1.407.000đ</span>,
      status: 'Đang chờ xử lý',
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
    },
  ]

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
      <CRow className="mb-3">
        <CCol>
          <h3>QUẢN LÝ ĐƠN HÀNG</h3>
        </CCol>
        <CCol md={{ span: 4, offset: 4 }}>
          <div className="d-flex justify-content-end">
            <Link to={`/order`}>
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
                <td>Lọc</td>
                <td>
                  <div className="d-flex">
                    <CFormSelect
                      className="component-size w-25"
                      aria-label="Chọn yêu cầu lọc"
                      options={[
                        'Chọn trạng thái',
                        { label: 'Đang chờ xử lý', value: 'pending' },
                        { label: 'Chờ khách phản hồi', value: 'customer-response' },
                        { label: 'Đã thanh toán', value: 'paid' },
                        { label: 'Đã giao hàng', value: 'delivered' },
                        { label: 'Đã hoàn tất', value: 'finished' },
                        { label: 'Không thành công', value: 'fail' },
                        { label: 'Khách hàng hủy bỏ', value: 'customer-cancels' },
                      ]}
                    />
                    <CFormSelect
                      className="component-size w-25 ms-2"
                      aria-label="Chọn yêu cầu lọc"
                      options={[
                        'Loại khách hàng ',
                        { label: 'Thành viên (Member)', value: 'member' },
                        { label: 'Khách vãng lai (Guest)', value: 'guest' },
                      ]}
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <td>Theo ngày</td>
                <td>
                  <div className="custom-datepicker-wrapper">
                    <DatePicker
                      className="custom-datepicker"
                      showIcon
                      dateFormat={'dd-MM-yyyy'}
                      selected={startDate}
                      onChange={handleStartDateChange}
                    />
                    <p className="datepicker-label">{'đến ngày'}</p>
                    <DatePicker
                      className="custom-datepicker"
                      showIcon
                      dateFormat={'dd-MM-yyyy'}
                      selected={endDate}
                      onChange={handleEndDateChange}
                    />
                  </div>
                  {errors.startDate && <p className="text-danger">{errors.startDate}</p>}
                  {errors.endDate && <p className="text-danger">{errors.endDate}</p>}
                </td>
              </tr>
              <tr>
                <td>Tìm kiếm</td>
                <td>
                  <CFormSelect
                    className="component-size w-25"
                    aria-label="Chọn yêu cầu lọc"
                    options={[
                      { label: 'Mã đơn hàng', value: '1' },
                      { label: 'ID Thành viên', value: '2' },
                      { label: 'Họ tên Khách hàng', value: '3' },
                      { label: 'Số điện thoại', value: '4' },
                    ]}
                  />
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

export default OrderList
