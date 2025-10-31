import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CFormSelect,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CRow,
  CSpinner,
  CAlert,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import './css/adminExcelUpdatePrice.css'
import { axiosClient } from '../../axiosConfig'

// Constants
const ALLOWED_FILE_TYPES = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

const MESSAGES = {
  FILE_TYPE_ERROR: 'Vui lòng chọn file Excel có định dạng .xls hoặc .xlsx',
  NO_FILE_ERROR: 'Vui lòng chọn file Excel để tải lên!',
  UPLOAD_SUCCESS: 'Tải lên thành công!',
  CONNECTION_ERROR: 'Đã xảy ra lỗi khi kết nối đến server.',
  IMPORT_SUCCESS: 'Import thành công',
  UPLOADING: 'Đang tải lên và xử lý file, vui lòng đợi...',
}

const ENDPOINTS = {
  CATEGORIES: 'admin/category',
  IMPORT_TECHNOLOGY: 'admin/import-technology-2',
}

const TEMPLATE_LINK =
  'https://docs.google.com/spreadsheets/d/12bE6Vd328aBCt4gv8nVK2gzq1E_IT_b3BVgGai_A_S4/edit?gid=714954238#gid=714954238'

function AdminExcelUpdatePrice() {
  // State management
  const [valueForm, setValueForm] = useState(null)
  const [categoryList, setCategoryList] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentUploads, setCurrentUploads] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' })

  // Effects
  useEffect(() => {
    fetchCategoryList()
  }, [])

  // API calls
  const fetchCategoryList = async () => {
    try {
      const response = await axiosClient.get(ENDPOINTS.CATEGORIES)
      if (response.data?.status === true) {
        setCategoryList(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching category list:', error)
    }
  }

  // Event handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (file && !ALLOWED_FILE_TYPES.includes(file.type)) {
      showNotification(MESSAGES.FILE_TYPE_ERROR, 'danger')
      return
    }

    setValueForm(file)
    // Clear previous notification when new file is selected
    setNotification({ show: false, message: '', type: 'success' })
  }

  const handleSubmit = async () => {
    if (!valueForm) {
      showNotification(MESSAGES.NO_FILE_ERROR, 'danger')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', valueForm)

    try {
      const response = await axiosClient.post(ENDPOINTS.IMPORT_TECHNOLOGY, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const result = response.data
      if (result.status === true) {
        setCurrentUploads({
          date: result.data?.imported_at,
          importedCount: result.data?.imported_count,
          message: result.message,
          notFoundCount: result.data?.not_found_count,
          notFoundProducts: result.data?.not_found_product,
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper functions
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type })
    // Auto hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' })
    }, 5000)
  }

  const getStatusColor = (message) => {
    return message === MESSAGES.IMPORT_SUCCESS ? 'success' : 'danger'
  }

  const getStatusText = (message) => {
    return message === MESSAGES.IMPORT_SUCCESS ? 'Thành công' : 'Lỗi'
  }

  const getBackgroundColor = (message) => {
    return message === MESSAGES.IMPORT_SUCCESS ? 'rgba(25,135,84,0.1)' : 'rgba(220,53,69,0.1)'
  }

  // Render components
  const renderHeader = () => (
    <CRow className="mb-3">
      <CCol md={12}>
        <h3>CẬP NHẬT THÔNG SỐ KỸ THUẬT SẢN PHẨM</h3>
      </CCol>
    </CRow>
  )

  const renderInstructionPanel = () => (
    <CRow className="mb-4">
      <CCol md={12}>
        <div
          className="p-3"
          style={{
            backgroundColor: '#eaf4fc',
            borderLeft: '5px solid #0d6efd',
            lineHeight: '1.6',
          }}
        >
          <h5 className="fw-bold mb-2">📘 Hướng dẫn và quy định upload</h5>
          <ul className="mb-2">
            <li>
              <strong>Yêu cầu định dạng:</strong> Các file import thông số kỹ thuật phải có các
              trường (column) tương ứng với các trường thông số kỹ thuật của ngành hàng cần cập
              nhật. Trong đó 6 trường đầu tiên bắt buộc phải giống như hình mẫu về nội dung và thứ
              tự.
            </li>
            <li>
              <strong>Bước 1:</strong> Chọn file cần import thông số kỹ thuật.
            </li>
            <li>
              <strong>Bước 2:</strong> Chọn ngành hàng tương ứng.
            </li>
            <li>
              <strong>Bước 3:</strong> Nhấn nút <strong>Tải lên! bắt đầu xử lý</strong> để import
              file vào database.
            </li>
          </ul>
          <p className="mb-0">
            <strong>Lưu ý:</strong> Nếu thành công sẽ hiển thị thông báo{' '}
            <span className="text-success fw-bold">Thành công</span>. Nếu có lỗi sẽ hiển thị{' '}
            <span className="text-danger fw-bold">nội dung lỗi hoặc mã không tìm thấy</span>.
          </p>
        </div>
      </CCol>
    </CRow>
  )

  const renderFileUploadSection = () => (
    <>
      <CRow className="mb-3">
        <CCol md={3}>
          <div className="title_admin">
            <span>File excel có định dạng *.xls hoặc *.xlsx</span>
          </div>
        </CCol>
        <CCol md={4}>
          <div className="value_admin">
            <CFormInput
              onChange={handleFileChange}
              size="sm"
              type="file"
              id="formFile"
              accept=".xls,.xlsx"
              label={null}
              disabled={isLoading}
            />
          </div>
        </CCol>
      </CRow>

      <CRow className="mb-3">
        <CCol md={3}>
          <div className="title_admin">
            <span>File excel mẫu</span>
          </div>
        </CCol>
        <CCol md={9}>
          <div className="value_admin d-flex flex-column">
            <div className="mb-2">
              <a
                href={TEMPLATE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm"
                style={{ width: 'fit-content' }}
              >
                📄 Tải file mẫu Excel từ Google Sheets
              </a>
            </div>
            <img className="w-100 h-100" src="/excel_import_tskt.png" alt="File excel mẫu" />
          </div>
        </CCol>
      </CRow>
    </>
  )

  const renderSubmitButton = () => (
    <CRow className="mb-3">
      <CCol md={12} className="d-flex justify-content-center">
        <CButton
          style={{ fontSize: 16 }}
          onClick={handleSubmit}
          size="sm"
          color="primary"
          disabled={isLoading || !valueForm}
        >
          {isLoading && <CSpinner size="sm" className="me-2" />}
          {isLoading ? 'Đang xử lý...' : 'Tải lên! bắt đầu xử lý'}
        </CButton>
      </CCol>
    </CRow>
  )

  const renderNotification = () =>
    notification.show && (
      <CRow className="mb-3">
        <CCol md={12}>
          <CAlert
            color={notification.type}
            dismissible
            onClose={() => setNotification({ show: false, message: '', type: 'success' })}
          >
            {notification.message}
          </CAlert>
        </CCol>
      </CRow>
    )

  const renderUploadHistory = () => (
    <CRow className="mb-3">
      <CCol md={12}>
        <h5 className="mb-3 mt-4">📂 Danh sách lần import</h5>
        {currentUploads && Object.keys(currentUploads).length > 0 && (
          <CAccordion alwaysOpen>
            <CAccordionItem className="border mb-2" style={{ borderRadius: 0 }}>
              <CAccordionHeader>
                <div className="d-flex justify-content-between align-items-center w-100 px-2">
                  <div style={{ flex: '0 0 40%' }} className="fw-semibold">
                    {`Ngày ${currentUploads.date}`}
                  </div>
                  <div style={{ flex: '0 0 40%' }}>{currentUploads.fileName}</div>
                  <div
                    className={`fw-bold text-${getStatusColor(currentUploads.message)}`}
                    style={{ fontSize: '1rem', flex: '0 0 20%' }}
                  >
                    {getStatusText(currentUploads.message)}
                  </div>
                </div>
              </CAccordionHeader>
              <CAccordionBody
                className="py-3 px-4"
                style={{
                  backgroundColor: getBackgroundColor(currentUploads.message),
                  fontSize: '1rem',
                }}
              >
                <div className="mt-2">
                  <strong>{`Đã import ${currentUploads.importedCount} sản phẩm.`}</strong>
                </div>
                {currentUploads.notFoundCount > 0 && (
                  <div className="mt-2">
                    <strong>{`Có ${currentUploads.notFoundCount} sản phẩm không tìm thấy.`}</strong>
                    <div className="mt-2">
                      <strong>Danh sách mã không tìm thấy: </strong>
                      <span>{currentUploads.notFoundProducts}</span>
                    </div>
                  </div>
                )}
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>
        )}
      </CCol>
    </CRow>
  )

  // Main render
  return (
    <CContainer>
      {renderHeader()}
      {renderNotification()}
      {renderInstructionPanel()}
      {renderFileUploadSection()}
      {renderSubmitButton()}
      {renderUploadHistory()}
    </CContainer>
  )
}

export default AdminExcelUpdatePrice
