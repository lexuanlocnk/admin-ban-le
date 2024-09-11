import React, { useEffect, useState } from 'react'

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
import axios from 'axios'
import moment from 'moment'
import ReactPaginate from 'react-paginate'
import { axiosClient } from '../../../axiosConfig'

function OrderList() {
  const navigate = useNavigate()
  const [isCollapse, setIsCollapse] = useState(false)

  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  const [dataOrderList, setDataOrderList] = useState([])
  const [dataStatus, setDataStatus] = useState([])

  const [choosenStatus, setChoosenStatus] = useState('')
  const [typeMember, setTypeMember] = useState('')

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // search input
  const [dataSearch, setDataSearch] = useState('')

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  // date picker
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
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

  // delete row
  const handleDelete = (id) => {
    setVisible(true)
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

  const fetchDataStatusOrder = async () => {
    try {
      const response = await axiosClient.get(`admin/order-status`)
      if (response.data.status === true) {
        const orderStatus = response.data.orderStatus.data
        setDataStatus(orderStatus)
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch data order status is error', error)
    }
  }

  useEffect(() => {
    fetchDataStatusOrder()
  }, [])

  const convertStringToTimeStamp = (dateString) => {
    if (dateString == '') {
      return ''
    } else {
      const dateMoment = moment(dateString, 'ddd MMM DD YYYY HH:mm:ss GMTZ')
      return dateMoment.unix()
    }
  }

  const fetchOrderListData = async () => {
    try {
      const response = await axiosClient.get(
        `admin/order?name=${dataSearch}&status=${choosenStatus}&typeMember=${typeMember}&fromDate=${convertStringToTimeStamp(startDate)}&toDate=${convertStringToTimeStamp(endDate)}&page=${pageNumber}`,
      )

      const orderData = response.data.data
      if (response.data.status === true) {
        setDataOrderList(orderData)
      }
    } catch (error) {
      console.error('Fetch order data is error', error)
    }
  }

  useEffect(() => {
    fetchOrderListData()
  }, [pageNumber, dataSearch, choosenStatus, typeMember, startDate, endDate])

  // search Data
  const handleSearch = (keyword) => {
    fetchOrderListData(keyword)
  }

  const [sortConfig, setSortConfig] = React.useState({ key: '', direction: 'ascending' })

  const handleSort = (columnKey) => {
    let direction = 'ascending'
    if (sortConfig.key === columnKey && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key: columnKey, direction })
  }

  const handleDeleteAll = async () => {
    console.log('>>> check undeal', selectedCheckbox)
    alert('Chức năng đang thực hiện...')
    // try {
    //   const response = await axiosClient.post(`admin/delete `, {
    //     data: selectedCheckbox,
    //   })

    //   if (response.data.status === true) {
    //     toast.success('Xóa tất cả thành công!')
    //     fetch
    //     setSelectedCheckbox([])
    //   }

    //   if (response.data.status === false && response.data.mess == 'no permission') {
    //     toast.warn('Bạn không có quyền thực hiện tác vụ này!')
    //   }
    // } catch (error) {
    //   toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    // }
  }

  const columns = [
    {
      key: 'id',
      label: (
        <CFormCheck
          aria-label="Select all"
          checked={isAllCheckbox}
          onChange={(e) => {
            const isChecked = e.target.checked
            setIsAllCheckbox(isChecked)
            if (isChecked) {
              const allIds = dataOrderList?.data.map((item) => item.order_id) || []
              setSelectedCheckbox(allIds)
            } else {
              setSelectedCheckbox([])
            }
          }}
        />
      ),
    },
    { key: 'orderCode', label: 'Mã đơn hàng' },
    { key: 'customerInfo', label: 'Thông tin khách hàng' },
    { key: 'orderDate', label: 'Ngày đặt hàng' },
    { key: 'total', label: 'Tổng tiền' },
    { key: 'status', label: 'Trạng thái' },
    { key: 'actions', label: 'Tác vụ' },
  ]

  const items =
    dataOrderList?.data && dataOrderList?.data.length > 0
      ? dataOrderList?.data.map((order) => ({
          id: (
            <CFormCheck
              id={order.order_id}
              checked={selectedCheckbox.includes(order.order_id)}
              value={order.order_id}
              onChange={(e) => {
                const orderId = order.order_id
                const isChecked = e.target.checked
                if (isChecked) {
                  setSelectedCheckbox([...selectedCheckbox, orderId])
                } else {
                  setSelectedCheckbox(selectedCheckbox.filter((id) => id !== orderId))
                }
              }}
            />
          ),
          orderCode: <span className="order-code">{order.order_code}</span>,
          customerInfo: (
            <React.Fragment>
              <div>
                <span>Họ tên: </span>
                <span className="customer-name">
                  {order.member === null ? order.d_name : order.member?.full_name}
                </span>
                <span className="customer-type">
                  {order.mem_id === 0 ? '(Khách vãng lai)' : '(Thành viên)'}
                </span>
              </div>
              <div>
                <span>Điện thoại: </span>
                <span className="customer-phone">{order.d_phone}</span>
              </div>
              <div>
                <span>Email: </span>
                <span className="customer-email">{order.d_email}</span>
              </div>
            </React.Fragment>
          ),
          orderDate: moment.unix(Number(order.date_order)).format('hh:mm:ss A, DD-MM-YYYY'),
          total: <span className="total">{Number(order.total_cart).toLocaleString('vi-VN')}đ</span>,
          status: <span style={{ fontWeight: 600 }}>{order?.order_status.title}</span>,
          actions: (
            <div>
              <button
                onClick={() => handleEditClick(order.order_id)}
                className="button-action mr-2 bg-info"
              >
                <CIcon icon={cilColorBorder} className="text-white" />
              </button>
              <button
                onClick={() => {
                  setVisible(true)
                  setDeletedId(order.order_id)
                }}
                className="button-action bg-danger"
              >
                <CIcon icon={cilTrash} className="text-white" />
              </button>
            </div>
          ),
          _cellProps: { id: { scope: 'row' } },
        }))
      : []

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
                            { label: 'Chọn trạng thái', value: '' },
                            ...(dataStatus && dataStatus.length > 0
                              ? dataStatus.map((status) => ({
                                  label: status.title,
                                  value: status.status_id,
                                }))
                              : []),
                          ]}
                          value={choosenStatus}
                          onChange={(e) => setChoosenStatus(e.target.value)}
                        />
                        <CFormSelect
                          className="component-size w-25 ms-2"
                          aria-label="Chọn yêu cầu lọc"
                          options={[
                            'Loại khách hàng ',
                            { label: 'Thành viên (Member)', value: 1 },
                            { label: 'Khách vãng lai (Guest)', value: 0 },
                          ]}
                          value={typeMember}
                          onChange={(e) => setTypeMember(e.target.value)}
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
                      <strong>
                        <em>
                          Tìm kiếm theo Mã đơn hàng, ID Thành viên, Họ Tên Khách Hàng, Số Điện Thoại
                        </em>
                      </strong>
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
            <CCol md={12} className="mt-3">
              <CButton onClick={handleDeleteAll} color="primary" size="sm">
                Xóa vĩnh viễn
              </CButton>
            </CCol>
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
            <div className="d-flex justify-content-end">
              <ReactPaginate
                pageCount={Math.ceil(dataOrderList?.total / dataOrderList?.per_page)}
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
              />
            </div>
          </CRow>
        </>
      )}
    </CContainer>
  )
}

export default OrderList
