import React, { useEffect, useRef, useState } from 'react'
import { CButton, CCol, CContainer, CFormCheck, CFormInput, CRow, CTable } from '@coreui/react'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Search from '../../components/search/Search'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'
import DeletedModal from '../../components/deletedModal/DeletedModal'
import { toast } from 'react-toastify'
import { axiosClient } from '../../axiosConfig'

function GroupSupport() {
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const sub = params.get('sub')

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  const [dataSupportGroup, setDataSupportGroup] = useState([])

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // selected checkbox
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  const initialValues = {
    title: '',
    name: '',
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc.'),
    name: Yup.string().required('Name là bắt buộc.'),
  })

  useEffect(() => {
    if (sub === 'add') {
      setIsEditing(false)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } else if (sub === 'edit' && id) {
      setIsEditing(true)
    }
  }, [location.search])

  const fetchDataSupportGroup = async (dataSearch = '') => {
    try {
      const response = await axiosClient.get(`/support-group?data=${dataSearch}`)
      if (response.data.status === true) {
        setDataSupportGroup(response.data.data)
      }
    } catch (error) {
      console.error('Fetch data support group is error', error)
    }
  }

  useEffect(() => {
    fetchDataSupportGroup()
  }, [])

  const fetchDataById = async (setValues) => {
    try {
      const response = await axiosClient.get(`/support-group/${id}/edit`)
      const data = response.data.data
      if (data && response.data.status === true) {
        setValues({
          title: data.title,
          name: data.name,
        })
      } else {
        console.error('No data found for the given ID.')
      }
    } catch (error) {
      console.error('Fetch data id group support is error', error.message)
    }
  }

  const handleSubmit = async (values) => {
    if (isEditing) {
      //call api update data
      try {
        const response = await axiosClient.put(`/support-group/${id}`, {
          title: values.title,
          name: values.name,
        })
        if (response.data.status === true) {
          toast.success('Cập nhật nhóm support thành công')
          fetchDataSupportGroup()
        } else {
          console.error('No data found for the given ID.')
        }
      } catch (error) {
        console.error('Put data id group support is error', error.message)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      }
    } else {
      //call api post new data
      try {
        const response = await axiosClient.post('/support-group', {
          title: values.title,
          name: values.name,
        })
        if (response.data.status === true) {
          toast.success('Thêm mới nhóm support thành công!')
          fetchDataSupportGroup()
        }
      } catch (error) {
        console.error('Post data group support is error', error)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      }
    }
  }

  const handleAddNewClick = () => {
    navigate('/group-support?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/group-support?id=${id}&sub=edit`)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axiosClient.delete(`/support-group/${deletedId}`)
      if (response.data.status === true) {
        setVisible(false)
        fetchDataSupportGroup()
      }
    } catch (error) {
      console.error('Delete support group id is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  // search Data
  const handleSearch = (keyword) => {
    fetchDataSupportGroup(keyword)
  }

  const items =
    dataSupportGroup && dataSupportGroup?.length > 0
      ? dataSupportGroup.map((item) => ({
          id: (
            <CFormCheck
              id={item.brandId}
              checked={selectedCheckbox.includes(item.brandId)}
              value={item.brandId}
              onChange={(e) => {
                const idx = item.brandId
                const isChecked = e.target.checked
                if (isChecked) {
                  setSelectedCheckbox([...selectedCheckbox, idx])
                } else {
                  setSelectedCheckbox(selectedCheckbox.filter((id) => id !== idx))
                }
              }}
            />
          ),
          title: item.title,
          name: item.name,
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
      label: '#',
      _props: { scope: 'col' },
    },
    {
      key: 'title',
      label: 'Tiêu đề',
      _props: { scope: 'col' },
    },
    {
      key: 'name',
      label: 'Name',
      _props: { scope: 'col' },
    },

    {
      key: 'actions',
      label: 'Tác vụ',
      _props: { scope: 'col' },
    },
  ]

  return (
    <CContainer>
      <DeletedModal visible={visible} setVisible={setVisible} onDelete={handleDelete} />
      <CRow className="mb-3">
        <CCol md={6}>
          <h2>QUẢN LÝ NHÓM SUPPORT</h2>
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
            <Link to={'/group-support'}>
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={4}>
          <h6>{!isEditing ? 'Thêm nhóm support' : 'Cập nhật nhóm support'}</h6>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, setValues }) => {
              useEffect(() => {
                fetchDataById(setValues)
              }, [setValues, id])
              return (
                <Form>
                  <CCol md={12}>
                    <label htmlFor="title-input">Tiêu đề </label>
                    <Field name="title">
                      {({ field }) => (
                        <CFormInput {...field} type="text" id="title-input" ref={inputRef} />
                      )}
                    </Field>
                    <ErrorMessage name="title" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="name-input">Name</label>
                    <Field name="name" type="text" as={CFormInput} id="name-input" />
                    <ErrorMessage name="name" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol xs={12}>
                    <CButton color="primary" type="submit" size="sm">
                      {isEditing ? 'Cập nhật' : 'Thêm mới'}
                    </CButton>
                  </CCol>
                </Form>
              )
            }}
          </Formik>
        </CCol>

        <CCol>
          <Search count={dataSupportGroup?.length} onSearchData={handleSearch} />
          <CTable className="mt-2" columns={columns} items={items} />
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default GroupSupport