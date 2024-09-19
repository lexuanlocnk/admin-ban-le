import { ErrorMessage, Field, Form, Formik } from 'formik'
import { CButton, CCol, CContainer, CFormCheck, CRow, CFormTextarea } from '@coreui/react'
import React, { useEffect, useState, useParams } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

function EditNewsletter() {
  const initialValues = {
    email: '',
  }

  const validationSchema = Yup.object({
    email: Yup.string().required('Email là bắt buộc.'),
  })

  //   const fetchDataNewsletter = async () => {
  //     try {
  //       const response = await axiosClient.get(`admin`)
  //       if (response.data.status === true) {
  //         setDataNewsletter(response.data.list)
  //       }
  //     } catch (error) {
  //       console.error('fetch Data Newsletter is error', error)
  //     }
  //   }

  //   useEffect(() => {
  //     fetchDataNewsletter()
  //   }, [])

  //   const fetchDataById = async (setValues) => {
  //     try {
  //       const response = await axiosClient.admin`get(`)
  //       const data = response.data.news
  //       if (data && response.data.status === true) {
  //         setValues({
  //           email: data?.news_desc?.title,
  //         })
  //
  //       } else {
  //         console.error('No data found for the given ID.')
  //       }

  //       if (response.data.status === false && response.data.mess == 'no permission') {
  //         setIsPermissionCheck(false)
  //       }
  //     } catch (error) {
  //       console.error('Fetch Data Newsletter id is error', error.message)
  //     }
  //   }

  //   useEffect(() => {
  //     fetchDataById()
  //   }, [])

  const handleSubmit = async (values) => {
    console.log('>>> check values', values)

    // try {
    //   const response = await axiosClient.put(`admin/`, {
    //     title: values.title,

    //   })

    //   if (response.data.status === 'success') {
    //     toast.success('Chỉnh sửa email thành công!')
    //   }

    //   if (response.data.status === false && response.data.mess == 'no permission') {
    //     toast.warn('Bạn không có quyền thực hiện tác vụ này!')
    //   }
    // } catch (error) {
    //   console.error('Post data news is error', error)
    //   toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    // }
  }
  return (
    <CContainer>
      <CRow className="mb-5">
        <CCol md={6}>
          <h2>CHỈNH SỬA NEWSLETTER</h2>
        </CCol>
        <CCol md={6}>
          <div className="d-flex justify-content-end">
            <Link to={`/newsletter`}>
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <CCol md={12}>
              <CRow>
                <CCol md={2}>
                  <label htmlFor="desc-input" className="form-label">
                    Danh sách email
                  </label>
                </CCol>
                <CCol md={8}>
                  <Field
                    style={{ height: '100px' }}
                    name="email"
                    type="email"
                    as={CFormTextarea}
                    text="Nhập vào đây một hoặc nhiều email. Mỗi email cách nhau bởi một dấu phẩy (,)"
                  />
                  <ErrorMessage name="email" component="div" className="text-danger" />

                  <CButton color="primary" type="submit" size="sm" className="mt-5">
                    Thêm mới
                  </CButton>
                </CCol>
              </CRow>
            </CCol>
          </Form>
        </Formik>
      </CRow>
    </CContainer>
  )
}

export default EditNewsletter
