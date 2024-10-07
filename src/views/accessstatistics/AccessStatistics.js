import React, { useEffect, useState } from 'react'
import { CButton, CCol, CContainer, CRow, CTable } from '@coreui/react'
import ReactPaginate from 'react-paginate'
import { axiosClient } from '../../axiosConfig'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

function AccessStatistics() {
  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)
  const [visitedData, setVisitedData] = useState([])

  const [isCollapse, setIsCollapse] = useState(false)

  // search input
  const [dataSearch, setDataSearch] = useState('')

  // date picker
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [errors, setErrors] = useState({ startDate: '', endDate: '' })

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  // search Data
  const handleSearch = (keyword) => {
    // fetchDataById(keyword)
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

  const convertStringToTimeStamp = (dateString) => {
    if (dateString == '') {
      return ''
    } else {
      const dateMoment = moment(dateString, 'ddd MMM DD YYYY HH:mm:ss GMTZ')
      return dateMoment.unix()
    }
  }

  const fetchStatictical = async () => {
    try {
      const response = await axiosClient.get(
        `admin/get-statistics?page=${pageNumber}&fromDate=${startDate !== null ? convertStringToTimeStamp(startDate) : ''}&toDate=${endDate !== null ? convertStringToTimeStamp(endDate) : ''}`,
      )

      if (response.data.status === true) {
        setVisitedData(response.data.data)
      }
      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch statictical data is error', error)
    }
  }

  useEffect(() => {
    fetchStatictical()
  }, [pageNumber, startDate, endDate])

  const downloadForm = async () => {
    // if (!startDate || !endDate) {
    //   alert('Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc trước khi xuất Excel.')
    //   return
    // }

    try {
      const response = await axiosClient({
        url: `/member/export-statistics-excel?fromDate=${convertStringToTimeStamp(startDate)}&endDate=${convertStringToTimeStamp(endDate)}`,
        method: 'GET',
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Thong_ke_truy_cap.xlsx`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error:', error)
    }
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

  const items =
    visitedData?.data && visitedData?.data.length > 0
      ? visitedData?.data.map((item, index) => ({
          index: index + 1,
          visited: item?.count,
          mem_id: item?.mem_id === 0 ? 'Khách vãng lai' : item?.member?.username,
          ip: item?.ip,
          url: item?.url,
          module: item?.module,
          action: item?.action,
          _cellProps: { id: { scope: 'row' } },
        }))
      : []

  const columns = [
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
      key: 'mem_id',
      label: 'Name',
      _props: { scope: 'col' },
    },
    {
      key: 'ip',
      label: 'IP',
      _props: { scope: 'col' },
    },
    {
      key: 'url',
      label: 'Link truy cập',
      _props: { scope: 'col' },
    },
    {
      key: 'module',
      label: 'Module',
      _props: { scope: 'col' },
    },

    {
      key: 'action',
      label: 'Action',
      _props: { scope: 'col' },
    },
  ]

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
        <CRow>
          <h2>THỐNG KÊ TRUY CẬP</h2>
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
                    <td className="total-count">{6}</td>
                  </tr>

                  <tr>
                    <td>Lọc từ ngày</td>
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
                </tbody>
              )}
            </table>
          </CCol>

          <CCol md={12} className="mt-2">
            <CButton size="sm" color="primary" onClick={downloadForm}>
              Xuất dữ liệu excel
            </CButton>
          </CCol>

          <CCol>
            <CTable
              hover
              bordered
              style={{ fontSize: 13.6 }}
              className="mt-2 mb-4"
              columns={columns}
              items={items}
            />

            <CCol>
              <div className="d-flex justify-content-end">
                <ReactPaginate
                  pageCount={Math.ceil(visitedData?.total / visitedData?.per_page)}
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
            </CCol>
          </CCol>
        </CRow>
      )}
    </CContainer>
  )
}

export default AccessStatistics
