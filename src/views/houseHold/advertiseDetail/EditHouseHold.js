import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CImage,
  CRow,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, useLocation } from 'react-router-dom'
import { axiosClient, imageBaseUrl } from '../../../axiosConfig'
import { toast } from 'react-toastify'

const DEFAULT_FORM_VALUES = {
  title: '',
  id_pos: '',
  width: '',
  height: '',
  link: '',
  target: '_self',
  description: '',
  display: 0,
  menu_order: 0,
}

function EditHouseHold() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const id = searchParams.get('id')

  const [isPermissionCheck, setIsPermissionCheck] = useState(true)
  const [dataAdvertiseCategory, setDataAdvertiseCategory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState([])
  const [file, setFile] = useState([])
  const [pictureCurrent, setPictureCurrent] = useState('')
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES)

  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc.'),
    id_pos: Yup.string().required('Vị trí là bắt buộc.'),
  })

  const isNoPermission = (responseData) =>
    responseData?.status === false &&
    (responseData?.mess === 'no permission' || responseData?.message === 'no permission')

  const resolveImageUrl = (picture) => {
    if (!picture) {
      return `${imageBaseUrl}no-image.jpg`
    }

    if (picture.startsWith('http://') || picture.startsWith('https://')) {
      return picture
    }

    return `${imageBaseUrl}${picture}`
  }

  const onFileChange = (e) => {
    const files = e.target.files
    const selectedFiles = []
    const fileUrls = []

    Array.from(files).forEach((selected) => {
      fileUrls.push(URL.createObjectURL(selected))

      const fileReader = new FileReader()
      fileReader.readAsDataURL(selected)
      fileReader.onload = (event) => {
        selectedFiles.push(event.target.result)
        if (selectedFiles.length === files.length) {
          setSelectedFile(selectedFiles)
        }
      }
    })

    setFile(fileUrls)
  }

  const fetchDataAdvertiseCategory = async () => {
    try {
      const response = await axiosClient.get('admin/household/ad-pos/get-all')
      if (response.data.status === true) {
        setDataAdvertiseCategory(response.data.data || [])
      }
    } catch (error) {
      console.error('Fetch household ad positions is error', error)
    }
  }

  const fetchDataById = async () => {
    try {
      const response = await axiosClient.get(`admin/household/advertise/${id}/edit`)
      const responseData = response.data
      const data = responseData?.data

      if (data) {
        setFormValues({
          title: data?.title || '',
          id_pos: data?.id_pos || '',
          width: data?.width || '',
          height: data?.height || '',
          link: data?.link || '',
          target: data?.target || '_self',
          description: data?.description || '',
          display: data?.display ?? 0,
          menu_order: data?.menu_order ?? 0,
        })
        setPictureCurrent(data?.picture || '')
      }

      if (isNoPermission(responseData)) {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch household advertise detail is error', error.message)
    }
  }

  useEffect(() => {
    fetchDataAdvertiseCategory()
    if (id) {
      fetchDataById()
    }
  }, [id])

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true)
      const picturePayload = selectedFile.length > 0 ? selectedFile : pictureCurrent

      const response = await axiosClient.put(`admin/household/advertise/${id}`, {
        _method: 'PUT',
        id_pos: Number(values.id_pos),
        title: values.title,
        picture: picturePayload,
        width: Number(values.width),
        height: Number(values.height),
        link: values.link,
        target: values.target,
        description: values.description,
        display: Number(values.display),
        menu_order: Number(values.menu_order),
      })

      if (response.data.status === true) {
        toast.success('Cập nhật ads gia dụng thành công!')
      }

      if (isNoPermission(response.data)) {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Put household advertise is error', error)
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
            <CCol>
              <h3>CHỈNH SỬA ADS GIA DỤNG</h3>
            </CCol>
            <CCol md={6}>
              <div className="d-flex justify-content-end">
                <Link to={'/household'}>
                  <CButton color="primary" type="button" size="sm">
                    Danh sách
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol md={8}>
              <Formik
                enableReinitialize
                initialValues={formValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue }) => {
                  return (
                    <Form>
                      <CCol md={12}>
                        <label htmlFor="title-input">Tiêu đề</label>
                        <Field name="title">
                          {({ field }) => <CFormInput {...field} type="text" id="title-input" />}
                        </Field>
                        <ErrorMessage name="title" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <CFormInput
                          name="avatar"
                          type="file"
                          id="formFile"
                          label="Ảnh đại diện"
                          size="sm"
                          onChange={(e) => onFileChange(e)}
                        />
                        <br />
                        <ErrorMessage name="avatar" component="div" className="text-danger" />

                        <div>
                          {file.length > 0 ? (
                            file.map((item, index) => (
                              <CImage className="border" key={index} src={item} width={200} />
                            ))
                          ) : (
                            <CImage
                              className="border"
                              src={resolveImageUrl(pictureCurrent)}
                              width={200}
                            />
                          )}
                        </div>
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="id-pos-select">Vị trí hiển thị</label>
                        <Field
                          className="component-size"
                          name="id_pos"
                          as={CFormSelect}
                          id="id-pos-select"
                          onChange={(event) => {
                            const selectedValue = event.target.value
                            setFieldValue('id_pos', selectedValue)

                            const selectedCategory = dataAdvertiseCategory?.find(
                              (banner) => String(banner?.id) === String(selectedValue),
                            )

                            if (selectedCategory) {
                              setFieldValue('width', selectedCategory.width)
                              setFieldValue('height', selectedCategory.height)
                            } else {
                              setFieldValue('width', '')
                              setFieldValue('height', '')
                            }
                          }}
                          options={[
                            { label: 'Chọn vị trí', value: '' },
                            ...(dataAdvertiseCategory && dataAdvertiseCategory.length > 0
                              ? dataAdvertiseCategory.map((banner) => ({
                                  label: banner.title,
                                  value: banner.id,
                                }))
                              : []),
                          ]}
                        />
                        <ErrorMessage name="id_pos" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="width-input">Chiều rộng</label>
                        <Field readOnly name="width" type="text" as={CFormInput} id="width-input" />
                        <ErrorMessage name="width" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="height-input">Chiều cao</label>
                        <Field
                          readOnly
                          name="height"
                          type="text"
                          as={CFormInput}
                          id="height-input"
                        />
                        <ErrorMessage name="height" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="link-input">Liên kết</label>
                        <Field name="link" type="text" as={CFormInput} id="link-input" />
                        <ErrorMessage name="link" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="target-select">Đích đến</label>
                        <Field
                          className="component-size"
                          name="target"
                          as={CFormSelect}
                          id="target-select"
                          options={[
                            { label: 'Tại trang (_self)', value: '_self' },
                            { label: 'Cửa sổ mới (_blank)', value: '_blank' },
                            { label: 'Cửa sổ cha (_parent)', value: '_parent' },
                            { label: 'Cửa sổ trên cùng (_top)', value: '_top' },
                          ]}
                        />
                        <ErrorMessage name="target" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="description-input">Mô tả</label>
                        <Field
                          name="description"
                          type="text"
                          as={CFormTextarea}
                          id="description-input"
                          style={{ height: 100 }}
                        />
                        <ErrorMessage name="description" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="menu-order-input">Thứ tự hiển thị</label>
                        <Field
                          name="menu_order"
                          type="number"
                          as={CFormInput}
                          id="menu-order-input"
                        />
                        <ErrorMessage name="menu_order" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="display-select">Hiển thị</label>
                        <Field
                          name="display"
                          as={CFormSelect}
                          id="display-select"
                          options={[
                            { label: 'Không', value: 0 },
                            { label: 'Có', value: 1 },
                          ]}
                        />
                        <ErrorMessage name="display" component="div" className="text-danger" />
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

export default EditHouseHold
