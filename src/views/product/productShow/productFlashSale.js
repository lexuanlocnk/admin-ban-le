import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CImage,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import ReactPaginate from 'react-paginate'
import moment from 'moment'
import { formatNumber, unformatNumber } from '../../../helper/utils'

function ProductFlashSale() {
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

  //price
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')

  // check all and check

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
        setCategories(categoriesResult.value.data.data)
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

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
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
  ]

  const items =
    dataProductList?.data && dataProductList?.data.length > 0
      ? dataProductList?.data?.map((item) => ({
          title: (
            <>
              <p className="blue-txt m-0">{item?.product_desc?.title}</p>
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

  console.log('>>>. chek category: ', categories)

  return (
    <CContainer>
      <CRow className="my-3">
        <CCol>
          <h3>SẢN PHẨM FLASH SALE</h3>
        </CCol>
        <CCol md={{ span: 4, offset: 4 }}>
          <div className="d-flex justify-content-end">
            <Link to={`/product`}>
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol className="d-flex gap-3 mb-2" md={12}>
          <CButton size="sm" color="primary">
            Cập nhật
          </CButton>
          <CButton size="sm" color="primary">
            Bỏ set deal các mục đã chọn
          </CButton>
        </CCol>
        <CCol>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">
                  <CFormCheck
                    // key={option?.op_id}
                    // label={option?.title}
                    aria-label="Default select example"
                    // defaultChecked={option?.op_id}
                    // id={`flexCheckDefault_${option?.op_id}`}
                    value={option?.op_id}
                    checked={selectedTechOptions.includes(option?.op_id)}
                    onChange={(e) => {
                      const optionId = option?.op_id
                      const isChecked = e.target.checked
                      if (isChecked) {
                        setSelectedTechOptions([...selectedTechOptions, optionId])
                      } else {
                        setSelectedTechOptions(selectedTechOptions.filter((id) => id !== optionId))
                      }
                    }}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Tiêu đề</CTableHeaderCell>
                <CTableHeaderCell scope="col">Hình ảnh</CTableHeaderCell>
                <CTableHeaderCell scope="col">Thời gian bắt đầu</CTableHeaderCell>
                <CTableHeaderCell scope="col">Thời gian kết thúc</CTableHeaderCell>
                <CTableHeaderCell scope="col">Giá gốc</CTableHeaderCell>
                <CTableHeaderCell scope="col">Giá bán</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell scope="row">1</CTableHeaderCell>
                <CTableDataCell
                  style={{
                    width: '35%',
                  }}
                >
                  {
                    'Laptop HP Envy x360 14-FC0094TU 5- 125U/16GB /512GB SSD/ 14" 2.8K/Pen/Win 11H/ A19C4PA'
                  }
                </CTableDataCell>
                <CTableDataCell>
                  <CImage
                    className="d-flex justify-content-center align-items-center"
                    width={50}
                    src={`http://192.168.245.190:8000/uploads/product/66aaec54563d9.png`}
                    alt={`image_1`}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <DatePicker
                    className="custom-datepicker"
                    showIcon
                    dateFormat={'dd-MM-yyyy'}
                    selected={startDate}
                    onChange={handleStartDateChange}
                  />
                  {errors.startDate && <p className="text-danger">{errors.startDate}</p>}
                </CTableDataCell>
                <CTableDataCell>
                  <DatePicker
                    className="custom-datepicker"
                    showIcon
                    dateFormat={'dd-MM-yyyy'}
                    selected={endDate}
                    onChange={handleEndDateChange}
                  />
                  {errors.endDate && <p className="text-danger">{errors.endDate}</p>}
                </CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    style={{
                      width: '100px',
                      fontSize: 13,
                    }}
                    type="text"
                    id="price-input"
                    value={formatNumber(price)}
                    onChange={(e) => {
                      const rawValue = unformatNumber(e.target.value)
                      setPrice(rawValue)
                    }}
                  />
                </CTableDataCell>
                <CTableDataCell style={{ fontSize: 13 }}>30.520.000 đ</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
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
                      {/* <CFormSelect
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
                      /> */}

                      <CFormSelect
                        className="component-size w-25"
                        aria-label="Chọn yêu cầu lọc"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option>Chọn danh mục</option>
                        {categories &&
                          categories?.map((category) => (
                            <React.Fragment key={category.cat_id}>
                              <option value={category.cat_id}>
                                {category?.category_desc?.cat_name} ({category.cat_id})
                              </option>
                              {category.parenty &&
                                category.parenty.map((subCategory) => (
                                  <React.Fragment key={subCategory.cat_id}>
                                    <option value={subCategory.cat_id}>
                                      {'|--'}
                                      {subCategory?.category_desc?.cat_name} ({subCategory.cat_id})
                                    </option>

                                    {subCategory.parentx &&
                                      subCategory.parentx.map((subSubCategory) => (
                                        <option
                                          key={subSubCategory.cat_id}
                                          value={subSubCategory.cat_id}
                                        >
                                          {'|++++'}
                                          {subSubCategory?.category_desc?.cat_name}(
                                          {subSubCategory.cat_id})
                                        </option>
                                      ))}
                                  </React.Fragment>
                                ))}
                            </React.Fragment>
                          ))}
                      </CFormSelect>

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
                  <td>Tìm kiếm</td>
                  <td>
                    <strong>
                      <em>Tìm kiếm theo Tiêu đề, Mã kho, Mã số, Giá bán</em>
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

export default ProductFlashSale
