import React, { useEffect, useRef, useState } from 'react'
import {
  CBadge,
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CSpinner,
  CTable,
} from '@coreui/react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Search from '../../../components/search/Search'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder, cilFullscreen } from '@coreui/icons'
import ReactPaginate from 'react-paginate'
import DeletedModal from '../../../components/deletedModal/DeletedModal'
import { toast } from 'react-toastify'
import { axiosClient } from '../../../axiosConfig'
import Loading from '../../../components/loading/Loading'

// ─── Constants ────────────────────────────────────────────────
const PRODUCT_TYPE_ID = 2 // 1 = CN, 2 = Gia Dụng
const CONFIG_KEY_DEFAULT = 'household_footer'

const DEFAULT_PAYLOAD_JSON = JSON.stringify(
  {
    aboutCompany: [],
    policies: [],
    companyInfo: {},
    icons: [],
    setting: {},
    settingLogo: {},
    hotline: '',
    saleContact: {},
    primaryColor: '#DA251C',
  },
  null,
  2,
)

const DEFAULT_FORM_VALUES = {
  productTypeId: PRODUCT_TYPE_ID,
  configKey: CONFIG_KEY_DEFAULT,
  isActive: true,
  payloadJson: DEFAULT_PAYLOAD_JSON,
}

const DEFAULT_PAGINATION = {
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
}

// ─── Component ────────────────────────────────────────────────
function HouseHoldFooters() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const sub = params.get('sub')
  const inputRef = useRef(null)

  const [isPermissionCheck, setIsPermissionCheck] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [dataList, setDataList] = useState([])
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION)
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES)
  const [jsonError, setJsonError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // ── Helpers ──────────────────────────────────────────────────
  const isNoPermission = (responseData) =>
    responseData?.status === false &&
    (responseData?.mess === 'no permission' || responseData?.message === 'no permission')

  const isSuccessResponse = (status) => status === true || status === 'success'

  const validateJson = (jsonStr) => {
    try {
      JSON.parse(jsonStr)
      return true
    } catch {
      return false
    }
  }

  // ── API Calls ─────────────────────────────────────────────────
  const fetchDataList = async (page = pageNumber) => {
    try {
      setIsLoadingList(true)
      const response = await axiosClient.get(`admin/household/footer-config?page=${page}`)
      const responseData = response.data

      if (isSuccessResponse(responseData?.status)) {
        setDataList(responseData?.data?.items || [])
        setPagination(responseData?.data?.pagination || DEFAULT_PAGINATION)
      }

      if (isNoPermission(responseData)) {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch household footer config error:', error)
    } finally {
      setIsLoadingList(false)
    }
  }

  const fetchDataById = async (recordId) => {
    try {
      const response = await axiosClient.get(`admin/household/footer-config/${recordId}/edit`)
      const data = response.data?.data

      if (data) {
        setFormValues({
          productTypeId: data?.productTypeId ?? PRODUCT_TYPE_ID,
          configKey: data?.configKey || CONFIG_KEY_DEFAULT,
          isActive: data?.isActive ?? true,
          payloadJson: JSON.stringify(data?.payload || {}, null, 2),
        })
      }

      if (isNoPermission(response.data)) {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Fetch footer config by ID error:', error.message)
      toast.error('Không thể tải thông tin cấu hình!')
    }
  }

  // ── Effects ───────────────────────────────────────────────────
  useEffect(() => {
    fetchDataList(pageNumber)
  }, [pageNumber])

  useEffect(() => {
    setSelectedCheckbox([])
    setIsAllCheckbox(false)
  }, [dataList])

  useEffect(() => {
    if (sub === 'edit' && id) {
      setIsEditing(true)
      fetchDataById(id)
      return
    }

    setIsEditing(false)
    setFormValues(DEFAULT_FORM_VALUES)
    setJsonError('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [sub, id])

  // ── Submit Handler ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate JSON payload
    if (!validateJson(formValues.payloadJson)) {
      setJsonError('Payload JSON không hợp lệ. Vui lòng kiểm tra lại!')
      toast.warn('Payload JSON không hợp lệ. Vui lòng kiểm tra lại!')
      return
    }

    setJsonError('')
    const payload = {
      productTypeId: Number(formValues.productTypeId),
      configKey: formValues.configKey,
      isActive: formValues.isActive === 'true' || formValues.isActive === true,
      payload: JSON.parse(formValues.payloadJson),
    }

    // UPDATE
    if (isEditing) {
      try {
        setIsSubmitting(true)
        const response = await axiosClient.put(`admin/household/footer-config/${id}`, {
          _method: 'PUT',
          ...payload,
        })

        if (response.data.status === true) {
          toast.success('Cập nhật cấu hình footer thành công!')
          setIsEditing(false)
          setFormValues(DEFAULT_FORM_VALUES)
          fetchDataList(pageNumber)
          navigate('/household/footer')
        }

        if (isNoPermission(response.data)) {
          toast.warn('Bạn không có quyền thực hiện tác vụ này!')
        }
      } catch (error) {
        console.error('Update footer config error:', error.message)
        toast.error('Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại!')
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    // CREATE
    try {
      setIsSubmitting(true)
      const response = await axiosClient.post('admin/household/footer-config', payload)

      if (response.data.status === true) {
        toast.success('Thêm mới cấu hình footer thành công!')
        setFormValues(DEFAULT_FORM_VALUES)
        fetchDataList(pageNumber)
        navigate('/household/footer?sub=add')
      }

      if (isNoPermission(response.data)) {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Create footer config error:', error)
      toast.error('Đã xảy ra lỗi khi thêm mới. Vui lòng thử lại!')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Delete ────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deletedId) return

    try {
      const response = await axiosClient.post('admin/household/footer-config-delete', {
        _method: 'DELETE',
        ids: [deletedId],
      })

      if (response.data.status === true) {
        setVisible(false)
        toast.success('Xóa cấu hình footer thành công!')
        fetchDataList(pageNumber)
      }

      if (isNoPermission(response.data)) {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Delete footer config error:', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  const handleDeleteSelectedCheckbox = async () => {
    if (selectedCheckbox.length === 0) {
      toast.warn('Vui lòng chọn dữ liệu cần xóa!')
      return
    }

    try {
      const response = await axiosClient.post('admin/household/footer-config-delete', {
        _method: 'DELETE',
        ids: selectedCheckbox,
      })

      if (response.data.status === true) {
        toast.success('Đã xóa các mục được chọn!')
        setSelectedCheckbox([])
        setIsAllCheckbox(false)
        fetchDataList(pageNumber)
      }

      if (isNoPermission(response.data)) {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Delete selected footer config error:', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  // ── Navigation ────────────────────────────────────────────────
  const handleAddNewClick = () => navigate('/household/footer?sub=add')

  const handleEditClick = (recordId) => navigate(`/household/footer?id=${recordId}&sub=edit`)

  const handlePageChange = ({ selected }) => {
    window.scrollTo(0, 0)
    setPageNumber(selected + 1)
  }

  // ── Table Config ──────────────────────────────────────────────
  const items =
    dataList && dataList.length > 0
      ? dataList.map((item) => ({
          id: (
            <CFormCheck
              key={item?.id}
              aria-label="Select row"
              id={`flexCheckDefault_${item?.id}`}
              value={item?.id}
              checked={selectedCheckbox.includes(item?.id)}
              onChange={(e) => {
                const recordId = item?.id
                if (e.target.checked) {
                  setSelectedCheckbox((prev) => [...prev, recordId])
                } else {
                  setSelectedCheckbox((prev) => prev.filter((sid) => sid !== recordId))
                }
              }}
            />
          ),
          configKey: (
            <code
              style={{
                fontSize: '0.85rem',
                background: '#f4f4f4',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              {item?.configKey}
            </code>
          ),
          isActive: item?.isActive ? (
            <CBadge color="success">Hiển thị</CBadge>
          ) : (
            <CBadge color="danger">Tạm ẩn</CBadge>
          ),
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

  const columns = [
    {
      key: 'id',
      label: (
        <CFormCheck
          aria-label="Select all"
          checked={isAllCheckbox}
          onChange={(e) => {
            const isChecked = e.target.checked
            setIsAllCheckbox(isChecked)
            setSelectedCheckbox(isChecked ? dataList.map((item) => item.id) : [])
          }}
        />
      ),
      _props: { scope: 'col' },
    },
    { key: 'configKey', label: 'Key', _props: { scope: 'col' } },
    { key: 'isActive', label: 'Trạng thái', _props: { scope: 'col' } },
    { key: 'actions', label: 'Tác vụ', _props: { scope: 'col' } },
  ]

  // ── Render ────────────────────────────────────────────────────
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

          {/* Header */}
          <CRow className="mb-3">
            <CCol md={6}>
              <h3>QUẢN LÝ FOOTER GIA DỤNG</h3>
            </CCol>
            <CCol md={6}>
              <div className="d-flex justify-content-end">
                <CButton
                  onClick={handleAddNewClick}
                  color="primary"
                  type="button"
                  size="sm"
                  className="button-add"
                >
                  Thêm mới
                </CButton>
                <Link to={'/household/footer'}>
                  <CButton color="primary" type="button" size="sm">
                    Danh sách
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>

          <CRow>
            {/* ── Left: Form (5/12) ──────────────────────── */}
            <CCol md={5}>
              <h6>{!isEditing ? 'Thêm cấu hình mới' : 'Cập nhật cấu hình footer'}</h6>
              <form onSubmit={handleSubmit}>
                {/* Product Type ID */}
                <CCol md={12}>
                  <label htmlFor="productTypeId-select">
                    Product Type <small className="text-muted">(1 = CN, 2 = Gia Dụng)</small>
                  </label>
                  <CFormSelect
                    id="productTypeId-select"
                    value={String(formValues.productTypeId)}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, productTypeId: e.target.value }))
                    }
                    options={[
                      { label: '2 — Gia Dụng', value: '2' },
                      { label: '1 — Chính Nhân (CN)', value: '1' },
                    ]}
                  />
                </CCol>
                <br />

                {/* Config Key */}
                <CCol md={12}>
                  <label htmlFor="configKey-input">Config Key</label>
                  <CFormInput
                    ref={inputRef}
                    id="configKey-input"
                    type="text"
                    value={formValues.configKey}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, configKey: e.target.value }))
                    }
                    required
                  />
                </CCol>
                <br />

                {/* isActive */}
                <CCol md={12}>
                  <label htmlFor="isActive-select">Trạng thái</label>
                  <CFormSelect
                    id="isActive-select"
                    value={String(formValues.isActive)}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, isActive: e.target.value }))
                    }
                    options={[
                      { label: 'Hiển thị', value: 'true' },
                      { label: 'Tạm ẩn', value: 'false' },
                    ]}
                  />
                </CCol>
                <br />

                {/* Payload JSON */}
                <CCol md={12}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label htmlFor="payload-textarea" className="mb-0">
                      Payload JSON <small className="text-muted">(chỉnh sửa trực tiếp)</small>
                    </label>
                    <CButton
                      size="sm"
                      color="secondary"
                      variant="outline"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <CIcon icon={cilFullscreen} size="sm" /> Mở rộng
                    </CButton>
                  </div>
                  <CFormTextarea
                    id="payload-textarea"
                    rows={26}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '1rem' /* Changed from 0.88rem to 1rem */,
                      background: '#1e1e1e',
                      color: '#d4d4d4',
                      border: jsonError ? '1px solid #dc3545' : '1px solid #dee2e6',
                      borderRadius: 4,
                      resize: 'vertical',
                    }}
                    value={formValues.payloadJson}
                    onChange={(e) => {
                      setFormValues((prev) => ({ ...prev, payloadJson: e.target.value }))
                      if (jsonError) setJsonError('')
                    }}
                  />
                  {jsonError && (
                    <div className="text-danger mt-1" style={{ fontSize: '0.82rem' }}>
                      {jsonError}
                    </div>
                  )}
                </CCol>
                <br />

                {/* Submit */}
                <CCol xs={12}>
                  <CButton color="primary" type="submit" size="sm" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <CSpinner size="sm" /> Đang xử lý...
                      </>
                    ) : isEditing ? (
                      'Cập nhật'
                    ) : (
                      'Thêm mới'
                    )}
                  </CButton>
                </CCol>
              </form>
            </CCol>

            {/* ── Right: Table (7/12) ────────────────────── */}
            <CCol md={7}>
              {/* Count only — no search input */}
              <Search count={pagination?.total || 0} onSearchData={() => {}} />

              <CCol className="my-3">
                <CButton onClick={handleDeleteSelectedCheckbox} color="primary" size="sm">
                  Xóa vĩnh viễn
                </CButton>
              </CCol>

              {isLoadingList ? (
                <Loading />
              ) : (
                <CTable className="mt-2" columns={columns} items={items} />
              )}

              <div className="d-flex justify-content-end">
                <ReactPaginate
                  pageCount={pagination?.last_page || 1}
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
                  forcePage={Math.max(pageNumber - 1, 0)}
                />
              </div>
            </CCol>
          </CRow>

          {/* Fullscreen JSON Editor Modal */}
          <CModal
            alignment="center"
            visible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            size="xl"
            backdrop="static"
          >
            <CModalHeader>
              <CModalTitle>Trình soạn thảo JSON (Phóng rộng)</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CFormTextarea
                rows={35}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '1.2rem',
                  background: '#1e1e1e',
                  color: '#d4d4d4',
                  border: '1px solid #dee2e6',
                  borderRadius: 4,
                  resize: 'none',
                }}
                value={formValues.payloadJson}
                onChange={(e) => {
                  setFormValues((prev) => ({ ...prev, payloadJson: e.target.value }))
                  if (jsonError) setJsonError('')
                }}
              />
            </CModalBody>
            <CModalFooter>
              <CButton color="primary" onClick={() => setIsModalOpen(false)}>
                Hoàn tất & Đóng
              </CButton>
            </CModalFooter>
          </CModal>
        </>
      )}
    </CContainer>
  )
}

export default HouseHoldFooters
