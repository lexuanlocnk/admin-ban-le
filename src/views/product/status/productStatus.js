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

const categories = [
  'Laptop',
  'Máy tính để bàn',
  'Workstation',
  'Server',
  'Máy in',
  'Linh kiện PC',
  'Phụ kiện',
  'Phần mềm',
  'Smart Home',
  'Thiết bị mạng',
  'Thiết bị văn phòng',
  'Smart phone-Tablet',
  'Thiết bị dân dụng',
  'Mực in chính hãng',
  'Màn hình máy tính',
  'Thiết bị thông minh',
  'Linh Kiện Server',
  'Dịch vụ bảo hành mở rộng',
]

const modules = ['Main', 'Product']

function ProductStatus() {
  const location = useLocation()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  // selected checkbox
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  // image upload
  const [selectedImage, setSelectedImage] = useState(null)

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
    url: '',
    destination: '',
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
    url: Yup.string().required('Chuỗi đường dẫn ảnh là bắt buộc!'),
    destination: Yup.string().required('Chọn vị trí liên kết!'),
    width: Yup.string().required('Chiều rộng ảnh là bắt buộc.'),
    height: Yup.string().required('Chiều cao ảnh là bắt buộc.'),
  })

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const id = params.get('id')
    const sub = params.get('sub')

    if (sub === 'add') {
      setIsEditing(false)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } else if (sub === 'edit' && id) {
      setIsEditing(true)
      fetchDataById(id)
    }
  }, [location.search])

  const fetchDataById = async (id, dataSearch) => {
    //api?search={dataSearch}
  }

  const handleSubmit = async (values) => {
    console.log(values)
    // if (isEditing) {
    //   //call api update data
    // } else {
    //   //call api post new data
    // }
  }

  const handleAddNewClick = () => {
    navigate('/product/status?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/product/status?id=${id}&sub=edit`)
  }

  // delete row
  const handleDelete = (id) => {
    setVisible(true)
  }

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  const handleImageUpload = (event) => {
    setSelectedImage(event.target.files[0])
  }

  const handleImageRemove = () => {
    setSelectedImage(null)
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
    fetchDataById(keyword)
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

  const items = [
    {
      id: <CFormCheck id="flexCheckDefault" />,
      title: 'Bán chạy',
      images: (
        <CImage fluid src="https://vitinhnguyenkim.vn/uploads/product/status/giam-gia-10.png" />
      ),
      name: 'sale',
      actions: (
        <div>
          <button onClick={() => handleEditClick(1)} className="button-action mr-2 bg-info">
            <CIcon icon={cilColorBorder} className="text-white" />
          </button>
          <button onClick={() => handleDelete(1)} className="button-action bg-danger">
            <CIcon icon={cilTrash} className="text-white" />
          </button>
        </div>
      ),
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: <CFormCheck id="flexCheckDefault" />,
      title: 'Khuyễn mãi',
      images: (
        <CImage fluid src="https://vitinhnguyenkim.vn/uploads/product/status/khuyen-mai.png" />
      ),
      name: 'promotion',
      actions: (
        <div>
          <button onClick={() => handleEditClick(1)} className="button-action mr-2 bg-info">
            <CIcon icon={cilColorBorder} className="text-white" />
          </button>
          <button onClick={() => handleDelete(1)} className="button-action bg-danger">
            <CIcon icon={cilTrash} className="text-white" />
          </button>
        </div>
      ),
      _cellProps: { id: { scope: 'row' } },
    },
  ]

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
      <DeletedModal visible={visible} setVisible={setVisible} />

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
            {({ setFieldValue }) => (
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
            )}
          </Formik>
        </CCol>
        <CCol md={8}>
          <Search />
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
                pageCount={Math.round(20 / 10)}
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
