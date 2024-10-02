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
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import '../css/editOrder.scss'
import moment from 'moment'
import { toast } from 'react-toastify'
import { axiosClient, imageBaseUrl } from '../../../axiosConfig'

function EditOrder() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const id = searchParams.get('id')

  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  const [dataOrderDetail, setDataOrderDetail] = useState([])
  //loading button
  const [isLoading, setIsLoading] = useState(false)

  const [dataStatus, setDataStatus] = useState([])
  const [choosenStatus, setChoosenStatus] = useState('')
  const [orderNote, setOrderNote] = useState(null)
  const [spx, setSpx] = useState(null)

  const fetchDataStatusOrder = async () => {
    try {
      const response = await axiosClient.get(`admin/order-status`)
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
      const response = await axiosClient.get(`admin/order/${id}/edit`)

      const data = response.data.dataOrder
      if (data) {
        setDataOrderDetail(data)
        setOrderNote(data.comment)
        // setDataStatus(2)
        setChoosenStatus(data.status)
      } else {
        console.error('No data found for the given ID.')
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch data order detail is error', error.message)
    }
  }

  useEffect(() => {
    fetchOrderDataDetail()
  }, [])

  // const total = dataOrderDetail.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const handleUpdateClick = async () => {
    // submit api put
    try {
      setIsLoading(true)
      const response = await axiosClient.put(`admin/order/${id}`, {
        status: choosenStatus,
        comment: orderNote,
      })

      if (response.data.status === true) {
        toast.success('Cập nhật đơn hàng thành công!')
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Put data order detail is error', error.message)
      toast.error('Đã xảy ra lỗi! Vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

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
        <>
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
                      Mã đơn hàng:{' '}
                      <strong className="order-code">{dataOrderDetail?.order_code}</strong>
                    </strong>
                  </div>

                  <div>
                    <strong>Trạng thái: </strong>
                    <span className="order-status border">{dataOrderDetail?.order_status}</span>
                  </div>

                  <div>
                    <strong>Ngày đặt hàng: </strong>
                    <span>
                      {moment
                        .unix(Number(dataOrderDetail?.date_order))
                        .format('DD-MM-YYYY, hh:mm:ss A')}
                    </span>
                  </div>
                </CCol>

                <CCol md={12} className="border p-3 white-background">
                  <h6 className="horizontal-line pb-2">Thông tin đơn hàng</h6>
                  <div className="row ">
                    <div className="col-md-6">
                      <strong>Thông tin thanh toán</strong>
                      <p>
                        Họ tên:{' '}
                        <span className="customer-info-name">{dataOrderDetail?.d_name}</span>{' '}
                        <span className="customer-info-type">
                          {dataOrderDetail?.mem_id === 0 ? '(Khách vãng lai)' : '(Thành viên)'}
                        </span>
                      </p>
                      <p>
                        Điện thoại:{' '}
                        <span className="customer-info-phone">{dataOrderDetail?.d_phone}</span>
                      </p>
                      <p>
                        Địa chỉ: <span>{dataOrderDetail?.d_address}</span>
                      </p>
                      <p>
                        Email: <span>{dataOrderDetail?.d_email}</span>
                      </p>

                      <strong>Phương thức thanh toán:</strong>
                      <p>{dataOrderDetail?.payment_method?.title}</p>
                    </div>
                    <div className="col-md-6">
                      <strong>Thông tin giao hàng</strong>
                      <p>
                        Họ tên:{' '}
                        <span className="customer-info-name">{dataOrderDetail?.d_name}</span>{' '}
                        <span className="customer-info-type">
                          {dataOrderDetail?.mem_id === 0 ? '(Khách vãng lai)' : '(Thành viên)'}
                        </span>
                      </p>
                      <p>
                        Điện thoại:{' '}
                        <span className="customer-info-phone">{dataOrderDetail?.d_phone}</span>
                      </p>
                      <p>
                        Địa chỉ: <span>{dataOrderDetail?.d_address}</span>
                      </p>
                      <p>
                        Email: <span>{dataOrderDetail?.d_email}</span>
                      </p>
                      <strong>Phương thức giao hàng:</strong>
                      <p>{dataOrderDetail?.shipping_method}</p>
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
                      {dataOrderDetail?.orderDetail?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <img src={`${imageBaseUrl}${item?.picture}`} alt={'img-product'} />
                          </td>
                          <td>
                            <Link to={`/product/edit?id=${item.item_id}`}>{item.item_title}</Link>
                          </td>
                          <td>{Number(item.item_price).toLocaleString('vi-VN')}đ</td>
                          <td>{item.quantity}</td>
                          <td>
                            {Number(item.item_price * item.quantity).toLocaleString('vi-VN')}đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="d-flex justify-content-between">
                    <div className="mt-3">
                      <div
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {dataOrderDetail.valueCoupon && dataOrderDetail.valueCoupon !== null ? (
                          <div>
                            Đơn hàng áp dụng Coupon:
                            {`${dataOrderDetail.valueCoupon.MaPhatHanh}, Giá trị: ${dataOrderDetail.valueCoupon.GiaTriCoupon.toLocaleString('vi-VN')}đ`}
                          </div>
                        ) : (
                          `Đơn hàng không áp dụng Coupon`
                        )}
                      </div>

                      <div
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {dataOrderDetail.totalValueOfPoint &&
                        dataOrderDetail.totalValueOfPoint !== null ? (
                          <div>
                            Đơn hàng áp dụng điểm tích lũy quy đổi:
                            {` ${dataOrderDetail.totalValueOfPoint.toLocaleString('vi-VN')}đ`}
                          </div>
                        ) : (
                          `Đơn hàng không áp dụng Coupon`
                        )}
                      </div>

                      <div
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {dataOrderDetail.PresentDes && dataOrderDetail.PresentDes !== null && (
                          <>
                            <div>
                              Đơn hàng có quà tặng kèm: {`${dataOrderDetail.PresentDes?.title}`}
                            </div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: dataOrderDetail.PresentDes?.content,
                              }}
                            ></div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="total justify-content-end">
                      <div className="total">
                        Thành tiền:{' '}
                        <span>
                          {dataOrderDetail.total_price &&
                            dataOrderDetail.total_price?.toLocaleString('vi-VN')}
                          đ
                        </span>
                      </div>
                      <div>
                        Giảm giá coupon:{' '}
                        <span>
                          {dataOrderDetail.CouponDiscout &&
                            dataOrderDetail.CouponDiscout?.toLocaleString('vi-VN')}
                          đ
                        </span>
                      </div>

                      <div>
                        Giảm giá điểm thưởng:{' '}
                        <span>
                          {dataOrderDetail.totalValueOfPoint &&
                            dataOrderDetail.totalValueOfPoint?.toLocaleString('vi-VN')}
                          đ
                        </span>
                      </div>
                      <div>
                        Tổng tiền:{' '}
                        <span>
                          {dataOrderDetail.total_cart &&
                            dataOrderDetail.total_cart?.toLocaleString('vi-VN')}
                          đ
                        </span>
                      </div>
                    </div>
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
                      <CFormLabel
                        htmlFor="spx"
                        value={spx}
                        onChange={(e) => setSpx(e.target.value)}
                      >
                        Số phiếu xuất
                      </CFormLabel>
                      <CFormInput type="text" id="spx" />
                    </CCol>
                  </CForm>
                </CCol>
                <CButton onClick={handleUpdateClick} color="primary" size="sm" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <CSpinner size="sm"></CSpinner> Đang cập nhật...
                    </>
                  ) : (
                    'Cập nhật'
                  )}
                </CButton>
              </CRow>
            </>
          ) : (
            <h4>Không có thông tin về đơn hàng. Vui lòng thử lại!</h4>
          )}
        </>
      )}
    </CContainer>
  )
}

export default EditOrder
