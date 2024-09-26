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
  CSpinner,
  CTable,
} from '@coreui/react'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { axiosClient } from '../../axiosConfig'
import moment from 'moment'

function EditMember() {
  const location = useLocation()

  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  const [isLoading, setIsLoading] = useState(false)

  const params = new URLSearchParams(location.search)
  const id = params.get('id')

  const initialValues = {
    userName: '',
    password: '',
    provider: '',
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
    // title: Yup.string().required('Tiêu đề là bắt buộc.'),
    // friendlyUrl: Yup.string().required('Chuỗi đường dẫn là bắt buộc.'),
    // pageTitle: Yup.string().required('Tiêu đề bài viết là bắt buộc.'),
    // metaKeyword: Yup.string().required('Meta keywords là bắt buộc.'),
    // metaDesc: Yup.string().required('Meta description là bắt buộc.'),
    // visible: Yup.string().required('Cho phép hiển thị là bắt buộc.'),
  })

  const fetchDataById = async (setValues) => {
    try {
      const response = await axiosClient.get(`/admin/member/${id}/edit`)
      const data = response.data.member
      if (data) {
        setValues({
          userName: data?.username,
          fullName: data?.full_name,
          provider: data?.provider,
          email: data?.email,
          phone: data?.phone,
          address: data?.address,
          gender: data?.gender == 'female' ? 'Nam' : 'Nữ',
          dob: data?.dateOfBirth,
          point: response?.data?.orderPoints,
          pointUsed: response?.data?.accumulatedPoints,
        })
        setSelectedFile(data.picture)
      } else {
        console.error('No data found for the given ID.')
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch data id member is error', error.message)
    }
  }

  useEffect(() => {
    fetchDataById()
  }, [])

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true)
      const response = await axiosClient.put(`/admin/member/${id}`, {
        // username: values.userName,
        fullname: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        gender: values.gender,
        dateOfBirth: values.dob,
      })
      if (response.data.status === true) {
        toast.success('Cập nhật thông tin thành công')
      } else {
        console.error('No data found for the given ID.')
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Put data id member is error', error.message)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CContainer>
      {!isPermissionCheck ? (
        <h5>
          <div>Bạn không đủ quyền để thao tác trên danh mục quản trị này.</div>
          <div className="mt-4">
            Vui lòng quay lại trang chủ <Link to={'/dashboard'}>(Nhấn vào để quay lại)</Link>
          </div>
        </h5>
      ) : (
        <>
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
                        <label htmlFor="provider-input">Hình thức đăng nhập</label>
                        <Field
                          name="provider"
                          type="text"
                          as={CFormInput}
                          id="provider-input"
                          disabled
                        />
                        <ErrorMessage name="provider" component="div" className="text-danger" />
                      </CCol>
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
                        <Field
                          name="dob"
                          type="text"
                          as={CFormInput}
                          id="dob-input"
                          text={'Định dạng ngày sinh: DD/MM/YYYY'}
                        />
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
                          options={[{ label: 'Đang hoạt động', value: '1' }]}
                        />
                        <ErrorMessage name="status" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol xs={12}>
                        <CButton color="primary" type="submit" size="sm" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <CSpinner size="sm"></CSpinner> Đang cập nhật...
                            </>
                          ) : (
                            'Cập nhật'
                          )}
                        </CButton>
                      </CCol>
                    </Form>
                  )
                }}
              </Formik>
            </CCol>
          </CRow>
        </>
      )}
    </CContainer>
  )
}

export default EditMember
