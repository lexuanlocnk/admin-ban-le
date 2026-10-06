import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { axiosClient, imageBaseUrl } from '../../../axiosConfig'

const endpoint = 'admin/product-image-crawls'
const jobLabels = {
  queued: 'Chờ máy Đồng bộ',
  running: 'Đang crawl',
  completed: 'Đã crawl',
  partial: 'Chưa đủ ảnh',
  failed: 'Lỗi xử lý',
}
const statusLabels = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Đã từ chối' }
const errorMessage = (error) =>
  error.response?.data?.message || 'Không tải được dữ liệu. Hãy thử lại.'
const imageUrl = (path) =>
  !path
    ? ''
    : /^https?:\/\//.test(path)
      ? path
      : `${imageBaseUrl}${path.replace(/^(public\/)?uploads\//, '')}`
const dateLabel = (date) => (date ? new Date(date).toLocaleString('vi-VN') : '—')
const scoreLabel = (score) =>
  score === null || score === undefined ? 'Chưa đọc OCR' : Number(score).toFixed(2)
const scoreColor = (score) =>
  score === null || score === undefined
    ? 'warning'
    : Number(score) >= 0.6
      ? 'danger'
      : Number(score) >= 0.25
        ? 'warning'
        : 'success'

export default function ProductImageCrawl() {
  const { productId } = useParams()
  const [filters, setFilters] = useState({
    search: '',
    cat_id: '',
    status: '',
    warning: '',
    display: 'Y',
    stock: '1',
  })
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [list, setList] = useState(null)
  const [categories, setCategories] = useState([])
  const [detail, setDetail] = useState(null)
  const [selected, setSelected] = useState([])
  const [popup, setPopup] = useState(null)
  const [sources, setSources] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(
    async (signal, quiet = false) => {
      if (!quiet) setLoading(true)
      try {
        const response = await axiosClient.get(productId ? `${endpoint}/${productId}` : endpoint, {
          params: productId ? undefined : { ...filters, page, per_page: 20 },
          signal,
        })
        if (signal?.aborted) return
        if (productId) {
          setDetail(response.data.data)
          setSelected((ids) =>
            ids.filter((id) =>
              response.data.data.images.some(
                (image) => image.id === id && image.status === 'pending',
              ),
            ),
          )
        } else {
          setList(response.data.data)
          setCategories(response.data.categories)
        }
        setError('')
      } catch (err) {
        if (!signal?.aborted) setError(errorMessage(err))
      } finally {
        if (!signal?.aborted && !quiet) setLoading(false)
      }
    },
    [productId, filters, page],
  )

  useEffect(() => {
    const controller = new AbortController()
    setDetail(null)
    setSelected([])
    setPopup(null)
    setSources('')
    load(controller.signal)
    return () => controller.abort()
  }, [load])

  const jobStatus = detail?.job?.status
  useEffect(() => {
    if (!productId || !['queued', 'running'].includes(jobStatus)) return undefined
    const controller = new AbortController()
    const timer = setInterval(() => load(controller.signal, true), 10000)
    return () => {
      clearInterval(timer)
      controller.abort()
    }
  }, [productId, jobStatus, load])

  const changeFilter = (key, value) => {
    setPage(1)
    setFilters((current) => ({ ...current, [key]: value }))
  }
  const enqueue = async (id, sourceText = '') => {
    setBusy(true)
    try {
      const source_urls = sourceText
        .split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean)
      const response = await axiosClient.post(`${endpoint}/${id}/enqueue`, { source_urls })
      toast.success(response.data.message)
      await load()
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }
  const review = async (action, ids) => {
    if (!ids.length) return
    setBusy(true)
    try {
      const response = await axiosClient.post(`${endpoint}/${productId}/review`, { action, ids })
      toast.success(response.data.message)
      setPopup(null)
      setSelected([])
      await load()
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const queued = ['queued', 'running'].includes(jobStatus)
  const pending = detail?.images.filter((image) => image.status === 'pending') || []

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 gap-3">
        <h4 className="mb-0">
          {productId ? 'Duyệt ảnh crawl của sản phẩm' : 'Duyệt ảnh chi tiết crawl'}
        </h4>
        <CButton
          color="secondary"
          variant="outline"
          disabled={busy || loading}
          onClick={() => load()}
        >
          Làm mới
        </CButton>
      </div>
      {error && <CAlert color="danger">{error}</CAlert>}
      {loading && (
        <div className="py-4 text-center">
          <CSpinner size="sm" /> Đang tải...
        </div>
      )}
      {!productId && list && (
        <CCard>
          <CCardBody>
            <p className="text-body-secondary">
              Sản phẩm thiếu ảnh chi tiết và lịch sử crawl. Ảnh chỉ lên trang sản phẩm sau khi được
              duyệt.
            </p>
            <CRow className="g-2 mb-3">
              <CCol md={4}>
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    changeFilter('search', search)
                  }}
                  className="d-flex gap-2"
                >
                  <CFormInput
                    placeholder="Tên hoặc mã hàng hóa"
                    aria-label="Tìm sản phẩm"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <CButton color="primary" type="submit">
                    Tìm
                  </CButton>
                </form>
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  aria-label="Danh mục"
                  value={filters.cat_id}
                  onChange={(event) => changeFilter('cat_id', event.target.value)}
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((cat) => (
                    <option key={`${cat.cat_id}-${cat.cat_name}`} value={cat.cat_id}>
                      {cat.cat_name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  aria-label="Trạng thái crawl"
                  value={filters.status}
                  onChange={(event) => changeFilter('status', event.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="missing">Chưa crawl</option>
                  {Object.entries(jobLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormSelect
                  aria-label="Cảnh báo OCR"
                  value={filters.warning}
                  onChange={(event) => changeFilter('warning', event.target.value)}
                >
                  <option value="">Tất cả cảnh báo</option>
                  <option value="low">OCR thấp</option>
                  <option value="check">Cần kiểm tra</option>
                  <option value="high">Cảnh báo cao</option>
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  aria-label="Hiển thị sản phẩm"
                  value={filters.display}
                  onChange={(event) => changeFilter('display', event.target.value)}
                >
                  <option value="">Tất cả hiển thị</option>
                  <option value="Y">Hiển thị (Y)</option>
                  <option value="N">Ẩn (N)</option>
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  aria-label="Tồn kho"
                  value={filters.stock}
                  onChange={(event) => changeFilter('stock', event.target.value)}
                >
                  <option value="">Tất cả tồn kho</option>
                  <option value="1">Còn hàng</option>
                  <option value="0">Hết hàng</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CTable responsive hover align="middle">
              <CTableHead>
                <CTableRow>
                  {[
                    'Ảnh',
                    'Tên / mã hàng hóa',
                    'Danh mục',
                    'Trạng thái',
                    'OCR cao nhất',
                    'Ngày crawl',
                    'Thao tác',
                  ].map((label) => (
                    <CTableHeaderCell key={label}>{label}</CTableHeaderCell>
                  ))}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {list.data.map((row) => (
                  <CTableRow key={row.product_id}>
                    <CTableDataCell>
                      {row.picture && (
                        <img
                          src={imageUrl(row.picture)}
                          alt=""
                          style={{ width: 56, height: 56, objectFit: 'contain' }}
                        />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <Link to={`/product/image-crawl/${row.product_id}`}>
                        {row.title || `Sản phẩm #${row.product_id}`}
                      </Link>
                      <div className="small text-body-secondary">{row.macn || row.MaHH}</div>
                    </CTableDataCell>
                    <CTableDataCell>{row.category || '—'}</CTableDataCell>
                    <CTableDataCell>
                      <div>{jobLabels[row.crawl_status] || 'Chưa crawl'}</div>
                      <small>{row.pending_count} ảnh chờ duyệt</small>
                      {row.error && <div className="small text-danger">{row.error}</div>}
                    </CTableDataCell>
                    <CTableDataCell>
                      {Number(row.pending_count) > 0 ? (
                        <CBadge color={scoreColor(row.ocr_score)}>
                          {scoreLabel(row.ocr_score)}
                        </CBadge>
                      ) : (
                        '—'
                      )}
                      {Number(row.ocr_unknown_count) > 0 && (
                        <div className="small text-warning">
                          {row.ocr_unknown_count} ảnh chưa đọc OCR
                        </div>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{dateLabel(row.finished_at || row.started_at)}</CTableDataCell>
                    <CTableDataCell>
                      <Link to={`/product/image-crawl/${row.product_id}`}>Xem chi tiết</Link>
                      <div>
                        <CButton
                          size="sm"
                          color="primary"
                          variant="outline"
                          className="mt-2"
                          disabled={busy || ['queued', 'running'].includes(row.crawl_status)}
                          onClick={() => enqueue(row.product_id)}
                        >
                          Yêu cầu crawl
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
                {!list.data.length && (
                  <CTableRow>
                    <CTableDataCell colSpan={7}>Không có sản phẩm phù hợp.</CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
            <div className="d-flex align-items-center justify-content-between">
              <span>
                {list.total} sản phẩm · Trang {list.current_page}/{list.last_page}
              </span>
              <div className="d-flex gap-2">
                <CButton
                  color="secondary"
                  variant="outline"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage(page - 1)}
                >
                  Trước
                </CButton>
                <CButton
                  color="secondary"
                  variant="outline"
                  disabled={page >= list.last_page || loading}
                  onClick={() => setPage(page + 1)}
                >
                  Sau
                </CButton>
              </div>
            </div>
          </CCardBody>
        </CCard>
      )}
      {productId && detail && (
        <>
          <Link to="/product/image-crawl">← Danh sách sản phẩm</Link>
          <CCard className="mt-3 mb-3">
            <CCardBody>
              <h5>{detail.product.title || `Sản phẩm #${productId}`}</h5>
              <div className="text-body-secondary mb-2">
                {detail.product.macn || detail.product.MaHH} · #{productId}
              </div>
              <div className="mb-2">
                {jobLabels[jobStatus] || 'Chưa crawl'} · {pending.length} ảnh chờ duyệt
              </div>
              {detail.job?.error && (
                <CAlert color={jobStatus === 'failed' ? 'danger' : 'warning'}>
                  {detail.job.error}
                </CAlert>
              )}
              {queued && (
                <CAlert color="info">
                  {jobStatus === 'queued'
                    ? 'Yêu cầu đã lưu. Máy Đồng bộ sẽ xử lý khi worker chạy.'
                    : 'Máy Đồng bộ đang xử lý. Dữ liệu cập nhật mỗi 10 giây.'}
                </CAlert>
              )}
              <CFormTextarea
                id="crawl-source-urls"
                label="URL trang sản phẩm nguồn (mỗi dòng một URL, tối đa 10)"
                placeholder="https://..."
                rows={2}
                value={sources}
                disabled={queued || busy}
                onChange={(event) => setSources(event.target.value)}
              />
              <div className="small text-body-secondary mt-1 mb-3">
                Để trống để tìm trên An Phát và HACOM. Bạn cũng có thể nhập URL trang sản phẩm từ
                nguồn khác.
              </div>
              <div className="d-flex flex-wrap gap-2">
                <CButton
                  color="primary"
                  variant="outline"
                  disabled={busy || queued}
                  onClick={() => enqueue(productId, sources)}
                >
                  Yêu cầu crawl lại
                </CButton>
                <CButton
                  color="success"
                  disabled={busy || !selected.length}
                  onClick={() => review('approve', selected)}
                >
                  Duyệt và chuyển sang ảnh chi tiết ({selected.length})
                </CButton>
                <CButton
                  color="danger"
                  variant="outline"
                  disabled={busy || !selected.length}
                  onClick={() => review('reject', selected)}
                >
                  Từ chối ảnh đã chọn
                </CButton>
                <CButton
                  color="secondary"
                  variant="outline"
                  disabled={busy || !pending.length}
                  onClick={() =>
                    setSelected(
                      selected.length === pending.length ? [] : pending.map((image) => image.id),
                    )
                  }
                >
                  Chọn / bỏ chọn tất cả
                </CButton>
              </div>
            </CCardBody>
          </CCard>
          {!detail.images.length && (
            <CAlert color="secondary">
              Chưa có ảnh crawl. Bạn có thể nhập nguồn và gửi yêu cầu ở trên.
            </CAlert>
          )}
          <CRow className="g-3">
            {detail.images.map((image) => (
              <CCol key={image.id} xs={12} sm={6} lg={4} xl={3}>
                <CCard
                  className="h-100"
                  style={
                    selected.includes(image.id)
                      ? { borderColor: '#1F5FBF', borderWidth: 2 }
                      : undefined
                  }
                >
                  <CCardHeader className="d-flex justify-content-between align-items-center">
                    <CFormCheck
                      aria-label={`Chọn ảnh ${image.id}`}
                      checked={selected.includes(image.id)}
                      disabled={busy || image.status !== 'pending'}
                      onChange={(event) =>
                        setSelected(
                          event.target.checked
                            ? [...selected, image.id]
                            : selected.filter((id) => id !== image.id),
                        )
                      }
                    />
                    <CBadge
                      color={
                        image.status === 'approved'
                          ? 'success'
                          : image.status === 'rejected'
                            ? 'secondary'
                            : 'info'
                      }
                    >
                      {statusLabels[image.status]}
                    </CBadge>
                  </CCardHeader>
                  <CCardBody className="d-flex flex-column">
                    <button
                      type="button"
                      className="border-0 bg-white p-0"
                      onClick={() => setPopup(image)}
                      aria-label={`Xem ảnh ${image.id}`}
                    >
                      <img
                        src={image.preview_url}
                        alt={`Ảnh sản phẩm từ ${image.domain}`}
                        style={{ width: '100%', height: 190, objectFit: 'contain' }}
                      />
                    </button>
                    <div className="mt-3 fw-semibold text-break">{image.domain}</div>
                    <div className="my-2">
                      Điểm cảnh báo OCR{' '}
                      <CBadge color={scoreColor(image.ocr_score)}>
                        {scoreLabel(image.ocr_score)}
                      </CBadge>
                    </div>
                    <div className="small text-body-secondary mb-3">
                      {image.warning || 'Không phát hiện chữ lạ'} · {image.width} × {image.height}
                    </div>
                    <div className="d-flex flex-wrap gap-2 mt-auto">
                      <CButton
                        size="sm"
                        color="secondary"
                        variant="outline"
                        onClick={() => setPopup(image)}
                      >
                        Chi tiết
                      </CButton>
                      {image.status === 'pending' && (
                        <>
                          <CButton
                            size="sm"
                            color="success"
                            disabled={busy}
                            onClick={() => review('approve', [image.id])}
                          >
                            Duyệt
                          </CButton>
                          <CButton
                            size="sm"
                            color="danger"
                            variant="outline"
                            disabled={busy}
                            onClick={() => review('reject', [image.id])}
                          >
                            Từ chối
                          </CButton>
                        </>
                      )}
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        </>
      )}
      <CModal visible={!!popup} size="lg" backdrop="static" onClose={() => !busy && setPopup(null)}>
        <CModalHeader closeButton={!busy}>
          <CModalTitle>Thông tin ảnh crawl</CModalTitle>
        </CModalHeader>
        {popup && (
          <>
            <CModalBody>
              <img
                src={popup.preview_url}
                alt="Ảnh chờ duyệt"
                style={{ width: '100%', maxHeight: 400, objectFit: 'contain' }}
              />
              <dl className="mt-3 text-break">
                <dt>Product ID / nguồn</dt>
                <dd>
                  {popup.product_id} · {popup.domain}
                </dd>
                <dt>Trang nguồn</dt>
                <dd>
                  <a href={popup.source_url} target="_blank" rel="noreferrer">
                    {popup.source_url}
                  </a>
                </dd>
                <dt>Ảnh gốc</dt>
                <dd>
                  <a href={popup.image_url} target="_blank" rel="noreferrer">
                    {popup.image_url}
                  </a>
                </dd>
                <dt>Điểm cảnh báo OCR</dt>
                <dd>
                  {scoreLabel(popup.ocr_score)} · {popup.warning || 'Không phát hiện chữ lạ'}
                </dd>
                <dt>Chữ nhận diện</dt>
                <dd>{popup.ocr_texts?.join(' · ') || 'Không có'}</dd>
                <dt>Trạng thái / ngày crawl</dt>
                <dd>
                  {statusLabels[popup.status]} · {dateLabel(popup.crawled_at)}
                </dd>
              </dl>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" disabled={busy} onClick={() => setPopup(null)}>
                Đóng
              </CButton>
              {popup.status === 'pending' && (
                <>
                  <CButton
                    color="danger"
                    variant="outline"
                    disabled={busy}
                    onClick={() => review('reject', [popup.id])}
                  >
                    Từ chối ảnh
                  </CButton>
                  <CButton
                    color="success"
                    disabled={busy}
                    onClick={() => review('approve', [popup.id])}
                  >
                    Duyệt ảnh
                  </CButton>
                </>
              )}
            </CModalFooter>
          </>
        )}
      </CModal>
    </>
  )
}
