import { cilColorBorder, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCol, CContainer, CFormCheck, CFormSelect, CRow, CTable } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosClient } from '../../axiosConfig'

import ReactPaginate from 'react-paginate'
import DeletedModal from '../../components/deletedModal/DeletedModal'
import { toast } from 'react-toastify'
import moment from 'moment/moment'

function LinkManagement() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)
  const [dataLinks, setDataLinks] = useState([])

  // checkbox selected
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  const [selectedCategory, setSelectedCategory] = useState('All')

  // search input
  const [dataSearch, setDataSearch] = useState('')

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  const [isCollapse, setIsCollapse] = useState(false)
  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  const fetchDataLinks = async (dataSearch = '') => {
    try {
      const response = await axiosClient.get(
        `admin/seo?data=${dataSearch}&page=${pageNumber}&module=${selectedCategory}`,
      )
      if (response.data.status === true) {
        setDataLinks(response.data.data)
      }
      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch promotion news data is error', error)
    }
  }

  useEffect(() => {
    fetchDataLinks()
  }, [pageNumber, selectedCategory])

  // search Data
  const handleSearch = (keyword) => {
    fetchDataLinks(keyword)
  }

  const handleEditClick = (id, module) => {
    navigate(`/${module}/edit?id=${id}`)
  }

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

  const items =
    dataLinks?.data && dataLinks?.data?.length > 0
      ? dataLinks?.data.map((item) => ({
          id: (
            <CFormCheck
              key={item?.news_id}
              aria-label="Default select example"
              defaultChecked={item?.news_id}
              id={`flexCheckDefault_${item?.news_id}`}
              value={item?.news_id}
              checked={selectedCheckbox.includes(item?.news_id)}
              onChange={(e) => {
                const newsId = item?.news_id
                const isChecked = e.target.checked
                if (isChecked) {
                  setSelectedCheckbox([...selectedCheckbox, newsId])
                } else {
                  setSelectedCheckbox(selectedCheckbox.filter((id) => id !== newsId))
                }
              }}
            />
          ),
          url: (
            <div
              style={{
                width: 300,
              }}
            >
              <Link className="blue-txt" to={`/${item?.module}/edit?id=${item?.itemId}`}>
                {item?.slug}
              </Link>
            </div>
          ),
          module: <div className="cate-color">{item?.module}</div>,
          action: item?.action,
          itemid: item?.itemId,
          date: <div>{moment.unix(item?.date).format('hh:mm:ss A, DD-MM-YYYY')}</div>,
          actions: (
            <div>
              <button
                onClick={() => handleEditClick(item?.itemId, item?.module)}
                className="button-action mr-2 bg-info"
              >
                <CIcon icon={cilColorBorder} className="text-white" />
              </button>
              {/* <button
                onClick={() => {
                  setVisible(true)
                  setDeletedId(item.news_id)
                }}
                className="button-action bg-danger"
              >
                <CIcon icon={cilTrash} className="text-white" />
              </button> */}
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
                const allIds = dataLinks?.data.map((item) => item.id) || []
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
      key: 'url',
      label: 'Chuỗi đường dẫn',
      _props: { scope: 'col' },
    },
    {
      key: 'module',
      label: 'Module',
      _props: { scope: 'col' },
    },
    {
      key: 'action',
      label: 'Action',
      _props: { scope: 'col' },
    },
    {
      key: 'itemid',
      label: 'Item ID',
      _props: { scope: 'col' },
    },
    {
      key: 'date',
      label: 'Ngày tạo',
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
          <CRow className="mb-3">
            <CCol>
              <h3>QUẢN LÝ LINK WEBSITE</h3>
            </CCol>
            <CCol md={6}>
              <div className="d-flex justify-content-end">
                <Link to={'/seo/links'}>
                  <CButton color="primary" type="submit" size="sm">
                    Danh sách
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol md={12}>
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
                      <td className="total-count">{dataLinks?.total}</td>
                    </tr>
                    <tr>
                      <td>Lọc theo vị trí</td>
                      <td>
                        <CFormSelect
                          className="component-size w-50"
                          aria-label="Chọn yêu cầu lọc"
                          options={[
                            { label: '--Chọn module--', value: 'All', disabled: true },
                            { label: 'About', value: 'About' },
                            { label: 'News', value: 'News' },
                            { label: 'Product', value: 'Product' },
                            { label: 'Service', value: 'Service' },
                            { label: 'Promotion', value: 'Promotion' },
                            { label: 'Guide', value: 'Guide' },
                            { label: 'Promotion', value: 'Promotion' },
                          ]}
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        />
                      </td>
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

            <CCol>
              <CTable hover className="mt-3" columns={columns} items={items} />
            </CCol>

            <div className="d-flex justify-content-end">
              <ReactPaginate
                pageCount={Math.ceil(dataLinks?.total / dataLinks?.per_page)}
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
          </CRow>
        </>
      )}
    </CContainer>
  )
}

export default LinkManagement
