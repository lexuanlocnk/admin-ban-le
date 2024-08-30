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
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import ReactPaginate from 'react-paginate'

import Search from '../../components/search/Search'
import DeletedModal from '../../components/deletedModal/DeletedModal'

import CKedtiorCustom from '../../components/customEditor/ckEditorCustom'
import { CKEditor } from 'ckeditor4-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { axiosClient } from '../../axiosConfig'

function PaymentMethod() {
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const sub = params.get('sub')

  const [isLoading, setIsLoading] = useState(false)

  // editor
  const [editorData, setEditorData] = useState('')

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  const [dataPaymentMethod, setDataPaymentMethod] = useState([])
  const [deletedId, setDeletedId] = useState(null)

  // selected checkbox
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  const [isCollapse, setIsCollapse] = useState(false)

  // search input
  const [dataSearch, setDataSearch] = useState('')

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  // show deleted Modal
  const [visible, setVisible] = useState(false)

  // form formik value
  const initialValues = {
    title: '',
    name: '',
    config: 0,
    visible: 0,
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc!'),
    name: Yup.string().required('Name là bắt buộc!'),
  })

  useEffect(() => {
    if (sub === 'add') {
      setIsEditing(false)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } else if (sub === 'edit' && id) {
      setIsEditing(true)
    }
  }, [location.search])

  const fetchDataPaymentMethod = async (dataSearch) => {
    try {
      const response = await axiosClient.get(
        `admin/payment-method?data=${dataSearch}&page=${pageNumber}`,
      )
      const paymentMethodData = response.data
      if (paymentMethodData.status === true) {
        setDataPaymentMethod(paymentMethodData.data)
      }
    } catch (error) {
      console.error('Fetch data payment method is error', error)
    }
  }

  useEffect(() => {
    fetchDataPaymentMethod()
  }, [dataSearch, pageNumber])

  const fetchDataById = async (setValues) => {
    //api?search={dataSearch}
    try {
      const response = await axiosClient.get(`admin/payment-method/${id}/edit`)
      const paymentMethodData = response.data.data
      if (paymentMethodData) {
        setValues({
          title: paymentMethodData.title,
          name: paymentMethodData.name,
          config: paymentMethodData.is_config,
          visible: paymentMethodData.display,
        })
        setEditorData(paymentMethodData.description || '')
      } else {
        console.error('No data found for the given ID.')
      }
    } catch (error) {
      console.error('Fetch data id shipping method is error', error.message)
    }
  }

  const handleSubmit = async (values) => {
    console.log(values)
    if (isEditing) {
      //call api update data
      try {
        setIsLoading(true)
        const response = await axiosClient.put(`admin/payment-method/${id}`, {
          title: values.title,
          display: values.visible,
          name: values.name,
          description: editorData,
          is_config: values.config,
        })

        if (response.data.status === true) {
          // toast.success('Cập nhật phương thức thành công!')
          // fetchDataShippingMethod()
          navigate('/order/payment-method')
          setEditorData('')
        }
      } catch (error) {
        console.error('Put data payment method is error', error)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      } finally {
        setIsLoading(false)
      }
    } else {
      //call api post new data
      try {
        const response = await axiosClient.post('admin/payment-method ', {
          title: values.title,
          display: values.visible,
          name: values.name,
          description: editorData,
          is_config: values.config,
        })

        if (response.data.status === true) {
          toast.success('Thêm mới phương thức thành công!')
          fetchDataPaymentMethod()
        }
      } catch (error) {
        console.error('Post data payment method is error', error)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      }
    }
  }

  const handleAddNewClick = () => {
    navigate('/order/payment-method?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/order/payment-method?id=${id}&sub=edit`)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axiosClient.delete(`admin/payment-method/${deletedId}`)
      if (response.data.status === true) {
        setVisible(false)
        fetchDataPaymentMethod()
      }
    } catch (error) {
      console.error('Delete payment method is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  const handleEditorChange = (data) => {
    setEditorData(data)
  }

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  // pagination data
  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1
    if (newPage < 2) {
      setPageNumber(newPage)
      window.scrollTo(0, 0)
      return
    }
    window.scrollTo(0, 0)
    setPageNumber(newPage)
  }

  // search Data
  const handleSearch = (keyword) => {
    fetchDataPaymentMethod(keyword)
  }

  const [sortConfig, setSortConfig] = React.useState({ key: '', direction: 'ascending' })

  const handleSort = (columnKey) => {
    let direction = 'ascending'
    if (sortConfig.key === columnKey && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key: columnKey, direction })
  }

  const columns = [
    { key: 'id', label: '#' },
    { key: 'title', label: 'Tiêu đề' },
    { key: 'name', label: 'Name' },
    { key: 'config', label: 'Cấu hình' },
    { key: 'actions', label: 'Tác vụ' },
  ]

  const items = dataPaymentMethod?.data
    ? dataPaymentMethod?.data.map((method) => ({
        id: <CFormCheck id="flexCheckDefault" />,
        title: <span className="blue-txt">{method.title}</span>,
        name: (
          <span
            style={{
              fontWeight: 600,
            }}
          >
            {method.name}
          </span>
        ),
        config: method.is_config === 0 ? 'No' : 'Yes',
        actions: (
          <div>
            <button
              onClick={() => handleEditClick(method.payment_id)}
              className="button-action mr-2 bg-info"
            >
              <CIcon icon={cilColorBorder} className="text-white" />
            </button>
            <button
              onClick={() => {
                setVisible(true)
                setDeletedId(method.payment_id)
              }}
              className="button-action bg-danger"
            >
              <CIcon icon={cilTrash} className="text-white" />
            </button>
          </div>
        ),
        _cellProps: { id: { scope: 'row' } },
      }))
    : []

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items]
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [items, sortConfig])

  return (
    <div>
      {isLoading ? (
        <CSpinner size="large" />
      ) : (
        <CContainer>
          <DeletedModal visible={visible} setVisible={setVisible} onDelete={handleDelete} />
          <CRow className="mb-3">
            <CCol md={6}>
              <h2>PHƯƠNG THỨC THANH TOÁN</h2>
            </CCol>
            <CCol md={6}>
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
                <Link to={`/order/payment-method`}>
                  <CButton color="primary" type="submit" size="sm">
                    Danh sách
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>

          <CRow>
            {/* Form add/ edit */}
            <CCol md={4}>
              <h6>{!isEditing ? 'Thêm mới thanh toán' : 'Cập nhật thanh toán'}</h6>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, setValues }) => {
                  useEffect(() => {
                    fetchDataById(setValues)
                  }, [setValues, id])

                  return (
                    <Form>
                      <CCol md={12}>
                        <label htmlFor="title-input">Tiêu đề</label>
                        <Field name="title">
                          {({ field }) => (
                            <CFormInput
                              {...field}
                              type="text"
                              id="title-input"
                              ref={inputRef}
                              text="Tên riêng sẽ hiển thị trên trang mạng của bạn."
                            />
                          )}
                        </Field>
                        <ErrorMessage name="title" component="div" className="text-danger" />
                      </CCol>
                      <br />
                      <CCol md={12}>
                        <lable htmlFor="name-input">Name</lable>
                        <Field
                          name="name"
                          type="text"
                          as={CFormInput}
                          id="name-input"
                          text="Name là bắt buộc và duy nhất."
                        />
                        <ErrorMessage name="name" component="div" className="text-danger" />
                      </CCol>
                      <br />
                      <CCol md={12}>
                        <label htmlFor="config-select">Cấu hình</label>
                        <Field
                          className="component-size w-50"
                          name="config"
                          as={CFormSelect}
                          id="config-select"
                          options={[
                            { label: 'Không', value: 0 },
                            { label: 'Có', value: 1 },
                          ]}
                        />
                        <ErrorMessage name="config" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="visible-select">Mô tả</label>
                        <CKedtiorCustom data={editorData} onChangeData={handleEditorChange} />
                        <CFormText>
                          Mô tả bình thường không được sử dụng trong giao diện, tuy nhiên có vài
                          giao diện hiện thị mô tả này.
                        </CFormText>
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="visible-select">Hiển thị</label>
                        <Field
                          className="component-size w-50"
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
                        <CButton color="primary" type="submit" size="sm">
                          {isEditing ? 'Cập nhật' : 'Thêm mới'}
                        </CButton>
                      </CCol>
                    </Form>
                  )
                }}
              </Formik>
            </CCol>
            <CCol md={8}>
              <Search count={dataPaymentMethod?.total} onSearchData={handleSearch} />
              <CCol className="mt-4">
                <CTable hover={true} className="border">
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <CTableHeaderCell
                          style={{ whiteSpace: 'nowrap' }}
                          key={column.key}
                          onClick={() => handleSort(column.key)}
                          className="prevent-select"
                        >
                          {column.label}
                          {sortConfig.key === column.key
                            ? sortConfig.direction === 'ascending'
                              ? ' ▼'
                              : ' ▲'
                            : ''}
                        </CTableHeaderCell>
                      ))}
                    </tr>
                  </thead>
                  <CTableBody>
                    {sortedItems.map((item, index) => (
                      <CTableRow key={index}>
                        {columns.map((column) => (
                          <CTableDataCell key={column.key}>{item[column.key]}</CTableDataCell>
                        ))}
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>

                <div className="d-flex justify-content-end">
                  <ReactPaginate
                    pageCount={Math.ceil(dataPaymentMethod?.total / dataPaymentMethod?.per_page)}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={1}
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    onPageChange={handlePageChange}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                    previousLabel={'<<'}
                    nextLabel={'>>'}
                  />
                </div>
              </CCol>
            </CCol>
          </CRow>
        </CContainer>
      )}
    </div>
  )
}

export default PaymentMethod
