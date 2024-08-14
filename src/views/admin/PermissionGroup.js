import { CButton, CCol, CContainer, CFormCheck, CFormInput, CFormSelect, CRow } from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import axios from 'axios'
import { toast } from 'react-toastify'

function PermissionGroup() {
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const sub = params.get('sub')

  const [cateParentData, setCateParentData] = useState([])
  const [cateChildData, setCateChildData] = useState([])

  const [parentCateChoosen, setParentCateChoosen] = useState(1)
  const [selectedLabel, setSelectedLabel] = useState('')

  const [permissionsData, setPermissionsData] = useState([])

  const inputRef = useRef(null)

  const [isCollapse, setIsCollapse] = useState(false)

  const initialValues = {
    permissions: 'manage',
    parentCate: '',
    childCate: 'Thông tin admin',
  }

  const validationSchema = Yup.object({
    // title: Yup.string().required('Tiêu đề là bắt buộc.'),
    // friendlyUrl: Yup.string().required('Chuỗi đường dẫn là bắt buộc.'),
    // pageTitle: Yup.string().required('Tiêu đề bài viết là bắt buộc.'),
    // metaKeyword: Yup.string().required('Meta keywords là bắt buộc.'),
    // metaDesc: Yup.string().required('Meta description là bắt buộc.'),
    // visible: Yup.string().required('Cho phép hiển thị là bắt buộc.'),
  })

  useEffect(() => {
    if (sub === 'add') {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [location.search])

  const fetchCateParent = async () => {
    try {
      const response = await axios.get(`http://192.168.245.190:8000/api/cate-parent-per`)
      if (response.data.status === true) {
        setCateParentData(response.data.data)
      }
    } catch (error) {
      console.error('Fetch data cate parent brand is error', error)
    }
  }

  useEffect(() => {
    fetchCateParent()
  }, [])

  const fetchCateChild = async () => {
    try {
      const response = await axios.get(
        `http://192.168.245.190:8000/api/select-cate-child-per/${parentCateChoosen}`,
      )
      if (response.data.status === true) {
        setCateChildData(response.data.data)
      }
    } catch (error) {
      console.error('Fetch data cate parent brand is error', error)
    }
  }

  useEffect(() => {
    fetchCateChild()
  }, [parentCateChoosen])

  const fetchPermissionsData = async () => {
    try {
      const response = await axios.get(`http://192.168.245.190:8000/api/permission`)
      if (response.data.status === true) {
        setPermissionsData(response.data.permissions)
      }
    } catch (error) {
      console.error('Fetch permissions data is error', error.message)
    }
  }

  useEffect(() => {
    fetchPermissionsData()
  }, [])

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://192.168.245.190:8000/api/permission', {
        permissionName: values.permissions,
        parentCate: selectedLabel,
        childCate: values.childCate,
      })

      if (response.data.status === true) {
        toast.success('Thêm mới quyền hạn thành công!')
        fetchPermissionsData()
      }
    } catch (error) {
      console.error('Post data permission is error', error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    }
  }

  const handleAddNewClick = () => {
    navigate('/admin/permissions-group?sub=add')
  }
  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  const handleParentCateChange = (event, setFieldValue) => {
    const selectedValue = event.target.value
    setParentCateChoosen(selectedValue)
    setFieldValue('parentCate', selectedValue)

    const selectedCate = cateParentData.find((cate) => cate.id == selectedValue)

    if (selectedCate) {
      setSelectedLabel(selectedCate.name)
    }
  }

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol md={{ span: 6 }}>
          <h3>Thêm quyền hạn cho tab quản trị</h3>
        </CCol>
        <CCol md={{ span: 6 }}>
          <div className="d-flex justify-content-end">
            <CButton
              onClick={handleAddNewClick}
              color="primary"
              type="submit"
              size="sm"
              className="button-add"
            >
              Thêm mới
            </CButton>
            <Link to={'/admin/permissions-group'}>
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={4}>
          <h6>{'Thêm mới quyền hạn'}</h6>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, setValues }) => {
              return (
                <Form>
                  <CCol md={12}>
                    <label htmlFor="parentCate-select">Chọn tab quản trị</label>
                    <Field
                      className="component-size "
                      name="parentCate"
                      as={CFormSelect}
                      id="parentCate-select"
                      text="Lựa chọn danh mục sẽ thêm tab quản trị trong Admin."
                      onChange={(event) => handleParentCateChange(event, setFieldValue)}
                      options={
                        cateParentData &&
                        cateParentData.length > 0 &&
                        cateParentData.map((cate) => ({
                          label: cate?.name,
                          value: cate?.id,
                        }))
                      }
                    />
                    <ErrorMessage name="parentCate" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="childCate-select">Chọn danh mục quản trị</label>
                    <Field
                      className="component-size "
                      name="childCate"
                      as={CFormSelect}
                      id="childCate-select"
                      text="Lựa chọn danh mục sẽ thêm tab quản trị trong Admin."
                      options={
                        cateChildData &&
                        cateChildData.length > 0 &&
                        cateChildData.map((cate) => ({
                          label: cate?.name,
                          value: cate?.name,
                        }))
                      }
                    />
                    <ErrorMessage name="childCate" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="permissions-select">Quyền hạn</label>
                    <Field
                      className="component-size w-50"
                      name="permissions"
                      as={CFormSelect}
                      id="permissions-select"
                      options={[
                        { label: 'manage', value: 'manage' },
                        { label: 'add', value: 'add' },
                        { label: 'edit', value: 'edit' },
                        { label: 'del', value: 'del' },
                        { label: 'update', value: 'update' },
                        { label: 'import', value: 'import' },
                        { label: 'export', value: 'export' },
                      ]}
                    />
                    <ErrorMessage name="permissions" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol xs={12}>
                    <CButton color="primary" type="submit" size="sm">
                      {'Thêm mới'}
                    </CButton>
                  </CCol>
                </Form>
              )
            }}
          </Formik>
        </CCol>
      </CRow>

      <CRow className="mt-4">
        {permissionsData || Object.keys(permissionsData).length !== 0 ? (
          Object.entries(permissionsData)?.map((tabs) => {
            return (
              <>
                <table className="filter-table mt-3">
                  <thead>
                    <tr>
                      <th colSpan="2">
                        <div className="d-flex justify-content-between">
                          <span>{tabs?.[0]}</span>
                          <span className="toggle-pointer" onClick={handleToggleCollapse}>
                            {isCollapse ? '▼' : '▲'}
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  {!isCollapse && (
                    <tbody>
                      {Object.entries(tabs[1])?.map((item, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              width: '40%',
                            }}
                          >
                            {item?.[0]}
                          </td>
                          <td className="d-flex gap-4 ">
                            {item?.[1].map((permission) => (
                              <CFormCheck
                                key={permission?.id}
                                aria-label="Default select example"
                                defaultChecked={permission?.id}
                                disabled
                                id={`flexCheckDefault_${permission?.id}`}
                                label={permission?.name}
                              />
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </>
            )
          })
        ) : (
          <p>No permission available</p>
        )}
      </CRow>
    </CContainer>
  )
}

export default PermissionGroup