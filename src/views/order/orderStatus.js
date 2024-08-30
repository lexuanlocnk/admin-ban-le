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

import { toast } from 'react-toastify'
import axios, { isCancel } from 'axios'
import { axiosClient } from '../../axiosConfig'

function OrderStatus() {
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const sub = params.get('sub')

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  const [dataStatus, setDataStatus] = useState([])
  const [deletedId, setDeletedId] = useState(null)

  // selected checkbox
  const [selectedCheckbox, setSelectedCheckbox] = useState([]) === 0 ? 'No' : 'Yes'

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
    color: '',
    isDefault: '0',
    isPayment: '0',
    isComplete: '0',
    isCancel: '0',
    isCustomer: '0',
    visible: 0,
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc!'),
    color: Yup.string().required('Màu sắc là bắt buộc!'),
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

  const fetchDataStatusOrder = async (dataSearch) => {
    try {
      const response = await axiosClient.get(
        `admin/order-status?data=${dataSearch}&page=${pageNumber}`,
      )
      if (response.data.status === true) {
        const orderStatus = response.data.orderStatus
        setDataStatus(orderStatus)
      }
    } catch (error) {
      console.error('Fetch data order status is error', error)
    }
  }

  useEffect(() => {
    fetchDataStatusOrder()
  }, [dataSearch, pageNumber])

  const fetchDataById = async (setValues) => {
    try {
      const response = await axiosClient.get(`admin/order-status/${id}/edit`)
      const data = response.data.orderStatus
      if (data) {
        setValues({
          title: data.title,
          color: data.color,
          isDefault: data.is_default,
          isPayment: data.is_payment,
          isComplete: data.is_complete,
          isCancel: data.is_cancel,
          isCustomer: data.is_customer,
          visible: data.display,
        })
      } else {
        console.error('No data found for the given ID.')
      }
    } catch (error) {
      console.error('Fetch data id order status is error', error.message)
    }
  }

  const handleSubmit = async (values) => {
    console.log(values)
    if (isEditing) {
      try {
        const response = await axiosClient.put(`admin/order-status/${id}`, {
          title: values.title,
          display: values.visible,
          color: values.color,
          is_default: values.isDefault,
          is_payment: values.isPayment,
          is_complete: values.isComplete,
          is_cancel: values.isCancel,
          is_customer: values.isCustomer,
        })

        if (response.data.status === true) {
          toast.success('Cập nhật trạng thái thành công!')
          fetchDataStatusOrder()
        }
      } catch (error) {
        console.error('Put data order status is error', error)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      }
    } else {
      try {
        const response = await axiosClient.post('admin/order-status', {
          title: values.title,
          display: values.visible,
          color: values.color,
          is_default: values.isDefault,
          is_payment: values.isPayment,
          is_complete: values.isComplete,
          is_cancel: values.isCancel,
          is_customer: values.isCustomer,
        })

        if (response.data.status === true) {
          toast.success('Thêm mới trạng thái thành công!')
          fetchDataStatusOrder()
        }
      } catch (error) {
        console.error('Post data order status is error', error)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      }
    }
  }

  const handleAddNewClick = () => {
    navigate('/order/status?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/order/status?id=${id}&sub=edit`)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axiosClient.delete(`admin/order-status/${deletedId}`)
      if (response.data.status === true) {
        setVisible(false)
        fetchDataStatusOrder()
      }
    } catch (error) {
      console.error('Delete status order is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
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
    fetchDataStatusOrder(keyword)
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
    { key: 'default', label: 'Default' },
    { key: 'payment', label: 'Payment' },
    { key: 'complete', label: 'Complete' },
    { key: 'cancel', label: 'Cancel' },
    { key: 'customer', label: 'Customer' },
    { key: 'actions', label: 'Tác vụ' },
  ]

  const items = dataStatus?.data
    ? dataStatus?.data.map((status) => ({
        id: <CFormCheck id="flexCheckDefault" />,
        title: (
          <span
            style={{
              color: status?.color,
              fontWeight: 600,
            }}
          >
            {status.title}
          </span>
        ),
        default: status.is_default === 0 ? 'No' : 'Yes',
        payment: status.is_payment === 0 ? 'No' : 'Yes',
        complete: status.is_complete === 0 ? 'No' : 'Yes',
        cancel: status.is_cancel === 0 ? 'No' : 'Yes',
        customer: status.is_customer === 0 ? 'No' : 'Yes',
        actions: (
          <div>
            <button
              onClick={() => handleEditClick(status.status_id)}
              className="button-action mr-2 bg-info"
            >
              <CIcon icon={cilColorBorder} className="text-white" />
            </button>
            <button
              onClick={() => {
                setVisible(true)
                setDeletedId(status.status_id)
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
    <CContainer>
      <DeletedModal visible={visible} setVisible={setVisible} onDelete={handleDelete} />
      <CRow className="mb-3">
        <CCol md={6}>
          <h3>TRẠNG THÁI ĐƠN HÀNG</h3>
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
            <Link to={`/product/category`}>
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
          <h6>{!isEditing ? 'Thêm mới trạng thái' : 'Cập nhật trạng thái'}</h6>
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
                    <label htmlFor="color-input">Màu sắc</label>
                    <Field
                      name="color"
                      type="text"
                      as={CFormInput}
                      id="color-input"
                      text="Hệ màu cho phép là RGB. vd: #000000"
                    />
                    <ErrorMessage name="color" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="isDefault-select">isDefault</label>
                    <Field
                      className="component-size w-50"
                      name="isDefault"
                      as={CFormSelect}
                      id="isDefault-select"
                      options={[
                        { label: 'Không', value: '0' },
                        { label: 'Có', value: '1' },
                      ]}
                    />
                    <ErrorMessage name="isDefault" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="isPayment-select">isPayment</label>
                    <Field
                      className="component-size w-50"
                      name="isPayment"
                      as={CFormSelect}
                      id="isPayment-select"
                      options={[
                        { label: 'Không', value: '0' },
                        { label: 'Có', value: '1' },
                      ]}
                    />
                    <ErrorMessage name="isPayment" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="isComplete-select">isComplete</label>
                    <Field
                      className="component-size w-50"
                      name="isComplete"
                      as={CFormSelect}
                      id="isComplete-select"
                      options={[
                        { label: 'Không', value: '0' },
                        { label: 'Có', value: '1' },
                      ]}
                    />
                    <ErrorMessage name="isComplete" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="isCancle-select">isCancle</label>
                    <Field
                      className="component-size w-50"
                      name="isCancel"
                      as={CFormSelect}
                      id="isCancle-select"
                      options={[
                        { label: 'Không', value: '0' },
                        { label: 'Có', value: '1' },
                      ]}
                    />
                    <ErrorMessage name="isCancel" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="isCustomer-select">isCustomer</label>
                    <Field
                      className="component-size w-50"
                      name="isCustomer"
                      as={CFormSelect}
                      id="isCustomer-select"
                      options={[
                        { label: 'Không', value: '0' },
                        { label: 'Có', value: '1' },
                      ]}
                    />
                    <ErrorMessage name="isCustomer" component="div" className="text-danger" />
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
          <Search count={dataStatus?.total} onSearchData={handleSearch} />
          <CCol className="mt-4">
            <CTable hover={true}>
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
                pageCount={Math.ceil(dataStatus?.total / dataStatus?.per_page)}
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
  )
}

export default OrderStatus
