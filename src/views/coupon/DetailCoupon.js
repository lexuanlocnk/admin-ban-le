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
import { Link, useLocation } from 'react-router-dom'
import { axiosClient } from '../../axiosConfig'
import moment from 'moment'

function DetailCoupon() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const coupon_code = searchParams.get('coupon_code')
  const [dataDetailCoupon, setDataDetailCoupon] = useState([])

  // const [dataCouponDetail, setDataCouponDetail] = useState([])

  const fetchCouponDetailData = async () => {
    try {
      const response = await axiosClient.get(`admin/get-detail-coupon/${coupon_code}`)
      setDataDetailCoupon(response.data.data)
    } catch (error) {
      console.error('Fetch coupon data error', error)
    }
  }

  useEffect(() => {
    fetchCouponDetailData()
  }, [])

  const items =
    dataDetailCoupon &&
    dataDetailCoupon.length > 0 &&
    dataDetailCoupon.map((item, index) => ({
      id: index + 1,
      maCouponUSer: item.MaCouponUSer,
      dateUsingCode: item.DateUsingCode,
      idUser: item.IDuser,
      iDOrderCode: item.IDOrderCode,
      _cellProps: { id: { scope: 'row' } },
    }))

  const columns = [
    { key: 'id', label: 'STT', _props: { scope: 'col' } },
    { key: 'maCouponUSer', label: 'Mã Coupon', _props: { scope: 'col' } },
    { key: 'dateUsingCode', label: 'Thời gian sử dụng', _props: { scope: 'col' } },
    { key: 'idUser', label: 'ID USER', _props: { scope: 'col' } },
    { key: 'iDOrderCode', label: 'Mã đơn hàng', _props: { scope: 'col' } },
  ]

  const item = [
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
            <Link to={`/coupon/add`}>
              <CButton color="primary" size="sm" className="button-add">
                Thêm mới
              </CButton>
            </Link>

            <Link to={`/coupon`}>
              <CButton color="primary" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CCol md={12} className="d-flex justify-content-between border p-3 mb-3 bg-white">
        <div>
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
          <span style={{ fontSize: 18 }}>Đang...</span>
        </div>

        <div>
          <strong>Ngày tạo: DD-MM-YYYY</strong>
          <span></span>
        </div>
      </CCol>

      <CCol className="mt-3">
        <h6>Danh sách Mã Coupon đã sử dụng</h6>

        {/* Kiểm tra nếu items có dữ liệu */}
        {items && items.length > 0 ? (
          <CTable className="mt-2" columns={columns} items={items} />
        ) : (
          <p>Không có coupon đã sử dụng</p>
        )}
      </CCol>
    </CContainer>
  )
}

export default DetailCoupon
