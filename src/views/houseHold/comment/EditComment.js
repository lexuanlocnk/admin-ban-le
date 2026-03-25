import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormSelect,
  CFormTextarea,
  CImage,
  CRow,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { axiosClient, imageBaseUrl } from '../../../axiosConfig'
import { toast } from 'react-toastify'

function EditComment() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const id = searchParams.get('id')

  // permission
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  // data
  const [detail, setDetail] = useState(null)

  // form state
  const [replyContent, setReplyContent] = useState('')
  const [display, setDisplay] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const fetchDetail = async () => {
    if (!id) return
    try {
      setIsFetching(true)
      const response = await axiosClient.get(`admin/household/product/discussions/${id}/edit`)
      if (response.data.status === true) {
        const data = response.data.data
        setDetail(data)
        setDisplay(data.display)
        setReplyContent(data.reply?.content || '')
      }
      if (response.data.status === false && response.data.mess === 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch discussion detail error:', error)
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const response = await axiosClient.post(`admin/household/product/discussions/${id}`, {
        _method: 'PUT',
        reply: replyContent,
        display: parseInt(display),
      })
      if (response.data.status === true) {
        toast.success('Cập nhật bình luận thành công!')
        fetchDetail()
      }
      if (response.data.status === false && response.data.mess === 'no permission') {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Reply comment error:', error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

  const renderRating = (rating) => {
    if (rating === null || rating === undefined) return null
    return (
      <div style={{ fontSize: 20, color: '#f0a500', marginTop: 4 }}>
        {'★'.repeat(rating)}
        <span style={{ color: '#ddd' }}>{'★'.repeat(5 - rating)}</span>
      </div>
    )
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
          {/* Header */}
          <CRow className="mb-3">
            <CCol>
              <h3>CHI TIẾT BÌNH LUẬN GIA DỤNG</h3>
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

          {isFetching ? (
            <div className="d-flex justify-content-center py-5">
              <CSpinner color="primary" />
            </div>
          ) : detail ? (
            <CRow className="g-3">
              {/* ─── CỘT TRÁI: Thông tin bình luận ─── */}
              <CCol md={7}>
                {/* Khách hàng & meta */}
                <CCard className="mb-3">
                  <CCardHeader className="fw-semibold" style={{ background: '#f8f9fa' }}>
                    Thông tin khách hàng
                  </CCardHeader>
                  <CCardBody>
                    <CRow className="g-2">
                      <CCol sm={6}>
                        <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>Họ tên</div>
                        <div className="fw-semibold">{detail.authorName || '—'}</div>
                      </CCol>
                      <CCol sm={6}>
                        <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>
                          Số điện thoại
                        </div>
                        <div>{detail.authorPhone || '—'}</div>
                      </CCol>
                      <CCol sm={6}>
                        <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>Loại</div>
                        {detail.type === 'review' ? (
                          <CBadge color="warning">Đánh giá</CBadge>
                        ) : (
                          <CBadge color="info">Bình luận</CBadge>
                        )}
                      </CCol>
                      <CCol sm={6}>
                        <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>Ngày tạo</div>
                        <div style={{ fontSize: 13 }}>{detail.createdAt}</div>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>

                {/* Sản phẩm */}
                <CCard className="mb-3">
                  <CCardHeader className="fw-semibold" style={{ background: '#f8f9fa' }}>
                    Sản phẩm liên quan
                  </CCardHeader>
                  <CCardBody>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Tên sản phẩm</div>
                    <div className="fw-semibold mb-2">{detail.productName}</div>
                    {detail.productSlug && (
                      <a
                        href={`https://hangtotgiatot.vn/${detail.productSlug}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: 13 }}
                      >
                        Xem sản phẩm trên website ↗
                      </a>
                    )}
                  </CCardBody>
                </CCard>

                {/* Nội dung bình luận */}
                <CCard className="mb-3">
                  <CCardHeader className="fw-semibold" style={{ background: '#f8f9fa' }}>
                    Nội dung bình luận
                  </CCardHeader>
                  <CCardBody>
                    {detail.type === 'review' && detail.rating && renderRating(detail.rating)}
                    <p
                      style={{
                        marginTop: detail.rating ? 10 : 0,
                        padding: '10px 14px',
                        background: '#f0f4ff',
                        borderRadius: 6,
                        borderLeft: '3px solid #4a90e2',
                        fontSize: 14,
                        lineHeight: 1.6,
                      }}
                    >
                      {detail.content}
                    </p>
                  </CCardBody>
                </CCard>

                {/* Hình ảnh bình luận */}
                {detail.images && detail.images.length > 0 && (
                  <CCard className="mb-3">
                    <CCardHeader className="fw-semibold" style={{ background: '#f8f9fa' }}>
                      Hình ảnh bình luận ({detail.images.length})
                    </CCardHeader>
                    <CCardBody>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {detail.images.map((img, idx) => (
                          <a
                            href={`${imageBaseUrl}${img}`}
                            target="_blank"
                            rel="noreferrer"
                            key={idx}
                          >
                            <CImage
                              src={`${imageBaseUrl}${img}`}
                              alt={`Ảnh ${idx + 1}`}
                              width={110}
                              height={110}
                              style={{
                                objectFit: 'cover',
                                borderRadius: 6,
                                border: '1px solid #eee',
                              }}
                            />
                          </a>
                        ))}
                      </div>
                    </CCardBody>
                  </CCard>
                )}
              </CCol>

              {/* ─── CỘT PHẢI: Quản lý & phản hồi ─── */}
              <CCol md={5}>
                {/* Cài đặt hiển thị */}
                <CCard className="mb-3">
                  <CCardHeader className="fw-semibold" style={{ background: '#f8f9fa' }}>
                    Cài đặt hiển thị
                  </CCardHeader>
                  <CCardBody>
                    <label
                      htmlFor="display-select"
                      style={{ fontSize: 13, marginBottom: 4, display: 'block' }}
                    >
                      Cho phép hiển thị bình luận này trên website
                    </label>
                    <CFormSelect
                      id="display-select"
                      className="component-size"
                      value={display}
                      onChange={(e) => setDisplay(e.target.value)}
                      options={[
                        { label: 'Hiển thị', value: 1 },
                        { label: 'Ẩn', value: 0 },
                      ]}
                    />
                  </CCardBody>
                </CCard>

                {/* Reply hiện tại */}
                {detail.reply && (
                  <CCard className="mb-3" style={{ borderLeft: '3px solid #3c9d3c' }}>
                    <CCardHeader
                      className="fw-semibold"
                      style={{ background: '#f0fff0', color: '#2d6a2d' }}
                    >
                      Reply hiện tại
                    </CCardHeader>
                    <CCardBody>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 8,
                        }}
                      >
                        <CBadge color="success">{detail.reply.adminName}</CBadge>
                        <span style={{ fontSize: 11, color: '#888' }}>
                          {detail.reply.updatedAt}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 13,
                          background: '#f8fff8',
                          padding: '8px 12px',
                          borderRadius: 6,
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {detail.reply.content}
                      </p>
                    </CCardBody>
                  </CCard>
                )}

                {/* Form reply mới */}
                <CCard className="mb-3">
                  <CCardHeader className="fw-semibold" style={{ background: '#f8f9fa' }}>
                    {detail.reply ? 'Cập nhật phản hồi' : 'Phản hồi khách hàng'}
                  </CCardHeader>
                  <CCardBody>
                    <label
                      htmlFor="reply-textarea"
                      style={{ fontSize: 13, marginBottom: 6, display: 'block', color: '#555' }}
                    >
                      Nội dung phản hồi gửi tới khách hàng:
                    </label>
                    <CFormTextarea
                      id="reply-textarea"
                      rows={6}
                      placeholder="Nhập nội dung phản hồi..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      style={{ resize: 'vertical', fontSize: 13 }}
                    />
                    <div className="d-flex gap-2 mt-3">
                      <CButton
                        color="primary"
                        size="sm"
                        onClick={handleSubmit}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <CSpinner size="sm" /> Đang lưu...
                          </>
                        ) : (
                          'Lưu thay đổi'
                        )}
                      </CButton>
                      <Link to={'/household/comment'}>
                        <CButton color="secondary" size="sm" type="button">
                          Hủy
                        </CButton>
                      </Link>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          ) : (
            <div className="text-center py-5 text-muted">Không tìm thấy dữ liệu bình luận.</div>
          )}
        </>
      )}
    </CContainer>
  )
}

export default EditComment
