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
import { axiosClient, imageBaseUrl } from '../../axiosConfig'

import ReactPaginate from 'react-paginate'
import DeletedModal from '../../components/deletedModal/DeletedModal'
import { toast } from 'react-toastify'

function LinkManagement() {
  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)
  const [dataLinks, setDataLinks] = useState([])

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // checkbox selected
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  const [dataLinksCategory, setDataLinksCategroy] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  // search input
  const [dataSearch, setDataSearch] = useState('')

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  const [isCollapse, setIsCollapse] = useState(false)
  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  const fetchDataLinks = async (dataSearch = '') => {
    // try {
    //   const response = await axiosClient.get(
    //     `admin/news?data=${dataSearch}&page=${pageNumber}&category=${selectedCategory}`,
    //   )
    //   if (response.data.status === true) {
    //     setDataLinks(response.data.list)
    //   }
    //   if (response.data.status === false && response.data.mess == 'no permission') {
    //     setIsPermissionCheck(false)
    //   }
    // } catch (error) {
    //   console.error('Fetch promotion news data is error', error)
    // }
  }

  useEffect(() => {
    fetchDataLinks()
  }, [pageNumber, selectedCategory])

  // delete row
  const handleDelete = async () => {
    console.log('>>>>check deledte:', deletedId)

    setVisible(true)
    // try {
    //   const response = await axiosClient.delete(`admin/news/${deletedId}`)
    //   if (response.data.status === true) {
    //     setVisible(false)
    //     fetchDataLinks()
    //   }

    //   if (response.data.status === false && response.data.mess == 'no permission') {
    //     toast.warn('Bạn không có quyền thực hiện tác vụ này!')
    //   }
    // } catch (error) {
    //   console.error('Delete links id is error', error)
    //   toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    // }
  }

  // search Data
  const handleSearch = (keyword) => {
    fetchDataLinks(keyword)
  }

  const handleDeleteSelectedCheckbox = async () => {
    console.log('>>>>>>>>>>>check')
    // try {
    //   const response = await axiosClient.post('admin/delete-all-news', {
    //     data: selectedCheckbox,
    //   })
    //   if (response.data.status === true) {
    //     toast.success('Xóa tất cả các mục thành công!')
    //     fetchDataLinks()
    //     setSelectedCheckbox([])
    //   }
    // } catch (error) {
    //   console.error('Deleted all id checkbox is error', error)
    // }
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

  // const items =
  //   dataLinks?.data && dataLinks?.data?.length > 0
  //     ? dataLinks?.data.map((item) => ({
  //         id: (
  //           <CFormCheck
  //             key={item?.news_id}
  //             aria-label="Default select example"
  //             defaultChecked={item?.news_id}
  //             id={`flexCheckDefault_${item?.news_id}`}
  //             value={item?.news_id}
  //             checked={selectedCheckbox.includes(item?.news_id)}
  //             onChange={(e) => {
  //               const newsId = item?.news_id
  //               const isChecked = e.target.checked
  //               if (isChecked) {
  //                 setSelectedCheckbox([...selectedCheckbox, newsId])
  //               } else {
  //                 setSelectedCheckbox(selectedCheckbox.filter((id) => id !== newsId))
  //               }
  //             }}
  //           />
  //         ),
  //         title: (
  //           <div
  //             className="title-color"
  //             style={{
  //               width: 300,
  //             }}
  //           >
  //             {item?.news_desc?.title}
  //           </div>
  //         ),
  //         image: (
  //           <CImage
  //             className="border"
  //             src={`${imageBaseUrl}${item.picture}`}
  //             alt={`Ảnh tin k/m ${item?.news_desc?.id}`}
  //             width={100}
  //             height={80}
  //             loading="lazy"
  //           />
  //         ),
  //         cate: <div className="cate-color">{item?.category_desc?.[0].cat_name}</div>,
  //         info: (
  //           <div>
  //             <span>{item?.views} lượt xem</span>
  //             <div>{moment.unix(item?.date_post).format('DD-MM-YYYY')}</div>
  //           </div>
  //         ),
  //         actions: (
  //           <div>
  //             <button
  //               onClick={() => handleEditClick(item.news_id)}
  //               className="button-action mr-2 bg-info"
  //             >
  //               <CIcon icon={cilColorBorder} className="text-white" />
  //             </button>
  //             <button
  //               onClick={() => {
  //                 setVisible(true)
  //                 setDeletedId(item.news_id)
  //               }}
  //               className="button-action bg-danger"
  //             >
  //               <CIcon icon={cilTrash} className="text-white" />
  //             </button>
  //           </div>
  //         ),
  //         _cellProps: { id: { scope: 'row' } },
  //       }))
  //     : []

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

  const items = [
    {
      id: <CFormCheck aria-label="Default select example" />,
      url: 'https://example.com/item/1',
      module: 'user',
      action: 'create',
      itemid: 101,
      date: '2024-09-19T12:34:56Z',
      actions: (
        <div>
          <button onClick={() => handleEditClick(items.id)} className="button-action mr-2 bg-info">
            <CIcon icon={cilColorBorder} className="text-white" />
          </button>
          <button
            onClick={() => {
              setVisible(true)
              setDeletedId(item.news_id)
            }}
            className="button-action bg-danger"
          >
            <CIcon icon={cilTrash} className="text-white" />
          </button>
        </div>
      ),
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: <CFormCheck aria-label="Default select example" />,
      url: 'https://example.com/item/2',
      module: 'product',
      action: 'update',
      itemid: 202,
      date: '2024-09-18T09:20:30Z',
      actions: (
        <div>
          <button onClick={() => handleEditClick(items.id)} className="button-action mr-2 bg-info">
            <CIcon icon={cilColorBorder} className="text-white" />
          </button>
          <button
            onClick={() => {
              setVisible(true)
              setDeletedId(item.news_id)
            }}
            className="button-action bg-danger"
          >
            <CIcon icon={cilTrash} className="text-white" />
          </button>
        </div>
      ),
      _cellProps: { id: { scope: 'row' } },
    },
    {
      id: <CFormCheck aria-label="Default select example" />,
      url: 'https://example.com/item/3',
      module: 'order',
      action: 'delete',
      itemid: 303,
      date: '2024-09-17T15:45:10Z',
      actions: (
        <div>
          <button onClick={() => handleEditClick(items.id)} className="button-action mr-2 bg-info">
            <CIcon icon={cilColorBorder} className="text-white" />
          </button>
          <button
            onClick={() => {
              setVisible(true)
              setDeletedId(item.news_id)
            }}
            className="button-action bg-danger"
          >
            <CIcon icon={cilTrash} className="text-white" />
          </button>
        </div>
      ),
      _cellProps: { id: { scope: 'row' } },
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
            {/* <Search count={dataNews?.total} onSearchData={handleSearch} /> */}

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
                      <td className="total-count">{dataLinks?.total}</td>
                    </tr>
                    <tr>
                      <td>Lọc theo vị trí</td>
                      <td>
                        <CFormSelect
                          className="component-size w-50"
                          aria-label="Chọn yêu cầu lọc"
                          options={[
                            { label: 'Chọn module', value: '' },
                            // ...(dataLinksCategory && dataLinksCategory.length > 0
                            //   ? dataLinksCategory.map((group) => ({
                            //       label: group?.news_category_desc?.cat_name,
                            //       value: group.cat_id,
                            //     }))
                            //   : []),
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

            <CCol md={12} className="mt-3">
              <CButton onClick={handleDeleteSelectedCheckbox} color="primary" size="sm">
                Xóa vĩnh viễn
              </CButton>
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
