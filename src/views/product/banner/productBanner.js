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
import DeletedModal from '../../../components/deletedModal/DeletedModal'
import axios from 'axios'
import { toast } from 'react-toastify'

function ProductBanner() {
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const sub = params.get('sub')

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  const [categories, setCategories] = useState([])
  const [dataBanner, setDataBanner] = useState([])

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
    image: '',
    url: '',
    destination: '',
    categories: '',
    width: '',
    height: '',
    desc: '',
    visible: '',
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc!'),
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

  const fetchDataBanner = async () => {
    try {
      const response = await axios.get(
        `http://192.168.245.190:8000/api/product-advertise?data=${dataSearch}&page=${pageNumber}`,
      )
      if (response.data.status === true) {
        setDataBanner(response.data.data)
      }
    } catch (error) {
      console.error('Fetch data banner is error', error)
    }
  }

  useEffect(() => {
    fetchDataBanner()
  }, [pageNumber])

  const fetchDataById = async (setValues) => {
    //api?search={dataSearch}
    try {
      const response = await axios.get(
        `http://192.168.245.190:8000/api/product-advertise/${id}/edit`,
      )
      const data = response.data.data
      if (response.data.status === true) {
        setValues({
          title: data.title,
          url: data.link,
          destination: data.target,
          // categories: data.category,
          width: data.width,
          height: data.height,
          desc: data.description,
          visible: data.display,
        })
        setSelectedFile(data.picture)
      } else {
        console.error('No data found for the given ID.')
      }
    } catch (error) {
      console.error('Fetch data id product banner is error', error.message)
    }
  }

  const handleSubmit = async (values) => {
    console.log(values)

    if (isEditing) {
      //call api update data
      try {
        const response = await axios.put(
          `http://192.168.245.190:8000/api/product-advertise/${id}`,
          {
            title: values.title,
            picture: selectedFile,
            link: values.url,
            filePath: values.destination,
            // category: values.category,
            width: values.width,
            height: values.height,
            description: values.desc,
            display: values.visible,
          },
        )

        if (response.data.status === true) {
          toast.success('Cập nhật trạng thái thành công')
          fetchDataBanner()
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
        const response = await axios.post('http://192.168.245.190:8000/api/product-advertise', {
          title: values.title,
          picture: selectedFile,
          link: values.url,
          filePath: values.destination,
          // category: values.category,
          width: values.width,
          height: values.height,
          description: values.desc,
          display: values.visible,
        })

        if (response.data.status === true) {
          toast.success('Cập nhật banner sản phẩm thành công!')
          fetchDataBanner()
        }
      } catch (error) {
        console.error('Put data product banner is error', error)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      }
    }
  }

  const handleAddNewClick = () => {
    navigate('/product/banner?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/product/banner?id=${id}&sub=edit`)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axios.delete(
        `http://192.168.245.190:8000/api/product-advertise/${deletedId}`,
      )
      if (response.data.status === true) {
        setVisible(false)
        fetchDataBanner()
      } else {
        console.error('ID not found for deleting product status')
      }
    } catch (error) {
      console.error('Delete product banner id is error', error)
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
    fetchDataBanner(keyword)
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
    { key: 'images', label: 'Hình ảnh' },
    { key: 'url', label: 'Liên kết' },
    { key: 'dimensions', label: 'Kích thước' },
    { key: 'actions', label: 'Tác vụ' },
  ]

  const items =
    dataBanner && dataBanner.length > 0
      ? dataBanner.map((item) => ({
          id: <CFormCheck id="flexCheckDefault" />,
          images: <CImage fluid src={`http://192.168.245.190:8000/uploads/${item.picture}`} />,
          url: item.link,
          dimensions: `${item.width}X${item.height}`,
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
        <CCol>
          <h3>BANNER SẢN PHẨM</h3>
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
            <Link to={`/product/banner`}>
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
                    <label htmlFor="title-input">Tiêu đề</label>
                    <Field name="title">
                      {({ field }) => (
                        <CFormInput
                          {...field}
                          type="text"
                          id="title-input"
                          ref={inputRef}
                          text="Tiêu đề được sử dụng trên trang mạng của bạn và làm thẻ ALT của banner."
                        />
                      )}
                    </Field>
                    <ErrorMessage name="title" component="div" className="text-danger" />
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
                    <label htmlFor="url-input">Liên kết</label>
                    <Field
                      name="url"
                      type="url"
                      as={CFormInput}
                      id="url-input"
                      text="Liên kết có hoặc không: https://vitinhnguyenkim.vn/"
                      placeholder="https://"
                    />
                    <ErrorMessage name="url" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="destination-select">Đích đến</label>
                    <Field
                      className="component-size w-50"
                      name="destination"
                      as={CFormSelect}
                      id="destination-select"
                      text="Loại hiển thị của liên kết. Mặc định liên kết tại trang (_self)."
                      options={[
                        { label: 'Tại trang (_self)', value: '1' },
                        { label: 'Cửa sổ mới (_blank)', value: '2' },
                        { label: 'Cửa sổ cha (_parent)', value: '3' },
                        { label: 'Cửa sổ trên cùng (_top)', value: '4' },
                      ]}
                    />
                    <ErrorMessage name="destination" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="categories-select">Danh mục đăng</label>
                    <Field
                      className="component-size w-50"
                      name="categories"
                      as={CFormSelect}
                      id="categories-select"
                      text="Lựa chọn danh mục sẽ hiển thị banner ngoài trang chủ."
                      options={
                        categories &&
                        categories.length > 0 &&
                        categories.map((cate) => ({
                          label: cate.category_desc.cat_name,
                          value: cate.cat_id,
                        }))
                      }
                    />
                    <ErrorMessage name="categories" component="div" className="text-danger" />
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
                  <td className="total-count">6</td>
                </tr>
                <tr>
                  <td>Lọc theo vị trí</td>
                  <td>
                    <CFormSelect
                      className="component-size w-50"
                      aria-label="Chọn yêu cầu lọc"
                      options={
                        categories &&
                        categories.length > 0 &&
                        categories.map((cate) => ({
                          label: cate.category_desc.cat_name,
                          value: cate.cat_id,
                        }))
                      }
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

export default ProductBanner
