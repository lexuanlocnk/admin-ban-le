import React, { useEffect, useRef, useState } from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CImage,
  CRow,
  CTable,
} from '@coreui/react'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { axiosClient } from '../../axiosConfig'

function EditMember() {
  const location = useLocation()

  const params = new URLSearchParams(location.search)
  const id = params.get('id')

  const initialValues = {
    userName: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    dob: '',
    point: '',
    pointUsed: '',
    status: 0,
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc.'),
    friendlyUrl: Yup.string().required('Chuỗi đường dẫn là bắt buộc.'),
    pageTitle: Yup.string().required('Tiêu đề bài viết là bắt buộc.'),
    metaKeyword: Yup.string().required('Meta keywords là bắt buộc.'),
    metaDesc: Yup.string().required('Meta description là bắt buộc.'),
    visible: Yup.string().required('Cho phép hiển thị là bắt buộc.'),
  })

  const fetchDataById = async (setValues) => {
    try {
      const response = await axiosClient.get(`/admin/member/${id}/edit`)
      // const data = response.data.brand
      // if (data) {
      //   setValues({
      //     title: data.brand_desc.title,
      //     description: data.brand_desc.description,
      //     friendlyUrl: data.brand_desc.friendly_url,
      //     pageTitle: data.brand_desc.friendly_title,
      //     metaKeyword: data.brand_desc.metakey,
      //     metaDesc: data.brand_desc.metadesc,
      //     visible: data.display,
      //   })
      //   setSelectedFile(data.picture)
      // } else {
      //   console.error('No data found for the given ID.')
      // }
    } catch (error) {
      console.error('Fetch data id product brand is error', error.message)
    }
  }

  useEffect(() => {
    fetchDataById()
  }, [])

  const handleSubmit = async (values) => {
    try {
      const response = await axios.put(`http://192.168.245.190:8000/api/brand/${id}`, {
        description: values.description,
        title: values.title,
        friendly_url: values.friendlyUrl,
        friendly_title: values.pageTitle,
        metakey: values.metaKeyword,
        metadesc: values.metaDesc,
        display: values.visible,
        picture: selectedFile,
      })

      if (response.data.status === true) {
        toast.success('Cập nhật thương hiệu thành công')
      } else {
        console.error('No data found for the given ID.')
      }
    } catch (error) {
      console.error('Put data id product brand is error', error.message)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    }
  }

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol md={6}>
          <h2>CHỈNH SỬA THÀNH VIÊN</h2>
        </CCol>
        <CCol md={6}>
          <div className="d-flex justify-content-end">
            <Link to={'/member'}>
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={8}>
          <h6>{'Thông tin đăng nhập'}</h6>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, setValues }) => {
              useEffect(() => {
                fetchDataById(setValues)
              }, [setValues, id])
              return (
                <Form>
                  <CCol md={12}>
                    <label htmlFor="userName-input">Tên đăng nhập</label>
                    <Field name="userName">
                      {({ field }) => (
                        <CFormInput
                          {...field}
                          disabled
                          type="text"
                          id="userName-input"
                          text="Không thể thay đổi."
                        />
                      )}
                    </Field>
                    <ErrorMessage name="userName" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="password-input">Mật khẩu</label>
                    <Field
                      name="password"
                      type="password"
                      as={CFormInput}
                      id="password-input"
                      text="Tối thiểu 6 ký tự. Nếu mật khẩu rỗng giữ lại mật khẩu cũ."
                    />
                    <ErrorMessage name="password" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <h6>Thông tin tài khoản</h6>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="fullName-input">Họ tên</label>
                    <Field name="fullName" type="text" as={CFormInput} id="fullName-input" />
                    <ErrorMessage name="fullName" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="email-input">Thư điện tử</label>
                    <Field name="email" type="text" as={CFormInput} id="email-input" />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="phone-input">Điện thoại</label>
                    <Field name="phone" type="text" as={CFormInput} id="phone-input" />
                    <ErrorMessage name="phone" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="address-input">Địa chỉ</label>
                    <Field name="address" type="text" as={CFormInput} id="address-input" />
                    <ErrorMessage name="address" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="gender-input">Giới tính</label>
                    <Field name="gender" type="text" as={CFormInput} id="gender-input" />
                    <ErrorMessage name="gender" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="dob-input">Ngày sinh</label>
                    <Field name="dob" type="text" as={CFormInput} id="dob-input" />
                    <ErrorMessage name="dob" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <h6>Thông tin khác</h6>
                  <CCol md={12}>
                    <label htmlFor="point-input">Điểm</label>
                    <Field name="point" type="text" as={CFormInput} id="point-input" />
                    <ErrorMessage
                      name="point"
                      component="div"
                      className="text-danger"
                      text={'Điểm tích lũy khi mua hàng.'}
                    />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="pointUsed-input">Điểm đã sử dụng</label>
                    <Field name="pointUsed" type="text" as={CFormInput} id="pointUsed-input" />
                    <ErrorMessage
                      name="pointUsed"
                      component="div"
                      className="text-danger"
                      text={'Điểm thành viên đã sử dụng.'}
                    />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="status-select">Trạng thái tài khoản</label>
                    <Field
                      name="status"
                      as={CFormSelect}
                      id="status-select"
                      options={[
                        { label: 'Đang chờ kích hoạt', value: '0' },
                        { label: 'Đang hoạt động', value: '1' },
                      ]}
                    />
                    <ErrorMessage name="status" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol xs={12}>
                    <CButton color="primary" type="submit" size="sm">
                      Cập nhật
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

export default EditMember
