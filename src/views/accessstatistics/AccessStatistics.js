import React, { useEffect, useState, useParams } from 'react'
import { CCardHeader, CCol, CContainer, CRow, CTable, CTableBody, CTableRow } from '@coreui/react'
import ReactPaginate from 'react-paginate'
import { axiosClient } from '../../axiosConfig'
import { Link } from 'react-router-dom'

function AccessStatistics() {
  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)
  const [visitedData, setVisitedData] = useState([])

  const fetchStatictical = async () => {
    try {
      const response = await axiosClient.get(`admin/get-statistics?page=${pageNumber}`)

      if (response.data.status === true) {
        setVisitedData(response.data.data)
      }
      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch statictical data is error', error)
    }
  }

  useEffect(() => {
    fetchStatictical()
  }, [pageNumber])

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
    visitedData?.data && visitedData?.data.length > 0
      ? visitedData?.data.map((item, index) => ({
          index: index + 1,
          visited: item?.count,
          mem_id: item?.mem_id === 0 ? 'Unknow' : item?.member?.username,
          ip: item?.ip,
          url: item?.url,
          module: item?.module,
          action: item?.action,
          _cellProps: { id: { scope: 'row' } },
        }))
      : []

  const columns = [
    {
      key: 'index',
      label: 'Thứ tự',
      _props: { scope: 'col' },
    },
    {
      key: 'visited',
      label: 'Lượt truy cập',
      _props: { scope: 'col' },
    },
    {
      key: 'mem_id',
      label: 'Name',
      _props: { scope: 'col' },
    },
    {
      key: 'ip',
      label: 'IP',
      _props: { scope: 'col' },
    },
    {
      key: 'url',
      label: 'Link truy cập',
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
        <CRow>
          <h2>THỐNG KÊ TRUY CẬP</h2>
          <CCol>
            <CTable
              hover
              bordered
              style={{ fontSize: 14 }}
              className="mt-2 mb-4"
              columns={columns}
              items={items}
            />
            <div className="d-flex justify-content-end">
              <ReactPaginate
                pageCount={Math.ceil(visitedData?.total / visitedData?.per_page)}
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
          </CCol>
        </CRow>
      )}
    </CContainer>
  )
}

export default AccessStatistics
