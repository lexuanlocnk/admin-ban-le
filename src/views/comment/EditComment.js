import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CImage,
  CRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import { axiosClient } from '../../axiosConfig'
import CKedtiorCustom from '../../components/customEditor/ckEditorCustom'
import Avatar from '../../assets/images/avatars/avatar.png'
import moment from 'moment'
import { toast } from 'react-toastify'

function EditComment() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const id = searchParams.get('id')

  const [customerComment, setCustomerComment] = useState('')
  const [adminComment, setAdminComment] = useState('')
  const [responseFor, setResponseFor] = useState('')

  const initialValues = {
    name: '',
    email: '',
    responseFor: '',
    dateSend: '',
    adminReply: '',
    visible: 0,
  }

  const fetchDataById = async (setValues) => {
    try {
      const response = await axiosClient.get(`admin/comment/${id}/edit`)
      const data = response.data.listComment

      if (data && response.data.status === true) {
        setValues({
          name: data?.name,
          email: data?.email,
          dateSend: moment(data?.created_at).format('DD-MM-YYYY, hh:mm:ss A'),
          adminReply: response.data.commentParentid?.content,
          visible: data?.display,
        })
        setCustomerComment(data?.content)
        setAdminComment('')
        setResponseFor(data?.product_desc)
      } else {
        console.error('No data found for the given ID.')
      }
    } catch (error) {
      console.error('Fetch data id comment is error', error.message)
    }
  }

  const handleSubmit = async (values) => {
    try {
      const response = await axiosClient.put(`admin/comment/${id}`, {
        reply: values.adminReply,
        display: values.visible,
      })

      if (response.data.status === true) {
        toast.success('Cập nhật bình luận thành công')
      } else {
        console.error('No data found for the given ID.')
      }
    } catch (error) {
      console.error('Put data id comment is error', error.message)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    }
  }

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <h2>TRẢ LỜI BÌNH LUẬN</h2>
        </CCol>
        <CCol md={{ span: 4, offset: 4 }}>
          <div className="d-flex justify-content-end">
            <Link to={`/comment`}>
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={8}>
          <h6>{'Trả lời bình luận'}</h6>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ setFieldValue, setValues }) => {
              useEffect(() => {
                fetchDataById(setValues)
              }, [setValues])
              return (
                <Form>
                  <CCol md={12}>
                    <label htmlFor="name-input">Tác giả</label>
                    <Field name="name">
                      {({ field }) => (
                        <CFormInput {...field} type="text" id="name-input" disabled />
                      )}
                    </Field>
                    <ErrorMessage name="name" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="email-input">Thư điện tử</label>
                    <Field name="email" type="text" as={CFormInput} id="email-input" disabled />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <CImage rounded thumbnail src={Avatar} width={100} height={100} />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="responseFor-input">Trả lời cho: </label>
                    <Link
                      to={`http://192.168.245.154:3000/detail-product/${responseFor?.friendly_url}`}
                    >
                      {responseFor?.title}
                    </Link>
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="dateSend-input">Ngày gửi</label>
                    <Field
                      name="dateSend"
                      type="text"
                      as={CFormInput}
                      id="dateSend-input"
                      disabled
                    />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <CFormLabel>Nội dung bình luận</CFormLabel>
                    <CKedtiorCustom
                      data={customerComment}
                      onChangeData={(data) => setCustomerComment(data)}
                    />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="adminReply-input">Admin trả lời</label>
                    <Field
                      style={{ height: '200px' }}
                      name="adminReply"
                      type="text"
                      as={CFormTextarea}
                      id="adminReply-input"
                    />
                    <ErrorMessage name="adminReply" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="visible-select">Hiển thị</label>
                    <Field
                      name="visible"
                      as={CFormSelect}
                      id="visible-select"
                      options={[
                        { label: 'Không', value: '0' },
                        { label: 'Có', value: '1' },
                      ]}
                    />
                    <ErrorMessage name="visible" component="div" className="text-danger" />
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

export default EditComment
