import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormText,
  CFormTextarea,
  CImage,
  CRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CKedtiorCustom from '../../../components/customEditor/ckEditorCustom'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import '../detail/css/addProductDetail.css'
import { data } from 'autoprefixer'
import { formatNumber, unformatNumber } from '../../../helper/utils'
import useDebounce from '../../../helper/debounce'
import axios from 'axios'
import { meta } from 'eslint-plugin-prettier'

function AddProductDetail() {
  const [descEditor, setDescEditor] = useState('')
  const [promotionEditor, setPromotionEditor] = useState('')
  const [videoEditor, setVideoEditor] = useState('')

  // category
  const [categories, setCategories] = useState([])

  // brand
  const [brands, setBrands] = useState([])

  // status
  const [status, setStatus] = useState([])

  // properties
  const [dataProductProperties, setDataProductProperties] = useState([])

  // technology
  const [tech, setTech] = useState({})
  const [tempTech, setTempTech] = useState({}) // Temporary state for input handling
  const debouncedTempTech = useDebounce(tempTech, 300) // Use debounce with a delay of 300ms

  // selected technology option
  const [selectedTechOptions, setSelectedTechOptions] = useState([])

  const [choosenCategory, setChoosenCategory] = useState('1')

  const [selectedCategory, setSelectedCategory] = useState([])

  const [selectedStatus, setSelectedStatus] = useState([])

  const [activeTab, setActiveTab] = useState('tab1')

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  // editor
  const [editorData, setEditorData] = useState('')
  // upload image and show image
  const [selectedFile, setSelectedFile] = useState('')
  const [file, setFile] = useState([])

  const initialValues = {
    title: '',
    friendlyUrl: '',
    pageTitle: '',
    metaKeywords: '',
    metaDescription: '',
    syndicationCode: '',
    productCodeNumber: '',
    productCode: '',
    price: 0,
    marketPrice: 0,
    brand: '',
    status: '',
    visible: 0,
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc.'),
    friendlyUrl: Yup.string().required('Chuỗi đường dẫn là bắt buộc .'),
    // parentId: Yup.string().required('Chọn danh mục cha là bắt buộc.'),
    pageTitle: Yup.string().required('Tiêu đề trang là bắt buộc.'),
    metaDesc: Yup.string().required('metaDescription là bắt buộc.'),
    metaKeyword: Yup.string().required('metaKeywords là bắt buộc.'),
    visible: Yup.string().required('Hiển thị là bắt buộc.'),
  })

  const fetchData = async () => {
    try {
      const [categoriesResult, brandsResult, statusResult] = await Promise.allSettled([
        axios.get('http://192.168.245.190:8000/api/category'),
        axios.get('http://192.168.245.190:8000/api/brand?type=all'),
        axios.get('http://192.168.245.190:8000/api/productStatus'),
      ])

      if (categoriesResult.status === 'fulfilled') {
        setCategories(categoriesResult.value.data)
      } else {
        console.error('Fetch categories data error', categoriesResult.reason)
      }

      if (brandsResult.status === 'fulfilled' && brandsResult.value.data.status === true) {
        setBrands(brandsResult.value.data.list)
      } else {
        console.error('Fetch brands data error', brandsResult.reason)
      }

      if (statusResult.status === 'fulfilled' && statusResult.value.data.status === 'success') {
        setStatus(statusResult.value.data.list.data)
      } else {
        console.error('Fetch status data error', statusResult.reason)
      }
    } catch (error) {
      console.error('Fetch data error', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchProductProperties = async () => {
    try {
      const response = await axios.get(
        `http://192.168.245.190:8000/api/cat-option?catId=${choosenCategory}`,
      )
      const data = response.data.listOption

      if (data) {
        setDataProductProperties(data)
      }
    } catch (error) {
      console.error('Fetch data categories is error', error)
    }
  }

  useEffect(() => {
    fetchProductProperties()
  }, [choosenCategory])

  useEffect(() => {
    setTech(debouncedTempTech)
  }, [debouncedTempTech])

  const handleTextareaChange = (propId, value) => {
    setTempTech((prevTempTech) => ({
      ...prevTempTech,
      [propId]: value,
    }))
  }

  //set img category
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

  const handleEditorChange = (data) => {
    setEditorData(data)
  }

  const handleSubmit = (values) => {
    console.log('>>>>check values', values)
    //api for submit
  }

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <h3>THÊM MỚI SẢN PHẨM</h3>
        </CCol>
        <CCol md={{ span: 4, offset: 4 }}>
          <div className="d-flex justify-content-end">
            <Link to={`/product`}>
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
          {({ setFieldValue, values }) => (
            <Form>
              <CRow>
                <CCol md={9}>
                  <CCol md={12}>
                    {/* <label htmlFor="title-input"></label> */}
                    <Field name="title">
                      {({ field }) => (
                        <CFormInput
                          {...field}
                          type="text"
                          id="title-input"
                          placeholder="Nhập tiêu đề ở tại đây"
                        />
                      )}
                    </Field>
                    <ErrorMessage name="title" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="visible-select">Bài viết mô tả sản phẩm</label>
                    <CKedtiorCustom data={editorData} onChangeData={handleEditorChange} />
                  </CCol>

                  <CCol md={12}>
                    <div className="tabs">
                      <button
                        className={activeTab === 'tab1' ? 'active' : ''}
                        onClick={() => handleTabClick('tab1')}
                      >
                        Mô tả
                      </button>
                      <button
                        className={activeTab === 'tab2' ? 'active' : ''}
                        onClick={() => handleTabClick('tab2')}
                      >
                        Thông tin khuyến mãi
                      </button>

                      <button
                        className={activeTab === 'tab3' ? 'active' : ''}
                        onClick={() => handleTabClick('tab3')}
                      >
                        Video
                      </button>

                      <button
                        className={activeTab === 'tab4' ? 'active' : ''}
                        onClick={() => handleTabClick('tab4')}
                      >
                        Thông số kỹ thuật
                      </button>
                    </div>
                    <div className="tab-contents">
                      <div className={`tab-content ${activeTab === 'tab1' ? 'active' : ''}`}>
                        <CCol md={12}>
                          <CKedtiorCustom
                            data={descEditor}
                            onChangeData={(data) => setDescEditor(data)}
                          />
                        </CCol>
                      </div>
                      <div className={`tab-content ${activeTab === 'tab2' ? 'active' : ''}`}>
                        <CCol md={12}>
                          <CKedtiorCustom
                            data={promotionEditor}
                            onChangeData={(data) => setPromotionEditor(data)}
                          />
                        </CCol>
                      </div>
                      <div className={`tab-content ${activeTab === 'tab3' ? 'active' : ''}`}>
                        <CCol md={12}>
                          <CKedtiorCustom
                            data={videoEditor}
                            onChangeData={(data) => setVideoEditor(data)}
                          />
                        </CCol>
                      </div>
                      <div className={`tab-content ${activeTab === 'tab4' ? 'active' : ''}`}>
                        <CCol md={12}>
                          <table>
                            {dataProductProperties &&
                              dataProductProperties.length > 0 &&
                              dataProductProperties?.map((prop) => (
                                <tr key={prop.title}>
                                  <th>{prop.title}</th>
                                  <td>
                                    <CFormTextarea
                                      id={`textarea_${prop.op_id}`}
                                      onChange={(e) =>
                                        handleTextareaChange(prop.op_id, e.target.value)
                                      }
                                    ></CFormTextarea>

                                    <div className="d-flex gap-3 flex-wrap mt-2">
                                      {prop?.optionChild?.map((option) => (
                                        <CFormCheck
                                          key={option?.op_id}
                                          label={option?.title}
                                          aria-label="Default select example"
                                          defaultChecked={option?.op_id}
                                          id={`flexCheckDefault_${option?.op_id}`}
                                          value={option?.op_id}
                                          checked={selectedTechOptions.includes(option?.op_id)}
                                          onChange={(e) => {
                                            const optionId = option?.op_id
                                            const isChecked = e.target.checked
                                            if (isChecked) {
                                              setSelectedTechOptions([
                                                ...selectedTechOptions,
                                                optionId,
                                              ])
                                            } else {
                                              setSelectedTechOptions(
                                                selectedTechOptions.filter((id) => id !== optionId),
                                              )
                                            }
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </table>
                        </CCol>
                      </div>
                    </div>
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
                    <ErrorMessage name="email" component="div" className="text-danger" />
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
                </CCol>

                <CCol md={3}>
                  <CCol md={12}>
                    <label htmlFor="color-input">Mã Syndication</label>
                    <Field name="color" type="text" as={CFormInput} id="color-input" />
                    <ErrorMessage name="color" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="color-input">Mã số</label>
                    <Field
                      name="color"
                      type="text"
                      as={CFormInput}
                      id="color-input"
                      text="Nếu không nhập mã số hoặc mã số đã tồn tại. Hệ thống sẽ tự tạo mã số theo chuẩn."
                    />
                    <ErrorMessage name="color" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="color-input">Mã kho</label>
                    <Field
                      name="color"
                      type="text"
                      as={CFormInput}
                      id="color-input"
                      text="Nếu không nhập mã kho hoặc mã kho đã tồn tại. Hệ thống sẽ tự tạo mã kho theo chuẩn."
                    />
                    <ErrorMessage name="color" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <Field name="minPrice">
                      {({ field }) => (
                        <CFormInput
                          {...field}
                          type="text"
                          id="minPrice-input"
                          // value={formatNumber(field.value)}
                          label="Giá thị trường"
                          onChange={(e) => {
                            const rawValue = unformatNumber(e.target.value)
                            setFieldValue(field.name, rawValue)
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="minPrice" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <Field name="maxPrice">
                      {({ field }) => (
                        <CFormInput
                          {...field}
                          type="text"
                          id="maxPrice-input"
                          // value={formatNumber(field.value)}
                          label="Giá bán"
                          onChange={(e) => {
                            const rawValue = unformatNumber(e.target.value)
                            setFieldValue(field.name, rawValue)
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="maxPrice" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="categories-select">Nghành hàng</label>
                    <Field
                      name="categories"
                      as={CFormSelect}
                      id="categories-select"
                      className="select-input"
                      value={choosenCategory}
                      onChange={(e) => setChoosenCategory(e.target.value)}
                      options={
                        categories && categories.length > 0
                          ? categories.map((cate) => ({
                              label: cate?.category_desc?.cat_name,
                              value: cate.cat_id,
                            }))
                          : []
                      }
                    />
                    <ErrorMessage name="categories" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <div className="border p-3 bg-white">
                    <React.Fragment>
                      <strong>Danh mục sản phẩm</strong>
                      <div className="mt-2">
                        {categories &&
                          categories.length > 0 &&
                          categories
                            ?.filter((cate) => cate.cat_id == choosenCategory)[0]
                            .sub_categories?.map((subCate) => (
                              <CFormCheck
                                key={subCate?.cat_id}
                                label={subCate?.category_desc?.cat_name}
                                aria-label="Default select example"
                                defaultChecked={subCate?.category_desc.cat_id}
                                id={`flexCheckDefault_${subCate?.category_desc.cat_id}`}
                                value={subCate?.category_desc.cat_id}
                                checked={selectedCategory.includes(subCate?.category_desc.cat_id)}
                                onChange={(e) => {
                                  const cateId = subCate?.category_desc.cat_id
                                  const isChecked = e.target.checked
                                  if (isChecked) {
                                    setSelectedCategory([...selectedCategory, cateId])
                                  } else {
                                    setSelectedCategory(
                                      selectedCategory.filter((id) => id !== cateId),
                                    )
                                  }
                                }}
                              />
                            ))}
                      </div>
                    </React.Fragment>
                  </div>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="categories-select">Thương hiệu</label>
                    <Field
                      name="categories"
                      as={CFormSelect}
                      id="categories-select"
                      className="select-input"
                      options={
                        brands && brands.length > 0
                          ? brands.map((brand) => ({
                              label: brand?.title,
                              value: brand.brandId,
                            }))
                          : []
                      }
                    />
                    <ErrorMessage name="categories" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <div className="border p-3 bg-white">
                    <React.Fragment>
                      <strong>Trạng thái</strong>
                      <div className="mt-2">
                        {status &&
                          status.length > 0 &&
                          status.map((item) => (
                            <CFormCheck
                              key={item?.status_id}
                              label={item?.name}
                              aria-label="Default select example"
                              defaultChecked={item?.status_id}
                              id={`flexCheckDefault_${item?.status_id}`}
                              value={item?.status_id}
                              checked={selectedStatus.includes(item?.status_id)}
                              onChange={(e) => {
                                const statusId = item?.status_id
                                const isChecked = e.target.checked
                                if (isChecked) {
                                  setSelectedStatus([...selectedStatus, statusId])
                                } else {
                                  setSelectedStatus(selectedStatus.filter((id) => id !== statusId))
                                }
                              }}
                            />
                          ))}
                      </div>
                    </React.Fragment>
                  </div>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="visible-select">Tình trạng</label>
                    <Field
                      name="visible"
                      as={CFormSelect}
                      id="visible-select"
                      className="select-input"
                      options={[
                        { label: 'Còn hàng', value: 0 },
                        { label: 'Liên hệ', value: 1 },
                        { label: 'Hàng đang về', value: 2 },
                      ]}
                    />
                    <ErrorMessage name="visible" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <CFormInput
                      name="picture"
                      type="file"
                      id="formFile"
                      label="Hình ảnh"
                      onChange={(e) => onFileChange(e)}
                      size="sm"
                    />
                    <br />
                    <ErrorMessage name="picture" component="div" className="text-danger" />

                    <div>
                      {file.length == 0 ? (
                        <div>
                          <CImage
                            src={`http://192.168.245.190:8000/uploads/` + selectedFile}
                            width={370}
                          />
                        </div>
                      ) : (
                        file.map((item, index) => <CImage key={index} src={item} width={370} />)
                      )}
                    </div>
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="visible-select">Đăng sản phẩm</label>
                    <Field
                      name="visible"
                      as={CFormSelect}
                      id="visible-select"
                      className="select-input"
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
                      Thêm mới
                    </CButton>
                  </CCol>
                </CCol>
              </CRow>
            </Form>
          )}
        </Formik>
      </CRow>
    </CContainer>
  )
}

export default AddProductDetail
