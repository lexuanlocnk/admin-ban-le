import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
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
import axios from 'axios'

const fakeData = [
  {
    id: 1,
    category_desc: {
      cat_id: 1,
      cat_name: 'Laptop',
    },
    sub_categories: [
      {
        cat_id: 179,
        category_desc: {
          cat_id: 179,
          cat_name: 'Laptop HP',
        },
      },
    ],
  },
]

function AddProductCategory() {
  // image upload
  const [selectedImage, setSelectedImage] = useState(null)
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [dataCustomerSupport, setDataCustomerSupport] = useState([
    {
      id: 1,
      name: 'Ms.Phương',
    },
    {
      id: 2,
      name: 'Ms.Thu',
    },
  ])

  const initialValues = {
    title: '',
    homeTitle: '',
    friendlyUrl: '',
    parentId: '',
    color: '',
    visibleBrands: [],
    visibleSupport: [],
    description: '',
    pageTitle: '',
    metaDesc: '',
    metaKeyword: '',
    visible: '',
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc.'),
    friendlyUrl: Yup.string().required('Chuỗi đường dẫn là bắt buộc .'),
    parentId: Yup.string().required('Chọn danh mục cha là bắt buộc.'),
    pageTitle: Yup.string().required('Tiêu đề trang là bắt buộc.'),
    metaDesc: Yup.string().required('metaDescription là bắt buộc.'),
    metaKeyword: Yup.string().required('metaKeywords là bắt buộc.'),
    visible: Yup.string().required('Hiển thị là bắt buộc.'),
  })

  const fetchCategoriesData = async () => {
    try {
      const response = await axios.get('http://192.168.245.190:8000/api/category')
      setCategories(response.data)
    } catch (error) {
      console.error('Fetch categories data error', error)
    }
  }

  useEffect(() => {
    fetchCategoriesData()
  }, [])

  // const fetchBrandData = async () => {
  //   try {
  //     const response = await axios.get('http://192.168.245.190:8000/api/brand')
  //     if ((response.data.status = true)) {
  //       setBrands(response.data.list)
  //     }
  //   } catch (error) {
  //     console.error('Fetch brands data error', error)
  //   }
  // }

  // useEffect(() => {
  //   fetchBrandData()
  // }, [])

  const handleImageUpload = (event) => {
    setSelectedImage(event.target.files[0])
  }

  const handleImageRemove = () => {
    setSelectedImage(null)
  }

  const handleSubmit = async (values) => {
    console.log('>>>check values', values)
    // async requets fetch

    try {
      const response = await axios.post('http://192.168.245.190:8000/api/category', {})
    } catch (error) {
      console.error('Post product category data error', error)
    }
  }
  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <h5>THÊM DANH MỤC MỚI</h5>
        </CCol>
        <CCol md={{ span: 4, offset: 4 }}>
          <div className="d-flex justify-content-end">
            <CButton color="primary" type="submit" size="sm">
              Danh sách
            </CButton>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol md={8}>
          <h6></h6>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values }) => (
              <Form>
                <CCol md={12}>
                  <label htmlFor="title-input">Tên danh mục</label>
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
                  <label htmlFor="url-input">Chuỗi đường dẫn</label>
                  <Field
                    name="friendlyUrl"
                    type="text"
                    as={CFormInput}
                    id="url-input"
                    text="Chuỗi dẫn tĩnh là phiên bản của tên hợp chuẩn với Đường dẫn (URL). Chuỗi này bao gồm chữ cái thường, số và dấu gạch ngang (-). VD: vi-tinh-nguyen-kim-to-chuc-su-kien-tri-an-dip-20-nam-thanh-lap"
                  />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </CCol>
                <br />

                <CCol md={12}>
                  <label htmlFor="category-select">Là con của</label>
                  <Field
                    name="parentId"
                    as={CFormSelect}
                    id="category-select"
                    onChange={(e) => setFieldValue('parentId', e.target.value)}
                    className="select-input"
                  >
                    <option value="0">Trống (0)</option>
                    {categories &&
                      categories.map((item) => (
                        <optgroup key={item.category_desc.cat_id}>
                          <option value={item.category_desc.cat_id}>
                            {item.category_desc.cat_name} ({item.category_desc.cat_id})
                          </option>
                          {item.sub_categories &&
                            item.sub_categories.map((subItem) => (
                              <option key={subItem.cat_id} value={subItem.cat_id}>
                                + {subItem.category_desc.cat_name} ({subItem?.cat_id})
                              </option>
                            ))}
                        </optgroup>
                      ))}
                  </Field>
                  <ErrorMessage name="parentId" component="div" className="text-danger" />
                </CCol>
                <br />

                <CCol md={12}>
                  <label htmlFor="avatar-input">Hình ảnh</label>
                  <div>
                    <CFormInput
                      type="file"
                      id="avatar-input"
                      size="sm"
                      onChange={handleImageUpload}
                    />
                    <ErrorMessage name="avatar" component="div" className="text-danger" />
                    {selectedImage && (
                      <div>
                        <CImage
                          className="mt-2"
                          src={URL.createObjectURL(selectedImage)}
                          alt="Ảnh đã upload"
                          width={300}
                        />
                        <CButton
                          className="mt-2"
                          color="danger"
                          size="sm"
                          onClick={handleImageRemove}
                        >
                          Xóa
                        </CButton>
                      </div>
                    )}
                  </div>
                </CCol>
                <br />

                <CCol md={12}>
                  <label htmlFor="color-input">Màu sắc</label>
                  <Field name="color" type="text" as={CFormInput} id="color-input" />
                  <ErrorMessage name="color" component="div" className="text-danger" />
                </CCol>
                <br />

                {/* <CCol md={12} className="overflow-scroll" style={{ height: '300px' }}>
                  <label htmlFor="visible-select">Thương hiệu</label>
                  {brands &&
                    brands.length > 0 &&
                    brands.map((item) => (
                      <div key={item.brandId}>
                        <Field
                          type="checkbox"
                          name="visibleBrands"
                          as={CFormCheck}
                          id={`brand-${item.brandId}`}
                          value={item.brandId}
                          label={item.title}
                          checked={values.visibleBrands.includes(item.brandId)}
                          onChange={() => {
                            const newValue = values.visibleBrands.includes(item.brandId)
                              ? values.visibleBrands.filter((id) => id !== item.brandId)
                              : [...values.visibleBrands, item.brandId]
                            setFieldValue('visibleBrands', newValue)
                          }}
                        />
                      </div>
                    ))}
                  <ErrorMessage name="visibleBrands" component="div" className="text-danger" />
                </CCol>
                <br /> */}

                <CCol md={12}>
                  <label htmlFor="visible-select">Nhân viên kinh doanh</label>
                  {dataCustomerSupport &&
                    dataCustomerSupport.length > 0 &&
                    dataCustomerSupport.map((item) => (
                      <div key={item.brand_id}>
                        <Field
                          type="checkbox"
                          name="visibleSupport"
                          as={CFormCheck}
                          id={`brand-${item.id}`}
                          value={item.id}
                          label={item.name}
                          checked={values.visibleSupport.includes(item.id)}
                          onChange={() => {
                            const newValue = values.visibleSupport.includes(item.id)
                              ? values.visibleSupport.filter((id) => id !== item.id)
                              : [...values.visibleSupport, item.id]
                            setFieldValue('visibleSupport', newValue)
                          }}
                        />
                      </div>
                    ))}
                  <ErrorMessage name="visibleSupport" component="div" className="text-danger" />
                </CCol>
                <br />

                <CCol md={12}>
                  <label htmlFor="desc-input">Mô tả</label>
                  <Field
                    style={{ height: '100px' }}
                    name="description"
                    type="text"
                    as={CFormTextarea}
                    id="desc-input"
                    text="Mô tả bình thường không được sử dụng trong giao diện, tuy nhiên có vài giao diện hiện thị mô tả này."
                  />
                  <ErrorMessage name="description" component="div" className="text-danger" />
                </CCol>
                <br />

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

                <CCol md={12}>
                  <label htmlFor="visible-select">Hiển thị</label>
                  <Field
                    name="visible"
                    as={CFormSelect}
                    id="visible-select"
                    className="select-input"
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
                    Thêm mới
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

export default AddProductCategory
