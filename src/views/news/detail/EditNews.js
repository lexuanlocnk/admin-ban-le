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
} from '@coreui/react'
import React, { useEffect, useState } from 'react'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, useLocation } from 'react-router-dom'
import CKedtiorCustom from '../../../components/customEditor/ckEditorCustom'
import { axiosClient, imageBaseUrl } from '../../../axiosConfig'

import { toast } from 'react-toastify'

function EditNews() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const id = searchParams.get('id')

  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  const [editorData, setEditorData] = useState('')
  const [dataNewsCategory, setDataNewsCategroy] = useState([])
  const [selectedCateCheckbox, setSelectedCateCheckbox] = useState([])

  // loading button
  const [isLoading, setIsLoading] = useState(false)

  const initialValues = {
    title: '',
    desc: '',
    friendlyUrl: '',
    pageTitle: '',
    metaKeyword: '',
    metaDesc: '',
    visible: 0,
  }

  const validationSchema = Yup.object({
    // title: Yup.string().required('Tiêu đề là bắt buộc.'),
    // friendlyUrl: Yup.string().required('Chuỗi đường dẫn là bắt buộc.'),
    // pageTitle: Yup.string().required('Tiêu đề bài viết là bắt buộc.'),
    // metaKeyword: Yup.string().required('Meta keywords là bắt buộc.'),
    // metaDesc: Yup.string().required('Meta description là bắt buộc.'),
    // visible: Yup.string().required('Cho phép hiển thị là bắt buộc.'),
  })

  const fetchDataNewsCategory = async () => {
    try {
      const response = await axiosClient.get(`admin/news-category`)
      if (response.data.status === true) {
        setDataNewsCategroy(response.data.list)
      }
    } catch (error) {
      console.error('Fetch data news is error', error)
    }
  }

  useEffect(() => {
    fetchDataNewsCategory()
  }, [])

  const fetchDataById = async (setValues) => {
    try {
      const response = await axiosClient.get(`admin/news/${id}/edit`)
      const data = response.data.news
      if (data && response.data.status === true) {
        setValues({
          title: data?.news_desc?.title,
          desc: data?.news_desc?.short,
          friendlyUrl: data?.news_desc?.friendly_url,
          pageTitle: data?.news_desc?.friendly_title,
          metaKeyword: data?.news_desc?.metakey,
          metaDesc: data?.news_desc?.metadesc,
          visible: data?.display,
        })
        setSelectedFile(
          data.picture !== '' && data.picture !== null ? data?.picture : '66c854a8eb10e.png',
        )
        setEditorData(data?.news_desc?.description)
        setSelectedCateCheckbox(data?.list_cate)
      } else {
        console.error('No data found for the given ID.')
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch data id news is error', error.message)
    }
  }

  useEffect(() => {
    fetchDataById()
  }, [])

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true)
      const response = await axiosClient.put(`admin/news/${id}`, {
        title: values.title,
        description: editorData,
        short: values.desc,
        friendly_url: values.friendlyUrl,
        friendly_title: values.pageTitle,
        metakey: values.metaKeyword,
        metadesc: values.metaDesc,
        cat_id: selectedCateCheckbox,
        picture: selectedFile,
        display: values.visible,
      })

      if (response.data.status === 'success') {
        toast.success('Chỉnh sửa tin tức thành công!')
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Post data news is error', error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

  // upload image and show image
  const [selectedFile, setSelectedFile] = useState('')
  const [file, setFile] = useState([])

  //set img avatar
  function onFileChange(e) {
    const files = e.target.files
    const selectedFiles = []
    const fileUrls = []

    Array.from(files).forEach((file) => {
      // Create a URL for the file
      fileUrls.push(URL.createObjectURL(file))

      // Read the file as base64
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = (event) => {
        selectedFiles.push(event.target.result)
        // Set base64 data after all files have been read
        if (selectedFiles.length === files.length) {
          setSelectedFile(selectedFiles)
        }
      }
    })

    // Set file URLs for immediate preview
    setFile(fileUrls)
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
              <h3>CHỈNH SỬA TIN TỨC</h3>
            </CCol>
            <CCol md={6}>
              <div className="d-flex justify-content-end">
                <Link to={'/news'}>
                  <CButton color="primary" type="button" size="sm">
                    Danh sách
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol md={12}>
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
                      <CRow>
                        <CCol md={8}>
                          <CCol md={12}>
                            <label htmlFor="title-input">Tiêu đề </label>
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

                          <CCol md={12}>
                            <label htmlFor="visible-select">Nội dung bài viết</label>
                            <CKedtiorCustom
                              data={editorData}
                              onChangeData={(data) => setEditorData(data)}
                            />
                          </CCol>
                          <br />

                          <CCol md={12}>
                            <label htmlFor="desc-input">Mô tả ngắn</label>
                            <Field
                              name="desc"
                              type="text"
                              as={CFormTextarea}
                              id="desc-input"
                              style={{ height: 100 }}
                            />
                            <ErrorMessage name="desc" component="div" className="text-danger" />
                          </CCol>
                          <br />

                          <h6>Search Engine Optimization</h6>
                          <br />
                          <CCol md={12}>
                            <label htmlFor="url-input">Chuỗi đường dẫn</label>
                            <Field
                              name="friendlyUrl"
                              type="text"
                              as={CFormInput}
                              id="url-input"
                              text="Chuỗi dẫn tĩnh là phiên bản của tên hợp chuẩn với Đường dẫn (URL). Chuỗi này bao gồm chữ cái thường, số và dấu gạch ngang (-). VD: vi-tinh-nguyen-kim-to-chuc-su-kien-tri-an-dip-20-nam-thanh-lap"
                            />
                            <ErrorMessage
                              name="friendlyUrl"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                          <br />
                          <CCol md={12}>
                            <label htmlFor="pageTitle-input">Tiêu đề trang</label>
                            <Field
                              name="pageTitle"
                              type="text"
                              as={CFormInput}
                              id="pageTitle-input"
                              text="Độ dài của tiêu đề trang tối đa 60 ký tự."
                            />
                            <ErrorMessage
                              name="pageTitle"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                          <br />
                          <CCol md={12}>
                            <label htmlFor="metaKeyword-input">Meta keywords</label>
                            <Field
                              name="metaKeyword"
                              type="text"
                              as={CFormTextarea}
                              id="metaKeyword-input"
                              text="Độ dài của meta keywords chuẩn là từ 100 đến 150 ký tự, trong đó có ít nhất 4 dấu phẩy (,)."
                            />
                            <ErrorMessage
                              name="metaKeyword"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                          <br />
                          <CCol md={12}>
                            <label htmlFor="metaDesc-input">Meta description</label>
                            <Field
                              name="metaDesc"
                              type="text"
                              as={CFormTextarea}
                              id="metaDesc-input"
                              text="Thẻ meta description chỉ nên dài khoảng 140 kí tự để có thể hiển thị hết được trên Google. Tối đa 200 ký tự."
                            />
                            <ErrorMessage name="metaDesc" component="div" className="text-danger" />
                          </CCol>
                          <br />
                        </CCol>

                        <CCol md={4}>
                          <CCol
                            md={12}
                            className="border bg-white p-2 overflow-scroll"
                            style={{ height: 'auto' }}
                          >
                            <label
                              className="pb-2 mb-2 w-100"
                              style={{
                                fontWeight: 500,
                                fontSize: 16,
                                borderBottom: '1px solid #ddd',
                              }}
                              htmlFor="visible-input"
                            >
                              Danh mục bài viết
                            </label>

                            {dataNewsCategory &&
                              dataNewsCategory?.length > 0 &&
                              dataNewsCategory.map((item) => (
                                <CFormCheck
                                  style={{
                                    transform: 'scale(1.4)',
                                    accentColor: '#198754',
                                  }}
                                  key={item?.cat_id}
                                  aria-label="Default select example"
                                  defaultChecked={item?.cat_id}
                                  id={`flexCheckDefault_${item?.cat_id}`}
                                  value={item?.cat_id}
                                  checked={selectedCateCheckbox.includes(item?.cat_id)}
                                  label={item?.news_category_desc?.cat_name}
                                  onChange={(e) => {
                                    const catId = item?.cat_id
                                    const isChecked = e.target.checked
                                    if (isChecked) {
                                      setSelectedCateCheckbox([...selectedCateCheckbox, catId])
                                    } else {
                                      setSelectedCateCheckbox(
                                        selectedCateCheckbox.filter((id) => id !== catId),
                                      )
                                    }
                                  }}
                                />
                              ))}
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
                              {file.length == 0 ? (
                                <div>
                                  <CImage
                                    className="border"
                                    src={`${imageBaseUrl}${selectedFile}`}
                                    width={200}
                                    loading="lazy"
                                    onError={(e) => {
                                      e.target.onerror = null
                                      e.target.src = `${imageBaseUrl}no-image.jpg`
                                    }}
                                  />
                                </div>
                              ) : (
                                file.map((item, index) => (
                                  <CImage
                                    className="border"
                                    key={index}
                                    src={item}
                                    width={200}
                                    loading="lazy"
                                  />
                                ))
                              )}
                            </div>
                          </CCol>
                          <br />

                          <CCol md={12}>
                            <label htmlFor="visible-select">Hiển thị</label>
                            <Field
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
                        </CCol>
                      </CRow>
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

export default EditNews
