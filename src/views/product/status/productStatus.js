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
import Search from '../../../components/search/Search'
import DeletedModal from '../../../components/deletedModal/DeletedModal'
import axios from 'axios'
import { toast } from 'react-toastify'

function ProductStatus() {
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const sub = params.get('sub')

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  const [dataProductStatus, setDataProductStatus] = useState([])

  // selected checkbox
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  // upload image and show image
  const [selectedFile, setSelectedFile] = useState('')
  const [file, setFile] = useState([])

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
    title: '',
    name: '',
    image: '',
    width: '',
    height: '',
    desc: '',
    friendlyUrl: '',
    pageTitle: '',
    metaKeyword: '',
    metaDesc: '',
    visible: '',
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc!'),
    name: Yup.string().required('Name là bắt buộc!'),
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

  const fetchDataStaus = async (dataSearch = '') => {
    try {
      const response = await axios.get(
        `http://192.168.245.190:8000/api/productStatus?data=${dataSearch}&page=${pageNumber}`,
      )
      if (response.data.status === 'success') {
        setDataProductStatus(response.data.list)
      }
    } catch (error) {
      console.error('Fetch data product brand is error', error)
    }
  }

  useEffect(() => {
    fetchDataStaus()
  }, [pageNumber])

  const fetchDataById = async (setValues) => {
    //api?search={dataSearch}
    try {
      const response = await axios.get(`http://192.168.245.190:8000/api/productStatus/${id}/edit`)
      const data = response.data.productStatus
      if (response.data.status === true) {
        setValues({
          title: data.product_status_desc.title,
          name: data.name,
          width: data.width,
          height: data.height,
          desc: data.product_status_desc.description,
          friendlyUrl: data.product_status_desc.friendly_url,
          pageTitle: data.product_status_desc.friendly_title,
          metaKeyword: data.product_status_desc.metakey,
          metaDesc: data.product_status_desc.metadesc,
          visible: data.display,
        })
        setSelectedFile(data.picture)
      } else {
        console.error('No data found for the given ID.')
      }
    } catch (error) {
      console.error('Fetch data id product brand is error', error.message)
    }
  }

  const handleSubmit = async (values) => {
    if (isEditing) {
      //call api update data
      try {
        const response = await axios.put(`http://192.168.245.190:8000/api/productStatus/${id}`, {
          title: values.title,
          name: values.name,
          picture: selectedFile,
          width: values.width,
          height: values.height,
          description: values.desc,
          friendly_url: values.friendlyUrl,
          friendly_title: values.pageTitle,
          metakey: values.metaKeyword,
          metadesc: values.metaDesc,
          display: values.visible,
        })

        if (response.data.status === true) {
          toast.success('Cập nhật trạng thái thành công')
        } else {
          console.error('No data found for the given ID.')
        }
      } catch (error) {
        console.error('Put data product status is error', error.message)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      }
    } else {
      //call api post new data
      try {
        const response = await axios.post('http://192.168.245.190:8000/api/productStatus', {
          title: values.title,
          name: values.name,
          picture: selectedFile,
          width: values.width,
          height: values.height,
          description: values.desc,
          friendly_url: values.friendlyUrl,
          friendly_title: values.pageTitle,
          metakey: values.metaKeyword,
          metadesc: values.metaDesc,
          display: values.visible,
        })

        if (response.data.status === true) {
          toast.success('Thêm mới trạng thái thành công!')
          fetchDataStaus()
        }
      } catch (error) {
        console.error('Post data product status is error', error)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      }
    }
  }

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

  const handleAddNewClick = () => {
    navigate('/product/status?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/product/status?id=${id}&sub=edit`)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axios.delete(
        `http://192.168.245.190:8000/api/productStatus/${deletedId}`,
      )
      if (response.data.status === true) {
        setVisible(false)
        fetchDataStaus()
      } else {
        console.error('ID not found for deleting product status')
      }
    } catch (error) {
      console.error('Delete product status id is error', error)
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
    fetchDataStaus(keyword)
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
    { key: 'images', label: 'Hình ảnh' },
    { key: 'name', label: 'Name' },
    { key: 'actions', label: 'Tác vụ' },
  ]

  const items =
    dataProductStatus?.data && dataProductStatus?.data.length > 0
      ? dataProductStatus?.data.map((item) => ({
          id: <CFormCheck id="flexCheckDefault" />,
          title: item.product_status_desc?.title,
          images: (
            <CImage fluid src={`http://192.168.245.190:8000/uploads/${item.picture}`} width={80} />
          ),
          name: item.name,
          actions: (
            <div>
              <button
                onClick={() => handleEditClick(item.status_id)}
                className="button-action mr-2 bg-info"
              >
                <CIcon icon={cilColorBorder} className="text-white" />
              </button>
              <button
                onClick={() => {
                  setVisible(true)
                  setDeletedId(item.status_id)
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
        <CCol>
          <h3>TRẠNG THÁI SẢN PHẨM</h3>
        </CCol>
        <CCol md={{ span: 4, offset: 4 }}>
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
                    <label htmlFor="name-input">Name</label>
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
                    <CFormInput
                      name="image"
                      type="file"
                      id="formFile"
                      label="Ảnh đại diện"
                      size="sm"
                      onChange={(e) => onFileChange(e)}
                    />
                    <br />
                    <ErrorMessage name="image" component="div" className="text-danger" />

                    <div>
                      {file.length == 0 ? (
                        <div>
                          <CImage
                            src={`http://192.168.245.190:8000/uploads/` + selectedFile}
                            width={300}
                          />
                        </div>
                      ) : (
                        file.map((item, index) => <CImage key={index} src={item} fluid />)
                      )}
                    </div>
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="width-input">Chiều rộng</label>
                    <Field
                      name="width"
                      type="width"
                      as={CFormInput}
                      id="width-input"
                      text="Đơn vị chiều rộng được sử dụng đơn vị pixel."
                    />
                    <ErrorMessage name="width" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="height-input">Chiều cao</label>
                    <Field
                      name="height"
                      type="text"
                      as={CFormInput}
                      id="height-input"
                      text="Đơn vị chiều cao được sử dụng đơn vị pixel."
                    />
                    <ErrorMessage name="height" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="desc-input">Mô tả</label>
                    <Field
                      name="desc"
                      type="text"
                      as={CFormTextarea}
                      id="desc-input"
                      text="Mô tả bình thường không được sử dụng trong giao diện, tuy nhiên có vài giao diện hiện thị mô tả này."
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
                    <ErrorMessage name="friendlyUrl" component="div" className="text-danger" />
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
                  <CCol md={12}>
                    <label htmlFor="visible-select">Hiển thị</label>
                    <Field
                      className="component-size w-50"
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
          <Search count={dataProductStatus?.total} onSearchData={handleSearch} />
          <CCol className="mt-4">
            <CTable hover>
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
                pageCount={Math.round(dataProductStatus?.total / dataProductStatus?.per_page)}
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

export default ProductStatus
