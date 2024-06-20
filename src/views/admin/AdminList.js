import React, { useEffect, useRef, useState } from 'react'
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
  CFormCheck,
} from '@coreui/react'
import './css/adminList.css'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import DeletedModal from '../../components/deletedModal/DeletedModal'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

function AdminList() {
  const location = useLocation()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  // image upload
  const [selectedImage, setSelectedImage] = useState(null)
  const [isCollapse, setIsCollapse] = useState(false)

  // search input
  const [dataSearch, setDataSearch] = useState('')

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  // show deleted Modal
  const [visible, setVisible] = useState(false)

  // form formik value
  const initialValues = {
    username: '',
    password: '',
    email: '',
    phone: '',
    displayName: '',
    avatar: null,
    role: '',
  }

  const validationSchema = Yup.object({
    username: Yup.string().required('Tên đăng nhập là bắt buộc.'),
    password: Yup.string().required('Mật khẩu là bắt buộc.'),
    email: Yup.string().email('Địa chỉ email không hợp lệ.').required('Email là bắt buộc.'),
    phone: Yup.string().required('Số điện thoại là bắt buộc.'),
    displayName: Yup.string().required('Tên hiển thị là bắt buộc.'),
    avatar: Yup.mixed().required('Ảnh đại diện là bắt buộc.'),
    role: Yup.string().required('Vai trò là bắt buộc.'),
  })

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const id = params.get('id')
    const sub = params.get('sub')

    if (sub === 'add') {
      setIsEditing(false)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } else if (sub === 'edit' && id) {
      setIsEditing(true)
      fetchDataById(id)
    }
  }, [location.search])

  const fetchDataById = async (id, dataSearch) => {
    //api?search={dataSearch}
  }

  const handleSubmit = async (e, values) => {
    console.log(values)
    // if (isEditing) {
    //   //call api update data
    // } else {
    //   //call api post new data
    // }
  }

  const handleAddNewClick = () => {
    navigate('/admin/list?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/admin/list?id=${id}&sub=edit`)
  }

  // delete row
  const handleDelete = (id) => {
    setVisible(true)
  }

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  const handleImageUpload = (event) => {
    setSelectedImage(event.target.files[0])
  }

  const handleImageRemove = () => {
    setSelectedImage(null)
  }

  // pagination data

  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1
    if (newPage < 2) {
      setPageNumber(newPage)
      window.scrollTo(0, 0)
      return
    }
    window.scrollTo(0, 0)
    setPageNumber(newPage)
  }

  // search Data
  const handleSearch = (keyword) => {
    fetchDataById(keyword)
  }

  // const handleImageSubmit = async (e, values) => {
  //   if (selectedImage) {
  //     const formData = new FormData()
  //     formData.append('image', selectedImage)

  //     try {
  //       await axios.post('/api/upload', formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       })
  //       console.log('Ảnh đã được upload thành công!')
  //     } catch (error) {
  //       console.error('Lỗi khi upload ảnh:', error)
  //     }
  //   }
  // }

  const items = [
    {
      id: <CFormCheck id="flexCheckDefault" />,
      username: 'quocnguyen',
      role: 'administrator',
      visited: '10:51, 20/04/2024',
      actions: (
        <div>
          <button onClick={() => handleEditClick(1)} className="button-action mr-2 bg-info">
            <CIcon icon={cilColorBorder} className="text-white" />
          </button>
          <button onClick={() => handleDelete(1)} className="button-action bg-danger">
            <CIcon icon={cilTrash} className="text-white" />
          </button>
        </div>
      ),
      _cellProps: { id: { scope: 'row' } },
    },
  ]

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

  return (
    <CContainer>
      <DeletedModal visible={visible} setVisible={setVisible} />
      <CRow className="mb-3">
        <CCol>
          <h5>QUẢN LÝ TÀI KHOẢN AMDIN</h5>
        </CCol>
        <CCol md={{ span: 4, offset: 4 }}>
          <div className="d-flex justify-content-end">
            <CButton
              onClick={handleAddNewClick}
              color="primary"
              type="submit"
              size="sm"
              className="button-add"
            >
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
          <h6>{!isEditing ? 'Thêm admin mới' : 'Cập nhật tài khoản admin'}</h6>
          {/* <CForm className="row gy-3">
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
                {isEditing ? 'Cập nhật' : 'Thêm mới'}
              </CButton>
            </CCol>
          </CForm> */}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form>
                <CForm className="row gy-3">
                  <CCol md={12}>
                    <label htmlFor="username-input">Tên đăng nhập</label>
                    <Field name="username" type="text" as={CFormInput} id="username-input" />
                    <ErrorMessage name="username" component="div" className="text-danger" />
                  </CCol>

                  <CCol md={12}>
                    <label htmlFor="password-input">Mật khẩu</label>
                    <Field name="password" type="password" as={CFormInput} id="password-input" />
                    <ErrorMessage name="password" component="div" className="text-danger" />
                  </CCol>

                  <CCol md={12}>
                    <label htmlFor="email-input">Thư điện tử</label>
                    <Field name="email" type="email" as={CFormInput} id="email-input" />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </CCol>

                  <CCol md={12}>
                    <label htmlFor="phone-input">Số điện thoại</label>
                    <Field name="phone" type="text" as={CFormInput} id="phone-input" />
                    <ErrorMessage name="phone" component="div" className="text-danger" />
                  </CCol>

                  <CCol md={12}>
                    <label htmlFor="display-name-input">Tên hiển thị</label>
                    <Field name="displayName" type="text" as={CFormInput} id="display-name-input" />
                    <ErrorMessage name="displayName" component="div" className="text-danger" />
                  </CCol>

                  <CCol md={12}>
                    <label htmlFor="avatar-input">Ảnh đại diện</label>
                    <input
                      id="avatar-input"
                      name="avatar"
                      type="file"
                      onChange={(event) => {
                        setFieldValue('avatar', event.target.files[0])
                        handleImageUpload(event)
                      }}
                    />
                    <ErrorMessage name="avatar" component="div" className="text-danger" />

                    {selectedImage && (
                      <div>
                        <CImage
                          className="mt-2"
                          src={URL.createObjectURL(selectedImage)}
                          alt="Ảnh đã upload"
                          width={300}
                        />
                        <CButton
                          className="mt-2"
                          color="danger"
                          size="sm"
                          onClick={handleImageRemove}
                        >
                          Xóa
                        </CButton>
                      </div>
                    )}
                  </CCol>

                  <CCol md={12}>
                    <label htmlFor="role-select">Vai trò</label>
                    <Field
                      name="role"
                      as={CFormSelect}
                      id="role-select"
                      options={[
                        { label: 'Biên tập viên', value: '1' },
                        { label: 'Quản trị web', value: '2' },
                        { label: 'Marketing', value: '3' },
                      ]}
                    />
                    <ErrorMessage name="role" component="div" className="text-danger" />
                  </CCol>

                  <CCol xs={12}>
                    <CButton color="primary" type="submit" size="sm">
                      {isEditing ? 'Cập nhật' : 'Thêm mới'}
                    </CButton>
                  </CCol>
                </CForm>
              </Form>
            )}
          </Formik>
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
                      <input
                        type="text"
                        className="search-input"
                        value={dataSearch}
                        onChange={(e) => setDataSearch(e.target.value)}
                      />
                      <button onClick={() => handleSearch(dataSearch)} className="submit-btn">
                        Submit
                      </button>
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </CRow>
          <CRow>
            <CCol className="my-2" md={4}>
              <CButton color="primary" size="sm">
                Xóa vĩnh viễn
              </CButton>
            </CCol>
          </CRow>
          <CRow>
            <CTable className="mt-2" columns={columns} items={items} />
            <div className="d-flex justify-content-end">
              <ReactPaginate
                pageCount={Math.round(20 / 10)}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                onPageChange={handlePageChange}
                containerClassName={'pagination'}
                activeClassName={'active'}
                previousLabel={'<<'}
                nextLabel={'>>'}
              />
            </div>
          </CRow>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default AdminList
