import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import '../css/editOrder.scss'

const items = [
  {
    id: 1,
    image:
      'https://chinhnhan.vn/uploads/product/muc-in-chinh-hang/HP/thumbs/50x50_muc-in-hp-136a.png',
    name: 'Mực in HP 136A LaserJet Toner Cartridge (W1360A)',
    link: '#',
    price: 1407000,
    quantity: 2,
  },
  {
    id: 2,
    image:
      'https://chinhnhan.vn/uploads/product/muc-in-chinh-hang/HP/thumbs/50x50_muc-in-hp-136a.png',
    name: 'Mực in HP 136A LaserJet Toner Cartridge (W1360A)',
    link: '#',
    price: 1407000,
    quantity: 1,
  },
]

function EditOrder() {
  const [orderStatus, setOrderStatus] = useState(null)
  const [orderNote, setOrderNote] = useState(null)
  const [spx, setSpx] = useState(null)

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const fetchOrderData = async () => {}

  const handleUpdateClick = () => {
    // submit api put
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
              Mã đơn hàng: <strong className="order-code">1348-20240704</strong>
            </strong>
          </div>

          <div>
            <strong>Trạng thái: </strong>
            <span className="order-status border">Đang chờ xử lý</span>
          </div>

          <div>
            <strong>Ngày đặt hàng:</strong>
            <span> 17:11, 10/10/2022</span>
          </div>
        </CCol>

        <CCol md={12} className="border p-3 white-background">
          <h6 className="horizontal-line pb-2">Thông tin đơn hàng</h6>
          <div className="row ">
            <div className="col-md-6">
              <strong>Thông tin thanh toán</strong>
              <p>
                Họ tên: <span className="customer-info-name">Ngọc</span>{' '}
                <span className="customer-info-type">(Khách vãng lai)</span>
              </p>
              <p>
                Điện thoại: <span className="customer-info-phone">0843332929</span>
              </p>
              <p>
                Địa chỉ: <span>Hồ Chí Minh</span>
              </p>
              <p>
                Email: <span>nhquoc99@gmail.com</span>
              </p>

              <strong>Phương thức thanh toán:</strong>
              <p>Trả tiền mặt khi nhận hàng</p>
            </div>
            <div className="col-md-6">
              <strong>Thông tin giao hàng</strong>
              <p>
                Họ tên: <span className="customer-info-name">Ngọc</span>{' '}
                <span className="customer-info-type">(Khách vãng lai)</span>
              </p>
              <p>
                Điện thoại: <span className="customer-info-phone">0843332929</span>
              </p>
              <p>
                Địa chỉ: <span>Hồ Chí Minh</span>
              </p>
              <p>
                Email: <span>nhquoc99@gmail.com</span>
              </p>

              <strong>Phương thức giao hàng:</strong>
              <p>Các công ty giao nhận tư nhân trong và ngoài nước</p>
            </div>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol className="cart my-2 border p-3 white-background" md={12}>
          <h6>Thông tin giỏ hàng</h6>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá bán</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <img src={item.image} alt={item.name} />
                  </td>
                  <td>
                    <a href={item.link}>{item.name}</a>
                  </td>
                  <td>{item.price.toLocaleString('vi-VN')}đ</td>
                  <td>{item.quantity}</td>
                  <td>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total">
            Tổng tiền: <span>{total.toLocaleString('vi-VN')}đ</span>
          </div>
        </CCol>

        <CCol className="cart my-1 border p-3 white-background" md={12}>
          <h6 className="horizontal-line pb-2">Cập nhật đơn hàng</h6>
          <CForm className="row g-3">
            <CCol className="mt-3">
              <CFormLabel htmlFor="status-select">Cập nhật trạng thái</CFormLabel>
              <CFormSelect
                className="component-size w-25"
                aria-label="Chọn yêu cầu lọc"
                id="status-select"
                options={[
                  'Chọn trạng thái',
                  { label: 'Đang chờ xử lý', value: 'pending' },
                  { label: 'Chờ khách phản hồi', value: 'customer-response' },
                  { label: 'Đã thanh toán', value: 'paid' },
                  { label: 'Đã giao hàng', value: 'delivered' },
                  { label: 'Đã hoàn tất', value: 'finished' },
                  { label: 'Không thành công', value: 'fail' },
                  { label: 'Khách hàng hủy bỏ', value: 'customer-cancels' },
                ]}
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel htmlFor="order-note">Ghi chú đơn hàng</CFormLabel>
              <CFormTextarea
                style={{ height: '100px', fontSize: 14 }}
                type="text"
                id="order-note"
                placeholder="Thêm ghi chú cho đơn hàng"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel htmlFor="spx" value={spx} onChange={(e) => setSpx(e.target.value)}>
                Số phiếu xuất
              </CFormLabel>
              <CFormInput type="text" id="spx" />
            </CCol>
          </CForm>
        </CCol>
        <CButton onClick={handleUpdateClick} color="primary" size="sm">
          Cập nhật
        </CButton>
      </CRow>
    </CContainer>
  )
}

export default EditOrder
