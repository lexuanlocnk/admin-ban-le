import { CButton, CCol, CContainer, CRow, CTable } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import moment from 'moment'

import './css/editCoupon.css'
import axios from 'axios'

const fakeData = [
  {
    couponCode: 'NKDRVMCP',
    used: '4',
    remaining: '9995',
    url: '/coupon/detail',
  },
  {
    couponCode: 'NKDRVMCP58',
    used: '19',
    remaining: '125',
    url: '/coupon/detail',
  },
]

function EditCoupon() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const id = searchParams.get('id')

  const [dataCoupon, setDataCoupon] = useState([])
  const [dataCouponDetail, setDataCouponDetail] = useState([])

  const fetchCouponDetailData = async () => {
    try {
      const response = await axios.get(`http://192.168.245.190:8000/api/coupon/${id}/edit`)
      setDataCoupon(response.data.listCoupon)
      setDataCouponDetail(response.data.listCoupon.coupon_desc)
    } catch (error) {
      console.error('Fetch coupon data error', error)
    }
  }

  useEffect(() => {
    fetchCouponDetailData()
  }, [])

  const items =
    dataCouponDetail &&
    dataCouponDetail.length > 0 &&
    dataCouponDetail.map((item, index) => ({
      id: index + 1,
      couponId: item.MaCouponDes,
      used: item.SoLanSuDungDes,
      remain: item.SoLanConLaiDes,
      detail: <Link to={item.idCouponDes}>Xem chi tiết</Link>,
      _cellProps: { id: { scope: 'row' } },
    }))

  const columns = [
    {
      key: 'id',
      label: 'STT',
      _props: { scope: 'col' },
    },
    {
      key: 'couponId',
      label: 'Mã Coupon',
      _props: { scope: 'col' },
    },
    {
      key: 'used',
      label: 'Đã dùng',
      _props: { scope: 'col' },
    },
    {
      key: 'remain',
      label: 'Còn lại',
      _props: { scope: 'col' },
    },
    {
      key: 'detail',
      label: 'Chi tiết sử dụng',
      _props: { scope: 'col' },
    },
  ]

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <h3>THÔNG TIN COUPON</h3>
        </CCol>
        <CCol md={{ span: 4, offset: 4 }}>
          <div className="d-flex justify-content-end">
            <Link to={`/coupon`}>
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
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
                {dataCoupon?.MaPhatHanh}
              </strong>
            </strong>
          </div>

          <div>
            <strong>Trạng thái: </strong>
            <span
              style={{
                fontSize: 18,
                color: dataCoupon?.status_id === 2 ? 'red' : 'green',
              }}
            >
              {dataCoupon?.status_id === 2 ? 'Ngừng Phát Hành' : 'Đang Phát Hành'}
            </span>
          </div>

          <div>
            <strong>
              Ngày tạo:{' '}
              {moment.unix(Number(dataCoupon?.StartCouponDate)).format('DD-MM-YYYY, hh:mm:ss A')}
            </strong>
            <span></span>
          </div>
        </CCol>

        <CCol md={12} className="border p-3 bg-white">
          <h6>Thông tin COUPON</h6>
          <div className="row ">
            <div className="col-md-6">
              <p>
                Mã đợt phát hành:{' '}
                <span
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {dataCoupon?.MaPhatHanh}
                </span>
              </p>
              <p>
                Tên đợt phát hành: <span>{dataCoupon?.TenCoupon}</span>
              </p>
              <p>
                Loại mã giảm: <span>Tổng đơn hàng</span>
              </p>
              <p>
                Số lượng mã: <span className="orange-txt">{dataCoupon?.SoLuongMa}</span>
              </p>
              <p>
                Ngành hàng áp dụng:{' '}
                {dataCoupon?.DanhMucSpChoPhep &&
                  dataCoupon?.DanhMucSpChoPhep.length > 0 &&
                  dataCoupon?.DanhMucSpChoPhep.map((item) => (
                    <span key={item.cat_name} className="orange-txt">
                      {item.cat_name},{' '}
                    </span>
                  ))}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                Giá trị khuyến mại:{' '}
                <span className="orange-txt">
                  {Number(dataCoupon?.GiaTriCoupon).toLocaleString('vi-VN')}đ
                </span>
              </p>
              <p>
                Đơn hàng chấp nhận sử dụng từ:{' '}
                <span>{Number(dataCoupon?.DonHangChapNhanTu).toLocaleString('vi-VN')}đ</span>
              </p>
              <p>
                Thương hiệu áp dụng:{' '}
                {dataCoupon?.ThuongHieuSPApDung &&
                  dataCoupon?.ThuongHieuSPApDung.length > 0 &&
                  dataCoupon?.ThuongHieuSPApDung.map((item) => (
                    <span key={item.title} className="orange-txt">
                      {item.title},{' '}
                    </span>
                  ))}
              </p>
              <p>
                Mã hàng áp dụng:{' '}
                <span className="orange-txt">{dataCoupon?.MaKhoSPApdung === 0}</span>
              </p>
            </div>
          </div>
        </CCol>

        <CCol className="mt-3">
          <h6>Danh sách Mã Coupon</h6>
          <CTable className="mt-2" columns={columns} items={items} />
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default EditCoupon
