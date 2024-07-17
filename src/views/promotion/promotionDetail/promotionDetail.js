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
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { Link, useNavigate } from 'react-router-dom'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'

import axios from 'axios'
import moment from 'moment/moment'
import DeletedModal from '../../../components/deletedModal/DeletedModal'

function PromotionDetail() {
  const navigate = useNavigate()
  const [isCollapse, setIsCollapse] = useState(false)

  const [dataGiftPromotion, setDataGiftPromotion] = useState([])
  const [countGiftPromotion, setCountGiftPromotion] = useState(null)

  const [selectedCheckbox, setSelectedCheckbox] = useState([])

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

  const handleAddNewClick = () => {
    navigate('/promotion-detail/add')
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

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axios.delete(
        `http://192.168.245.190:8000/api/gift-promotion/${deletedId}`,
      )
      if (response.data.status === true) {
        setVisible(false)
        fetchGiftPromotion()
      }
    } catch (error) {
      console.error('Delete status order is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  // search Data
  const handleSearch = (keyword) => {
    fetchDataById(keyword)
  }

  const handleEditClick = (id) => {
    navigate(`/promotion-detail/edit?id=${id}`)
  }

  // sorting columns
  const [sortConfig, setSortConfig] = React.useState({ key: '', direction: 'ascending' })

  const handleSort = (columnKey) => {
    let direction = 'ascending'
    if (sortConfig.key === columnKey && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key: columnKey, direction })
  }

  const fetchGiftPromotion = async () => {
    try {
      const response = await axios.get(
        `http://192.168.245.190:8000/api/gift-promotion?data=${dataSearch}&StartDate=${startDate}&EndDate=${endDate}`,
      )
      if (response.data.status === true) {
        setDataGiftPromotion(response.data.data)
        setCountGiftPromotion(response.data.data.length)
      }
    } catch (error) {
      console.error('Fetch coupon data is error', error)
    }
  }

  useEffect(() => {
    fetchGiftPromotion()
  }, [dataSearch, startDate, endDate])

  const columns = [
    { key: 'id', label: '#' },
    { key: 'releaseCode', label: 'Mã đợt phát hành' },
    { key: 'name', label: 'Đợt phát hành' },
    { key: 'rangePrice', label: 'Phân khúc giá' },
    { key: 'giftType', label: 'Áp dụng' },
    { key: 'startDate', label: 'Ngày bắt đầu' },
    { key: 'expire', label: 'Hết hạn' },
    { key: 'actions', label: 'Tác vụ' },
  ]

  const items = dataGiftPromotion?.map((item) => ({
    id: <CFormCheck id="flexCheckDefault" />,
    releaseCode: <span className="blue-txt">{item.code}</span>,
    name: item.title,
    rangePrice: `${Number(item.priceMin).toLocaleString('vi-VN')}đ - ${Number(item.priceMax).toLocaleString('vi-VN')}đ`,

    giftType: item.type === 0 ? 'Áp dụng cho nghành hàng' : 'Áp dụng cho Mã SP chỉ định',
    startDate: moment.unix(Number(item.StartDate)).format('DD-MM-YYYY'),
    expire: moment.unix(Number(item.EndDate)).format('DD-MM-YYYY'),
    actions: (
      <div>
        <button onClick={() => handleEditClick(item.id)} className="button-action mr-2 bg-info">
          <CIcon icon={cilColorBorder} className="text-white" />
        </button>

        <button
          onClick={() => {
            setVisible(true)
            setDeletedId(item.id)
          }}
          className="button-action bg-danger"
        >
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
      <DeletedModal visible={visible} setVisible={setVisible} onDelete={handleDelete} />
      <CRow className="mb-3">
        <CCol>
          <h3>QUẢN LÝ KHUYẾN MÃI</h3>
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
            <Link to={`/promotion-detail`}>
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
                  <td className="total-count">{countGiftPromotion}</td>
                </tr>

                <tr>
                  <td>Tạo từ ngày</td>
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
                      options={[{ label: 'Mã đợt phát hành', value: '1' }]}
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

        <CCol>
          <CTable hover className="mt-3 border">
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

export default PromotionDetail
