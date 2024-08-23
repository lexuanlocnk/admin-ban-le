import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormInput,
  CFormSelect,
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
import DeletedModal from '../../components/deletedModal/DeletedModal'
import axios from 'axios'
import { toast } from 'react-toastify'
import { axiosClient } from '../../axiosConfig'

function Support() {
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const sub = params.get('sub')

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  const [supportGroup, setSupportGroup] = useState([])
  const [dataSupport, setDataSupport] = useState([])

  const [selectedGroup, setSelectedGroup] = useState('')

  // selected checkbox
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  const [isCollapse, setIsCollapse] = useState(false)

  // search input
  const [dataSearch, setDataSearch] = useState('')

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // form formik value
  const initialValues = {
    name: '',
    phone: '',
    email: '',
    skyName: '',
    type: 'chat',
    groupType: '',
  }

  const validationSchema = Yup.object({
    // title: Yup.string().required('Tiêu đề là bắt buộc!'),
    // url: Yup.string().required('Chuỗi đường dẫn ảnh là bắt buộc!'),
    // destination: Yup.string().required('Chọn vị trí liên kết!'),
    // width: Yup.string().required('Chiều rộng ảnh là bắt buộc.'),
    // height: Yup.string().required('Chiều cao ảnh là bắt buộc.'),
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

  const fetchDataSupportGroup = async () => {
    try {
      const response = await axiosClient.get('/support-group')
      if (response.data.status === true) {
        setSupportGroup(response.data.data)
      }
    } catch (error) {
      console.error('Fetch categories data error', error)
    }
  }

  useEffect(() => {
    fetchDataSupportGroup()
  }, [])

  const fetchSupportData = async (dataSearch = '') => {
    try {
      const response = await axiosClient.get(
        `/support?data=${dataSearch}&page=${pageNumber}&group=${selectedGroup}`,
      )
      const data = response.data.data

      if (response.data.status === true) {
        setDataSupport(data)
      }
    } catch (error) {
      console.error('Fetch data support is error', error)
    }
  }

  useEffect(() => {
    fetchSupportData()
  }, [pageNumber, selectedGroup])

  const fetchDataById = async (setValues) => {
    //api?search={dataSearch}
    try {
      const response = await axios.get(`http://192.168.245.190:8000/api/support/${id}/edit`)
      const data = response.data.data

      if (response.data.status === true) {
        setValues({
          name: data?.title,
          phone: data?.phone,
          email: data?.email,
          skyName: data?.name,
          type: data?.type,
          groupType: data?.group,
        })
      } else {
        console.error('No data found for the given ID.')
      }
    } catch (error) {
      console.error('Fetch data id support is error', error.message)
    }
  }

  const handleSubmit = async (values) => {
    console.log(values)

    if (isEditing) {
      //call api update data
      try {
        const response = await axiosClient.put(`support/${id}`, {
          title: values.name,
          email: values.email,
          phone: values.phone,
          name: values.skyName,
          type: values.type,
          group: values.groupType,
        })

        if (response.data.status === true) {
          toast.success('Cập nhật thông tin support thành công.')
          fetchSupportData()
        } else {
          console.error('No data found for the given ID.')
        }
      } catch (error) {
        console.error('Put data support is error', error.message)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      }
    } else {
      //call api post new data
      try {
        const response = await axiosClient.post('support', {
          title: values.name,
          email: values.email,
          phone: values.phone,
          name: values.skyName,
          type: values.type,
          group: values.groupType,
        })

        if (response.data.status === true) {
          toast.success('Thêm mới support thành công!')
          // fetchDataBanner()
        }
      } catch (error) {
        console.error('Post data support is error', error)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      }
    }
  }

  const handleAddNewClick = () => {
    navigate('/support?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/support?id=${id}&sub=edit`)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axiosClient.delete(`support/${deletedId}`)
      if (response.data.status === true) {
        setVisible(false)
        fetchSupportData()
      } else {
        console.error('ID not found for deleting support')
      }
    } catch (error) {
      console.error('Delete support id is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    } finally {
      setVisible(false)
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
    fetchSupportData(keyword)
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
    { key: 'name', label: 'Tên' },
    { key: 'phone', label: 'Điện thoại' },
    { key: 'email', label: 'Thư điện tử' },
    { key: 'skyName', label: 'Skype name' },
    { key: 'type', label: 'Loại' },
    { key: 'actions', label: 'Tác vụ' },
  ]

  const items =
    dataSupport?.data && dataSupport?.data.length > 0
      ? dataSupport?.data.map((item) => ({
          id: <CFormCheck id="flexCheckDefault" />,
          name: item?.title,
          phone: item.phone,
          email: item.email,
          skyName: item?.name,
          type: item?.type,
          actions: (
            <div>
              <button
                onClick={() => handleEditClick(item.id)}
                className="button-action mr-2 bg-info"
              >
                <CIcon icon={cilColorBorder} className="text-white" />
              </button>
              <button
                onClick={() => {
                  setVisible(true)
                  setDeletedId(item.id)
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
          <h3>QUẢN LÝ SUPPORT</h3>
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
            <Link to={`/support`}>
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
          <h6>{!isEditing ? 'Thêm mới banner' : 'Cập nhật banner'}</h6>
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
                    <label htmlFor="name-input">Tên</label>
                    <Field name="name">
                      {({ field }) => (
                        <CFormInput
                          {...field}
                          type="text"
                          id="name-input"
                          ref={inputRef}
                          text="Tên riêng sẽ hiển thị trên trang mạng của bạn."
                        />
                      )}
                    </Field>
                    <ErrorMessage name="name" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="phone-input">Điện thoại</label>
                    <Field name="phone" type="phone" as={CFormInput} id="phone-input" />
                    <ErrorMessage name="phone" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="email-input">Thư điện tử</label>
                    <Field name="email" type="email" as={CFormInput} id="email-input" />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="skyName-input">Skyke name</label>
                    <Field name="skyName" type="text" as={CFormInput} id="skyName-input" />
                    <ErrorMessage name="skyName" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="type-select">Loại</label>
                    <Field
                      className="component-size w-50"
                      name="type"
                      as={CFormSelect}
                      id="type-select"
                      options={[
                        { label: 'Chat', value: 'chat' },
                        { label: 'Call', value: 'call' },
                      ]}
                    />
                    <ErrorMessage name="type" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="groupType-select">Nhóm Support</label>
                    <Field
                      className="component-size "
                      name="groupType"
                      as={CFormSelect}
                      id="groupType-select"
                      options={[
                        { label: 'Chọn nhóm support', value: '' },
                        ...(supportGroup && supportGroup.length > 0
                          ? supportGroup.map((group) => ({
                              label: group.title,
                              value: group.name,
                            }))
                          : []),
                      ]}
                    />
                    <ErrorMessage name="groupType" component="div" className="text-danger" />
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
          <table className="filter-table">
            <thead>
              <tr>
                <th colSpan="2">
                  <div className="d-flex justify-content-between">
                    <span>Bộ lọc tìm kiếm</span>
                    <span className="toggle-pointer" onClick={handleToggleCollapse}>
                      {isCollapse ? '▼' : '▲'}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            {!isCollapse && (
              <tbody>
                <tr>
                  <td>Tổng cộng</td>
                  <td className="total-count">{dataSupport?.total}</td>
                </tr>
                <tr>
                  <td>Lọc theo vị trí</td>
                  <td>
                    <CFormSelect
                      className="component-size w-75"
                      aria-label="Chọn yêu cầu lọc"
                      options={[
                        { label: 'Chọn nhóm support', value: '' },
                        ...(supportGroup && supportGroup.length > 0
                          ? supportGroup.map((group) => ({
                              label: group.title,
                              value: group.name,
                            }))
                          : []),
                      ]}
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Tìm kiếm</td>
                  <td>
                    <input
                      type="text"
                      className="search-input"
                      value={dataSearch}
                      onChange={(e) => setDataSearch(e.target.value)}
                    />
                    <button onClick={() => handleSearch(dataSearch)} className="submit-btn">
                      Submit
                    </button>
                  </td>
                </tr>
              </tbody>
            )}
          </table>

          <CCol className="mt-4">
            <CTable>
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
                pageCount={Math.ceil(dataSupport?.total / dataSupport?.per_page)}
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

export default Support