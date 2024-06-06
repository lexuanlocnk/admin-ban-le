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
import React from 'react'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'

import './css/adminGroup.css'
import Search from '../../components/search/Search'
import { Link } from 'react-router-dom'

function AdminGroup() {
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
          <button className="button-action mr-2">
            <CIcon icon={cilColorBorder} className="text-info" />
          </button>
          <button className="button-action">
            <CIcon icon={cilTrash} className="text-danger" />
          </button>
        </div>
      ),
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: 2,
      title: 'Biên tập viên',
      role: 'editor',
      permission: <Link>Cập nhật quyền [editor]</Link>,
      actions: (
        <div>
          <button className="button-action mr-2">
            <CIcon icon={cilColorBorder} className="text-info" />
          </button>
          <button className="button-action">
            <CIcon icon={cilTrash} className="text-danger" />
          </button>
        </div>
      ),
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: 3,
      title: 'Tuyển dụng',
      role: 'hire',
      permission: <Link>Cập nhật quyền [hire]</Link>,
      actions: (
        <div>
          <button className="button-action mr-2">
            <CIcon icon={cilColorBorder} className="text-info" />
          </button>
          <button className="button-action">
            <CIcon icon={cilTrash} className="text-danger" />
          </button>
        </div>
      ),
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: 4,
      title: 'Sales',
      role: 'sale',
      permission: <Link>Cập nhật quyền [sale]</Link>,
      actions: (
        <div>
          <button className="button-action mr-2">
            <CIcon icon={cilColorBorder} className="text-info" />
          </button>
          <button className="button-action">
            <CIcon icon={cilTrash} className="text-danger" />
          </button>
        </div>
      ),
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: 5,
      title: 'PM',
      role: 'content',
      permission: <Link>Cập nhật quyền [content]</Link>,
      actions: (
        <div>
          <button className="button-action mr-2">
            <CIcon icon={cilColorBorder} className="text-info" />
          </button>
          <button className="button-action">
            <CIcon icon={cilTrash} className="text-danger" />
          </button>
        </div>
      ),
      _cellProps: { id: { scope: 'row' } },
    },
  ]
  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol md={6}>
          <h4>QUẢN LÝ NHÓM ADMIN</h4>
        </CCol>
        <CCol md={6}></CCol>
      </CRow>

      <CRow>
        <CCol md={4}>
          <h6>Thêm nhóm admin mới</h6>
          <CForm className="row gy-3">
            <CCol md={12}>
              <CFormInput id="inputEmail4" label="Tiêu đề" />
            </CCol>

            <CCol md={12}>
              <CFormInput id="inputPassword4" label="Role" />
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
