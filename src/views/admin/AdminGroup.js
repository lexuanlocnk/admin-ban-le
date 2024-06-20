import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CPagination,
  CPaginationItem,
  CRow,
  CTable,
} from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'

import './css/adminGroup.css'
import Search from '../../components/search/Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import DeletedModal from '../../components/deletedModal/DeletedModal'

const fakeData = [
  {
    id: 1,
    title: 'Quản trị website',
    role: 'administrator',
    permission: 'administrator',
  },
]

function AdminGroup() {
  const location = useLocation()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [role, setRole] = useState('')

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  // search input
  const [dataSearch, setDataSearch] = useState('')

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  // show deleted Modal
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const id = params.get('id')
    const sub = params.get('sub')

    if (sub === 'add') {
      setIsEditing(false)
      setTitle('')
      setRole('')
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } else if (sub === 'edit' && id) {
      setIsEditing(true)
      fetchDataById(id)
    }
  }, [location.search])

  const fetchDataById = async (id, dataSearch) => {
    //api?search={dataSearch}
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isEditing) {
      //call api update data
    } else {
      //call api post new data
    }
  }

  const handleAddNewClick = () => {
    navigate('/admin/groups?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/admin/groups?id=${id}&sub=edit`)
  }

  // delete row
  const handleDelete = (id) => {
    setVisible(true)
  }

  // table data
  const columns = [
    {
      key: 'id',
      label: '#',
      _props: { scope: 'col' },
    },
    {
      key: 'title',
      label: 'Tiêu đề',
      _props: { scope: 'col' },
    },
    {
      key: 'role',
      label: 'Vai trò',
      _props: { scope: 'col' },
    },
    {
      key: 'permission',
      label: 'Quyền hạn',
      _props: { scope: 'col' },
    },
    {
      key: 'actions',
      label: 'Tác vụ',
      _props: { scope: 'col' },
    },
  ]

  const items = fakeData.map((item, index) => ({
    id: item.id,
    title: item.title,
    role: item.role,
    permission: <Link>Cập nhật quyền [{item.permission}]</Link>,
    actions: (
      <div>
        <button onClick={() => handleEditClick(item.id)} className="button-action mr-2 bg-info">
          <CIcon icon={cilColorBorder} className="text-white" />
        </button>
        <button onClick={() => handleDelete(item.id)} className="button-action bg-danger">
          <CIcon icon={cilTrash} className="text-white" />
        </button>
      </div>
    ),
  }))

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
    fetchDataById(keyword)
  }

  return (
    <CContainer>
      <DeletedModal visible={visible} setVisible={setVisible} />
      <CRow className="mb-3">
        <CRow>
          <CCol>
            <h4>QUẢN LÝ NHÓM ADMIN</h4>
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
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </div>
          </CCol>
        </CRow>
      </CRow>

      <CRow>
        <CCol md={4}>
          <h6>{!isEditing ? 'Thêm nhóm admin mới' : 'Chỉnh sửa nhóm admin'}</h6>
          <CForm className="row gy-3">
            <CCol md={12}>
              <CFormInput
                ref={inputRef}
                id="inputTitle"
                label="Tiêu đề"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </CCol>

            <CCol md={12}>
              <CFormInput
                id="inputPassword"
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </CCol>

            <CCol xs={12}>
              <CButton onClick={handleSubmit} color="primary" type="submit" size="sm">
                {isEditing ? 'Cập nhật' : 'Thêm mới'}
              </CButton>
            </CCol>
          </CForm>
        </CCol>

        <CCol md={8}>
          <Search onSearchData={handleSearch} />
          <CTable hover className="mt-3" columns={columns} items={items} />

          <div className="d-flex justify-content-end">
            <ReactPaginate
              pageCount={Math.round(20 / 10)}
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

export default AdminGroup
