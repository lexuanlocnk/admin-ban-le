import { CButton, CCol, CContainer, CFormInput, CFormSelect, CImage, CRow } from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

function ProductBanner() {
  const location = useLocation()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  // selected checkbox
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

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
    title: '',
    url: '',
    destination: '',
    width: '',
    height: '',
    desc: '',
    visible: '',
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc.'),
    // password: Yup.string().required('Mật khẩu là bắt buộc.'),
    // email: Yup.string().email('Địa chỉ email không hợp lệ.').required('Email là bắt buộc.'),
    // phone: Yup.string().required('Số điện thoại là bắt buộc.'),
    // displayName: Yup.string().required('Tên hiển thị là bắt buộc.'),
    // role: Yup.string().required('Vai trò là bắt buộc.'),
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

  const handleSubmit = async (values) => {
    console.log(values)
    // if (isEditing) {
    //   //call api update data
    // } else {
    //   //call api post new data
    // }
  }

  const handleAddNewClick = () => {
    navigate('/product/banner?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/product/banner?id=${id}&sub=edit`)
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

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <h3>BANNER SẢN PHẨM</h3>
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
            <Link to={`/product/category`}>
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
        {/* Form add/ edit */}
        <CCol md={4}>
          <h6>{!isEditing ? 'Thêm mới banner' : 'Cập nhật banner'}</h6>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form>
                <CCol md={12}>
                  <label htmlFor="title-input">Tiêu đề</label>
                  <Field name="title">
                    {({ field }) => (
                      <CFormInput
                        {...field}
                        type="text"
                        id="title-input"
                        ref={inputRef}
                        text="Tiêu đề được sử dụng trên trang mạng của bạn và làm thẻ ALT của banner."
                      />
                    )}
                  </Field>
                  <ErrorMessage name="title" component="div" className="text-danger" />
                </CCol>
                <br />

                <CCol md={12}>
                  <label htmlFor="avatar-input">Hình ảnh</label>
                  <div>
                    <CFormInput
                      type="file"
                      id="avatar-input"
                      size="sm"
                      onChange={handleImageUpload}
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
                  </div>
                </CCol>
                <br />

                <CCol md={12}>
                  <label htmlFor="url-input">Liên kết</label>
                  <Field
                    name="url"
                    type="url"
                    as={CFormInput}
                    id="url-input"
                    text="Liên kết có hoặc không: https://vitinhnguyenkim.vn/"
                  />
                  <ErrorMessage name="url" component="div" className="text-danger" />
                </CCol>
                <br />
                <CCol md={12}>
                  <label htmlFor="destination-select">Đích đến</label>
                  <Field
                    className="component-size w-50"
                    name="destination"
                    as={CFormSelect}
                    id="destination-select"
                    text="Loại hiển thị của liên kết. Mặc định liên kết tại trang (_self)."
                    options={[
                      { label: 'Tại trang (_self)', value: '1' },
                      { label: 'Cửa sổ mới (_blank)', value: '2' },
                      { label: 'Cửa sổ cha (_parent)', value: '3' },
                      { label: 'Cửa sổ trên cùng (_top)', value: '4' },
                    ]}
                  />
                  <ErrorMessage name="destination" component="div" className="text-danger" />
                </CCol>
                <br />

                <CCol md={12}>
                  <label htmlFor="email-input">Chiều rộng</label>
                  <Field name="email" type="email" as={CFormInput} id="email-input" />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </CCol>
                <br />

                <CCol md={12}>
                  <label htmlFor="phone-input">Chiều cao</label>
                  <Field name="phone" type="text" as={CFormInput} id="phone-input" />
                  <ErrorMessage name="phone" component="div" className="text-danger" />
                </CCol>
                <br />

                <CCol md={12}>
                  <label htmlFor="display-name-input">Tên hiển thị</label>
                  <Field name="displayName" type="text" as={CFormInput} id="display-name-input" />
                  <ErrorMessage name="displayName" component="div" className="text-danger" />
                </CCol>
                <br />

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
                <br />

                <CCol xs={12}>
                  <CButton color="primary" type="submit" size="sm">
                    {isEditing ? 'Cập nhật' : 'Thêm mới'}
                  </CButton>
                </CCol>
              </Form>
            )}
          </Formik>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ProductBanner
