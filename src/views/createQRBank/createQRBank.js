import React from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol, CFormInput, CButton } from '@coreui/react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import CIcon from '@coreui/icons-react'
import './public/QRCodeOrderPage.css'
import { cilTrash } from '@coreui/icons'

// Schema validation
const SearchSchema = Yup.object().shape({
  mapx: Yup.string().required('Vui lòng nhập mã phiếu xuất'),
})

const QRCodeOrderPage = () => {
  const handleSearch = (values) => {
    console.log('Giá trị nhập:', values.mapx)
  }

  return (
    <div className="qrcode-page">
      <h2 className="qrcode-page__title">Tạo mã QRcode cho đơn hàng NKC</h2>

      <Formik initialValues={{ mapx: '' }} validationSchema={SearchSchema} onSubmit={handleSearch}>
        {({ errors, touched }) => (
          <Form className="qrcode-page__form">
            <div className="qrcode-page__input-group">
              <Field
                as={CFormInput}
                name="mapx"
                placeholder="Nhập mã phiếu xuất"
                className="qrcode-page__input"
                invalid={touched.mapx && !!errors.mapx}
              />
              <CButton type="submit" color="success" variant="outline">
                <CIcon icon={cilTrash} className="text-white" />
              </CButton>
            </div>
            {errors.mapx && touched.mapx ? (
              <div className="qrcode-page__error">{errors.mapx}</div>
            ) : null}
          </Form>
        )}
      </Formik>

      <div className="qrcode-layout">
        <h3 className="qrcode-layout__title">
          Thanh toán qua Banking cho đơn hàng (điền mã phiếu xuất vào đây)
        </h3>

        <CRow className="qrcode-layout__content">
          <CCol md={5}>
            <CCard>
              <CCardHeader>QR Code Thanh Toán</CCardHeader>
              <CCardBody className="text-center">
                <div className="qrcode-box__qrcode">[ QR CODE ]</div>
                <p>
                  <strong>Số tiền:</strong> 1,000,000 VND
                </p>
                <p>
                  <strong>Đơn hàng:</strong> PX00123
                </p>
                <p>
                  <strong>Tên người thụ hưởng:</strong> Công ty ABC
                </p>
                <p className="qrcode-box__note">Sử dụng App Banking hoặc camera để quét mã</p>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol md={7}>
            <CCard>
              <CCardHeader>Thông tin đơn hàng</CCardHeader>
              <CCardBody>
                <div className="order-info">
                  <p>
                    <strong>Tên khách hàng:</strong> Nguyễn Văn A
                  </p>
                  <p>
                    <strong>MST:</strong> 0123456789
                  </p>
                  <p>
                    <strong>Liên hệ:</strong> 0987654321
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM
                  </p>
                  <p>
                    <strong>Ghi chú:</strong> Giao trước 10h sáng
                  </p>

                  <div className="order-info__product-list">
                    <p>
                      <strong>Hàng hóa đã mua:</strong>
                    </p>
                    <ul>
                      <li>Sản phẩm A - SL: 2 - 500,000 VND</li>
                      <li>Sản phẩm B - SL: 1 - 500,000 VND</li>
                    </ul>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </div>
  )
}

export default QRCodeOrderPage
