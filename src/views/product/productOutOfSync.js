import React, { useEffect, useState } from 'react'
import { cilColorBorder, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormSelect,
  CFormInput,
  CRow,
  CTable,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CAccordionBody,
} from '@coreui/react'
import { Link, useSearchParams } from 'react-router-dom'
import { axiosClient } from '../../axiosConfig'
import moment from 'moment/moment'

import ReactPaginate from 'react-paginate'
import DeletedModal from '../../components/deletedModal/DeletedModal'
import { toast } from 'react-toastify'

function ProductOutOfSync() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [addForm, setAddForm] = useState({
    TenHH: '',
    MaHH: '',
    price: '',
    type: 'skip',
    display: 1,
  })

  // Lấy giá trị `page` từ URL hoặc mặc định là 1
  const pageFromUrl = parseInt(searchParams.get('page')) || 1
  const [pageNumber, setPageNumber] = useState(pageFromUrl)

  useEffect(() => {
    setSearchParams({ page: pageNumber })
  }, [pageNumber, setSearchParams])

  const [dataProductSkip, setDataProductSkip] = useState([])

  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDisplay, setSelectedDisplay] = useState('')

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // checkbox selected
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  const [isCollapse, setIsCollapse] = useState(false)

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  // search input
  const [dataSearch, setDataSearch] = useState('')

  const handleEditClick = async (id) => {
    try {
      const res = await axiosClient.get(`admin/price-skip/${id}`)
      if (res.data.status === true) {
        setEditRecord(res.data.data)
        setEditForm({
          ...res.data.data,
          display: Number(res.data.data?.display ?? 1),
        })
        setEditModalVisible(true)
      }
    } catch (error) {
      toast.error('Không thể lấy dữ liệu chi tiết!')
    }
  }

  const getTypeLabel = (type) => {
    return type === 'skip' ? 'Điều chỉnh giá' : 'So sánh giá'
  }

  const getDisplayLabel = (display) => {
    return Number(display) === 1 ? 'Hiển thị' : 'Ẩn'
  }

  // search Data
  const handleSearch = (keyword) => {
    fetchDataProductSkip(keyword)
  }

  const fetchDataProductSkip = async (dataSearch = '') => {
    try {
      const response = await axiosClient.get(
        `admin/price-skip?search=${dataSearch}&page=${pageNumber}&type=${selectedCategory}&display=${selectedDisplay}`,
      )

      if (response.data.status === true) {
        setDataProductSkip(response.data)
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch product skip data is error', error)
    }
  }

  useEffect(() => {
    fetchDataProductSkip()
  }, [pageNumber, selectedCategory, selectedDisplay])

  // pagination data
  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1
    setPageNumber(newPage)
    window.scrollTo(0, 0)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axiosClient.delete(`admin/price-skip/${deletedId}`)
      if (response.data.status === true) {
        setVisible(false)
        fetchDataProductSkip()
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Delete news id is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  const handleDeleteSelectedCheckbox = async () => {
    try {
      const response = await axiosClient.post('admin/price-skip-delete', {
        ids: selectedCheckbox,
      })
      if (response.data.status === true) {
        toast.success('Xóa tất cả các mục thành công!')
        fetchDataProductSkip()
        setSelectedCheckbox([])
      }
    } catch (error) {
      console.error('Deleted all id checkbox is error', error)
    }
  }

  const items =
    dataProductSkip?.data && dataProductSkip?.data?.length > 0
      ? dataProductSkip?.data.map((item) => ({
          id: (
            <div className="d-flex justify-content-center align-items-center">
              <CFormCheck
                key={item?.id}
                aria-label="Default select example"
                defaultChecked={item?.id}
                id={`flexCheckDefault_${item?.id}`}
                value={item?.id}
                checked={selectedCheckbox.includes(item?.id)}
                onChange={(e) => {
                  const newsId = item?.id
                  const isChecked = e.target.checked
                  if (isChecked) {
                    setSelectedCheckbox([...selectedCheckbox, newsId])
                  } else {
                    setSelectedCheckbox(selectedCheckbox.filter((id) => id !== newsId))
                  }
                }}
              />
            </div>
          ),
          title: (
            <div
              className="fw-semibold text-dark text-truncate"
              style={{ maxWidth: '340px', cursor: 'pointer' }}
              title={item?.TenHH}
            >
              {item?.TenHH}
            </div>
          ),
          macn: (
            <div>
              <span
                className="badge bg-light text-primary border font-monospace px-2 py-1"
                style={{ fontSize: '0.825rem' }}
              >
                {item?.MaHH}
              </span>
            </div>
          ),
          type: (
            <div>
              <span
                className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1 fw-medium"
                style={{ fontSize: '0.825rem' }}
              >
                {getTypeLabel(item?.type)}
              </span>
            </div>
          ),

          price: (
            <div className="text-end fw-bold text-dark fs-6" style={{ letterSpacing: '0.2px' }}>
              {item?.price ? Number(item.price).toLocaleString('vi-VN') + ' đ' : '0 đ'}
            </div>
          ),
          display: (
            <div className="text-center">
              <span
                className={`badge ${
                  Number(item?.display) === 1
                    ? 'bg-success-subtle text-success border border-success-subtle'
                    : 'bg-secondary-subtle text-secondary border border-secondary-subtle'
                } px-2 py-1 fw-medium`}
                style={{ fontSize: '0.825rem' }}
              >
                {getDisplayLabel(item?.display)}
              </span>
            </div>
          ),

          info: (
            <div>
              <div>{moment.unix(item?.created_at).format('DD-MM-YYYY')}</div>
            </div>
          ),
          actions: (
            <div className="d-flex justify-content-center align-items-center gap-2">
              <button
                onClick={() => handleEditClick(item.id)}
                className="button-action bg-info text-white rounded border-0 p-2 d-inline-flex align-items-center justify-content-center shadow-sm"
                style={{ width: '36px', height: '36px' }}
                title="Sửa"
              >
                <CIcon icon={cilColorBorder} className="text-white" size="lg" />
              </button>
              <button
                onClick={() => {
                  setVisible(true)
                  setDeletedId(item.id)
                }}
                className="button-action bg-danger text-white rounded border-0 p-2 d-inline-flex align-items-center justify-content-center shadow-sm"
                style={{ width: '36px', height: '36px' }}
                title="Xóa"
              >
                <CIcon icon={cilTrash} className="text-white" size="lg" />
              </button>
            </div>
          ),
          _cellProps: { id: { scope: 'row' } },
        }))
      : []

  const columns = [
    {
      key: 'id',
      label: (
        <div className="d-flex justify-content-center align-items-center">
          <CFormCheck
            aria-label="Select all"
            checked={isAllCheckbox}
            onChange={(e) => {
              const isChecked = e.target.checked
              setIsAllCheckbox(isChecked)
              if (isChecked) {
                const allIds = dataProductSkip?.data.map((item) => item.id) || []
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
        style: { width: '50px', textAlign: 'center', verticalAlign: 'middle' },
      },
    },
    {
      key: 'title',
      label: 'Tên sản phẩm',
      _props: { scope: 'col', style: { minWidth: '260px', verticalAlign: 'middle' } },
    },
    {
      key: 'macn',
      label: 'Mã sản phẩm',
      _props: {
        scope: 'col',
        style: { whiteSpace: 'nowrap', minWidth: '170px', verticalAlign: 'middle' },
      },
    },
    {
      key: 'type',
      label: 'Loại',
      _props: {
        scope: 'col',
        style: { whiteSpace: 'nowrap', minWidth: '130px', verticalAlign: 'middle' },
      },
    },
    {
      key: 'price',
      label: 'Giá sản phẩm',
      _props: {
        scope: 'col',
        style: {
          whiteSpace: 'nowrap',
          minWidth: '130px',
          textAlign: 'right',
          verticalAlign: 'middle',
        },
      },
    },
    {
      key: 'display',
      label: 'Hiển thị',
      _props: {
        scope: 'col',
        style: {
          whiteSpace: 'nowrap',
          minWidth: '100px',
          textAlign: 'center',
          verticalAlign: 'middle',
        },
      },
    },

    {
      key: 'actions',
      label: 'Tác vụ',
      _props: {
        scope: 'col',
        style: {
          whiteSpace: 'nowrap',
          minWidth: '100px',
          textAlign: 'center',
          verticalAlign: 'middle',
        },
      },
    },
  ]

  // Thêm state cho import Excel
  const [valueForm, setValueForm] = useState(null)
  const [currentUploads, setCurrentUploads] = useState({})

  // Thêm hàm xử lý file upload
  const onFileChange = (e) => {
    const file = e.target.files[0]
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]

    if (file && !allowedTypes.includes(file.type)) {
      alert('Vui lòng chọn file Excel có định dạng .xls hoặc .xlsx')
      return
    }

    setValueForm(file)
  }

  // Thêm hàm xử lý submit
  const handleImportSubmit = async () => {
    if (!valueForm) {
      alert('Vui lòng chọn file Excel để tải lên!')
      return
    }

    const formData = new FormData()
    formData.append('file', valueForm)

    try {
      const response = await axiosClient.post('admin/import-price-skip', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const result = response.data
      console.log('result', result)

      if (result.status === true) {
        alert('Tải lên thành công!')
      } else {
        alert('Tải lên thành công!, nhưng có lỗi về dữ liệu.')
      }
      setCurrentUploads({
        date: result.imported_at,
        fileName: result.filename,
        importedCount: result.imported_count,
        message: result.message,
        notFoundCount: result.not_found_count,
        notFoundProducts: result.not_found_product,
      })
      fetchDataProductSkip()
    } catch (error) {
      console.error(error)
      alert('Đã xảy ra lỗi khi kết nối đến server.')
    }
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddFormChange = (e) => {
    const { name, value } = e.target
    setAddForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddClick = () => {
    setAddForm({
      TenHH: '',
      MaHH: '',
      price: '',
      type: 'skip',
      display: 1,
    })
    setAddModalVisible(true)
  }

  const handleAddModalClose = () => {
    setAddModalVisible(false)
    setAddForm({
      TenHH: '',
      MaHH: '',
      price: '',
      type: 'skip',
      display: 1,
    })
  }

  const handleAddSave = async () => {
    try {
      const res = await axiosClient.post('admin/price-skip', {
        ...addForm,
        display: Number(addForm.display),
      })
      if (res.data.status === true) {
        handleAddModalClose()
        fetchDataProductSkip()
        toast.success('Thêm thành công!')
      } else {
        toast.error(res.data.message || 'Thêm thất bại!')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Có lỗi khi thêm!')
    }
  }

  // Call api put to update product skip
  const handleEditSave = async () => {
    try {
      const res = await axiosClient.put(`admin/price-skip/${editRecord.id}`, {
        ...editForm,
        display: Number(editForm.display),
      })
      if (res.data.status === true) {
        setEditModalVisible(false)
        setEditRecord(null)
        setEditForm({})
        fetchDataProductSkip()
        toast.success('Cập nhật thành công!')
      } else {
        toast.error('Cập nhật thất bại!')
      }
    } catch (error) {
      toast.error('Có lỗi khi cập nhật!')
    }
  }

  const handleEditModalClose = () => {
    setEditModalVisible(false)
    setEditRecord(null)
    setEditForm({})
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
            <CCol>
              <h3>QUẢN LÝ SẢN PHẨM KHÔNG ĐỒNG BỘ</h3>
            </CCol>
            <CCol md={6}>
              <div className="d-flex justify-content-end gap-2">
                <Link to={'/product-out-of-sync'}>
                  <CButton color="primary" type="submit" size="sm">
                    Danh sách
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>

          {/* Thêm phần Import Excel */}
          <CRow className="mb-4">
            <CCol md={12}>
              <div
                className="p-3"
                style={{
                  backgroundColor: '#eaf4fc',
                  borderLeft: '5px solid #0d6efd',
                  lineHeight: '1.6',
                }}
              >
                <h5 className="fw-bold mb-2">📘 Hướng dẫn và quy định upload</h5>
                <ul className="mb-2">
                  <li>
                    <strong>Yêu cầu định dạng:</strong> Chọn file Excel cần upload, đảm bảo theo
                    đúng bản Excel mẫu.
                  </li>
                  <li>
                    <strong>Bước 1:</strong> Chọn file Excel cần import.
                  </li>
                  <li>
                    <strong>Bước 2:</strong> Đảm bảo điền đầy đủ thông tin cột Mã kho và cột Loại
                    trong file Excel.
                  </li>
                  <li>
                    <strong>Bước 3:</strong> Nhấn nút <strong>Tải lên để import</strong> vào
                    database.
                  </li>
                </ul>
                <p className="mb-0">
                  <strong>Lưu ý:</strong> Nếu thành công sẽ hiển thị thông báo{' '}
                  <span className="text-success fw-bold">Thành công</span>. Nếu có lỗi sẽ hiển thị{' '}
                  <span className="text-danger fw-bold">thông báo upload lỗi</span>.
                </p>
              </div>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={3}>
              <div className="title_admin">
                <span>File excel có định dạng *.xls hoặc *.xlsx</span>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="value_admin">
                <CFormInput
                  onChange={onFileChange}
                  size="sm"
                  type="file"
                  id="formFile"
                  accept=".xls,.xlsx"
                  label={null}
                />
              </div>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={12} className="d-flex justify-content-center">
              <CButton
                style={{
                  fontSize: 16,
                }}
                onClick={handleImportSubmit}
                size="sm"
                color="primary"
              >
                Tải lên để import
              </CButton>
            </CCol>
          </CRow>

          {/* Hiển thị kết quả import */}
          {currentUploads && Object.keys(currentUploads).length > 0 && (
            <CAccordion alwaysOpen>
              <CAccordionItem className="border mb-2" style={{ borderRadius: 0 }}>
                <CAccordionHeader>
                  <div className="d-flex justify-content-between align-items-center w-100 px-2">
                    <div style={{ flex: '0 0 40%' }} className="fw-semibold">
                      {`Ngày ${currentUploads.date}`}
                    </div>
                    <div style={{ flex: '0 0 40%' }}>{currentUploads.fileName}</div>
                    <div
                      className={`fw-bold text-${currentUploads.message === 'success' ? 'success' : 'danger'}`}
                      style={{ fontSize: '1rem', flex: '0 0 20%' }}
                    >
                      {currentUploads.message === 'success' ? 'Thành công' : 'Lỗi'}
                    </div>
                  </div>
                </CAccordionHeader>
                <CAccordionBody
                  className="py-3 px-4"
                  style={{
                    backgroundColor:
                      currentUploads.message === 'success'
                        ? 'rgba(25,135,84,0.1)'
                        : 'rgba(220,53,69,0.1)',
                    fontSize: '1rem',
                  }}
                >
                  <div className="mt-2">
                    <strong>{`Đã import ${currentUploads.importedCount} sản phẩm.`}</strong>
                  </div>
                  {currentUploads.notFoundCount > 0 && (
                    <div className="mt-2">
                      <strong>{`Có ${currentUploads.notFoundCount} sản phẩm không tìm thấy.`}</strong>
                      <div className="mt-2">
                        <strong>Danh sách mã không tìm thấy: </strong>
                        <span>{currentUploads.notFoundProducts}</span>
                      </div>
                    </div>
                  )}
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>
          )}

          <CRow className="mb-4">
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
                          {dataProductSkip?.pagination?.total || 0}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-semibold text-secondary">Lọc theo loại sản phẩm</td>
                      <td>
                        <CFormSelect
                          className="component-size w-auto"
                          style={{ minWidth: '240px' }}
                          aria-label="Chọn loại lọc"
                          options={[
                            { label: 'Chọn loại lọc', value: '' },
                            { label: 'Điều chỉnh giá', value: 'skip' },
                            { label: 'So sánh giá', value: 'adjustment' },
                          ]}
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-semibold text-secondary">Lọc theo hiển thị</td>
                      <td>
                        <CFormSelect
                          className="component-size w-auto"
                          style={{ minWidth: '240px' }}
                          aria-label="Chọn trạng thái hiển thị"
                          options={[
                            { label: 'Tất cả trạng thái', value: '' },
                            { label: 'Hiển thị', value: '1' },
                            { label: 'Ẩn', value: '0' },
                          ]}
                          value={selectedDisplay}
                          onChange={(e) => setSelectedDisplay(e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-semibold text-secondary">Tìm kiếm</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="text"
                            className="search-input"
                            placeholder="Nhập từ khóa tìm kiếm..."
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
          </CRow>

          <CRow className="mb-3 align-items-center">
            <CCol md={12} className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <CButton
                  onClick={handleDeleteSelectedCheckbox}
                  color="primary"
                  size="sm"
                  className="px-3 shadow-sm"
                >
                  Xóa vĩnh viễn
                </CButton>
                {selectedCheckbox.length > 0 && (
                  <span className="text-muted fs-7">
                    (Đã chọn <strong>{selectedCheckbox.length}</strong> mục)
                  </span>
                )}
              </div>
              <CButton
                color="primary"
                type="button"
                size="sm"
                onClick={handleAddClick}
                className="px-3 shadow-sm"
              >
                Thêm sản phẩm
              </CButton>
            </CCol>
          </CRow>

          <CRow className="mb-4">
            <CCol md={12}>
              <div className="card product-table-card">
                <CTable
                  hover
                  align="middle"
                  className="mb-0 custom-product-table"
                  columns={columns}
                  items={items}
                />
              </div>
            </CCol>
          </CRow>

          <CRow className="mb-4 align-items-center">
            <CCol md={6} className="text-muted fs-7">
              Hiển thị <strong>{items.length}</strong> trên tổng số{' '}
              <strong>{dataProductSkip?.pagination?.total || 0}</strong> sản phẩm
            </CCol>
            <CCol md={6} className="d-flex justify-content-end">
              <ReactPaginate
                pageCount={Math.ceil((dataProductSkip?.pagination?.total || 0) / 10)}
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
            </CCol>
          </CRow>

          <CModal
            visible={addModalVisible}
            onClose={handleAddModalClose}
            alignment="center"
            className="shadow-lg"
          >
            <CModalHeader closeButton className="bg-light border-bottom px-4 py-3">
              <strong className="fs-5 text-dark">Thêm sản phẩm không đồng bộ</strong>
            </CModalHeader>
            <CModalBody className="p-4">
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary fs-7 mb-1">
                  Tên sản phẩm
                </label>
                <CFormInput
                  name="TenHH"
                  placeholder="Nhập tên sản phẩm..."
                  value={addForm.TenHH}
                  onChange={handleAddFormChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary fs-7 mb-1">
                  Mã sản phẩm
                </label>
                <CFormInput
                  name="MaHH"
                  placeholder="Nhập mã sản phẩm (vd: MHSS_...)"
                  value={addForm.MaHH}
                  onChange={handleAddFormChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary fs-7 mb-1">Giá (VNĐ)</label>
                <CFormInput
                  name="price"
                  placeholder="Nhập giá..."
                  value={addForm.price}
                  onChange={handleAddFormChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary fs-7 mb-1">Loại</label>
                <CFormSelect
                  name="type"
                  value={addForm.type}
                  onChange={handleAddFormChange}
                  options={[
                    { label: 'Điều chỉnh giá', value: 'skip' },
                    { label: 'So sánh giá', value: 'adjustment' },
                  ]}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary fs-7 mb-1">
                  Trạng thái hiển thị
                </label>
                <CFormSelect
                  name="display"
                  value={addForm.display}
                  onChange={handleAddFormChange}
                  options={[
                    { label: 'Hiển thị', value: 1 },
                    { label: 'Ẩn', value: 0 },
                  ]}
                />
              </div>
            </CModalBody>
            <CModalFooter className="bg-light border-top px-4 py-3">
              <CButton color="secondary" size="sm" className="px-3" onClick={handleAddModalClose}>
                Đóng
              </CButton>
              <CButton
                color="primary"
                size="sm"
                className="px-4 shadow-sm"
                style={{ backgroundColor: '#696cff', borderColor: '#696cff' }}
                onClick={handleAddSave}
              >
                Thêm mới
              </CButton>
            </CModalFooter>
          </CModal>

          <CModal
            visible={editModalVisible}
            onClose={handleEditModalClose}
            alignment="center"
            className="shadow-lg"
          >
            <CModalHeader closeButton className="bg-light border-bottom px-4 py-3">
              <strong className="fs-5 text-dark">Cập nhật sản phẩm không đồng bộ</strong>
            </CModalHeader>
            <CModalBody className="p-4">
              {editForm && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary fs-7 mb-1">
                      Tên sản phẩm
                    </label>
                    <CFormInput
                      name="TenHH"
                      placeholder="Nhập tên sản phẩm..."
                      value={editForm.TenHH || ''}
                      onChange={handleEditFormChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary fs-7 mb-1">
                      Mã sản phẩm
                    </label>
                    <CFormInput
                      name="MaHH"
                      placeholder="Nhập mã sản phẩm..."
                      value={editForm.MaHH || ''}
                      onChange={handleEditFormChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary fs-7 mb-1">
                      Giá (VNĐ)
                    </label>
                    <CFormInput
                      name="price"
                      placeholder="Nhập giá..."
                      value={editForm.price || ''}
                      onChange={handleEditFormChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary fs-7 mb-1">Loại</label>
                    <CFormSelect
                      name="type"
                      value={editForm.type || 'skip'}
                      onChange={handleEditFormChange}
                      options={[
                        { label: 'Điều chỉnh giá', value: 'skip' },
                        { label: 'So sánh giá', value: 'adjustment' },
                      ]}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary fs-7 mb-1">
                      Trạng thái hiển thị
                    </label>
                    <CFormSelect
                      name="display"
                      value={editForm.display ?? 1}
                      onChange={handleEditFormChange}
                      options={[
                        { label: 'Hiển thị', value: 1 },
                        { label: 'Ẩn', value: 0 },
                      ]}
                    />
                  </div>
                </>
              )}
            </CModalBody>
            <CModalFooter className="bg-light border-top px-4 py-3">
              <CButton color="secondary" size="sm" className="px-3" onClick={handleEditModalClose}>
                Đóng
              </CButton>
              <CButton
                color="primary"
                size="sm"
                className="px-4 shadow-sm"
                style={{ backgroundColor: '#696cff', borderColor: '#696cff' }}
                onClick={handleEditSave}
              >
                Lưu thay đổi
              </CButton>
            </CModalFooter>
          </CModal>
        </>
      )}
    </CContainer>
  )
}

export default ProductOutOfSync
