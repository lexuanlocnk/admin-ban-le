import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CRow,
  CTable,
} from '@coreui/react'
// import './css/adminLog.css'

function AdminLog() {
  const [isCollapse, setIsCollapse] = useState(false)

  // date picker
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  const columns = [
    {
      key: 'id',
      label: '#',
      _props: { scope: 'col' },
    },
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
      key: 'time',
      label: 'Time',
      _props: { scope: 'col' },
    },
  ]

  const items = [
    {
      id: <CFormCheck id="flexCheckDefault" />,
      username: 'quocnguyen',
      page: 'Product',
      actions: 'Add',
      nameID: 'quocnguyen',
      time: '14:35:30, 18/06/2024',
      _cellProps: { id: { scope: 'row' } },
    },
  ]

  return (
    <CContainer>
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
                  <CFormSelect
                    className="component-size w-25"
                    aria-label="Chọn yêu cầu lọc"
                    options={[
                      'Tất cả các username',
                      { label: 'quocnguyen', value: '1' },
                      { label: 'an', value: '2' },
                      { label: 'long', value: '3' },
                    ]}
                  />
                </td>
              </tr>

              <tr>
                <td>Theo ngày</td>
                <td>
                  <div className="d-flex align-items-center">
                    <DatePicker
                      showIcon
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                    <p className="m-2">{'đến ngày'}</p>
                    <DatePicker showIcon selected={endDate} onChange={(date) => setEndDate(date)} />
                  </div>
                </td>
              </tr>
              <tr>
                <td>Tìm kiếm</td>
                <td>
                  <CFormSelect
                    className="component-size w-25"
                    aria-label="Chọn yêu cầu lọc"
                    options={[
                      'Pages',
                      { label: 'product', value: '1' },
                      { label: 'order', value: '2' },
                    ]}
                  />
                  <div className="mt-2">
                    <input type="text" className="search-input" />
                    <button className="submit-btn">Submit</button>
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </CRow>

      <CRow>
        <CCol className="my-2" md={4}>
          <CButton color="primary" size="sm">
            Xóa vĩnh viễn
          </CButton>
        </CCol>
      </CRow>

      <CRow>
        <CTable className="mt-2" columns={columns} items={items} />
        <CPagination align="end" aria-label="Page navigation example" size="sm">
          <CPaginationItem aria-label="Previous" disabled>
            <span aria-hidden="true">&laquo;</span>
          </CPaginationItem>
          <CPaginationItem active>1</CPaginationItem>
          <CPaginationItem>2</CPaginationItem>
          <CPaginationItem>3</CPaginationItem>
          <CPaginationItem aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </CPaginationItem>
        </CPagination>
      </CRow>
    </CContainer>
  )
}

export default AdminLog
