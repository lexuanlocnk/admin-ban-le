import { CButton, CCol, CContainer, CFormCheck, CFormSelect, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import DeletedModal from '../../../components/deletedModal/DeletedModal'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'
import ReactPaginate from 'react-paginate'
import axios from 'axios'

function ProductProperties() {
  const navigate = useNavigate()
  const [isCollapse, setIsCollapse] = useState(false)

  const [dataProductProperties, setDataProductProperties] = useState([])
  const [categories, setCategories] = useState([])

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedCate, setSelectedCate] = useState('1')

  const [searchParams, setSearchParams] = useSearchParams()

  // search input
  const [dataSearch, setDataSearch] = useState('')

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  // show deleted Modal
  const [visible, setVisible] = useState(false)

  const fetchCategoriesData = async () => {
    try {
      const response = await axios.get('http://192.168.245.190:8000/api/category')
      setCategories(response.data)
    } catch (error) {
      console.error('Fetch categories data error', error)
    }
  }

  useEffect(() => {
    fetchCategoriesData()
  }, [])

  const fetchProductProperties = async (dataSearch = '') => {
    try {
      const response = await axios.get(
        `http://192.168.245.190:8000/api/cat-option?data=${dataSearch}&catId=${selectedCate}`,
      )
      const data = response.data.listOption

      if (data) {
        setDataProductProperties(data)
      }
    } catch (error) {
      console.error('Fetch data categories is error', error)
    }
  }

  useEffect(() => {
    fetchProductProperties()
  }, [selectedCate])

  const handleAddNewClick = () => {
    const catId = searchParams.get('cat_id') || '1'
    navigate(`/product/properties/add?cat_id=${catId}`)
  }

  const handleUpdateClick = (slug) => {
    navigate(`/product/properties/edit?id=${slug}`)
  }

  const handleToggleCollapse = () => {
    setIsCollapse((prevState) => !prevState)
  }

  // delete row
  const handleDelete = (id) => {
    setVisible(true)
  }

  // pagination data
  // const handlePageChange = ({ selected }) => {
  //   const newPage = selected + 1
  //   if (newPage < 2) {
  //     setPageNumber(newPage)
  //     window.scrollTo(0, 0)
  //     return
  //   }
  //   window.scrollTo(0, 0)
  //   setPageNumber(newPage)
  // }

  // search Data
  const handleSearch = (keyword) => {
    fetchProductProperties(keyword)
  }

  const handleChange = (event) => {
    const catId = event.target.value
    searchParams.set('cat_id', catId)
    setSearchParams(searchParams)
    setSelectedCategory(event.target.options[event.target.selectedIndex].label)
    setSelectedCate(catId)
  }

  return (
    <CContainer>
      <DeletedModal visible={visible} setVisible={setVisible} />
      <CRow className="mb-3">
        <CCol>
          <h3>
            {selectedCategory !== null
              ? `THUỘC TÍNH ${selectedCategory.toUpperCase()}`
              : `THUỘC TÍNH SẢN PHẨM`}
          </h3>
        </CCol>
        <CCol md={{ span: 6, offset: 6 }}>
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
            <Link to={`/product/properties`}>
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
                      <option value="0">Chọn nghành hàng</option>
                      {categories &&
                        categories.map((item) => (
                          <optgroup key={item.category_desc.cat_id}>
                            <option value={item.category_desc.cat_id}>
                              {item.category_desc.cat_name} ({item.category_desc.cat_id})
                            </option>
                            {item.sub_categories &&
                              item.sub_categories.map((subItem) => (
                                <option key={subItem.cat_id} value={subItem.cat_id}>
                                  + {subItem.category_desc.cat_name} ({subItem?.cat_id})
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
          <table className="table table-hover border caption-top mt-3">
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
              {dataProductProperties &&
                dataProductProperties.map((option) => (
                  <React.Fragment key={option.op_id}>
                    <tr>
                      <td scope="row">
                        <CFormCheck id="flexCheckDefault" />
                      </td>
                      <td scope="row" style={{ fontWeight: 600 }}>
                        {option.title}
                      </td>
                      <td scope="row">{option.slug}</td>
                      <td scope="row">
                        <div>
                          <button
                            onClick={() => handleUpdateClick(option.op_id)}
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
                    {option?.optionChild &&
                      option?.optionChild.map((optionChild) => (
                        <React.Fragment key={optionChild.op_id}>
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
                              {optionChild.title}
                            </td>
                            <td>{optionChild.slug}</td>
                            <td scope="row">
                              <div>
                                <button
                                  onClick={() => handleUpdateClick(optionChild.op_id)}
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
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ProductProperties
