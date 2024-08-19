import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Search from '../../components/search/Search'
import ReactPaginate from 'react-paginate'
import axios from 'axios'
import { axiosClient } from '../../axiosConfig'
import CIcon from '@coreui/icons-react'
import { cilColorBorder, cilTrash } from '@coreui/icons'
import moment from 'moment'
import DeletedModal from '../../components/deletedModal/DeletedModal'
import { toast } from 'react-toastify'

const host = `http://192.168.245.154.:3000/`

function Comment() {
  const navigate = useNavigate()
  const [isCollapse, setIsCollapse] = useState(false)

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  const [commentData, setCommentData] = useState([])

  // checkbox selected
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

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
    fetchCommentData(keyword)
  }

  const handleEditClick = (id) => {
    navigate(`/comment/edit?id=${id}`)
  }

  const fetchCommentData = async (dataSearch = '') => {
    try {
      const response = await axiosClient.get(`/comment?page=${pageNumber}&data=${dataSearch}`)

      if (response.data.status === true) {
        setCommentData(response.data.listComment)
      }
    } catch (error) {
      console.error('Fetch comment data is error', error)
    }
  }

  useEffect(() => {
    fetchCommentData()
  }, [pageNumber])

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axiosClient.delete(`comment/${deletedId}`)
      if (response.data.status === true) {
        setVisible(false)
        fetchCommentData()
      }
    } catch (error) {
      console.error('Delete comment id is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  const handleDeleteSelectedCheckbox = async () => {
    console.log('>>> selectedCheckbox', selectedCheckbox)

    try {
      const response = await axiosClient.post('/delete-all-comment', {
        data: selectedCheckbox,
      })
    } catch (error) {
      console.error('Delete selected checkbox is error', error)
    }
  }

  return (
    <CContainer>
      <DeletedModal visible={visible} setVisible={setVisible} onDelete={handleDelete} />

      <CRow className="mb-3">
        <CCol md={6}>
          <h2>QUẢN LÝ BÌNH LUẬN</h2>
        </CCol>
        <CCol md={6}>
          <div className="d-flex justify-content-end">
            <Link to={`/comment`}>
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={12}>
          <Search count={commentData?.total} onSearchData={handleSearch} />
        </CCol>

        <CCol md={12} className="mt-3">
          <CButton onClick={handleDeleteSelectedCheckbox} color="primary" size="sm">
            Xóa vĩnh viễn
          </CButton>
        </CCol>
        <CCol className="mt-3">
          <CTable className="border" hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">
                  <CFormCheck
                    aria-label="Select all"
                    checked={isAllCheckbox}
                    onChange={(e) => {
                      const isChecked = e.target.checked
                      setIsAllCheckbox(isChecked)
                      if (isChecked) {
                        const allIds = commentData?.data.map((item) => item.comment_id) || []
                        setSelectedCheckbox(allIds)
                      } else {
                        setSelectedCheckbox([])
                      }
                    }}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Tác giả</CTableHeaderCell>
                <CTableHeaderCell scope="col">Nội dung bình luận</CTableHeaderCell>
                <CTableHeaderCell scope="col">Trả lời cho</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ngày gửi</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tác vụ</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {commentData?.data &&
                commentData?.data.length > 0 &&
                commentData?.data.map((item) => (
                  <CTableRow key={item.comment_id}>
                    <CTableHeaderCell scope="row">
                      <CFormCheck
                        key={item?.comment_id}
                        aria-label="Default select example"
                        defaultChecked={item?.comment_id}
                        id={`flexCheckDefault_${item?.comment_id}`}
                        value={item?.comment_id}
                        checked={selectedCheckbox.includes(item?.comment_id)}
                        onChange={(e) => {
                          const commentId = item?.comment_id
                          const isChecked = e.target.checked
                          if (isChecked) {
                            setSelectedCheckbox([...selectedCheckbox, commentId])
                          } else {
                            setSelectedCheckbox(selectedCheckbox.filter((id) => id !== commentId))
                          }
                        }}
                      />
                    </CTableHeaderCell>

                    <CTableDataCell>{item.name}</CTableDataCell>

                    <CTableDataCell style={{ width: '30%' }}>{item.content}</CTableDataCell>

                    <CTableDataCell style={{ fontSize: 13 }} className="orange-txt">
                      <a
                        href={`${host}/detail-product/${item?.product_desc?.friendly_url}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item?.product_desc?.title}
                      </a>
                    </CTableDataCell>

                    <CTableDataCell style={{ fontSize: 13 }} className="orange-txt">
                      {moment(item.created_at).format('DD-MM-YYYY, hh:mm:ss A')}
                    </CTableDataCell>
                    <CTableDataCell style={{ width: 100 }} className="orange-txt">
                      <div>
                        <button
                          onClick={() => handleEditClick(item.comment_id)}
                          className="button-action mr-2 bg-info"
                        >
                          <CIcon icon={cilColorBorder} className="text-white" />
                        </button>
                        <button
                          onClick={() => {
                            setVisible(true)
                            setDeletedId(item.comment_id)
                          }}
                          className="button-action bg-danger"
                        >
                          <CIcon icon={cilTrash} className="text-white" />
                        </button>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
            </CTableBody>
          </CTable>
          <div className="d-flex justify-content-end">
            <ReactPaginate
              pageCount={Math.ceil(commentData?.total / commentData?.per_page)}
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

export default Comment
