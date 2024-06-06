import { CButton, CCol, CContainer, CForm, CFormInput, CRow } from '@coreui/react'
import React from 'react'

function AdminInfo() {
  return (
    <CContainer>
      <CRow className="mb-3">
        <h4>THÔNG TIN ADMIN</h4>
        <h6>Thông tin tài khoản</h6>
      </CRow>
      <CRow>
        <CCol md={6}>
          <CForm className="row gy-3">
            <CCol md={12}>
              <CFormInput id="inputEmail4" label="Tên đăng nhập" text="Không thể thay đổi" />
            </CCol>

            <CCol md={12}>
              <CFormInput type="password" id="inputPassword4" label="Mật khẩu mới" />
            </CCol>

            <CCol md={12}>
              <CFormInput id="inputAddress" label="Thư điện tử" text="Thư điện tử (bắt buộc)." />
            </CCol>

            <CCol md={12}>
              <CFormInput id="inputAddress2" label="Tên hiển thị" text="Tên hiển thị (bắt buộc)." />
            </CCol>

            <CCol md={12}>
              <CFormInput id="inputAddress2" label="Số điện thoại" />
            </CCol>

            <CCol md={12}>
              <CFormInput id="inputAddress2" label="Vai trò" />
            </CCol>

            <CCol xs={12}>
              <CButton color="primary" type="submit" size="sm">
                Cập nhật
              </CButton>
            </CCol>
          </CForm>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default AdminInfo
