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
import { axiosClient } from '../../axiosConfig'
import { toast } from 'react-toastify'
import CIcon from '@coreui/icons-react'
import { cilColorBorder, cilTrash } from '@coreui/icons'
import DeletedModal from '../../components/deletedModal/DeletedModal'

function Newsletter() {
  const navigate = useNavigate()

  // checkbox selected
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  const handleEditClick = (id) => {
    navigate(`/newsletter/edit?id=${id}`)
  }

  const fetchDataNewsletter = async (data) => {
    // try {
    //   const response = await axiosClient.get(
    //     `admin/order-status?data=${dataSearch}&page=${pageNumber}`,
    //   )
    //   if (response.data.status === true) {
    //     const orderStatus = response.data.orderStatus
    //     setDataStatus(orderStatus)
    //   }
    //   if (response.data.status === false && response.data.mess == 'no permission') {
    //     setIsPermissionCheck(false)
    //   }
    // } catch (error) {
    //   console.error('Fetch data order status is error', error)
    // }
  }

  useEffect(() => {
    fetchDataNewsletter()
  }, [])

  // show deleted Modal
  const [visible, setVisible] = useState(false)

  //delete row
  const handleDelete = async () => {
    setVisible(true)

    // setVisible(true)
    // try {
    //   const response = await axiosClient.delete(`admin/`)
    //   if (response.data.status === true) {
    //     setVisible(false)
    //     fetchDataNewsletter()
    //   }

    //   if (response.data.status === false && response.data.mess == 'no permission') {
    //     toast.warn('Bạn không có quyền thực hiện tác vụ này!')
    //   }
    // } catch (error) {
    //   console.error('Delete status order is error', error)
    //   toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    // }
  }

  const items = [
    {
      id: 1,
      titlemail: 'mailhoangkd@gmail.com',
      'ngày đăng ký': '05/05/2024',
    },
    {
      id: 2,
      titlemail: 'sample@email.tst',
      'ngày đăng ký': '20/08/2023',
    },
    {
      id: 3,
      titlemail: 'vien.pc298@gmail.com',
      'ngày đăng ký': '15/10/2022',
    },
    {
      id: 4,
      titlemail: 'abc@',
      'ngày đăng ký': '02/10/2022',
    },
  ]

  return (
    <CContainer>
      <DeletedModal visible={visible} setVisible={setVisible} onDelete={handleDelete} />
      <CRow className="mb-3">
        <CCol md={6}>
          <h2>QUẢN LÝ NEWSLETTER</h2>
        </CCol>
        <CCol md={6}>
          <div className="d-flex justify-content-end">
            <Link to={`/newsletter/add`}>
              <CButton color="primary" type="submit" size="sm">
                Thêm mới
              </CButton>
            </Link>
            <Link to={`/newsletter`} className="ms-2">
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={12}>
          <Search />
        </CCol>
        <CRow>
          <CCol md={12} className="mt-3 mb-3 ">
            <CButton color="primary" size="sm">
              Xóa vĩnh viễn
            </CButton>

            <CButton color="primary" size="sm" className="ms-3 ">
              Xuất dữ liệu exdel theo dữ liệu tìm kiếm
            </CButton>
          </CCol>
        </CRow>

        <CCol>
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
                        setSelectedCheckbox(items.map((item) => item.id))
                      } else {
                        setSelectedCheckbox([])
                      }
                    }}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Thư điện tử</CTableHeaderCell>
                <CTableHeaderCell scope="col">Ngày đăng ký</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tác vụ</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {items.map((item) => (
                <CTableRow key={item.id}>
                  <CTableDataCell>
                    <CFormCheck aria-label="Select" />
                  </CTableDataCell>
                  <CTableDataCell>{item.titlemail}</CTableDataCell>
                  <CTableDataCell>{item['ngày đăng ký']}</CTableDataCell>

                  <CTableDataCell style={{ width: 100 }} className="orange-txt">
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
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Newsletter
