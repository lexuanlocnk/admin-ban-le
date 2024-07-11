import { CButton, CCol, CContainer, CRow } from '@coreui/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import '../css/editOrder.scss'

function EditOrder() {
  const [isCollapse, setIsCollapse] = useState(false)

  // handle toggle
  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <h3>CHI TIẾT ĐƠN HÀNG</h3>
        </CCol>
        <CCol md={{ span: 4, offset: 4 }}>
          <div className="d-flex justify-content-end">
            <Link to={`/order`}>
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={12} className="d-flex justify-content-between border p-3 mb-3 white-background">
          <div className="">
            <strong>
              Mã đơn hàng: <strong>101022_tongdonhang_500K</strong>
            </strong>
          </div>

          <div>
            <strong>Trạng thái: </strong>
            <span>Đang chờ xử lý</span>
          </div>

          <div>
            <strong>Ngày đặt hàng:</strong>
            <span> 17:11, 10/10/2022</span>
          </div>
        </CCol>

        <CCol md={12} className="border p-3 white-background">
          <h5 className="horizontal-line pb-2">Thông tin đơn hàng</h5>

          <div className="row ">
            <div className="col-md-6">
              <h6>Thông tin thanh toán</h6>
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
              <h6>Thông tin giao hàng</h6>
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
      </CRow>
    </CContainer>
  )
}

export default EditOrder
