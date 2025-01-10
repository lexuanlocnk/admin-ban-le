import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CRow,
  CSpinner,
} from '@coreui/react'

import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { axiosClient } from '../../../axiosConfig'

function AddProductPropertiesNew() {
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const catId = searchParams.get('cat_id')

  const [category, setCategory] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  const [showAddAttribute, setShowAddAttribute] = useState(false)
  const [newAttribute, setNewAttribute] = useState('')
  const [attributes, setAttributes] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const initialValues = {
    title: '',
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc.'),
  })

  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get(`admin/category`)
      const data = response.data.data

      if (data && response.data.status === true) {
        setCategory(data)
      }
    } catch (error) {
      console.error('Fetch data categories is error', error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddAttribute = () => {
    if (newAttribute.trim()) {
      setAttributes([...attributes, newAttribute.trim()])
      setNewAttribute('')
      setShowAddAttribute(false)
    }
  }

  const handleRemoveAttribute = (index) => {
    const updatedAttributes = attributes.filter((_, i) => i !== index)
    setAttributes(updatedAttributes)
  }

  const handleSubmit = async (values) => {
    // api for submit
    try {
      setIsLoading(true)
      const response = await axiosClient.post('admin/properties', {
        title: values.title,
        cat_id: selectedCategory,
        attributes,
      })
      if (response.data.status === true) {
        toast.success('Thêm mới thuộc tính thành công.')
      }
      if (response.data.status === false && response.data.mess == 'no permission') {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Post product properties data error', error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol md={6}>
          <h2>THÊM MỚI THUỘC TÍNH</h2>
        </CCol>
        <CCol md={6}>
          <div className="d-flex justify-content-end">
            <Link to={`/product/properties`}>
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={8}>
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
                        text="Tên riêng sẽ hiển thị lên trang web của bạn."
                      />
                    )}
                  </Field>
                  <ErrorMessage name="title" component="div" className="text-danger" />
                </CCol>
                <br />

                <div
                  className="border p-3 bg-white"
                  style={{
                    maxHeight: 400,
                    minHeight: 250,
                    overflowY: 'scroll',
                  }}
                >
                  <React.Fragment>
                    <h6>Danh mục sản phẩm</h6>
                    <div className="mt-2">
                      {category &&
                        category.length > 0 &&
                        category.map((item) => (
                          <>
                            <CFormCheck
                              key={item?.cat_id}
                              label={item?.category_desc?.cat_name}
                              defaultChecked={item?.cat_id}
                              id={`flexCheckDefault_${item?.cat_id}`}
                              value={item?.cat_id}
                              checked={selectedCategory.includes(item?.cat_id)}
                              onChange={(e) => {
                                const cateId = item?.cat_id
                                const isChecked = e.target.checked
                                if (isChecked) {
                                  setSelectedCategory([...selectedCategory, cateId])
                                } else {
                                  setSelectedCategory(
                                    selectedCategory.filter((id) => id !== cateId),
                                  )
                                }
                              }}
                            />
                          </>
                        ))}
                    </div>
                  </React.Fragment>
                </div>
                <br />

                <CCol md={12}>
                  <CButton
                    color="secondary"
                    size="sm"
                    onClick={() => setShowAddAttribute(!showAddAttribute)}
                  >
                    Thêm mới dữ liệu thuộc tính
                  </CButton>

                  {showAddAttribute && (
                    <div className="mt-3 d-flex align-items-center">
                      <CFormInput
                        type="text"
                        value={newAttribute}
                        onChange={(e) => setNewAttribute(e.target.value)}
                        placeholder="Nhập thuộc tính mới"
                        className="me-2"
                      />
                      <CButton color="success" size="sm" onClick={handleAddAttribute}>
                        Thêm
                      </CButton>
                    </div>
                  )}

                  <div className="mt-3">
                    <h6 className="mb-3">Danh sách thuộc tính thêm mới:</h6>
                    {attributes.map((attr, index) => (
                      <>
                        <div key={index} className="d-flex align-items-center mb-2">
                          <img
                            src="https://media.vitinhnguyenkim.com/uploads/row-sub.gif"
                            alt="Subcategory"
                            className="mr-2"
                          />
                          <span className="me-2">{attr}</span>
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => handleRemoveAttribute(index)}
                          >
                            Xóa
                          </CButton>
                        </div>
                      </>
                    ))}
                  </div>
                </CCol>
                <br />

                <CCol xs={12}>
                  <CButton color="primary" type="submit" size="sm" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <CSpinner size="sm"></CSpinner> Đang cập nhật...
                      </>
                    ) : (
                      'Thêm mới'
                    )}
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

export default AddProductPropertiesNew
