import { CButton, CCol, CContainer, CFormCheck, CFormSelect, CRow } from '@coreui/react'
import React, { useState } from 'react'
import DeletedModal from '../../../components/deletedModal/DeletedModal'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'
import ReactPaginate from 'react-paginate'

const fakeData = [
  {
    title: 'Màu sắc',
    slug: 'mau-sac',
    options: [
      { title: 'Đen', slug: 'den' },
      { title: 'Xám', slug: 'xam' },
      { title: 'Bạc', slug: 'bac' },
      { title: 'Vàng', slug: 'vang' },
      { title: 'Trắng', slug: 'trang' },
      { title: 'Xanh', slug: 'xanh' },
      { title: 'Xanh đen', slug: 'xanh-den' },
      { title: 'Vàng đồng', slug: 'vang-dong' },
      { title: 'Vàng hồng', slug: 'vang-hong' },
    ],
  },
  {
    title: 'Hệ điều hành',
    slug: 'he-dieu-hanh',
    options: [
      { title: 'Windows', slug: 'windows' },
      { title: 'Free Dos', slug: 'free-dos' },
      { title: 'Linux', slug: 'linux' },
    ],
  },
]

const categories = [
  {
    id: 1,
    category_desc: {
      cat_id: 1,
      cat_name: 'Laptop',
    },
    sub_categories: [
      {
        cat_id: 179,
        category_desc: {
          cat_id: 179,
          cat_name: 'Laptop HP',
        },
      },
    ],
  },

  {
    id: 2,
    category_desc: {
      cat_id: 2,
      cat_name: 'Máy tính để bàn',
    },
    sub_categories: [
      {
        cat_id: 180,
        category_desc: {
          cat_id: 180,
          cat_name: 'Laptop HP',
        },
      },
    ],
  },
]

function ProductProperties() {
  const navigate = useNavigate()
  const [isCollapse, setIsCollapse] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  // search input
  const [dataSearch, setDataSearch] = useState('')

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  // show deleted Modal
  const [visible, setVisible] = useState(false)

  const fetchDataById = async (id, dataSearch) => {
    //api?search={dataSearch}
  }

  const handleAddNewClick = () => {
    const catId = searchParams.get('cat_id') || '1' // Default to 179 if cat_id is not set
    navigate(`/product/properties?cat_id=${catId}&sub=add`)
  }

  const handleUpdateClick = (slug) => {
    navigate(`/product/properties/edit?slug=${slug}`)
  }

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  // delete row
  const handleDelete = (id) => {
    setVisible(true)
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

  // search Data
  const handleSearch = (keyword) => {
    fetchDataById(keyword)
  }

  const handleChange = (event) => {
    const catId = event.target.value
    searchParams.set('cat_id', catId)
    setSearchParams(searchParams)
  }

  return (
    <CContainer>
      <DeletedModal visible={visible} setVisible={setVisible} />
      <CRow className="mb-3">
        <CCol>
          <h3>THUỘC TÍNH SẢN PHẨM</h3>
        </CCol>
        <CCol md={{ span: 4, offset: 4 }}>
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
            <Link to={`/product/category`}>
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
                  <td className="total-count">6</td>
                </tr>
                <tr>
                  <td>Nghành</td>
                  <td>
                    <CFormSelect
                      className="component-size w-50"
                      aria-label="Chọn yêu cầu lọc"
                      onChange={handleChange}
                    >
                      <option>Chọn nghành hàng</option>
                      {categories &&
                        categories.map((item) => (
                          <optgroup key={item.category_desc.cat_id}>
                            <option value={item.category_desc.cat_id}>
                              {item.category_desc.cat_name} ({item.category_desc.cat_id})
                            </option>
                            {item.sub_categories &&
                              item.sub_categories.map((subItem) => (
                                <option key={subItem.cat_id} value={subItem.cat_id}>
                                  + {subItem.category_desc.cat_name} ({subItem.cat_id})
                                </option>
                              ))}
                          </optgroup>
                        ))}
                    </CFormSelect>
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
          <table className="table table-hover caption-top mt-3">
            <thead className="thead-dark">
              <tr>
                <th scope="col">
                  <CFormCheck id="flexCheckDefault" />
                </th>
                <th scope="col">Tên</th>
                <th scope="col">Chuỗi đường dẫn</th>
                <th scope="col">Tác vụ</th>
              </tr>
            </thead>
            <tbody>
              {fakeData &&
                fakeData.map((cate) => (
                  <React.Fragment key={cate.slug}>
                    <tr>
                      <td scope="row">
                        <CFormCheck id="flexCheckDefault" />
                      </td>
                      <td scope="row" style={{ fontWeight: 600 }}>
                        {cate.title}
                      </td>
                      <td scope="row">{cate.slug}</td>
                      <td scope="row">
                        <div>
                          <button
                            onClick={() => handleUpdateClick(cate.slug)}
                            className="button-action mr-2 bg-info"
                          >
                            <CIcon icon={cilColorBorder} className="text-white" />
                          </button>
                          <button
                            onClick={() => handleDelete()}
                            className="button-action bg-danger"
                          >
                            <CIcon icon={cilTrash} className="text-white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {cate.options &&
                      cate.options.map((option) => (
                        <React.Fragment key={option.slug}>
                          <tr>
                            <td scope="row">
                              <CFormCheck id="flexCheckDefault" />
                            </td>
                            <td>
                              <img
                                src="https://vitinhnguyenkim.vn/admin/public/images/row-sub.gif"
                                alt="Subcategory"
                                className="mr-2"
                              />
                              {option.title}
                            </td>
                            <td>{option.slug}</td>
                            <td scope="row">
                              <div>
                                <button
                                  onClick={() => handleUpdateClick(option.slug)}
                                  className="button-action mr-2 bg-info"
                                >
                                  <CIcon icon={cilColorBorder} className="text-white" />
                                </button>
                                <button
                                  onClick={() => handleDelete()}
                                  className="button-action bg-danger"
                                >
                                  <CIcon icon={cilTrash} className="text-white" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-end">
            <ReactPaginate
              pageCount={Math.round(20 / 10)}
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
    </CContainer>
  )
}

export default ProductProperties
