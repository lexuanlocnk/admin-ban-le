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
} from '@coreui/react'
import React, { useEffect, useState } from 'react'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, useLocation } from 'react-router-dom'
import { axiosClient, imageBaseUrl } from '../../../axiosConfig'

import { toast } from 'react-toastify'

function EditAddressManagement() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const id = searchParams.get('id')

  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  const initialValues = {
    title: '',
    companyName: '',
    address: '',
    phone: '',
    mail: '',
    website: '',
    workTime: '',
    map: '',
    visible: 0,
  }

  const validationSchema = Yup.object({
    // question: Yup.string().required('Nội dung câu hỏi là bắt buộc.'),
    // name: Yup.string().required('Tên người hỏi là bắt buộc.'),
    // category: Yup.string().required('Danh mục tư vấn là bắt buộc.'),
    // visible: Yup.string().required('Cho phép hiển thị là bắt buộc.'),
  })

  const fetchDataById = async (setValues) => {
    try {
      const response = await axiosClient.get(`admin/contact-config/${id}/edit`)
      const data = response.data.data

      if (data) {
        setValues({
          title: data?.title,
          companyName: data?.company,
          workTime: data?.work_time,
          address: data?.address,
          phone: data?.phone,
          mail: data?.email,
          website: data?.website,
          map: data?.map,
          visible: data?.display,
        })
      } else {
        console.error('No data found for the given ID.')
      }
      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch data id intro is error', error.message)
    }
  }

  const handleSubmit = async (values) => {
    try {
      const response = await axiosClient.put(`admin/contact-config/${id}`, {
        title: values.title,
        company: values.companyName,
        address: values.address,
        phone: values.phone,
        email: values.mail,
        website: values.website,
        work_time: values.workTime,
        map: values.map,
        display: values.visible,
      })
      if (response.data.status === true) {
        toast.success('Chỉnh sửa địa chỉ thành công!')
      }
      if (response.data.status === false && response.data.mess == 'no permission') {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Put data address is error', error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
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
            <CCol>
              <h2>CHỈNH SỬA SỔ ĐỊA CHỈ</h2>
            </CCol>
            <CCol md={6}>
              <div className="d-flex justify-content-end">
                <Link to={'/address'}>
                  <CButton color="primary" type="button" size="sm">
                    Danh sách
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol md={10}>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, setValues, values }) => {
                  useEffect(() => {
                    fetchDataById(setValues)
                  }, [setValues, id])
                  return (
                    <Form>
                      <CCol md={8}>
                        <label htmlFor="title-input">Tiêu đề</label>
                        <Field name="title">
                          {({ field }) => <CFormInput {...field} type="text" id="title-input" />}
                        </Field>
                        <ErrorMessage name="title" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={8}>
                        <label htmlFor="companyName-input">Tên công ty</label>
                        <Field name="companyName">
                          {({ field }) => (
                            <CFormInput {...field} type="text" id="companyName-input" />
                          )}
                        </Field>
                        <ErrorMessage name="companyName" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={8}>
                        <label htmlFor="address-input">Địa chỉ</label>
                        <Field name="address">
                          {({ field }) => <CFormInput {...field} type="text" id="address-input" />}
                        </Field>
                        <ErrorMessage name="address" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="phone-input">Điện thoại</label>
                        <Field
                          name="phone"
                          type="text"
                          as={CFormTextarea}
                          id="phone-input"
                          style={{ height: 100 }}
                        />
                        <ErrorMessage name="phone" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={8}>
                        <label htmlFor="mail-input">Thư điện tử</label>
                        <Field name="mail" type="text" as={CFormInput} id="mail-input" />
                        <ErrorMessage name="mail" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={8}>
                        <label htmlFor="website-input">Website</label>
                        <Field name="website">
                          {({ field }) => <CFormInput {...field} type="text" id="website-input" />}
                        </Field>
                        <ErrorMessage name="website" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={8}>
                        <label htmlFor="workTime-input">Giờ làm việc</label>
                        <Field name="workTime">
                          {({ field }) => <CFormInput {...field} type="text" id="workTime-input" />}
                        </Field>
                        <ErrorMessage name="workTime" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      {/* <div style="width: 100%"><iframe width="100%" height="250" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=250&amp;hl=en&amp;q=245A%20Tr%E1%BA%A7n%20Quang%20Kh%E1%BA%A3i,%20Ph%C6%B0%E1%BB%9Dng%20T%C3%A2n%20%C4%90%E1%BB%8Bnh,%20Qu%E1%BA%ADn%201,%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh+(Showroom%20Ch%C3%ADnh%20Nh%C3%A2n)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/">gps devices</a></iframe></div> */}

                      <CCol md={12}>
                        <label htmlFor="map-input">Bản đồ</label>
                        <Field
                          name="map"
                          type="text"
                          as={CFormTextarea}
                          id="map-input"
                          style={{ height: 200 }}
                          text={'Tạo map từ trang: https://www.maps.ie/create-google-map/'}
                        />

                        <ErrorMessage name="map" component="div" className="text-danger" />
                        <br />

                        {values.map ? (
                          <div dangerouslySetInnerHTML={{ __html: values.map }} />
                        ) : (
                          'Không có sitemap cho địa chỉ'
                        )}
                      </CCol>

                      <CCol md={12} className="mt-4">
                        <label htmlFor="visible-select">Hiển thị</label>
                        <Field
                          className={'w-50'}
                          name="visible"
                          as={CFormSelect}
                          id="visible-select"
                          options={[
                            { label: 'Không', value: 0 },
                            { label: 'Có', value: 1 },
                          ]}
                        />
                        <ErrorMessage name="visible" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol xs={12}>
                        <CButton color="primary" type="submit" size="sm">
                          {'Cập nhật'}
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

export default EditAddressManagement
