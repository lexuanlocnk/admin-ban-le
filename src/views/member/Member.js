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
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import './css/member.scss'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'
import DeletedModal from '../../components/deletedModal/DeletedModal'
import { axiosClient } from '../../axiosConfig'
import moment from 'moment/moment'

function Member() {
  const navigate = useNavigate()

  const [memberData, setMemberData] = useState([])

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

  const fetchMemberData = async (dataSearch = '') => {
    try {
      const response = await axiosClient.get(`admin/member?data=${dataSearch}`)

      if (response.data.status === true) {
        setMemberData(response.data.data)
      }
    } catch (error) {
      console.error('Fetch member data is error', error)
    }
  }

  useEffect(() => {
    fetchMemberData()
  }, [])

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
    fetchMemberData(keyword)
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
    memberData && memberData?.length > 0
      ? memberData?.map((customer) => ({
          id: <CFormCheck id="flexCheckDefault" />,
          username: (
            <>
              <div className="customer-username">{customer?.username}</div>
              {/* <div className="customer-userid">{`#KH-${customer.id}`}</div> */}
            </>
          ),
          customerInfo: (
            <React.Fragment>
              <div>
                <span>Họ tên: </span>
                <span className="customer-name">{customer?.full_name}</span>
              </div>
              <div>
                <span>Điểm tích lũy: </span>
                <span className="customer-pointsUsed">{customer?.orderPoints}</span>
              </div>
              <div>
                <span>Điểm đã sử dụng: </span>
                <span className="customer-pointsAccumulated">
                  {customer?.accumulatedPoints === null ? 0 : customer?.accumulatedPoints}
                </span>
              </div>
            </React.Fragment>
          ),
          orderYet: (
            <span className="customer-order">
              {customer.order_sum > 0 ? 'Đã từng đặt' : 'Chưa có đơn'}
            </span>
          ),
          createDate: (
            <span className="customer-registrationDate">
              {moment(customer?.created_at).format('DD-MM-YYYY, hh:mm:ss A')}
            </span>
          ),
          login: customer?.lastLogin,
          status: <span className="customer-status">{`[Đang hoạt động]`}</span>,
          actions: (
            <div style={{ width: 60 }}>
              <button
                onClick={() => handleEditClick(customer?.id)}
                className="button-action mr-2 bg-info"
              >
                <CIcon icon={cilColorBorder} className="text-white" />
              </button>
              {/* <button onClick={() => handleDelete(1)} className="button-action bg-danger">
                <CIcon icon={cilTrash} className="text-white" />
              </button> */}
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
                    <button onClick={() => handleSearch(dataSearch)} className="submit-btn">
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
