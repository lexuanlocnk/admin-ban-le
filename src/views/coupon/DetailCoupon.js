import React, { useEffect, useState, useParams } from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CRow,
  CTable,
  CTableHeaderCell,
  CTableRow,
  CTableBody,
  CTableDataCell,
  CTableHead,
} from '@coreui/react'
import { useLocation } from 'react-router-dom'
import { axiosClient } from '../../axiosConfig'

function DetailCoupon() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const coupon_code = searchParams.get('coupon_code')
  const [dataCoupon, setDataCoupon] = useState(null)

  const fetchCouponDetailData = async () => {
    try {
      const response = await axiosClient.get(`admin/get-detail-coupon/${coupon_code}`)
      setDataCoupon(response.data.listCoupon)
    } catch (error) {
      console.error('Fetch coupon data error', error)
    }
  }

  useEffect(() => {
    fetchCouponDetailData()
  }, [])

  const column = [
    { key: 'stt', label: 'STT', _props: { scope: 'col' } },
    { key: 'ma', label: 'Mã Coupon', _props: { scope: 'col' } },
    { key: 'thoiGian', label: 'Thời gian sử dụng', _props: { scope: 'col' } },
    { key: 'idUser', label: 'ID USER', _props: { scope: 'col' } },
    { key: 'maDonhang', label: 'Mã đơn hàng', _props: { scope: 'col' } },
  ]

  const items = [
    {
      ma: 'DH001',
      id: 1,
      thoiGian: '2024-09-10 14:30',
      idUser: '654',
      stt: 1,
      maDonhang: 46513154,
    },
    {
      ma: 'DH002',
      id: 2,
      thoiGian: '2024-09-11 09:15',
      idUser: '789',
      stt: 2,
      maDonhang: 84513154,
    },
    {
      ma: 'DH003',
      id: 3,
      thoiGian: '2024-09-12 11:00',
      idUser: '516',
      stt: 3,
      maDonhang: 84613154,
    },
    {
      ma: 'DH004',
      id: 4,
      thoiGian: '2024-09-13 16:45',
      idUser: '357',
      stt: 4,
      maDonhang: 84613154,
    },
    {
      ma: 'DH005',
      id: 5,
      thoiGian: '2024-09-14 08:20',
      idUser: '547',
      stt: 5,
      maDonhang: 84613154,
    },
  ]

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol md={6}>
          <h2>CHI TIẾT COUPON</h2>
        </CCol>
        <CCol md={6}>
          <div className="d-flex justify-content-end">
            <CButton color="primary" size="sm" className="button-add">
              Thêm mới
            </CButton>

            <CButton color="primary" size="sm">
              Danh sách
            </CButton>
          </div>
        </CCol>
      </CRow>

      <CCol md={12} className="d-flex justify-content-between border p-3 mb-3 bg-white">
        <div className="">
          <strong>
            Mã Đợt Phát Hành:{' '}
            <strong
              style={{
                fontSize: 18,
                color: 'red',
              }}
            >
              {coupon_code}
            </strong>
          </strong>
        </div>

        <div>
          <strong>Trạng thái: </strong>
          <span
            style={{
              fontSize: 18,
              color: dataCoupon?.IDCouponUs === 2 ? 'red' : 'green', // thay idcoupon
            }}
          >
            {dataCoupon?.IDCouponUs === 2 ? 'Ngừng Phát Hành' : 'Đang Phát Hành'}
          </span>
        </div>

        <div>
          <strong>
            Ngày tạo:{' '}
            {/* {moment.unix(Number(dataCoupon?.StartCouponDate)).format('DD-MM-YYYY, hh:mm:ss A')} */}
          </strong>
          <span></span>
        </div>
      </CCol>
      <h6>Danh sách Mã Coupon đã sử dụng</h6>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            {column.map((col) => (
              <CTableHeaderCell key={col.key}>{col.label}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {items.map((item, index) => (
            <CTableRow key={item.id}>
              <CTableDataCell>{item.stt}</CTableDataCell>
              <CTableDataCell>{item.ma}</CTableDataCell>
              <CTableDataCell>{item.thoiGian}</CTableDataCell>
              <CTableDataCell>{item.idUser}</CTableDataCell>
              <CTableDataCell>{item.maDonhang}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </CContainer>
  )
}

export default DetailCoupon
