import { cilColorBorder, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCol, CContainer, CImage, CRow, CTable } from '@coreui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import Search from '../../../components/search/Search'

const dataBrands = [
  {
    brandId: 1,
    title: 'CHƯƠNG TRÌNH KHUYẾN MÃI BACK TO SCHOOL 2024',
    friendlyUrl: 'chuong-trinh-khuyen-mai-back-to-school-2024',
    view: 435,
    create_at: '03:07, 09/08/2024',
    picture: 'no-image.jpg',
  },
]

function PromotionNews() {
  const handleAddNewClick = () => {
    navigate('/promotion-news?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/promotion-news?id=${id}&sub=edit`)
  }

  const handleSearch = () => {}

  const items =
    dataBrands && dataBrands?.length > 0
      ? dataBrands.map((item) => ({
          id:
            // <CFormCheck
            //   id={item.brandId}
            //   checked={selectedCheckbox.includes(item.brandId)}
            //   value={item.brandId}
            //   onChange={(e) => {
            //     const idx = item.brandId
            //     const isChecked = e.target.checked
            //     if (isChecked) {
            //       setSelectedCheckbox([...selectedCheckbox, idx])
            //     } else {
            //       setSelectedCheckbox(selectedCheckbox.filter((id) => id !== idx))
            //     }
            //   }}
            // />
            '#',
          title: item.title,
          image: (
            <CImage
              src={`http://192.168.245.190:8000/uploads/${item.picture}`}
              alt={`Ảnh thương hiệu ${item.title}`}
              width={50}
            />
          ),
          url: item.friendlyUrl,
          info: (
            <div>
              <span>{item?.view} lượt xem</span>
              <div>{item?.create_at}</div>
            </div>
          ),
          actions: (
            <div>
              <button
                onClick={() => handleEditClick(item.brandId)}
                className="button-action mr-2 bg-info"
              >
                <CIcon icon={cilColorBorder} className="text-white" />
              </button>
              <button
                onClick={() => {
                  setVisible(true)
                  setDeletedId(item.brandId)
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
      key: 'image',
      label: 'Hình ảnh',
      _props: { scope: 'col' },
    },
    {
      key: 'url',
      label: 'Chuỗi đường dẫn',
      _props: { scope: 'col' },
    },
    {
      key: 'info',
      label: 'Thông tin',
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
      <CRow className="mb-3">
        <CCol>
          <h3>QUẢN LÝ TIN KHUYẾN MÃI</h3>
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
            <Link to={'/promotion-news'}>
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <Search count={6} onSearchData={handleSearch} />
        <CTable className="mt-2" columns={columns} items={items} />
      </CRow>
    </CContainer>
  )
}

export default PromotionNews
