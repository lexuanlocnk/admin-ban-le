import { cilColorBorder, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormSelect,
  CImage,
  CRow,
  CTable,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosClient } from '../../../axiosConfig'
import DeletedModal from '../../../components/deletedModal/DeletedModal'

function MailTemplate() {
  const navigate = useNavigate()

  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  const [dataAddress, setDataAddress] = useState([])

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // checkbox selected
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  const [isCollapse, setIsCollapse] = useState(false)

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  // search input
  const [dataSearch, setDataSearch] = useState('')

  const handleAddNewClick = () => {
    navigate('/content/mail-temp/add')
  }

  const handleEditClick = (id) => {
    navigate(`/content/mail-temp/edit?id=${id}`)
  }

  // search Data
  const handleSearch = (keyword) => {
    fetchDataAddress(keyword)
  }

  const fetchDataAddress = async (dataSearch = '') => {
    try {
      const response = await axiosClient.get(`admin/contact-config`)

      if (response.data.status === true) {
        setDataAddress(response.data.list)
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch consultant data is error', error)
    }
  }

  useEffect(() => {
    fetchDataAddress()
  }, [pageNumber])

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    // try {
    //   const response = await axiosClient.delete(`admin/faqs/${deletedId}`)
    //   if (response.data.status === true) {
    //     setVisible(false)
    //     fetchDataAddress()
    //   }

    //   if (response.data.status === false && response.data.mess == 'no permission') {
    //     toast.warn('Bạn không có quyền thực hiện tác vụ này!')
    //   }
    // } catch (error) {
    //   console.error('Delete consultant id is error', error)
    //   toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    // }
  }

  const handleDeleteSelectedCheckbox = async () => {
    alert('Chức năng đang thực hiện...')
    // try {
    //   const response = await axiosClient.post('admin/delete-all-news', {
    //     data: selectedCheckbox,
    //   })
    //   if (response.data.status === true) {
    //     toast.success('Xóa tất cả các mục thành công!')
    //     fetchDataConsultant()
    //     setSelectedCheckbox([])
    //   }
    // } catch (error) {
    //   console.error('Deleted all id checkbox is error', error)
    // }
  }

  const items =
    dataAddress && dataAddress?.length > 0
      ? dataAddress.map((item) => ({
          id: (
            <CFormCheck
              key={item?.contact_id}
              aria-label="Default select example"
              defaultChecked={item?.contact_id}
              id={`flexCheckDefault_${item?.contact_id}`}
              value={item?.contact_id}
              checked={selectedCheckbox.includes(item?.contact_id)}
              onChange={(e) => {
                const contactId = item?.contact_id
                const isChecked = e.target.checked
                if (isChecked) {
                  setSelectedCheckbox([...selectedCheckbox, contactId])
                } else {
                  setSelectedCheckbox(selectedCheckbox.filter((id) => id !== contactId))
                }
              }}
            />
          ),

          title: (
            <div
              style={{
                minWidth: 120,
              }}
              className="blue-txt"
            >
              {item?.title}
            </div>
          ),

          name: <div className="cate-color">{item?.email}</div>,

          actions: (
            <div>
              <button
                onClick={() => handleEditClick(item?.contact_id)}
                className="button-action mr-2 bg-info"
              >
                <CIcon icon={cilColorBorder} className="text-white" />
              </button>
              <button
                onClick={() => {
                  setVisible(true)
                  setDeletedId(item?.contact_id)
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
      label: (
        <>
          <CFormCheck
            aria-label="Select all"
            checked={isAllCheckbox}
            onChange={(e) => {
              const isChecked = e.target.checked
              setIsAllCheckbox(isChecked)
              if (isChecked) {
                const allIds = dataAddress?.data.map((item) => item.id) || []
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
              <h2>QUẢN LÝ MAIL TEMP</h2>
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
                <Link to={'/content/mail-temp'}>
                  <CButton color="primary" type="submit" size="sm">
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
                      <td className="total-count">{dataAddress?.total}</td>
                    </tr>

                    <tr>
                      <td>Tìm kiếm</td>
                      <td>
                        <input
                          type="text"
                          className="search-input"
                          value={dataSearch}
                          onChange={(e) => setDataSearch(e.target.value)}
                        />
                        <button onClick={() => handleSearch(dataSearch)} className="submit-btn">
                          Submit
                        </button>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </CCol>

            <CCol md={12} className="mt-3">
              <CButton onClick={handleDeleteSelectedCheckbox} color="primary" size="sm">
                Xóa vĩnh viễn
              </CButton>
            </CCol>

            <CCol>
              <CTable
                style={{
                  fontSize: 13.6,
                }}
                hover
                className="mt-3"
                columns={columns}
                items={items}
              />
            </CCol>
          </CRow>
        </>
      )}
    </CContainer>
  )
}

export default MailTemplate