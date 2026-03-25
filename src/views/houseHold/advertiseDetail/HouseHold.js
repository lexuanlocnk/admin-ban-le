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
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { axiosClient, imageBaseUrl } from '../../../axiosConfig'
import ReactPaginate from 'react-paginate'
import DeletedModal from '../../../components/deletedModal/DeletedModal'
import { toast } from 'react-toastify'
import Loading from '../../../components/loading/Loading'

const DEFAULT_PAGINATION = {
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
}

function HouseHold() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const pageFromUrl = parseInt(searchParams.get('page'), 10) || 1
  const [pageNumber, setPageNumber] = useState(pageFromUrl)

  const [isPermissionCheck, setIsPermissionCheck] = useState(true)
  const [dataAdvertise, setDataAdvertise] = useState([])
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION)
  const [dataAdvertisePos, setDataAdvertisePos] = useState([])
  const [selectedPosition, setSelectedPosition] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])
  const [isCollapse, setIsCollapse] = useState(false)
  const [dataSearch, setDataSearch] = useState('')

  const isNoPermission = (responseData) =>
    responseData?.status === false &&
    (responseData?.mess === 'no permission' || responseData?.message === 'no permission')

  const resolveImageUrl = (picture) => {
    if (!picture) {
      return `${imageBaseUrl}no-image.jpg`
    }

    if (picture.startsWith('http://') || picture.startsWith('https://')) {
      return picture
    }

    return `${imageBaseUrl}${picture}`
  }

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  const handleAddNewClick = () => {
    navigate('/household/add')
  }

  const handleEditClick = (id) => {
    navigate(`/household/edit?id=${id}`)
  }

  const fetchDataAdvertisePos = async () => {
    try {
      const response = await axiosClient.get('admin/household/ad-pos/get-all')
      if (response.data?.status === true) {
        setDataAdvertisePos(response.data?.data || [])
      }
    } catch (error) {
      console.error('Fetch household ad position is error', error)
    }
  }

  const fetchDataAdvertise = async (
    keyword = dataSearch,
    page = pageNumber,
    idPos = selectedPosition,
  ) => {
    try {
      setIsLoading(true)
      const response = await axiosClient.get(
        `admin/household/advertise?data=${keyword}&page=${page}&id_pos=${idPos}`,
      )
      const responseData = response.data

      if (responseData?.status === true) {
        setDataAdvertise(responseData?.data?.items || [])
        setPagination(responseData?.data?.pagination || DEFAULT_PAGINATION)
      }

      if (isNoPermission(responseData)) {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch household advertise is error', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setSearchParams({ page: String(pageNumber) })
  }, [pageNumber, setSearchParams])

  useEffect(() => {
    fetchDataAdvertisePos()
  }, [])

  useEffect(() => {
    fetchDataAdvertise(dataSearch, pageNumber, selectedPosition)
  }, [pageNumber, selectedPosition])

  useEffect(() => {
    setSelectedCheckbox([])
    setIsAllCheckbox(false)
  }, [dataAdvertise])

  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1
    setPageNumber(newPage)
    window.scrollTo(0, 0)
  }

  const handleSearch = () => {
    setPageNumber(1)
    fetchDataAdvertise(dataSearch, 1, selectedPosition)
  }

  const handleDelete = async () => {
    if (!deletedId) {
      return
    }

    try {
      const response = await axiosClient.post('admin/household/advertise-delete', {
        _method: 'DELETE',
        ids: [deletedId],
      })

      if (response.data.status === true) {
        setVisible(false)
        toast.success('Xóa ads gia dụng thành công!')
        fetchDataAdvertise(dataSearch, pageNumber, selectedPosition)
      }

      if (isNoPermission(response.data)) {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Delete household advertise is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  const handleDeleteSelectedCheckbox = async () => {
    if (selectedCheckbox.length === 0) {
      toast.warn('Vui lòng chọn dữ liệu cần xóa!')
      return
    }

    try {
      const response = await axiosClient.post('admin/household/advertise-delete', {
        _method: 'DELETE',
        ids: selectedCheckbox,
      })

      if (response.data.status === true) {
        toast.success('Đã xóa các mục được chọn!')
        fetchDataAdvertise(dataSearch, pageNumber, selectedPosition)
        setSelectedCheckbox([])
      }

      if (isNoPermission(response.data)) {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Deleted all household advertise by checkbox is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  const items =
    dataAdvertise && dataAdvertise.length > 0
      ? dataAdvertise.map((item) => ({
          id: (
            <CFormCheck
              key={item?.id}
              aria-label="Select row"
              id={`flexCheckDefault_${item?.id}`}
              value={item?.id}
              checked={selectedCheckbox.includes(item?.id)}
              onChange={(e) => {
                const advertiseId = item?.id
                const isChecked = e.target.checked
                if (isChecked) {
                  setSelectedCheckbox((prev) => [...prev, advertiseId])
                  return
                }
                setSelectedCheckbox((prev) =>
                  prev.filter((selectedId) => selectedId !== advertiseId),
                )
              }}
            />
          ),
          image: (
            <CImage
              src={resolveImageUrl(item.picture)}
              alt={`Ảnh tin household ads ${item?.id}`}
              width={200}
              loading="lazy"
            />
          ),
          title: item?.title,
          position: item?.pos_name,
          display: item?.display === 1 ? 'Có' : 'Không',
          createdAt: item?.created_at,
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
      label: (
        <CFormCheck
          aria-label="Select all"
          checked={isAllCheckbox}
          onChange={(e) => {
            const isChecked = e.target.checked
            setIsAllCheckbox(isChecked)
            if (isChecked) {
              const allIds = dataAdvertise?.map((item) => item.id) || []
              setSelectedCheckbox(allIds)
              return
            }
            setSelectedCheckbox([])
          }}
        />
      ),
      _props: { scope: 'col' },
    },
    {
      key: 'image',
      label: 'Hình ảnh',
      _props: { scope: 'col' },
    },
    {
      key: 'title',
      label: 'Tiêu đề',
      _props: { scope: 'col' },
    },
    {
      key: 'position',
      label: 'Vị trí',
      _props: { scope: 'col' },
    },
    {
      key: 'display',
      label: 'Hiển thị',
      _props: { scope: 'col' },
    },
    {
      key: 'createdAt',
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
          <DeletedModal visible={visible} setVisible={setVisible} onDelete={handleDelete} />

          <CRow className="mb-3">
            <CCol>
              <h2>QUẢN LÝ ADS GIA DỤNG</h2>
            </CCol>
            <CCol md={6}>
              <div className="d-flex justify-content-end">
                <CButton
                  onClick={handleAddNewClick}
                  color="primary"
                  type="button"
                  size="sm"
                  className="button-add"
                >
                  Thêm mới
                </CButton>
                <Link to={'/household'}>
                  <CButton color="primary" type="button" size="sm">
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
                      <td className="total-count">{pagination?.total || 0}</td>
                    </tr>
                    <tr>
                      <td>Lọc theo vị trí</td>
                      <td>
                        <CFormSelect
                          className="component-size w-50"
                          aria-label="Chọn lọc vị trí"
                          options={[
                            { label: 'Chọn vị trí', value: '' },
                            ...(dataAdvertisePos && dataAdvertisePos.length > 0
                              ? dataAdvertisePos.map((pos) => ({
                                  label: pos.title,
                                  value: pos.id,
                                }))
                              : []),
                          ]}
                          value={selectedPosition}
                          onChange={(e) => {
                            setSelectedPosition(e.target.value)
                            setPageNumber(1)
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Tìm kiếm</td>
                      <td>
                        <em>
                          <strong>Tìm kiếm theo từ khóa theo tiêu đề, vị trí quảng cáo</strong>
                        </em>
                        <input
                          type="text"
                          className="search-input"
                          value={dataSearch}
                          onChange={(e) => setDataSearch(e.target.value)}
                        />
                        <button onClick={handleSearch} className="submit-btn">
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
              {isLoading ? (
                <Loading />
              ) : (
                <CTable hover className="mt-3 border" columns={columns} items={items} />
              )}
            </CCol>

            <div className="d-flex justify-content-end">
              <ReactPaginate
                pageCount={pagination?.last_page || 1}
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
                forcePage={Math.max(pageNumber - 1, 0)}
              />
            </div>
          </CRow>
        </>
      )}
    </CContainer>
  )
}

export default HouseHold
