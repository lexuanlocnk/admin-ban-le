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
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import '../css/editOrder.scss'
import axios from 'axios'
import moment from 'moment'
import { toast } from 'react-toastify'

function EditOrder() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const id = searchParams.get('id')

  const [dataOrderDetail, setDataOrderDetail] = useState([])
  const [dataOrderInfo, setDataOrderInfo] = useState({})

  const [dataStatus, setDataStatus] = useState([])
  const [choosenStatus, setChoosenStatus] = useState('')
  const [orderNote, setOrderNote] = useState(null)
  const [spx, setSpx] = useState(null)

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const fetchDataStatusOrder = async () => {
    try {
      const response = await axios.get(`http://192.168.245.190:8000/api/order-status`)
      if (response.data.status === true) {
        const orderStatus = response.data.orderStatus.data
        setDataStatus(orderStatus)
      }
    } catch (error) {
      console.error('Fetch data order status is error', error)
    }
  }

  useEffect(() => {
    fetchDataStatusOrder()
  }, [])

  const fetchOrderDataDetail = async () => {
    try {
      const response = await axios.get(`http://192.168.245.190:8000/api/order/${id}/edit`)
      const orderInfo = response.data.orderSumId
      const data = response.data.orderDetail
      if (data) {
        setDataOrderDetail(data)
        setDataOrderInfo(orderInfo)
        setOrderNote(orderInfo.comment)
      } else {
        console.error('No data found for the given ID.')
      }
    } catch (error) {
      console.error('Fetch data order detail is error', error.message)
    }
  }

  useEffect(() => {
    fetchOrderDataDetail()
  }, [])

  const handleUpdateClick = async () => {
    // submit api put
    try {
      const response = await axios.put(`http://192.168.245.190:8000/api/order/${id}`, {
        status: choosenStatus,
        comment: orderNote,
      })

      if (response.data.status === true) {
        toast.success('Cập nhật đơn hàng thành công!')
      }
    } catch (error) {
      console.error('Put data order detail is error', error.message)
      toast.error('Đã xảy ra lỗi! Vui lòng thử lại!')
    }
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

      {dataOrderDetail ? (
        <>
          <CRow>
            <CCol
              md={12}
              className="d-flex justify-content-between border p-3 mb-3 white-background"
            >
              <div className="">
                <strong>
                  Mã đơn hàng: <strong className="order-code">{dataOrderInfo?.order_code}</strong>
                </strong>
              </div>

              <div>
                <strong>Trạng thái: </strong>
                <span className="order-status border">{dataOrderInfo?.order_status?.title}</span>
              </div>

              <div>
                <strong>Ngày đặt hàng: </strong>
                <span>
                  {moment.unix(Number(dataOrderInfo?.date_order)).format('DD-MM-YYYY, hh:mm:ss A')}
                </span>
              </div>
            </CCol>

            <CCol md={12} className="border p-3 white-background">
              <h6 className="horizontal-line pb-2">Thông tin đơn hàng</h6>
              <div className="row ">
                <div className="col-md-6">
                  <strong>Thông tin thanh toán</strong>
                  <p>
                    Họ tên: <span className="customer-info-name">{dataOrderInfo?.d_name}</span>{' '}
                    <span className="customer-info-type">
                      {dataOrderInfo?.mem_id === 0 ? '(Khách vãng lai)' : '(Thành viên)'}
                    </span>
                  </p>
                  <p>
                    Điện thoại:{' '}
                    <span className="customer-info-phone">{dataOrderInfo?.d_phone}</span>
                  </p>
                  <p>
                    Địa chỉ: <span>{dataOrderInfo?.d_address}</span>
                  </p>
                  <p>
                    Email: <span>{dataOrderInfo?.d_email}</span>
                  </p>

                  <strong>Phương thức thanh toán:</strong>
                  <p>{dataOrderInfo?.payment_method?.title}</p>
                </div>
                <div className="col-md-6">
                  <strong>Thông tin giao hàng</strong>
                  <p>
                    Họ tên: <span className="customer-info-name">{dataOrderInfo?.d_name}</span>{' '}
                    <span className="customer-info-type">
                      {dataOrderInfo?.mem_id === 0 ? '(Khách vãng lai)' : '(Thành viên)'}
                    </span>
                  </p>
                  <p>
                    Điện thoại:{' '}
                    <span className="customer-info-phone">{dataOrderInfo?.d_phone}</span>
                  </p>
                  <p>
                    Địa chỉ: <span>{dataOrderInfo?.d_address}</span>
                  </p>
                  <p>
                    Email: <span>{dataOrderInfo?.d_email}</span>
                  </p>
                  <strong>Phương thức giao hàng:</strong>
                  <p>{dataOrderInfo?.shipping_method?.title}</p>
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
                  {dataOrderDetail?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={`http://192.168.245.190:8000/uploads/product/${item.product?.picture}`}
                          alt={'img-product'}
                        />
                      </td>
                      <td>
                        <Link to={`/product/edit?id=${item.item_id}`}>{item.item_title}</Link>
                      </td>
                      <td>{Number(item.item_price).toLocaleString('vi-VN')}đ</td>
                      <td>{item.quantity}</td>
                      <td>{Number(item.item_price * item.quantity).toLocaleString('vi-VN')}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="total">
                Tổng tiền:{' '}
                <span>
                  {dataOrderInfo.total_cart && dataOrderInfo.total_cart?.toLocaleString('vi-VN')}đ
                </span>
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
                      { label: 'Chọn trạng thái', value: '' },
                      ...(dataStatus && dataStatus.length > 0
                        ? dataStatus?.map((status) => ({
                            label: status.title,
                            value: status.status_id,
                          }))
                        : []),
                    ]}
                    value={choosenStatus}
                    onChange={(e) => setChoosenStatus(e.target.value)}
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
        </>
      ) : (
        <h4>Không có thông tin về đơn hàng. Vui lòng thử lại!</h4>
      )}
    </CContainer>
  )
}

export default EditOrder
