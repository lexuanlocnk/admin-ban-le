import { CButton, CCol, CContainer, CRow, CTable } from '@coreui/react'
import React from 'react'
import { Link } from 'react-router-dom'

import './css/editCoupon.css'

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
  const items = fakeData.map((item, index) => ({
    id: index + 1,
    couponId: item.couponCode,
    used: item.used,
    remain: item.remaining,
    detail: <Link to={item.url}>Xem chi tiết</Link>,
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
        <CCol md={12} className="d-flex justify-content-between border p-3 mb-3">
          <div className="">
            <strong>
              Mã Đợt Phát Hành:{' '}
              <strong
                style={{
                  fontSize: 18,
                  color: 'red',
                }}
              >
                101022_tongdonhang_500K
              </strong>
            </strong>
          </div>

          <div>
            <strong>Trạng thái: </strong>
            <span
              style={{
                fontSize: 18,
                color: 'red',
              }}
            >
              Ngừng Phát Hành
            </span>
          </div>

          <div>
            <strong>Ngày tạo:</strong>
            <span> 17:11, 10/10/2022</span>
          </div>
        </CCol>

        <CCol md={12} className="border p-3">
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
                  101022_tongdonhang_500K
                </span>
              </p>
              <p>
                Tên đợt phát hành: <span>101022_tongdonhang_500K</span>
              </p>
              <p>
                Loại mã giảm: <span>Tổng đơn hàng</span>
              </p>
              <p>
                Số lượng mã: <span className="orange-txt">1</span>
              </p>
              <p>
                Ngành hàng áp dụng: <span className="orange-txt">All</span>
              </p>
            </div>
            <div className="col-md-6">
              <p>
                Giá trị khuyến mại: <span className="orange-txt">500,000</span>
              </p>
              <p>
                Đơn hàng chấp nhận sử dụng từ: <span>500,000</span>
              </p>
              <p>
                Loại Khách Hàng Áp Dụng: <span>Khách sỉ - Member</span>
              </p>
              <p>
                Thương hiệu áp dụng: <span className="orange-txt">All</span>
              </p>
              <p>
                Mã hàng áp dụng: <span></span>
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
