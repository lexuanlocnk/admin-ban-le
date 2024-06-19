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

function AdminGroup() {
  const location = useLocation()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ title: '', role: '' })

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const id = params.get('id')
    const sub = params.get('sub')

    if (sub === 'add') {
      setIsEditing(false)
      setFormData({ title: '', role: '' })
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } else if (sub === 'edit' && id) {
      setIsEditing(true)
      fetchDataById(id)
    }
  }, [location.search])

  const fetchDataById = async (id) => {}

  const handleInputChange = async (e) => {
    const { name, value } = e.target
    setFormData(...formData, { [name]: value })
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
  const items = [
    {
      id: 1,
      title: 'Quản trị website',
      role: 'administrator',
      permission: <Link>Cập nhật quyền [administrator]</Link>,
      actions: (
        <div>
          <button onClick={handleEditClick(5)} className="button-action mr-2 bg-info">
            <CIcon icon={cilColorBorder} className="text-white" />
          </button>
          <button className="button-action bg-danger">
            <CIcon icon={cilTrash} className="text-white" />
          </button>
        </div>
      ),
      _cellProps: { id: { scope: 'row' } },
    },
  ]

  return (
    <CContainer>
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
          <h6>Thêm nhóm admin mới</h6>
          <CForm className="row gy-3">
            <CCol md={12}>
              <CFormInput ref={inputRef} id="inputTitle" label="Tiêu đề" value={formData.title} />
            </CCol>

            <CCol md={12}>
              <CFormInput id="inputPassword" label="Role" value={formData.role} />
            </CCol>

            <CCol xs={12}>
              <CButton color="primary" type="submit" size="sm">
                Thêm mới
              </CButton>
            </CCol>
          </CForm>
        </CCol>

        <CCol md={8}>
          <Search />
          <CTable hover className="mt-3" columns={columns} items={items} />
          <CPagination align="end" aria-label="Page navigation example" size="sm">
            <CPaginationItem aria-label="Previous" disabled>
              <span aria-hidden="true">&laquo;</span>
            </CPaginationItem>
            <CPaginationItem active>1</CPaginationItem>
            <CPaginationItem>2</CPaginationItem>
            <CPaginationItem>3</CPaginationItem>
            <CPaginationItem aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>
          </CPagination>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default AdminGroup
