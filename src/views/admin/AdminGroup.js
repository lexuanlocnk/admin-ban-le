import { CButton, CCol, CContainer, CForm, CFormInput, CRow } from '@coreui/react'
import React from 'react'

import './css/adminGroup.css'

function AdminGroup() {
  return (
    <CContainer>
      <CRow className="mb-3">
        <h4>QUẢN LÝ NHÓM ADMIN</h4>
      </CRow>

      <CRow>
        <CCol md={4}>
          <h6>Thêm nhóm admin mới</h6>
          <CForm className="row gy-3">
            <CCol md={12}>
              <CFormInput id="inputEmail4" label="Tiêu đề" />
            </CCol>

            <CCol md={12}>
              <CFormInput id="inputPassword4" label="Role" />
            </CCol>

            <CCol xs={12}>
              <CButton color="primary" type="submit">
                Thêm mới
              </CButton>
            </CCol>
          </CForm>
        </CCol>

        <CCol md={8}></CCol>
      </CRow>
    </CContainer>
  )
}

export default AdminGroup
