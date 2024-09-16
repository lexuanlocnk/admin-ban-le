import React from 'react'
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CContainer,
  CRow,
  CCol,
} from '@coreui/react'

const dummyData = [
  {
    table: 'about',
    row: 8,
    dataSize: '284 Bytes',
    indexSize: '2 KB',
    maxDataSize: '268435456 MB',
    dataFree: '0 Bytes',
    createTime: '2022-05-12 06:38:52',
    updateTime: '2024-07-17 08:10:58',
  },
  {
    table: 'about_desc',
    row: 8,
    dataSize: '24 KB',
    indexSize: '2 KB',
    maxDataSize: '268435456 MB',
    dataFree: '0 Bytes',
    createTime: '2022-05-12 06:38:52',
    updateTime: '2024-07-17 08:10:58',
  },
  {
    table: 'ad_pos',
    row: 15,
    dataSize: '1.1 KB',
    indexSize: '2 KB',
    maxDataSize: '268435456 MB',
    dataFree: '0 Bytes',
    createTime: '2022-05-12 06:38:52',
    updateTime: '2024-06-15 02:51:14',
  },
  {
    table: 'admin',
    row: 11,
    dataSize: '1.4 KB',
    indexSize: '2 KB',
    maxDataSize: '268435456 MB',
    dataFree: '0 Bytes',
    createTime: '2022-05-12 06:38:52',
    updateTime: '2024-09-16 03:19:55',
  },
  {
    table: 'admin_group',
    row: 6,
    dataSize: '11.3 KB',
    indexSize: '2 KB',
    maxDataSize: '268435456 MB',
    dataFree: '0 Bytes',
    createTime: '2022-05-12 06:38:52',
    updateTime: '2024-06-02 05:51:14',
  },
  {
    table: 'admin_menu',
    row: 103,
    dataSize: '8.8 KB',
    indexSize: '4 KB',
    maxDataSize: '268435456 MB',
    dataFree: '0 Bytes',
    createTime: '2022-05-12 06:38:52',
    updateTime: '2024-07-04 07:10:53',
  },
  {
    table: 'admin_permission',
    row: 82,
    dataSize: '6.6 KB',
    indexSize: '2 KB',
    maxDataSize: '268435456 MB',
    dataFree: '0 Bytes',
    createTime: '2022-05-12 06:38:52',
    updateTime: '2024-07-18 08:10:58',
  },
  {
    table: 'admin_sessions',
    row: 23,
    dataSize: '52.3 KB',
    indexSize: '5 KB',
    maxDataSize: '268435456 MB',
    dataFree: '46.7 KB',
    createTime: '2022-05-12 06:38:52',
    updateTime: '2024-09-16 07:43:07',
  },
]

function SystemData() {
  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <h2>QUẢN LÝ DỮ LIỆU</h2>
        </CCol>
      </CRow>

      <CRow>
        <h6>Thông tin dữ liệu</h6>
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>Table</CTableHeaderCell>
              <CTableHeaderCell>Row</CTableHeaderCell>
              <CTableHeaderCell>Data Size</CTableHeaderCell>
              <CTableHeaderCell>Index Size</CTableHeaderCell>
              <CTableHeaderCell>Max Data Size</CTableHeaderCell>
              <CTableHeaderCell>Data Free</CTableHeaderCell>
              <CTableHeaderCell>Create Time</CTableHeaderCell>
              <CTableHeaderCell>Update Time</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {dummyData.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{item.table}</CTableDataCell>
                <CTableDataCell>{item.row}</CTableDataCell>
                <CTableDataCell>{item.dataSize}</CTableDataCell>
                <CTableDataCell>{item.indexSize}</CTableDataCell>
                <CTableDataCell>{item.maxDataSize}</CTableDataCell>
                <CTableDataCell>{item.dataFree}</CTableDataCell>
                <CTableDataCell>{item.createTime}</CTableDataCell>
                <CTableDataCell>{item.updateTime}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CRow>
    </CContainer>
  )
}

export default SystemData
