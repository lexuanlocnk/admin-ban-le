import {
  CBadge,
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormSelect,
  CImage,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder, cilColorPalette, cilHome } from '@coreui/icons'
import ReactPaginate from 'react-paginate'
import moment from 'moment'

import './css/productDetail.css'
import DeletedModal from '../../../components/deletedModal/DeletedModal'
import { axiosClient, imageBaseUrl } from '../../../axiosConfig'
import { toast } from 'react-toastify'
import Loading from '../../../components/loading/Loading'
import useDebounce from '../../../helper/debounce'

function ProductDetail() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Lấy giá trị `page` từ URL hoặc mặc định là 1
  const pageFromUrl = parseInt(searchParams.get('page')) || 1
  const [pageNumber, setPageNumber] = useState(pageFromUrl)

  useEffect(() => {
    setSearchParams({ page: pageNumber })
  }, [pageNumber, setSearchParams])

  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  const [dataProductList, setDataProductList] = useState([])

  //loading button
  const [isLoading, setIsLoading] = useState(false)

  const [isLoadingButton, setIsLoadingButton] = useState({
    excelCategoryButton: false,
    excelAllButton: false,
  })

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

  // selected checkbox
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

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
  const debouncedSearch = useDebounce(dataSearch, 300) // Áp dụng debounce với 300ms

  // filter states
  const [selectedDisplay, setSelectedDisplay] = useState('')
  const [selectedStock, setSelectedStock] = useState('')

  const fetchData = async () => {
    try {
      const [categoriesResult, brandsResult, statusResult] = await Promise.allSettled([
        axiosClient.get('admin/category'),
        axiosClient.get('admin/brand?type=all'),
        axiosClient.get('admin/productStatus'),
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
      setIsLoading(true)
      const response = await axiosClient.get(
        `admin/product?page=${pageNumber}&data=${dataSearch}&brand=${selectedBrand}&category=${selectedCategory}&status=${selectedStatus}&display=${selectedDisplay}&stock=${selectedStock}`,
      )
      if (response.data.status === true) {
        setDataProductList(response.data.product)
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch product data list is error', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [
    pageNumber,
    debouncedSearch,
    selectedBrand,
    selectedCategory,
    selectedStatus,
    selectedDisplay,
    selectedStock,
  ])

  const handleAddNewClick = () => {
    navigate('/product/add')
  }

  const handleUpdateClick = (id) => {
    navigate(`/product/edit?id=${id}&page=${pageNumber}`)
  }

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axiosClient.delete(`admin/product/${deletedId}`)
      if (response.data.status === true) {
        setVisible(false)
        fetchProductData()
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Delete product id is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  // deleted all checkbox
  const handleDeleteSelectedCheckbox = async () => {
    try {
      const response = await axiosClient.post('admin/delete-all-product', {
        data: selectedCheckbox,
      })
      if (response.data.status === true) {
        toast.success('Xóa tất cả các mục thành công!')
        fetchDataInstruct()
        setSelectedCheckbox([])
      }
    } catch (error) {
      console.error('Deleted all id checkbox is error', error)
    }
  }

  const handleSearch = (keyword) => {
    fetchProductData(keyword)
  }

  // pagination data
  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1
    setPageNumber(newPage)
    window.scrollTo(0, 0)
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
    {
      key: 'id',
      label: (
        <div className="d-flex justify-content-center align-items-center">
          <CFormCheck
            style={{
              transform: 'scale(1.2)',
              accentColor: '#198754',
            }}
            aria-label="Select all"
            checked={isAllCheckbox}
            onChange={(e) => {
              const isChecked = e.target.checked
              setIsAllCheckbox(isChecked)
              if (isChecked) {
                const allIds = dataProductList?.data.map((item) => item.product_id) || []
                setSelectedCheckbox(allIds)
              } else {
                setSelectedCheckbox([])
              }
            }}
          />
        </div>
      ),
      _props: {
        scope: 'col',
        style: { width: '40px', textAlign: 'center', verticalAlign: 'middle' },
      },
    },
    {
      key: 'title',
      label: 'Tiêu đề',
      _props: { scope: 'col', style: { verticalAlign: 'middle' } },
    },
    {
      key: 'image',
      label: 'Hình ảnh',
      _props: {
        scope: 'col',
        style: { width: '65px', textAlign: 'center', verticalAlign: 'middle' },
      },
    },
    {
      key: 'price',
      label: 'Giá bán',
      _props: {
        scope: 'col',
        style: { whiteSpace: 'nowrap', width: '110px', verticalAlign: 'middle' },
      },
    },
    {
      key: 'marketPrice',
      label: 'Giá thị trường',
      _props: {
        scope: 'col',
        style: { whiteSpace: 'nowrap', width: '95px', verticalAlign: 'middle' },
      },
    },
    {
      key: 'status',
      label: 'Tình trạng',
      _props: {
        scope: 'col',
        style: { whiteSpace: 'nowrap', width: '95px', verticalAlign: 'middle' },
      },
    },
    {
      key: 'create_at',
      label: 'Ngày đồng bộ',
      _props: {
        scope: 'col',
        style: { whiteSpace: 'nowrap', width: '115px', verticalAlign: 'middle' },
      },
    },
    {
      key: 'update_at',
      label: 'Cập nhật',
      _props: {
        scope: 'col',
        style: { whiteSpace: 'nowrap', width: '115px', verticalAlign: 'middle' },
      },
    },
    {
      key: 'actions',
      label: 'Tác vụ',
      _props: {
        scope: 'col',
        style: {
          whiteSpace: 'nowrap',
          width: '95px',
          textAlign: 'center',
          verticalAlign: 'middle',
        },
      },
    },
  ]

  const items =
    dataProductList?.data && dataProductList?.data.length > 0
      ? dataProductList?.data?.map((item) => ({
          id: (
            <div className="d-flex justify-content-center align-items-center">
              <CFormCheck
                style={{
                  transform: 'scale(1.2)',
                  accentColor: '#198754',
                }}
                key={item?.product_id}
                aria-label="Default select example"
                defaultChecked={item?.product_id}
                id={`flexCheckDefault_${item?.product_id}`}
                value={item?.product_id}
                checked={selectedCheckbox.includes(item?.product_id)}
                onChange={(e) => {
                  const productId = item?.product_id
                  const isChecked = e.target.checked
                  if (isChecked) {
                    setSelectedCheckbox([...selectedCheckbox, productId])
                  } else {
                    setSelectedCheckbox(selectedCheckbox.filter((id) => id !== productId))
                  }
                }}
              />
            </div>
          ),
          title: (
            <>
              <Link to={`/product/edit?id=${item?.product_id}`}>
                <p className="blue-txt m-0 fw-semibold">
                  {item?.TenHH ? item?.TenHH : item?.TenHHCu}
                </p>
              </Link>
              <p
                style={{
                  fontWeight: '600',
                  marginBottom: '2px',
                  color: '#333',
                  fontSize: '0.825rem',
                }}
              >
                {item?.TenHH ? item?.TenTrenWeb2SAP : ''}
              </p>
              <p className="orange-txt font-monospace m-0">{`#${item?.MaHH ? item?.MaHH : item?.macn}`}</p>
              {item.type === 2 && (
                <div
                  className="mt-1"
                  style={{
                    display: 'inline-block',
                    padding: '2px 6px',
                    background: 'linear-gradient(135deg, #ff8a00, #ff5e00)',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: '700',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(255, 94, 0, 0.2)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  <CIcon icon={cilHome} size="custom" height={10} className="me-1" />
                  Đồ gia dụng - Fujihome
                </div>
              )}
            </>
          ),
          image: (
            <div className="d-flex justify-content-center align-items-center">
              <CImage
                width={45}
                src={`${imageBaseUrl}${item.picture}`}
                alt={`image_${item?.macn}`}
                loading="lazy"
                className="rounded border"
              />
            </div>
          ),
          price: (
            <div style={{ lineHeight: 1.4 }}>
              <div className="orange-txt" style={{ fontWeight: 600 }}>
                <span>Bán:</span>{' '}
                {item.price ? `${Number(item.price).toLocaleString('vi-VN')}đ` : '—'}
              </div>
              {item.type === 2 && item.price_purchase !== null && (
                <div className="text-danger" style={{ fontWeight: 500 }}>
                  <span>Nhập:</span> {`${Number(item.price_purchase).toLocaleString('vi-VN')}đ`}
                </div>
              )}
            </div>
          ),
          marketPrice: (
            <div className="fw-semibold text-secondary">
              {`${Number(item.price_old).toLocaleString('vi-VN')}đ`}
            </div>
          ),
          status: (
            <div>
              <span className="fw-medium text-dark d-block fs-7">
                {item.stock > 0 ? (item.stock === 1 ? 'Còn hàng' : 'Ngừng KD') : 'Hết hàng'}
              </span>
              <span
                className={`badge ${
                  item.Hienthi === 'Y'
                    ? 'bg-success-subtle text-success border border-success-subtle'
                    : 'bg-danger-subtle text-danger border border-danger-subtle'
                } px-2 py-1 mt-1`}
              >
                {item.Hienthi === 'Y' ? 'Hiển thị' : 'Ẩn'}
              </span>
            </div>
          ),

          create_at: (
            <div className="fs-7 text-secondary">
              <p className="m-0">{moment(item?.created_at).format('DD-MM-YYYY HH:mm')}</p>
            </div>
          ),

          update_at: (
            <div className="fs-7 text-secondary">
              <p className="m-0">{moment(item?.updated_at).format('DD-MM-YYYY HH:mm')}</p>
            </div>
          ),

          actions: (
            <div className="d-flex justify-content-center align-items-center gap-1">
              <button
                onClick={() => handleUpdateClick(item.product_id)}
                className="button-action bg-info text-white rounded border-0 p-1 d-inline-flex align-items-center justify-content-center shadow-sm"
                style={{ width: '32px', height: '32px' }}
                title="Sửa"
              >
                <CIcon icon={cilColorBorder} className="text-white" />
              </button>

              <button
                onClick={() => {
                  setVisible(true)
                  setDeletedId(item.product_id)
                }}
                className="button-action bg-danger text-white rounded border-0 p-1 d-inline-flex align-items-center justify-content-center shadow-sm"
                style={{ width: '32px', height: '32px' }}
                title="Xóa"
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

  // export excel by category and brand

  const handleExportExcelByCategoryAndBrand = async () => {
    if (!selectedCategory || !selectedBrand) {
      alert('Vui lòng chọn đầy đủ danh mục và thương hiệu trước khi xuất Excel.')
      return
    }
    try {
      setIsLoadingButton((prev) => ({ ...prev, excelCategoryButton: true }))
      const response = await axiosClient({
        url: `/member/products/export/technology?categoryId=${selectedCategory}&brandId=${selectedBrand}`,
        method: 'GET',
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Thong_tin_sp_theo_danh_muc.xlsx`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Export excel by category and brand is error:', error)
    } finally {
      setIsLoadingButton((prev) => ({ ...prev, excelCategoryButton: false }))
    }
  }

  // export excel all products by category and brand

  const handleExportExcelAllProductByCategoryAndBrand = async () => {
    if (!selectedCategory || !selectedBrand) {
      alert('Vui lòng chọn đầy đủ danh mục và thương hiệu trước khi xuất Excel.')
      return
    }
    try {
      setIsLoadingButton((prev) => ({ ...prev, excelAllButton: true }))

      const response = await axiosClient({
        url: `/member/products-export-properties?categoryId=${selectedCategory}&brandId=${selectedBrand}`,
        method: 'GET',
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Tskt_sp_theo_danh_muc.xlsx`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Export excel technology by category and brand is error:', error)
    } finally {
      setIsLoadingButton((prev) => ({ ...prev, excelAllButton: false }))
    }
  }

  return (
    <CContainer>
      {!isPermissionCheck ? (
        <h5>
          <div>Bạn không đủ quyền để thao tác trên danh mục quản trị này.</div>
          <div className="mt-4">
            Vui lòng quay lại trang chủ <Link to={'/dashboard'}>(Nhấn vào để quay lại)</Link>
          </div>
        </h5>
      ) : (
        <>
          <DeletedModal visible={visible} setVisible={setVisible} onDelete={handleDelete} />
          <CRow className="mb-3">
            <CCol md={6}>
              <h2>QUẢN LÝ SẢN PHẨM</h2>
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
                <Link to={`/product`}>
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
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-dark">Bộ lọc tìm kiếm</span>
                        <span
                          className="toggle-pointer text-secondary px-2"
                          onClick={handleToggleCollapse}
                        >
                          {isCollapse ? '▼' : '▲'}
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>
                {!isCollapse && (
                  <tbody>
                    <tr>
                      <td style={{ width: '220px' }} className="fw-semibold text-secondary">
                        Tổng cộng
                      </td>
                      <td>
                        <span className="text-danger fs-6 fw-bold">
                          {dataProductList?.total || 0}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-semibold text-secondary">Lọc</td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <CFormSelect
                            className="component-size w-auto"
                            style={{ width: '185px' }}
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
                            className="component-size w-auto"
                            style={{ width: '185px' }}
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
                            className="component-size w-auto"
                            style={{ width: '185px' }}
                            aria-label="Chọn hiển thị"
                            value={selectedDisplay}
                            onChange={(e) => setSelectedDisplay(e.target.value)}
                            options={[
                              { label: 'Tất cả hiển thị', value: '' },
                              { label: 'Hiển thị', value: 'Y' },
                              { label: 'Ẩn', value: 'N' },
                            ]}
                          />
                          <CFormSelect
                            className="component-size w-auto"
                            style={{ width: '185px' }}
                            aria-label="Chọn tình trạng kho"
                            value={selectedStock}
                            onChange={(e) => setSelectedStock(e.target.value)}
                            options={[
                              { label: 'Tất cả kho', value: '' },
                              { label: 'Còn hàng', value: '1' },
                              { label: 'Hết hàng', value: '0' },
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-semibold text-secondary">Xem từ ngày</td>
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
                      <td className="fw-semibold text-secondary">Tìm kiếm</td>
                      <td>
                        <div className="mb-1 text-muted fs-7">
                          <em>Tìm kiếm theo Tiêu đề, Mã kho, Mã số, Giá bán</em>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="text"
                            className="search-input"
                            placeholder="Nhập thông tin tìm kiếm..."
                            value={dataSearch}
                            onChange={(e) => setDataSearch(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSearch(dataSearch)
                            }}
                          />
                          <CButton
                            color="primary"
                            size="sm"
                            onClick={() => handleSearch(dataSearch)}
                          >
                            Submit
                          </CButton>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </CCol>

            <CCol md={12} className="mt-3">
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <CButton
                  onClick={handleDeleteSelectedCheckbox}
                  color="primary"
                  size="sm"
                  className="px-3 shadow-sm"
                >
                  Xóa vĩnh viễn
                </CButton>
              </div>
            </CCol>

            <CCol md={12} className="mt-3">
              {isLoading ? (
                <Loading />
              ) : (
                <div className="card product-table-card">
                  <CTable hover align="middle" className="mb-0 custom-product-table">
                    <thead>
                      <tr>
                        {columns.map((column) => (
                          <CTableHeaderCell
                            key={column.key}
                            onClick={() => handleSort(column.key)}
                            className="prevent-select"
                            style={column._props?.style}
                          >
                            {column.label}
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
                </div>
              )}
            </CCol>

            <CCol md={12} className="mt-4 mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted fs-7">
                  Hiển thị <strong>{sortedItems.length}</strong> trên tổng số{' '}
                  <strong>{dataProductList?.total || 0}</strong> sản phẩm
                </div>
                <ReactPaginate
                  pageCount={Math.ceil(
                    (dataProductList?.total || 0) / (dataProductList?.per_page || 10),
                  )}
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
                  containerClassName={'pagination mb-0'}
                  activeClassName={'active'}
                  previousLabel={'<<'}
                  nextLabel={'>>'}
                  forcePage={pageNumber - 1}
                />
              </div>
            </CCol>
          </CRow>
        </>
      )}
    </CContainer>
  )
}

export default ProductDetail
