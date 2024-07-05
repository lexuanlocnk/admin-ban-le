import React, { useState } from 'react'
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
  CFormTextarea,
  CRow,
} from '@coreui/react'
import { Link } from 'react-router-dom'

const categories = [
  {
    label: 'Laptop Intel',
    value: 'laptop-intel',
    children: [
      {
        label: 'Nuc Serial',
        value: 'nuc-serial',
      },
    ],
  },
  {
    label: 'Macbook',
    value: 'macbook',
  },
  {
    label: 'Laptop HP',
    value: 'laptop-hp',
    children: [
      {
        label: 'Victus',
        value: 'victus',
      },
      {
        label: '240/340S',
        value: '240-340s',
      },
      {
        label: '14S / 15S',
        value: '14s-15s',
      },
    ],
  },
]

const brands = [
  {
    label: 'AEROCOOL',
    value: 'aerocool',
  },
  {
    label: 'ACBEL',
    value: 'acbel',
  },
  {
    label: 'Acer',
    value: 'acer',
  },
  {
    label: 'ADATA',
    value: 'adata',
  },
]

function AddCoupon() {
  const initialValues = {
    title: '',
    releaseCode: '',
    startDate: new Date(),
    endDate: new Date(),
    desc: '',
    applyCodeType: null,
    ordersHaveProductCode: '',
    promotionValue: '',
    maximumUsed: '',
    usedPerCustomer: '',
    termsOfOders: '',
    industry: '',
    applyToProductCategories: [],
    applytoProductBrand: [],
    // applyGuests: null,
    numberOfCodes: '1',
    prefixCode: 'NK',
    suffixCode: 'CP',
    characterCode: '4',
    visible: '',
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
  })

  const handleSubmit = (values) => {
    console.log('>>>> cehck values', values)
    // api for submit
  }

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <h3>THÊM ĐỢT PHÁT HÀNH</h3>
        </CCol>
        <CCol md={{ span: 4, offset: 4 }}>
          <div className="d-flex justify-content-end">
            <Link to={`/product/properties`}>
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
            {({ setFieldValue, values }) => (
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
                    text="Tối thiểu 6 ký tự. VD:COUPONDOT001"
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

                <CCol md={12}>
                  <label htmlFor="desc-input">Mô tả</label>
                  <Field
                    style={{ height: '100px' }}
                    name="desc"
                    type="text"
                    as={CFormTextarea}
                    id="desc-input"
                  />
                  <ErrorMessage name="desc" component="div" className="text-danger" />
                </CCol>
                <br />

                <CCol md={12}>
                  <label htmlFor="applyCode-select">Loại Mã áp dụng</label>
                  <Field
                    name="applyCodeType"
                    as={CFormSelect}
                    id="applyCode-select"
                    className="select-input"
                    options={[
                      { label: 'Giảm Tổng Đơn Hàng', value: '0' },
                      { label: 'Giảm Theo Mã Hàng', value: '1' },
                    ]}
                  />
                  <ErrorMessage name="applyCodeType" component="div" className="text-danger" />
                </CCol>
                <br />

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

                <CCol md={12}>
                  <label htmlFor="promotion-input">Giá trị khuyến mãi</label>
                  <Field
                    name="promotionValue"
                    type="text"
                    as={CFormInput}
                    id="promotion-input"
                    text="Chỉ nhập số. VD:10,000"
                  />
                  <ErrorMessage name="promotionValue" component="div" className="text-danger" />
                </CCol>
                <br />

                <CCol md={12}>
                  <label htmlFor="maximumUsed-input">Mỗi mã được sử dụng tối đa</label>
                  <Field
                    name="maximumUsed"
                    type="text"
                    as={CFormInput}
                    id="maximumUsed-input"
                    text="Chỉ nhập số. VD:10 - Nhập 999999 -> không giới hạn số lần"
                  />
                  <ErrorMessage name="maximumUsed" component="div" className="text-danger" />
                </CCol>
                <br />

                <CCol md={12}>
                  <label htmlFor="usedPerCustomer-input">
                    Trong đó mỗi khách hàng được sử dụng tối đa
                  </label>
                  <Field
                    name="usedPerCustomer"
                    type="text"
                    as={CFormInput}
                    id="usedPerCustomer-input"
                    text="Chỉ nhập số. VD:10 - Nhập 999999 -> không giới hạn số lần"
                  />
                  <ErrorMessage name="usedPerCustomer" component="div" className="text-danger" />
                </CCol>
                <br />

                <CCol md={12}>
                  <label htmlFor="termsOfOders-input">Điều kiện đơn hàng từ</label>
                  <Field
                    name="termsOfOders"
                    type="text"
                    as={CFormInput}
                    id="termsOfOders-input"
                    text="Chỉ nhập số. VD:1,000,000 - Nhập 0 -> không giới hạn giá trị đơn hàng"
                  />
                  <ErrorMessage name="termsOfOders" component="div" className="text-danger" />
                </CCol>
                <br />

                <CCol md={12}>
                  <CCol md={12}>
                    <label htmlFor="industry-select">Áp dụng cho danh mục sản phẩm</label>
                    <p>Ngành hàng (Nếu dùng chung chọn [tất cả] !)</p>
                    <Field
                      className="component-size w-50"
                      name="industry"
                      as={CFormSelect}
                      id="industry-select"
                      options={[
                        { label: 'Tất cả', value: '1' },
                        { label: 'Laptop', value: '2' },
                        { label: 'Máy tính để bàn', value: '3' },
                      ]}
                    />
                    <ErrorMessage name="industry" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12} className="overflow-scroll" style={{ height: '100px' }}>
                    {categories.map((category) => (
                      <div key={category.value}>
                        <CFormCheck
                          id={category.value}
                          label={category.label}
                          value={category.value}
                          checked={values.applyToProductCategories.includes(category.value)}
                          onChange={() => {
                            const set = new Set(values.applyToProductCategories)
                            if (set.has(category.value)) {
                              set.delete(category.value)
                            } else {
                              set.add(category.value)
                            }
                            setFieldValue('applyToProductCategories', Array.from(set))
                          }}
                        />
                        {category.children &&
                          category.children.map((child) => (
                            <div key={child.value} className="ml-3">
                              <CFormCheck
                                id={child.value}
                                label={child.label}
                                value={child.value}
                                checked={values.applyToProductCategories.includes(child.value)}
                                onChange={() => {
                                  const set = new Set(values.applyToProductCategories)
                                  if (set.has(child.value)) {
                                    set.delete(child.value)
                                  } else {
                                    set.add(child.value)
                                  }
                                  setFieldValue('applyToProductCategories', Array.from(set))
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

                <CFormLabel>Đơn hàng có thương hiệu sản phẩm</CFormLabel>
                <CCol md={12} className="overflow-scroll" style={{ height: '100px' }}>
                  {brands.map((brands) => (
                    <div key={brands.value}>
                      <CFormCheck
                        id={brands.value}
                        label={brands.label}
                        value={brands.value}
                        checked={values.applyToProductCategories.includes(brands.value)}
                        onChange={() => {
                          const set = new Set(values.applyToProductCategories)
                          if (set.has(brands.value)) {
                            set.delete(brands.value)
                          } else {
                            set.add(brands.value)
                          }
                          setFieldValue('applytoProductBrand', Array.from(set))
                        }}
                      />
                    </div>
                  ))}
                  <ErrorMessage
                    name="applytoProductBrand"
                    component="div"
                    className="text-danger"
                  />
                </CCol>

                <CCol md={12}>
                  <label htmlFor="numberOfCodes-input">Số Lượng Mã Cần Tạo</label>
                  <Field
                    name="numberOfCodes"
                    type="text"
                    as={CFormInput}
                    id="numberOfCodes-input"
                    text="Chỉ nhập số. VD:10 - tối đa 500"
                  />
                  <ErrorMessage name="numberOfCodes" component="div" className="text-danger" />
                </CCol>
                <br />

                <CCol md={12}>
                  <label htmlFor="prefixCode-input">Mã Tiền Tố</label>
                  <Field
                    name="prefixCode"
                    type="text"
                    as={CFormInput}
                    id="prefixCode-input"
                    text="Là giá trị phía trước mã . VD: ABC_____ - tối đa 3 ký tự"
                  />
                  <ErrorMessage name="prefixCode" component="div" className="text-danger" />
                </CCol>
                <br />

                <CCol md={12}>
                  <label htmlFor="suffixCode-input">Mã Hậu Tố</label>
                  <Field
                    name="suffixCode"
                    type="text"
                    as={CFormInput}
                    id="suffixCode-input"
                    text="Là giá trị phía sau cùng dãy mã . VD: _____END - tối đa 3 ký tự"
                  />
                  <ErrorMessage name="suffixCode" component="div" className="text-danger" />
                </CCol>
                <br />

                <CCol md={12}>
                  <label htmlFor="characterCode-input">Số ký tự mã</label>
                  <Field
                    name="characterCode"
                    type="text"
                    as={CFormInput}
                    id="characterCode-input"
                    text="Là số lượng ký tự [ngẫu nhiên] cho dãy mã . VD: __XxXxXx___ - nhập giá trị 1-6"
                  />
                  <ErrorMessage name="characterCode" component="div" className="text-danger" />
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

export default AddCoupon
