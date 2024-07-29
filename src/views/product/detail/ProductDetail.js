import {
  CButton,
  CCol,
  CContainer,
  CFormSelect,
  CImage,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'
import ReactPaginate from 'react-paginate'
import moment from 'moment'

import './css/productDetail.css'
import DeletedModal from '../../../components/deletedModal/DeletedModal'

function ProductDetail() {
  const navigate = useNavigate()

  const [dataProductList, setDataProductList] = useState([])

  // category
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  // brand
  const [brands, setBrands] = useState([])
  const [selectedBrand, setSelectedBrand] = useState('')

  // status
  const [status, setStatus] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('')

  // date picker
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [errors, setErrors] = useState({ startDate: '', endDate: '' })

  // validate for date start - date end
  const validateDates = (start, end) => {
    const newErrors = { startDate: '', endDate: '' }
    if (start && end && start > end) {
      newErrors.startDate = 'Ngày bắt đầu không được sau ngày kết thúc'
      newErrors.endDate = 'Ngày kết thúc không được trước ngày bắt đầu'
    }
    setErrors(newErrors)
  }

  const handleStartDateChange = (date) => {
    setStartDate(date)
    validateDates(date, endDate)
  }

  const handleEndDateChange = (date) => {
    setEndDate(date)
    validateDates(startDate, date)
  }

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // toggel table
  const [isCollapse, setIsCollapse] = useState(false)

  // search input
  const [dataSearch, setDataSearch] = useState('')

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

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

  const fetchProductData = async () => {
    try {
      const response = await axios.get(
        `http://192.168.245.190:8000/api/product?page=${pageNumber}&data=${dataSearch}&brand=${selectedBrand}&category=${selectedCategory}&status=${selectedStatus}`,
      )
      if (response.data.status === true) {
        setDataProductList(response.data.product)
      }
    } catch (error) {
      console.error('Fetch product data list is error', error.message)
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [pageNumber, dataSearch, selectedBrand, selectedCategory, selectedStatus])

  const handleAddNewClick = () => {
    navigate('/product/add')
  }

  const handleUpdateClick = (id) => {
    navigate(`/product/edit?id=${id}`)
  }

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axios.delete(`http://192.168.245.190:8000/api/product/${deletedId}`)
      if (response.data.status === true) {
        setVisible(false)
        fetchProductData()
      }
    } catch (error) {
      console.error('Delete product id is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  const handleSearch = (keyword) => {
    fetchDataCategories(keyword)
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

  // sorting columns
  const [sortConfig, setSortConfig] = React.useState({ key: '', direction: 'ascending' })

  const handleSort = (columnKey) => {
    let direction = 'ascending'
    if (sortConfig.key === columnKey && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key: columnKey, direction })
  }

  const columns = [
    { key: 'title', label: 'Tiêu đề' },
    { key: 'image', label: 'Hình ảnh' },
    { key: 'price', label: 'Giá bán' },
    { key: 'marketPrice', label: 'Giá thị trường' },
    { key: 'status', label: 'Tình trạng' },
    { key: 'info', label: 'Thông tin ' },
    { key: 'actions', label: 'Tác vụ' },
  ]

  const items =
    dataProductList?.data && dataProductList?.data.length > 0
      ? dataProductList?.data?.map((item) => ({
          title: (
            <>
              <p className="blue-txt m-0">{item?.product_desc.title}</p>
              <p className="orange-txt">{`#${item?.macn}`}</p>
            </>
          ),
          image: (
            <CImage
              className="d-flex justify-content-center align-items-center"
              width={50}
              src={`http://192.168.245.190:8000/uploads/${item.picture}`}
              alt={`image_${item?.macn}`}
            />
          ),
          price: (
            <span className="orange-txt">{`${Number(item.price_old).toLocaleString('vi-VN')}đ`}</span>
          ),
          marketPrice: `${Number(item.price).toLocaleString('vi-VN')}đ`,
          status: (
            <>
              <span>
                {item.stock > 0 ? (item.stock === 1 ? 'Còn hàng' : 'Ngừng kinh doanh') : 'Hết hàng'}
              </span>
              <p>{item.display === 1 ? 'Hiển thị' : 'Ẩn'}</p>
            </>
          ),
          info: (
            <>
              <p>{item.views} lượt xem</p>
              <p>{moment.unix(item.date_post).format('DD-MM-YYYY, hh:mm:ss A')}</p>
            </>
          ),
          actions: (
            <div>
              <button
                onClick={() => handleUpdateClick(item.id)}
                className="button-action mr-2 bg-info"
              >
                <CIcon icon={cilColorBorder} className="text-white" />
              </button>

              <button
                onClick={() => {
                  setVisible(true)
                  setDeletedId(item.product_id)
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
          <h3>QUẢN LÝ SẢN PHẨM</h3>
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
        <CCol md={12}>
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
                  <td className="total-count">{dataProductList?.total}</td>
                </tr>
                <tr>
                  <td>Lọc</td>
                  <td>
                    <div
                      className="d-flex"
                      style={{
                        columnGap: 10,
                      }}
                    >
                      <CFormSelect
                        className="component-size w-25"
                        aria-label="Chọn yêu cầu lọc"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        options={[
                          { label: 'Chọn danh mục', value: '' },
                          ...(categories && categories.length > 0
                            ? categories.map((cate) => ({
                                label: cate.category_desc.cat_name,
                                value: cate.cat_id,
                              }))
                            : []),
                        ]}
                      />
                      <CFormSelect
                        className="component-size w-25"
                        aria-label="Chọn thương hiệu"
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        options={[
                          { label: 'Chọn thương hiệu', value: '' },
                          ...(brands && brands.length > 0
                            ? brands.map((brand) => ({
                                label: brand.title,
                                value: brand.brandId,
                              }))
                            : []),
                        ]}
                      />
                      <CFormSelect
                        className="component-size w-25"
                        aria-label="Chọn trạng thái"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        options={[
                          { label: 'Chọn trạng thái', value: '' },
                          ...(status && status.length > 0
                            ? status.map((status) => ({
                                label: status.name,
                                value: status.status_id,
                              }))
                            : []),
                        ]}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Xem từ ngày</td>
                  <td>
                    <div className="custom-datepicker-wrapper">
                      <DatePicker
                        className="custom-datepicker"
                        showIcon
                        dateFormat={'dd-MM-yyyy'}
                        selected={startDate}
                        onChange={handleStartDateChange}
                      />
                      <p className="datepicker-label">{'đến ngày'}</p>
                      <DatePicker
                        className="custom-datepicker"
                        showIcon
                        dateFormat={'dd-MM-yyyy'}
                        selected={endDate}
                        onChange={handleEndDateChange}
                      />
                    </div>
                    {errors.startDate && <p className="text-danger">{errors.startDate}</p>}
                    {errors.endDate && <p className="text-danger">{errors.endDate}</p>}
                  </td>
                </tr>
                <tr>
                  <td>Tìm kiếm</td>
                  <td>
                    <strong>
                      <em>Tìm kiếm theo Tiêu đề, Mã kho, Mã số, Giá bán, Chuỗi đường dẫn</em>
                    </strong>
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
        </CCol>

        <CCol>
          <CTable hover className="mt-3 border">
            <thead>
              <tr>
                {columns.map((column) => (
                  <CTableHeaderCell
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
              pageCount={Math.ceil(dataProductList?.total / dataProductList?.per_page)}
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
      </CRow>
    </CContainer>
  )
}

export default ProductDetail