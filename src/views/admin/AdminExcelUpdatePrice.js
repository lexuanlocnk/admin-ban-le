import { CButton, CCol, CContainer, CFormInput, CRow } from '@coreui/react'
import React, { useState } from 'react'
import './css/adminExcelUpdatePrice.css'

function AdminExcelUpdatePrice() {
  const [valueForm, setValueForm] = useState({
    file: null,
    numberLine: null,
  })

  //set img avatar
  function onFileChange(e) {
    const files = e.target.files
    const fileUrls = []

    Array.from(files).forEach((file) => {
      // Create a URL for the file
      fileUrls.push(URL.createObjectURL(file))
    })

    // Đặt URL file để xem trước ngay lập tức
    setValueForm((prev) => ({
      ...prev,
      file: fileUrls, // Lưu URLs để xem trước
    }))
  }

  function onChangeLine(value) {
    setValueForm((prev) => ({
      ...prev,
      numberLine: parseInt(value), // Lưu URLs để xem trước
    }))
  }

  function handleSubmit() {
    console.log('submit', valueForm)
  }

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol md={12}>
          <h3>CẬP NHẬT GIÁ, BẢO HÀNH EXCEL</h3>
        </CCol>
      </CRow>

      <CRow className="mb-3  ">
        <CCol md={3}>
          <div className="title_admin">
            <span>File excel có định dạng *.xls</span>
          </div>
        </CCol>
        <CCol md={4}>
          <div className="value_admin">
            <CFormInput
              onChange={(e) => onFileChange(e)}
              size="sm"
              type="file"
              id="formFile"
              label={null}
            />
          </div>
        </CCol>
      </CRow>
      <CRow className="mb-3  ">
        <CCol md={3}>
          <div className="title_admin">
            <span>Dòng bắt đầu xử lý</span>
          </div>
        </CCol>
        <CCol md={4}>
          <div className="value_admin">
            <CFormInput
              type="number"
              size="sm"
              value={valueForm.numberLine}
              label={null}
              onChange={(e) => onChangeLine(e.target.value)}
            />
          </div>
        </CCol>
      </CRow>
      <CRow className="mb-3  ">
        <CCol md={3}>
          <div className="title_admin">
            <span>File excel mẫu</span>
          </div>
        </CCol>
        <CCol md={9}>
          <div className="value_admin">
            <img className="w-100 h-100" src="/example_excel.jpg" alt="File excel mẫu" />
          </div>
        </CCol>
      </CRow>

      <CRow className="mb-3  ">
        <CCol md={12} className="d-flex justify-content-center">
          <CButton onClick={handleSubmit} size="sm" color="primary">
            Tải lên! bắt đầu xử lý
          </CButton>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default AdminExcelUpdatePrice
