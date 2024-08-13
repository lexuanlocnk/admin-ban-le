import { CButton, CCol, CContainer, CFormInput, CFormSelect, CRow } from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import axios from 'axios'
import { toast } from 'react-toastify'

function PermissionGroup() {
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const sub = params.get('sub')

  const [cateParentData, setCateParentData] = useState([])
  const [cateChildData, setCateChildData] = useState([])

  const inputRef = useRef(null)

  const initialValues = {
    title: '',
    parentCate: '',
    childCate: '',
  }
  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc.'),
    // friendlyUrl: Yup.string().required('Chuỗi đường dẫn là bắt buộc.'),
    // pageTitle: Yup.string().required('Tiêu đề bài viết là bắt buộc.'),
    // metaKeyword: Yup.string().required('Meta keywords là bắt buộc.'),
    // metaDesc: Yup.string().required('Meta description là bắt buộc.'),
    // visible: Yup.string().required('Cho phép hiển thị là bắt buộc.'),
  })

  useEffect(() => {
    if (sub === 'add') {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [location.search])

  const fetchCateParent = async () => {
    try {
      const response = await axios.get(`http://192.168.245.190:8000/api/cate-parent-per`)
      if (response.data.status === true) {
        setCateParentData(response.data.data)
      }
    } catch (error) {
      console.error('Fetch data cate parent brand is error', error)
    }
  }

  useEffect(() => {
    fetchCateParent()
  }, [])

  const fetchCateChild = async () => {
    try {
      const response = await axios.get(`http://192.168.245.190:8000/api/cate-child-per`)
      if (response.data.status === true) {
        setCateChildData(response.data.data)
      }
    } catch (error) {
      console.error('Fetch data cate parent brand is error', error)
    }
  }

  useEffect(() => {
    fetchCateChild()
  }, [])

  // const fetchDataById = async (setValues) => {
  //   try {
  //     const response = await axios.get(`http://192.168.245.190:8000/api/brand/${id}/edit`)
  //     const data = response.data.brand
  //     if (data) {
  //       setValues({
  //         title: data.brand_desc.title,
  //         description: data.brand_desc.description,
  //         friendlyUrl: data.brand_desc.friendly_url,
  //         pageTitle: data.brand_desc.friendly_title,
  //         metaKeyword: data.brand_desc.metakey,
  //         metaDesc: data.brand_desc.metadesc,
  //         visible: data.display,
  //       })
  //       setSelectedFile(data.picture)
  //     } else {
  //       console.error('No data found for the given ID.')
  //     }
  //   } catch (error) {
  //     console.error('Fetch data id product brand is error', error.message)
  //   }
  // }

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://192.168.245.190:8000/api/brand', {
        title: values.title,
      })

      if (response.data.status === true) {
        toast.success('Thêm mới thương hiệu thành công!')
        fetchDataBrands()
      }
    } catch (error) {
      console.error('Post data product brand is error', error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    }
  }

  const handleAddNewClick = () => {
    navigate('/admin/permissions-group?sub=add')
  }

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol md={{ span: 6 }}>
          <h3>Bảng phân quyền theo tab quản trị</h3>
        </CCol>
        <CCol md={{ span: 6 }}>
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
            <Link to={'/admin/permissions-group'}>
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={4}>
          <h6>{'Thêm tab quản trị và quyền'}</h6>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, setValues }) => {
              return (
                <Form>
                  <CCol md={12}>
                    <label htmlFor="categories-select">Chọn tab quản trị cha</label>
                    <Field
                      className="component-size "
                      name="categories"
                      as={CFormSelect}
                      id="categories-select"
                      text="Lựa chọn danh mục sẽ thêm tab quản trị trong Admin."
                      options={
                        cateParentData &&
                        cateParentData.length > 0 &&
                        cateParentData.map((cate) => ({
                          label: cate?.name,
                          value: cate?.name,
                        }))
                      }
                    />
                    <ErrorMessage name="categories" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="categories-select">Chọn tab quản trị con</label>
                    <Field
                      className="component-size "
                      name="categories"
                      as={CFormSelect}
                      id="categories-select"
                      text="Lựa chọn danh mục sẽ thêm tab quản trị trong Admin."
                      options={
                        cateChildData &&
                        cateChildData.length > 0 &&
                        cateChildData.map((cate) => ({
                          label: cate?.name,
                          value: cate?.name,
                        }))
                      }
                    />
                    <ErrorMessage name="categories" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="permissions-select">Quyền hạn</label>
                    <Field
                      className="component-size w-50"
                      name="permissions"
                      as={CFormSelect}
                      id="permissions-select"
                      options={[
                        { label: 'manage', value: 'manage' },
                        { label: 'add', value: 'add' },
                        { label: 'edit', value: 'edit' },
                        { label: 'del', value: 'del' },
                        { label: 'update', value: 'update' },
                        { label: 'import', value: 'import' },
                        { label: 'export', value: 'export' },
                      ]}
                    />
                    <ErrorMessage name="permissions" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol xs={12}>
                    <CButton color="primary" type="submit" size="sm">
                      {'Thêm mới'}
                    </CButton>
                  </CCol>
                </Form>
              )
            }}
          </Formik>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default PermissionGroup
