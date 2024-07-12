import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { Link, useNavigate } from 'react-router-dom'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'

function Coupon() {
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

  const handleAddNewClick = () => {
    navigate('/coupon/add')
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

  const handleEditClick = (id) => {
    navigate(`/coupon/edit?id=${id}`)
  }

  const handleDelete = () => {}

  // const columns = [
  //   {
  //     key: 'id',
  //     label: '#',
  //     _props: { scope: 'col' },
  //   },
  //   {
  //     key: 'releaseCode',
  //     label: 'Mã đợt phát hành',
  //     _props: { scope: 'col' },
  //   },
  //   {
  //     key: 'release',
  //     label: 'Đợt phát hành',
  //     _props: { scope: 'col' },
  //   },
  //   {
  //     key: 'createAt',
  //     label: 'Ngày tạo',
  //     _props: { scope: 'col' },
  //   },
  //   {
  //     key: 'startDate',
  //     label: 'Ngày bắt đầu',
  //     _props: { scope: 'col' },
  //   },
  //   {
  //     key: 'expire',
  //     label: 'Hết hạn',
  //     _props: { scope: 'col' },
  //   },
  //   {
  //     key: 'sumOfCoupon',
  //     label: 'Tổng số ',
  //     _props: { scope: 'col' },
  //   },
  //   {
  //     key: 'used',
  //     label: 'Đã dùng',
  //     _props: { scope: 'col' },
  //   },
  //   {
  //     key: 'status',
  //     label: 'Trạng thái',
  //     _props: { scope: 'col' },
  //   },

  //   {
  //     key: 'actions',
  //     label: 'Tác vụ',
  //     _props: { scope: 'col' },
  //   },
  // ]

  // sorting columns
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
    { key: 'releaseCode', label: 'Mã đợt phát hành' },
    { key: 'release', label: 'Đợt phát hành' },
    { key: 'createAt', label: 'Ngày tạo' },
    { key: 'startDate', label: 'Ngày bắt đầu' },
    { key: 'expire', label: 'Hết hạn' },
    { key: 'sumOfCoupon', label: 'Tổng số ' },
    { key: 'used', label: 'Đã dùng' },
    { key: 'status', label: 'Trạng thái' },
    { key: 'actions', label: 'Tác vụ' },
  ]

  const items = [
    {
      id: <CFormCheck id="flexCheckDefault" />,
      releaseCode: '101022_tongdonhang_500K',
      release:
        'Tổng giá trị đơn hàng từ 5,000,000 đến dưới 10 triệu trong chương trình Mua tận gốc - ưu đãi tận nóc',
      createAt: '17:11, 10/10/2022',
      startDate: '17:08, 10/10/2022',
      expire: '17:08, 30/10/2022',
      sumOfCoupon: '1',
      used: '4',
      status: 'Ngừng phát hành',
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
    {
      id: <CFormCheck id="flexCheckDefault" />,
      releaseCode: '101023_tongdonhang_600K',
      release:
        'Tổng giá trị đơn hàng từ 5,000,000 đến dưới 10 triệu trong chương trình Mua tận gốc - ưu đãi tận nóc',
      createAt: '17:11, 11/10/2022',
      startDate: '17:08, 11/10/2022',
      expire: '17:08, 30/11/2022',
      sumOfCoupon: '1',
      used: '5',
      status: 'Đang phát hành',
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
          <h3>QUẢN LÝ COUPON</h3>
        </CCol>
        <CCol md={{ span: 4, offset: 4 }}>
          <div className="d-flex justify-content-end">
            <CButton
              onClick={handleAddNewClick}
              color="primary"
              type="submit"
              size="sm"
              className="button-add"
            >
              Thêm mới
            </CButton>
            <Link to={`/coupon`}>
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={12}>
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
                  <td>Tạo từ ngày</td>
                  <td>
                    <div>
                      <div className="d-flex align-items-center">
                        <DatePicker
                          dateFormat={'dd-MM-yyyy'}
                          showIcon
                          selected={startDate}
                          onChange={handleStartDateChange}
                        />
                        <p className="m-2">{'đến ngày'}</p>
                        <DatePicker
                          dateFormat={'dd-MM-yyyy'}
                          showIcon
                          selected={endDate}
                          onChange={handleEndDateChange}
                        />
                      </div>
                      {errors.startDate && <p className="text-danger">{errors.startDate}</p>}
                      {errors.endDate && <p className="text-danger">{errors.endDate}</p>}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Tìm kiếm</td>
                  <td>
                    <CFormSelect
                      className="component-size w-25"
                      aria-label="Chọn yêu cầu lọc"
                      options={[{ label: 'Mã đợt phát hàng', value: '1' }]}
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
        </CCol>

        <CCol className="my-2" md={12}>
          <CButton color="primary" size="sm">
            Xóa vĩnh viễn
          </CButton>
        </CCol>

        <CCol>
          {/* <CTable className="mt-2" columns={columns} items={items} /> */}

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
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Coupon
