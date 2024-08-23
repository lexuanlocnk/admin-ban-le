import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CImage,
  CRow,
} from '@coreui/react'
import React, { useState } from 'react'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { axiosClient, imageBaseUrl } from '../../axiosConfig'
import { formatNumber, unformatNumber } from '../../helper/utils'

function ProductConfig() {
  // upload image and show image
  const [selectedFile, setSelectedFile] = useState('')
  const [file, setFile] = useState([])

  const initialValues = {
    point: '10000',
    productPerPage: '10',
    widthImage: '300',
    pageTitle: '',
    metaKeyword: '',
    metaDesc: '',
    visible: 1,
  }

  const validationSchema = Yup.object({
    // title: Yup.string().required('Tiêu đề là bắt buộc.'),
    // friendlyUrl: Yup.string().required('Chuỗi đường dẫn là bắt buộc.'),
    // pageTitle: Yup.string().required('Tiêu đề bài viết là bắt buộc.'),
    // metaKeyword: Yup.string().required('Meta keywords là bắt buộc.'),
    // metaDesc: Yup.string().required('Meta description là bắt buộc.'),
    // visible: Yup.string().required('Cho phép hiển thị là bắt buộc.'),
  })

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

  // const fetchDataById = async (setValues) => {
  //   try {
  //     const response = await axiosClient.get(`product/brand/${id}/edit`)
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
    console.log('>>>> values', values)

    // try {
    //   const response = await axiosClient.put('/product', {
    //     pageTitle: values.pageTitle,
    //     metaKeyword: values.metaKeyword,
    //     metaDesc: values.metaDesc,
    //     moneyPerPoint: values.point,
    //     productPerPage: values.productPerPage,
    //     width: values.widthImage,
    //     display: values.visible,
    //     picture: selectedFile,
    //   })

    //   if (response.data.status === true) {
    //     // notify
    //   }
    // } catch (error) {
    //   console.error('Put product config data is error', error)
    // }
  }

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <h3>CẤU HÌNH SẢN PHẨM</h3>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={8}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, setValues }) => {
              // useEffect(() => {
              //   fetchDataById(setValues)
              // }, [setValues, id])
              return (
                <Form>
                  <h6>Search Engine Optimization</h6>
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
                    <ErrorMessage name="pageTitle" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="metaKeyword-input">Meta keywords</label>
                    <Field
                      name="metaKeyword"
                      type="text"
                      as={CFormInput}
                      id="metaKeyword-input"
                      text="Độ dài của meta keywords chuẩn là từ 100 đến 150 ký tự, trong đó có ít nhất 4 dấu phẩy (,)."
                    />
                    <ErrorMessage name="metaKeyword" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="metaDesc-input">Meta description</label>
                    <Field
                      name="metaDesc"
                      type="text"
                      as={CFormInput}
                      id="metaDesc-input"
                      text="Thẻ meta description chỉ nên dài khoảng 140 kí tự để có thể hiển thị hết được trên Google. Tối đa 200 ký tự."
                    />
                    <ErrorMessage name="metaDesc" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <h6>Cấu hình trang danh sách</h6>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="point-input">
                      Điểm (Quy đổi 1 điểm bằng bao nhiêu tiền, đơn vị vnđ)
                    </label>
                    <Field name="point">
                      {({ field }) => (
                        <CFormInput
                          {...field}
                          type="text"
                          id="point-input"
                          value={formatNumber(field.value)}
                          label="Giá thị trường"
                          onChange={(e) => {
                            const rawValue = unformatNumber(e.target.value)
                            setFieldValue(field.name, rawValue)
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="point" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="productPerPage-input">Số sản phẩm xem trên 1 trang</label>
                    <Field
                      name="productPerPage"
                      type="text"
                      as={CFormInput}
                      id="productPerPage-input"
                    />
                    <ErrorMessage name="productPerPage" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="widthImage-input">Chiều ngang ảnh</label>
                    <Field name="widthImage" type="text" as={CFormInput} id="widthImage-input" />
                    <ErrorMessage name="widthImage" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="visible-select">Hiển thị ảnh no-photo</label>
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

                  <CCol md={12}>
                    <CFormInput
                      name="avatar"
                      type="file"
                      id="formFile"
                      label="Ảnh no photo"
                      size="sm"
                      onChange={(e) => onFileChange(e)}
                    />
                    <br />
                    <ErrorMessage name="avatar" component="div" className="text-danger" />

                    <div>
                      {file.length == 0 ? (
                        <div>
                          <CImage src={`${imageBaseUrl}` + selectedFile} width={370} />
                        </div>
                      ) : (
                        file.map((item, index) => <CImage key={index} src={item} width={370} />)
                      )}
                    </div>
                  </CCol>
                  <br />

                  <CCol xs={12}>
                    <CButton color="primary" type="submit" size="sm">
                      {'Lưu thay đổi'}
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

export default ProductConfig