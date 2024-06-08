import React, { useState } from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CRow,
  CFormSelect,
  CTable,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import './css/adminList.css'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'
import { Link } from 'react-router-dom'

function AdminList() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isCollapse, setIsCollapse] = useState(false)

  const handleImageUpload = (event) => {
    setSelectedImage(event.target.files[0])
  }

  const handleImageRemove = () => {
    setSelectedImage(null)
  }

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  const handleImageSubmit = async () => {
    if (selectedImage) {
      const formData = new FormData()
      formData.append('image', selectedImage)

      try {
        await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        console.log('Ảnh đã được upload thành công!')
      } catch (error) {
        console.error('Lỗi khi upload ảnh:', error)
      }
    }
  }

  const columns = [
    {
      key: 'id',
      label: '#',
      _props: { scope: 'col' },
    },
    {
      key: 'username',
      label: 'Tên đăng nhập',
      _props: { scope: 'col' },
    },
    {
      key: 'role',
      label: 'Vai trò',
      _props: { scope: 'col' },
    },
    {
      key: 'visited',
      label: 'Đăng nhập gần đây',
      _props: { scope: 'col' },
    },
    {
      key: 'actions',
      label: 'Tác vụ',
      _props: { scope: 'col' },
    },
  ]

  const items = [
    {
      id: 1,
      username: 'quocnguyen',
      role: 'administrator',
      visited: '10:51, 20/04/2024',
      actions: (
        <div>
          <button className="button-action mr-2 bg-info">
            <CIcon icon={cilColorBorder} className="text-white" />
          </button>
          <button className="button-action bg-danger">
            <CIcon icon={cilTrash} className="text-white" />
          </button>
        </div>
      ),
      _cellProps: { id: { scope: 'row' } },
    },

    {
      id: 2,
      username: 'longhoang',
      role: 'administrator',
      visited: '10:51, 20/04/2024',
      actions: (
        <div>
          <button className="button-action mr-2 bg-info">
            <CIcon icon={cilColorBorder} className="text-white" />
          </button>
          <button className="button-action bg-danger">
            <CIcon icon={cilTrash} className="text-white" />
          </button>
        </div>
      ),
      _cellProps: { id: { scope: 'row' } },
    },

    {
      id: 3,
      username: 'andev',
      role: 'administrator',
      visited: '10:51, 20/04/2024',
      actions: (
        <div>
          <button className="button-action mr-2 bg-info">
            <CIcon icon={cilColorBorder} className="text-white" />
          </button>
          <button className="button-action bg-danger">
            <CIcon icon={cilTrash} className="text-white" />
          </button>
        </div>
      ),
      _cellProps: { id: { scope: 'row' } },
    },
  ]

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <h4>QUẢN LÝ TÀI KHOẢN AMDIN</h4>
        </CCol>
        <CCol md={{ span: 4, offset: 4 }}>
          <div className="d-flex justify-content-end">
            <CButton color="primary" type="submit" size="sm" className="button-add">
              Thêm mới
            </CButton>
            <CButton color="primary" type="submit" size="sm">
              Danh sách
            </CButton>
          </div>
        </CCol>
      </CRow>

      <CRow>
        {/* Form add/ edit */}
        <CCol md={4}>
          <h6>Thêm admin mới</h6>
          <CForm className="row gy-3">
            <CCol md={12}>
              <CFormInput
                id="username-input"
                label="Tên đăng nhập"
                text="Tên đăng nhập hệ thống (bắt buộc)."
              />
            </CCol>

            <CCol md={12}>
              <CFormInput
                type="password"
                id="password-input"
                label="Mật khẩu"
                aria-label="Nhập mật khẩu"
              />
            </CCol>

            <CCol md={12}>
              <CFormInput
                id="email-input"
                type="email"
                label="Thư điện tử"
                text="Thư điện tử (bắt buộc)."
                aria-label="Nhập địa chỉ email"
              />
            </CCol>

            <CCol md={12}>
              <CFormInput
                id="phone-input"
                label="Số điện thoại"
                text="Số điện thoại (bắt buộc)."
                aria-label="Nhập số điện thoại"
              />
            </CCol>

            <CCol md={12}>
              <CFormInput
                id="display-name-input"
                label="Tên hiển thị"
                text="Tên hiển thị (bắt buộc)."
                aria-label="Nhập tên hiển thị"
              />
            </CCol>

            <CCol md={12}>
              <div>
                <CFormInput
                  type="file"
                  size="sm"
                  id="avatar-input"
                  label="Ảnh đại diện"
                  onChange={handleImageUpload}
                  aria-label="Tải lên ảnh đại diện"
                />
                {selectedImage && (
                  <div>
                    <div>
                      <CImage
                        className="mt-2"
                        src={URL.createObjectURL(selectedImage)}
                        alt="Ảnh đã upload"
                        width={300}
                      />
                    </div>
                    <CButton className="mt-2" color="danger" size="sm" onClick={handleImageRemove}>
                      Xóa
                    </CButton>
                  </div>
                )}
              </div>
            </CCol>

            <CCol md={12}>
              <CFormSelect
                className="component-size"
                label="Vai trò"
                aria-label="Chọn vai trò"
                options={[
                  { label: 'Biên tập viên', value: '1' },
                  { label: 'Quản trị web', value: '2' },
                  { label: 'Marketing', value: '3' },
                ]}
              />
            </CCol>

            <CCol xs={12}>
              <CButton color="primary" type="submit" size="sm">
                Thêm mới
              </CButton>
            </CCol>
          </CForm>
        </CCol>

        {/* search, table view */}
        <CCol md={8}>
          <CRow>
            <table className="filter-table">
              <thead>
                <tr>
                  <th colSpan="2">
                    <div className="d-flex justify-content-between">
                      <span>Bộ lọc tìm kiếm</span>
                      <span className="toggle-pointer" onClick={handleToggleCollapse}>
                        {isCollapse ? '▼' : '▲'}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              {!isCollapse && (
                <tbody>
                  <tr>
                    <td>Tổng cộng</td>
                    <td className="total-count">6</td>
                  </tr>
                  <tr>
                    <td>Lọc</td>
                    <td>
                      <CFormSelect
                        className="component-size w-50"
                        aria-label="Chọn yêu cầu lọc"
                        options={[
                          { label: 'Biên tập viên', value: '1' },
                          { label: 'Quản trị web', value: '2' },
                          { label: 'Marketing', value: '3' },
                        ]}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Tìm kiếm</td>
                    <td>
                      <input type="text" className="search-input" />
                      <button className="submit-btn">Submit</button>
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </CRow>
          <CRow>
            <CTable className="mt-2" columns={columns} items={items} />
            <CPagination align="end" aria-label="Page navigation example" size="sm">
              <CPaginationItem aria-label="Previous" disabled>
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
              <CPaginationItem active>1</CPaginationItem>
              <CPaginationItem>2</CPaginationItem>
              <CPaginationItem>3</CPaginationItem>
              <CPaginationItem aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </CPaginationItem>
            </CPagination>
          </CRow>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default AdminList
