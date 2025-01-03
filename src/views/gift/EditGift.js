import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'
import { Link, useLocation } from 'react-router-dom'

import CKedtiorCustom from '../../components/customEditor/ckEditorCustom'
import { formatNumber } from 'chart.js/helpers'
import { unformatNumber } from '../../helper/utils'
import moment from 'moment'
import { toast } from 'react-toastify'
import { axiosClient } from '../../axiosConfig'

function EditGift() {
  const [categories, setCategories] = useState([])
  const [editorData, setEditorData] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const id = searchParams.get('id')

  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  const initialValues = {
    title: '',
    releaseCode: '',
    startDate: new Date(),
    endDate: new Date(),
    minPrice: 0,
    maxPrice: 0,
    applyGiftType: 0,
    industry: 'all',
    applyToProductCategories: [],
    ordersHaveProductCode: '',
    visible: 1,
  }

  const validationSchema = Yup.object({
    title: Yup.string().min(6, 'Tối thiểu 6 ký tự').required('Tên đợt phát hành là bắt buộc.'),
    releaseCode: Yup.string().min(6, 'Tối thiểu 6 ký tự').required('Mã đợt phát hành là bắt buộc'),
    startDate: Yup.date().required('Thời gian bắt đầu là bắt buộc.'),
    endDate: Yup.date()
      .required('Thời gian kết thúc là bắt buộc.')
      .test('is-greater', 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu!', function (value) {
        const { startDate } = this.parent
        return value && startDate ? value > startDate : true
      }),

    minPrice: Yup.number()
      .required('Bắt buộc')
      .positive('Giá phải lớn hơn 0')
      .integer('Giá phải là số nguyên'),
    maxPrice: Yup.number()
      .required('Bắt buộc')
      .positive('Giá phải lớn hơn 0')
      .integer('Giá phải là số nguyên')
      .moreThan(Yup.ref('minPrice'), 'Giá sau phải lớn hơn giá trước'),
  })

  const fetchCategoriesData = async () => {
    try {
      const response = await axiosClient.get('admin/category')
      setCategories(response.data.data)
    } catch (error) {
      console.error('Fetch categories data error', error)
    }
  }

  useEffect(() => {
    fetchCategoriesData()
  }, [])

  const fetchDataGift = async (setValues) => {
    try {
      const response = await axiosClient.get(`admin/present/${id}/edit`)
      const data = response.data.data

      if (data && response.data.status === true) {
        setValues({
          title: data.title,
          releaseCode: data.code,
          minPrice: data.priceMin,
          maxPrice: data.priceMax,
          startDate: new Date(moment.unix(data.StartDate)),
          endDate: new Date(moment.unix(data.EndDate)),
          applyGiftType: data.type,
          ordersHaveProductCode: data.ordersHaveProductCode,
          industry: data.cat_parent_id,
          visible: data.display,
          applyToProductCategories: data.list_cat,
        })
        setEditorData(data?.content)
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch data gift is error', error)
    }
  }

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true)
      const response = await axiosClient.put(`admin/present/${id}`, {
        title: values.title,
        code: values.releaseCode,
        cat_parent_id: [values.industry],
        list_cat: values.applyToProductCategories,
        list_product: values.ordersHaveProductCode,
        content: editorData,
        type: values.applyGiftType,
        display: values.visible,
        priceMin: values.minPrice,
        priceMax: values.maxPrice,
        StartDate: values.startDate,
        EndDate: values.endDate,
      })

      if (response.data.status === true) {
        toast.success('Cập nhật quà tặng thành công')
      }
      if (response.data.status === false && response.data.mess == 'no permission') {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Post gift data is error', error)
      toast.error('Đã xảy ra lỗi! Vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditorChange = (data) => {
    setEditorData(data)
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
              <h3>CẬP NHẬT QÙA TẶNG</h3>
            </CCol>
            <CCol md={{ span: 4, offset: 4 }}>
              <div className="d-flex justify-content-end">
                <Link to={`/gift`}>
                  <CButton color="primary" type="submit" size="sm">
                    Danh sách
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol md={8}>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, values, setValues }) => {
                  useEffect(() => {
                    fetchDataGift(setValues)
                  }, [setValues])

                  return (
                    <Form>
                      <CCol md={12}>
                        <label htmlFor="title-input">Tên đợt phát hành</label>
                        <Field
                          name="title"
                          type="text"
                          as={CFormInput}
                          id="title-input"
                          text="Tối thiểu 6 ký tự."
                        />
                        <ErrorMessage name="title" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="releaseCode-input">Mã đợt phát hành</label>
                        <Field
                          name="releaseCode"
                          type="text"
                          as={CFormInput}
                          id="releaseCode-input"
                          text="Tối thiểu 6 ký tự. VD:160724_quatang_latop"
                        />
                        <ErrorMessage name="releaseCode" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <div>
                        <label>Thời gian áp dụng từ</label>
                        <div className="d-flex align-items-center mb-2">
                          <DatePicker
                            dateFormat={'dd-MM-yyyy'}
                            showIcon
                            selected={values.startDate}
                            onChange={(date) => setFieldValue('startDate', date)}
                          />
                          <p className="m-2">{'đến ngày'}</p>
                          <DatePicker
                            dateFormat={'dd-MM-yyyy'}
                            showIcon
                            selected={values.endDate}
                            onChange={(date) => setFieldValue('endDate', date)}
                          />
                        </div>
                        <ErrorMessage name="startDate" component="p" className="text-danger" />
                        <ErrorMessage name="endDate" component="p" className="text-danger" />
                      </div>
                      <br />

                      <div>
                        <CFormLabel>Khoảng giá</CFormLabel>
                        <CRow>
                          <CCol md={6}>
                            <Field name="minPrice">
                              {({ field }) => (
                                <CFormInput
                                  {...field}
                                  type="text"
                                  id="minPrice-input"
                                  value={formatNumber(field.value)}
                                  text={'Mệnh giá VNĐ'}
                                  onChange={(e) => {
                                    const rawValue = unformatNumber(e.target.value)
                                    setFieldValue(field.name, rawValue)
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage name="minPrice" component="div" className="text-danger" />
                          </CCol>

                          <CCol md={6}>
                            <Field name="maxPrice">
                              {({ field }) => (
                                <CFormInput
                                  {...field}
                                  type="text"
                                  id="maxPrice-input"
                                  value={formatNumber(field.value)}
                                  text={'Mệnh giá VNĐ'}
                                  onChange={(e) => {
                                    const rawValue = unformatNumber(e.target.value)
                                    setFieldValue(field.name, rawValue)
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage name="maxPrice" component="div" className="text-danger" />
                          </CCol>
                        </CRow>
                      </div>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="desc-input">Nội dung quà tặng</label>
                        {<CKedtiorCustom data={editorData} onChangeData={handleEditorChange} />}
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="applyGiftType-select">Loại quà tặng</label>
                        <Field
                          name="applyGiftType"
                          as={CFormSelect}
                          id="applyGiftType-select"
                          className="select-input"
                          options={[
                            { label: 'Áp dụng cho nghành hàng', value: '0' },
                            { label: 'Áp dụng cho Mã SP chỉ định', value: '1' },
                          ]}
                        />
                        <ErrorMessage
                          name="applyGiftType"
                          component="div"
                          className="text-danger"
                        />
                      </CCol>
                      <br />

                      {values.applyGiftType === 1 && (
                        <React.Fragment>
                          <CCol md={12}>
                            <label htmlFor="productCode-input">Đơn hàng có Mã SP</label>
                            <Field
                              name="ordersHaveProductCode"
                              type="text"
                              as={CFormInput}
                              id="productCode-input"
                              text={`Nhập Mã Kho SP Cách nhau dấu "," VD: MBDE_3080SFF,MBDE_3456SSS`}
                            />
                            <ErrorMessage
                              name="ordersHaveProductCode"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                          <br />
                        </React.Fragment>
                      )}

                      {values.applyGiftType === 0 && (
                        <React.Fragment>
                          <CCol md={12}>
                            <CCol md={12}>
                              <label htmlFor="industry-select">Áp dụng cho danh mục sản phẩm</label>
                              <p>
                                Ngành hàng (Nếu dùng chung chọn [Tất cả] !, Nếu không chọn nghành
                                hàng con mặc định lấy theo nghành hàng cha)
                              </p>
                              <Field
                                className="component-size w-50"
                                name="industry"
                                as={CFormSelect}
                                id="industry-select"
                                options={[
                                  { label: 'Tất cả', value: 'all' },
                                  ...categories?.map((item) => ({
                                    label: item.category_desc?.cat_name,
                                    value: item.parenty.map((sub) => sub.cat_id),
                                  })),
                                ]}
                              />
                              <ErrorMessage
                                name="industry"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                            <br />
                            <CCol md={12} className="overflow-scroll" style={{ height: 'auto' }}>
                              {categories.map((category) => (
                                <div key={category?.cat_id}>
                                  {category?.parenty &&
                                    category?.parenty
                                      .filter((item) => {
                                        const industryArr = values.industry.split(',')
                                        return industryArr.includes(item.cat_id.toString())
                                      })
                                      .map((child) => (
                                        <div key={child.cat_id} className="ms-3 d-flex">
                                          <img
                                            src="https://vitinhnguyenkim.vn/admin/public/images/row-sub.gif"
                                            alt="Subcategory"
                                            className="mr-2"
                                          />
                                          <CFormCheck
                                            id={child.cat_id}
                                            label={child?.category_desc?.cat_name}
                                            value={child.cat_id}
                                            checked={values.applyToProductCategories.includes(
                                              child.cat_id,
                                            )}
                                            onChange={() => {
                                              const set = new Set(values.applyToProductCategories)
                                              if (set.has(child.cat_id)) {
                                                set.delete(child.cat_id)
                                              } else {
                                                set.add(child.cat_id)
                                              }
                                              setFieldValue(
                                                'applyToProductCategories',
                                                Array.from(set),
                                              )
                                            }}
                                          />
                                        </div>
                                      ))}
                                </div>
                              ))}
                              <ErrorMessage
                                name="applyToProductCategories"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                          </CCol>
                          <br />
                          <br />
                        </React.Fragment>
                      )}

                      <CCol md={12}>
                        <label htmlFor="visible-select">Hiển thị</label>
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

export default EditGift
