import { cilColorBorder, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CBadge,
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormSelect,
  CRow,
  CTable,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import { axiosClient } from '../../../axiosConfig'
import DeletedModal from '../../../components/deletedModal/DeletedModal'
import { toast } from 'react-toastify'
import Loading from '../../../components/loading/Loading'

function Comments() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const pageFromUrl = parseInt(searchParams.get('page')) || 1
  const [pageNumber, setPageNumber] = useState(pageFromUrl)

  useEffect(() => {
    setSearchParams({ page: pageNumber })
  }, [pageNumber, setSearchParams])

  // permission
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  // data
  const [commentData, setCommentData] = useState(null)

  // loading
  const [isLoading, setIsLoading] = useState(false)

  // delete modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // checkbox
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  // filter collapse
  const [isCollapse, setIsCollapse] = useState(false)

  // filters
  const [filterType, setFilterType] = useState('')
  const [filterDisplay, setFilterDisplay] = useState('')
  const [filterReply, setFilterReply] = useState('')

  const handleToggleCollapse = () => setIsCollapse((prev) => !prev)

  const handleEditClick = (id) => {
    navigate(`/household/comment/edit?id=${id}`)
  }

  const fetchCommentData = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({ page: pageNumber })
      if (filterType) params.append('type', filterType)
      if (filterDisplay !== '') params.append('display', filterDisplay)
      if (filterReply !== '') params.append('has_reply', filterReply)

      const response = await axiosClient.get(
        `admin/household/product/discussions?${params.toString()}`,
      )

      if (response.data.status === true) {
        setCommentData(response.data.data)
      }

      if (response.data.status === false && response.data.mess === 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch household comment data error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCommentData()
  }, [pageNumber, filterType, filterDisplay, filterReply])

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected + 1)
    window.scrollTo(0, 0)
  }

  // single delete via modal
  const handleDelete = async () => {
    try {
      const response = await axiosClient.delete(`admin/household/product/discussions-delete`, {
        data: { _method: 'DELETE', ids: [deletedId] },
      })
      if (response.data.status === true) {
        setVisible(false)
        toast.success('Đã xóa bình luận thành công!')
        fetchCommentData()
        setSelectedCheckbox([])
      }
      if (response.data.status === false && response.data.mess === 'no permission') {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Delete comment error:', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  const handleDeleteSelectedCheckbox = async () => {
    if (selectedCheckbox.length === 0) {
      toast.warn('Vui lòng chọn ít nhất một bình luận!')
      return
    }
    try {
      const response = await axiosClient.delete(`admin/household/product/discussions-delete`, {
        data: { _method: 'DELETE', ids: selectedCheckbox },
      })
      if (response.data.status === true) {
        toast.success('Đã xóa các mục được chọn!')
        fetchCommentData()
        setSelectedCheckbox([])
        setIsAllCheckbox(false)
      }
    } catch (error) {
      console.error('Bulk delete error:', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  const renderTypeBadge = (type) => {
    if (type === 'review') return <CBadge color="warning">Đánh giá</CBadge>
    return <CBadge color="info">Bình luận</CBadge>
  }

  const renderDisplayBadge = (display) => {
    return display === 1 ? (
      <CBadge color="success">Hiển thị</CBadge>
    ) : (
      <CBadge color="secondary">Ẩn</CBadge>
    )
  }

  const renderReplyBadge = (hasReply) => {
    return hasReply === 1 ? (
      <CBadge color="primary">Đã reply</CBadge>
    ) : (
      <CBadge color="danger">Chưa</CBadge>
    )
  }

  const renderRating = (rating) => {
    if (rating === null || rating === undefined) return <span className="text-muted">—</span>
    return (
      <span style={{ color: '#f0a500', fontSize: 13 }}>
        {'★'.repeat(rating)}
        {'☆'.repeat(5 - rating)}
      </span>
    )
  }

  const items =
    commentData?.items && commentData.items.length > 0
      ? commentData.items.map((item) => ({
          checkbox: (
            <CFormCheck
              key={item.id}
              id={`check_${item.id}`}
              value={item.id}
              checked={selectedCheckbox.includes(item.id)}
              onChange={(e) => {
                const id = item.id
                const checked = e.target.checked
                setSelectedCheckbox((prev) =>
                  checked ? [...prev, id] : prev.filter((x) => x !== id),
                )
              }}
            />
          ),
          id: <span className="fw-semibold text-secondary">#{item.id}</span>,
          type: renderTypeBadge(item.type),
          customer: (
            <div style={{ minWidth: 130 }}>
              <div className="fw-semibold">{item.author_name}</div>
              {item.author_phone && (
                <div style={{ fontSize: 12, color: '#888' }}>{item.author_phone}</div>
              )}
            </div>
          ),
          product: (
            <div style={{ maxWidth: 200 }}>
              <span
                style={{
                  fontSize: 12,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
                title={item.product_name}
              >
                {item.product_name}
              </span>
            </div>
          ),
          rating: renderRating(item.rating),
          content: (
            <div
              style={{
                maxWidth: 220,
                fontSize: 13,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              title={item.content}
            >
              {item.content}
            </div>
          ),
          images: (
            <CBadge color={item.total_images > 0 ? 'info' : 'light'} style={{ minWidth: 28 }}>
              {item.total_images}
            </CBadge>
          ),
          display: renderDisplayBadge(item.display),
          has_reply: renderReplyBadge(item.has_reply),
          created_at: <span style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{item.created_at}</span>,
          actions: (
            <div style={{ display: 'flex', gap: 4 }}>
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
          _cellProps: { checkbox: { scope: 'row' } },
        }))
      : []

  const columns = [
    {
      key: 'checkbox',
      label: (
        <CFormCheck
          aria-label="Chọn tất cả"
          checked={isAllCheckbox}
          onChange={(e) => {
            const checked = e.target.checked
            setIsAllCheckbox(checked)
            if (checked) {
              setSelectedCheckbox(commentData?.items?.map((i) => i.id) || [])
            } else {
              setSelectedCheckbox([])
            }
          }}
        />
      ),
      _props: { scope: 'col', style: { width: 40 } },
    },
    { key: 'id', label: 'ID', _props: { scope: 'col' } },
    { key: 'type', label: 'Loại', _props: { scope: 'col' } },
    { key: 'customer', label: 'Khách hàng', _props: { scope: 'col' } },
    { key: 'product', label: 'Sản phẩm', _props: { scope: 'col' } },
    { key: 'rating', label: '⭐ Đánh giá', _props: { scope: 'col' } },
    { key: 'content', label: 'Nội dung', _props: { scope: 'col' } },
    { key: 'images', label: 'Ảnh', _props: { scope: 'col', style: { width: 55 } } },
    { key: 'display', label: 'Hiển thị', _props: { scope: 'col' } },
    { key: 'has_reply', label: 'Reply', _props: { scope: 'col' } },
    { key: 'created_at', label: 'Ngày tạo', _props: { scope: 'col' } },
    { key: 'actions', label: 'Tác vụ', _props: { scope: 'col', style: { width: 90 } } },
  ]

  const pagination = commentData?.pagination

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
              <h2>QUẢN LÝ BÌNH LUẬN GIA DỤNG</h2>
            </CCol>
            <CCol md={6}>
              <div className="d-flex justify-content-end">
                <Link to={'/household/comment'}>
                  <CButton color="primary" type="button" size="sm">
                    Danh sách
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol>
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
                      <td className="total-count">{pagination?.total ?? '—'}</td>
                    </tr>
                    <tr>
                      <td>Lọc theo loại</td>
                      <td>
                        <CFormSelect
                          className="component-size w-50"
                          value={filterType}
                          onChange={(e) => {
                            setFilterType(e.target.value)
                            setPageNumber(1)
                          }}
                          options={[
                            { label: 'Tất cả', value: '' },
                            { label: 'Bình luận', value: 'comment' },
                            { label: 'Đánh giá', value: 'review' },
                          ]}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Trạng thái hiển thị</td>
                      <td>
                        <CFormSelect
                          className="component-size w-50"
                          value={filterDisplay}
                          onChange={(e) => {
                            setFilterDisplay(e.target.value)
                            setPageNumber(1)
                          }}
                          options={[
                            { label: 'Tất cả', value: '' },
                            { label: 'Hiển thị', value: '1' },
                            { label: 'Ẩn', value: '0' },
                          ]}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Trạng thái reply</td>
                      <td>
                        <CFormSelect
                          className="component-size w-50"
                          value={filterReply}
                          onChange={(e) => {
                            setFilterReply(e.target.value)
                            setPageNumber(1)
                          }}
                          options={[
                            { label: 'Tất cả', value: '' },
                            { label: 'Đã reply', value: '1' },
                            { label: 'Chưa reply', value: '0' },
                          ]}
                        />
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </CCol>

            <CCol md={12} className="mt-3">
              <CButton
                onClick={handleDeleteSelectedCheckbox}
                color="primary"
                size="sm"
                disabled={selectedCheckbox.length === 0}
              >
                Xóa vĩnh viễn {selectedCheckbox.length > 0 && `(${selectedCheckbox.length})`}
              </CButton>
            </CCol>

            <CCol>
              {isLoading ? (
                <Loading />
              ) : (
                <CTable hover responsive className="mt-3 border" columns={columns} items={items} />
              )}
            </CCol>

            <div className="d-flex justify-content-end">
              <ReactPaginate
                pageCount={pagination ? Math.ceil(pagination.total / pagination.perPage) : 1}
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
                forcePage={pageNumber - 1}
              />
            </div>
          </CRow>
        </>
      )}
    </CContainer>
  )
}

export default Comments
