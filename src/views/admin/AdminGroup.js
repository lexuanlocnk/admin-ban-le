import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CRow,
  CTable,
} from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'

import './css/adminGroup.css'
import Search from '../../components/search/Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DeletedModal from '../../components/deletedModal/DeletedModal'
import { toast } from 'react-toastify'
import { axiosClient } from '../../axiosConfig'

function AdminGroup() {
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const sub = params.get('sub')

  const [title, setTitle] = useState('')
  const [role, setRole] = useState('')

  const [adminGroupData, setAdminGroupData] = useState([])

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  // checkbox selected
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  // search input
  const [dataSearch, setDataSearch] = useState('')

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  useEffect(() => {
    if (sub === 'add') {
      setIsEditing(false)
      setTitle('')
      setRole('')
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } else if (sub === 'edit' && id) {
      setIsEditing(true)
    }
  }, [location.search])

  const fetchAdminGroupData = async (dataSearch = '') => {
    try {
      const response = await axiosClient.get(`admin/role?data=${dataSearch}`)

      if (response.data.status === true) {
        setAdminGroupData(response.data.roles)
      }
    } catch (error) {
      console.error('Fetch role adminstrator data is error', error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    }
  }

  useEffect(() => {
    fetchAdminGroupData()
  }, [])

  const fetchDataById = async () => {
    try {
      const response = await axiosClient.get(`admin/role/${id}/edit`)
      const data = response.data.role
      if (response.data.status === true) {
        setTitle(data?.title)
        setRole(data?.name)
      }
    } catch (error) {
      console.error('Fetch data admin group by id is error', error)
    }
  }

  useEffect(() => {
    fetchDataById()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isEditing) {
      //call api update data
      try {
        const response = await axiosClient.put(`admin/role/${id}`, {
          title: title,
          name: role,
        })

        if (response.data.status === true) {
          toast.success('Cập nhật vai trò thành công!')
          fetchAdminGroupData()
        }
      } catch (error) {
        console.error('Put role adminstrator data is error', error)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      }
    } else {
      //call api post new data
      try {
        const response = await axiosClient.post(`admin/role`, {
          title: title,
          name: role,
        })

        if (response.data.status === true) {
          toast.success('Thêm mới vai trò thành công!')
          fetchAdminGroupData()
        }
      } catch (error) {
        console.error('Post role adminstrator data is error', error)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      }
    }
  }

  const handleAddNewClick = () => {
    navigate('/admin/groups?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/admin/groups?id=${id}&sub=edit`)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axiosClient.delete(`admin/role/${deletedId}`)
      if (response.data.status === true) {
        setVisible(false)
        fetchAdminGroupData()
      }
    } catch (error) {
      console.error('Delete admin role is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  // table data
  const columns = [
    {
      key: 'id',
      label: (
        <>
          <CFormCheck
            aria-label="Select all"
            checked={isAllCheckbox}
            onChange={(e) => {
              const isChecked = e.target.checked
              setIsAllCheckbox(isChecked)
              if (isChecked) {
                const allIds = adminGroupData?.map((item) => item.id) || []
                setSelectedCheckbox(allIds)
              } else {
                setSelectedCheckbox([])
              }
            }}
          />
        </>
      ),
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

  const items =
    adminGroupData && adminGroupData?.length > 0
      ? adminGroupData?.map((item, index) => ({
          id: (
            <CFormCheck
              key={item?.id}
              aria-label="Default select example"
              defaultChecked={item?.id}
              id={`flexCheckDefault_${item?.id}`}
              value={item?.id}
              checked={selectedCheckbox.includes(item?.id)}
              onChange={(e) => {
                const commentId = item?.id
                const isChecked = e.target.checked
                if (isChecked) {
                  setSelectedCheckbox([...selectedCheckbox, commentId])
                } else {
                  setSelectedCheckbox(selectedCheckbox.filter((id) => id !== commentId))
                }
              }}
            />
          ),
          title: item.title,
          role: item.name,
          permission: (
            <Link to={`/admin/groups/edit?id=${item.id}`}>Cập nhật quyền [{item.name}]</Link>
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
        }))
      : []

  // search Data
  const handleSearch = (keyword) => {
    fetchAdminGroupData(keyword)
  }

  const handleDeleteSelectedCheckbox = async () => {
    console.log('>>> selectedCheckbox', selectedCheckbox)

    // try {
    //   const response = await axiosClient.post('/delete-all-comment', {
    //     data: selectedCheckbox,
    //   })
    // } catch (error) {
    //   console.error('Delete selected checkbox is error', error)
    // }
  }

  return (
    <CContainer>
      <DeletedModal visible={visible} setVisible={setVisible} onDelete={handleDelete} />
      <CRow className="mb-3">
        <CRow>
          <CCol md={6}>
            <h2>QUẢN LÝ NHÓM ADMIN</h2>
          </CCol>
          <CCol md={6}>
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
          <Search
            onSearchData={handleSearch}
            count={adminGroupData && adminGroupData.length > 0 ? adminGroupData.length : 0}
          />
          <CCol md={12} className="mt-3">
            <CButton onClick={handleDeleteSelectedCheckbox} color="primary" size="sm">
              Xóa vĩnh viễn
            </CButton>
          </CCol>
          <CTable hover className="mt-3" columns={columns} items={items} />
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default AdminGroup
