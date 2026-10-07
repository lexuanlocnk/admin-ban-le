import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import CIcon from '@coreui/icons-react'
import { cilCopy } from '@coreui/icons'
import copyProductCode from '../../../helper/copyProductCode'
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

const categoryTreeOptions = (categories) => {
  const ids = new Set(categories.map((category) => String(category.cat_id)))
  const children = new Map()
  categories.forEach((category) => {
    const parent = ids.has(String(category.parentid)) ? String(category.parentid) : '0'
    children.set(parent, [...(children.get(parent) || []), category])
  })
  const options = []
  const visited = new Set()
  const visit = (category, depth) => {
    const id = String(category.cat_id)
    if (visited.has(id)) return
    visited.add(id)
    options.push({ ...category, depth })
    ;(children.get(id) || []).forEach((child) => visit(child, depth + 1))
  }
  ;(children.get('0') || []).forEach((category) => visit(category, 0))
  categories.forEach((category) => visit(category, 0))
  return options
}

export default function ProductImageCrawl() {
  const { productId } = useParams()
  const [filters, setFilters] = useState({
    search: '',
    cat_id: '',
    crawled: '0',
    stock: '1',
  })
  const [search, setSearch] = useState('')
  const [filtersCollapsed, setFiltersCollapsed] = useState(false)
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

  const renderPagination = (position) => (
    <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between my-3">
      <span>
        {list.total} sản phẩm · Trang {list.current_page}/{list.last_page}
      </span>
      <nav aria-label={position === 'top' ? 'Phân trang trên' : 'Phân trang dưới'}>
        <ReactPaginate
          pageCount={list.last_page}
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
          containerClassName="pagination mb-0"
          activeClassName="active"
          previousLabel="<<"
          nextLabel=">>"
          forcePage={page - 1}
          disableInitialCallback
          onClick={() => (loading ? false : undefined)}
          onPageChange={({ selected }) => setPage(selected + 1)}
        />
      </nav>
    </div>
  )

  const queued = ['queued', 'running'].includes(jobStatus)
  const pending = detail?.images.filter((image) => image.status === 'pending') || []

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 gap-3">
        <h2 className="mb-0 text-uppercase">
          {productId ? 'Duyệt ảnh crawl của sản phẩm' : 'Duyệt ảnh chi tiết crawl'}
        </h2>
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
            <table className="filter-table crawl-filter-table mb-3">
              <thead>
                <tr>
                  <th colSpan={2}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-dark">Bộ lọc tìm kiếm</span>
                      <button
                        type="button"
                        className="border-0 bg-transparent text-secondary px-2"
                        aria-label={filtersCollapsed ? 'Mở bộ lọc' : 'Thu gọn bộ lọc'}
                        aria-expanded={!filtersCollapsed}
                        onClick={() => setFiltersCollapsed((current) => !current)}
                      >
                        {filtersCollapsed ? '▼' : '▲'}
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              {!filtersCollapsed && (
                <tbody>
                  <tr>
                    <td className="crawl-filter-label fw-semibold text-secondary">Tổng cộng</td>
                    <td>
                      <span className="text-danger fs-6 fw-bold">{list.total}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="crawl-filter-label fw-semibold text-secondary">Lọc</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <CFormSelect
                          className="component-size crawl-filter-select"
                          aria-label="Danh mục"
                          value={filters.cat_id}
                          onChange={(event) => changeFilter('cat_id', event.target.value)}
                        >
                          <option value="">Tất cả danh mục</option>
                          {categoryTreeOptions(categories).map((cat) => (
                            <option key={`${cat.cat_id}-${cat.cat_name}`} value={cat.cat_id}>
                              {`${'\u00a0\u00a0\u00a0\u00a0'.repeat(cat.depth)}${cat.depth ? '↳ ' : ''}${cat.cat_name}`}
                            </option>
                          ))}
                        </CFormSelect>
                        <CFormSelect
                          className="component-size crawl-filter-select"
                          aria-label="Trạng thái crawl ảnh"
                          value={filters.crawled}
                          onChange={(event) => changeFilter('crawled', event.target.value)}
                        >
                          <option value="">Tất cả</option>
                          <option value="1">Đã crawl ảnh</option>
                          <option value="0">Chưa crawl ảnh</option>
                        </CFormSelect>
                        <CFormSelect
                          className="component-size crawl-filter-select"
                          aria-label="Tồn kho"
                          value={filters.stock}
                          onChange={(event) => changeFilter('stock', event.target.value)}
                        >
                          <option value="">Tất cả tồn kho</option>
                          <option value="1">Còn hàng</option>
                          <option value="0">Hết hàng</option>
                        </CFormSelect>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="crawl-filter-label fw-semibold text-secondary">Tìm kiếm</td>
                    <td>
                      <div className="mb-1 text-muted fs-7">
                        <em>Tìm kiếm theo tên hoặc mã hàng hóa</em>
                      </div>
                      <form
                        onSubmit={(event) => {
                          event.preventDefault()
                          changeFilter('search', search)
                        }}
                        className="d-flex flex-wrap align-items-center gap-2"
                      >
                        <CFormInput
                          className="crawl-filter-search"
                          placeholder="Nhập thông tin tìm kiếm..."
                          aria-label="Tìm sản phẩm"
                          value={search}
                          onChange={(event) => setSearch(event.target.value)}
                        />
                        <CButton color="primary" size="sm" type="submit">
                          Tìm
                        </CButton>
                      </form>
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
            {renderPagination('top')}
            <CTable responsive hover align="middle" className="crawl-product-table">
              <CTableHead>
                <CTableRow>
                  {[
                    'Tên / mã hàng hóa',
                    'Ảnh',
                    'Danh mục',
                    'Trạng thái',
                    'Ngày đồng bộ',
                    'Ngày crawl',
                    'Thao tác',
                  ].map((label) => (
                    <CTableHeaderCell
                      key={label}
                      className={label === 'Tên / mã hàng hóa' ? 'crawl-product-name' : undefined}
                    >
                      {label}
                    </CTableHeaderCell>
                  ))}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {list.data.map((row) => (
                  <CTableRow key={row.product_id}>
                    <CTableDataCell className="crawl-product-name">
                      <Link
                        to={`/product/image-crawl/${row.product_id}`}
                        className="blue-txt fw-semibold"
                      >
                        {row.title || `Sản phẩm #${row.product_id}`}
                      </Link>
                      <div className="d-flex align-items-center gap-1 mt-1">
                        <span className="orange-txt font-monospace fw-semibold">
                          {row.MaHH || row.macn ? `#${row.MaHH || row.macn}` : '—'}
                        </span>
                        {(row.MaHH || row.macn) && (
                          <button
                            type="button"
                            className="border-0 bg-transparent text-secondary p-1 d-inline-flex align-items-center"
                            aria-label={`Copy mã sản phẩm ${row.MaHH || row.macn}`}
                            title="Copy mã sản phẩm"
                            onClick={() => copyProductCode(row.MaHH || row.macn)}
                          >
                            <CIcon icon={cilCopy} size="custom" width={14} height={14} />
                          </button>
                        )}
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      {row.picture && (
                        <img
                          src={imageUrl(row.picture)}
                          alt=""
                          style={{ width: 56, height: 56, objectFit: 'contain' }}
                        />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{row.category || '—'}</CTableDataCell>
                    <CTableDataCell>
                      <div>{jobLabels[row.crawl_status] || 'Chưa crawl'}</div>
                      <small>{row.pending_count} ảnh chờ duyệt</small>
                      {row.error && <div className="small text-danger">{row.error}</div>}
                    </CTableDataCell>
                    <CTableDataCell>{dateLabel(row.synced_at)}</CTableDataCell>
                    <CTableDataCell>{dateLabel(row.finished_at || row.started_at)}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        as={Link}
                        to={`/product/image-crawl/${row.product_id}`}
                        size="sm"
                        color="primary"
                        variant="outline"
                        className="text-nowrap"
                      >
                        Xem chi tiết
                      </CButton>
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
            {renderPagination('bottom')}
          </CCardBody>
        </CCard>
      )}
      {productId && detail && (
        <>
          <div className="d-flex justify-content-end">
            <CButton as={Link} to="/product/image-crawl" color="secondary" variant="outline">
              ← Quay lại danh sách sản phẩm
            </CButton>
          </div>
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
              {detail.source_policy && (
                <div className="mb-3">
                  <h6>Nguồn ảnh theo cấp ưu tiên</h6>
                  <CRow className="g-2">
                    {detail.source_policy.tiers.map((tier) => (
                      <CCol md={4} key={tier.priority}>
                        <div className="border rounded p-3 h-100">
                          <strong>
                            Cấp {tier.priority}: {tier.name}
                          </strong>
                          <div className="small mt-2" style={{ maxHeight: 150, overflowY: 'auto' }}>
                            {(tier.kind === 'official'
                              ? Object.entries(detail.source_policy.official_domains)
                                  .filter(
                                    ([brand]) =>
                                      !detail.job?.normalized?.brand ||
                                      brand === detail.job.normalized.brand,
                                  )
                                  .flatMap(([brand, domains]) =>
                                    domains.map((domain) => ({ name: brand, domain })),
                                  )
                              : tier.sources
                            ).map((source) => (
                              <div key={source.domain}>
                                <a
                                  href={`https://${source.domain}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {source.name} · {source.domain}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CCol>
                    ))}
                  </CRow>
                </div>
              )}
              <CFormTextarea
                id="crawl-source-urls"
                className="mb-3"
                label="URL trang sản phẩm nguồn (mỗi dòng một URL, tối đa 10)"
                placeholder="https://..."
                rows={2}
                value={sources}
                disabled={queued || busy}
                onChange={(event) => setSources(event.target.value)}
              />
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
