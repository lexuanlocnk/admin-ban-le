import { CButton, CCol, CContainer, CFormCheck, CImage, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Search from '../../../components/search/Search'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'
import { Link, useNavigate } from 'react-router-dom'
import DeletedModal from '../../../components/deletedModal/DeletedModal'
import axios from 'axios'
import { axiosClient, imageBaseUrl } from '../../../axiosConfig'

function ProductCategory() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // selected checkbox
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  const fetchDataCategories = async (dataSearch = '') => {
    try {
      const response = await axiosClient.get(`admin/category?data=${dataSearch}`)
      const data = response.data.data

      if (data) {
        setCategories(data)
      }
    } catch (error) {
      console.error('Fetch data categories is error', error)
    }
  }

  useEffect(() => {
    fetchDataCategories()
  }, [])

  const handleAddNewClick = () => {
    navigate('/product/category/add')
  }

  const handleUpdateClick = (id) => {
    navigate(`/product/category/edit?id=${id}`)
  }

  const handleSearch = (keyword) => {
    fetchDataCategories(keyword)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axiosClient.delete(`admin/category/${deletedId}`)
      if (response.data.status === true) {
        setVisible(false)
        fetchDataCategories()
      }
    } catch (error) {
      console.error('Delete category id is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  return (
    <CContainer>
      <DeletedModal visible={visible} setVisible={setVisible} onDelete={handleDelete} />
      <CRow className="mb-3">
        <CCol>
          <h3>DANH MỤC SẢN PHẨM</h3>
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
        <CCol>
          <Search count={categories.length} onSearchData={handleSearch} />
          <table className="table table-hover caption-top mt-3">
            <thead className="thead-dark">
              <tr>
                <th scope="col">
                  <CFormCheck id="flexCheckDefault" />
                </th>
                <th scope="col">Tên</th>
                <th scope="col">Background</th>
                <th scope="col">Show home</th>
                <th scope="col">Tác vụ</th>
              </tr>
            </thead>
            <tbody>
              {categories &&
                categories.length > 0 &&
                categories.map((cate) => (
                  <React.Fragment key={cate.cat_id}>
                    <tr>
                      <td scope="row">
                        <CFormCheck id="flexCheckDefault" />
                      </td>
                      <td scope="row" style={{ fontWeight: 600 }}>
                        {cate?.category_desc?.cat_name}
                      </td>
                      <td scope="row">
                        <CImage
                          src={`${imageBaseUrl}${cate.background !== null && cate.background !== '' ? cate.background : 'no-image.jpg'}`}
                          width={50}
                        />
                      </td>
                      <td scope="row">{cate.show_home === 1 ? 'Có' : 'Không'}</td>
                      <td scope="row">
                        <div>
                          <button
                            onClick={() => handleUpdateClick(cate.cat_id)}
                            className="button-action mr-2 bg-info"
                          >
                            <CIcon icon={cilColorBorder} className="text-white" />
                          </button>
                          <button
                            onClick={() => {
                              setVisible(true)
                              setDeletedId(cate.cat_id)
                            }}
                            className="button-action bg-danger"
                          >
                            <CIcon icon={cilTrash} className="text-white" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {cate.parenty &&
                      cate.parenty.map((subCate) => (
                        <React.Fragment key={subCate.cat_id}>
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
                              {subCate?.category_desc?.cat_name}
                            </td>
                            <td scope="row">
                              <CImage
                                src={`${imageBaseUrl}${subCate.background !== null && subCate.background !== '' ? subCate.background : 'no-image.jpg'}`}
                                width={50}
                              />
                            </td>
                            <td scope="row">{subCate.show_home === 1 ? 'Có' : 'Không'}</td>
                            <td scope="row">
                              <div>
                                <button
                                  onClick={() => handleUpdateClick(subCate.cat_id)}
                                  className="button-action mr-2 bg-info"
                                >
                                  <CIcon icon={cilColorBorder} className="text-white" />
                                </button>
                                <button
                                  onClick={() => {
                                    setVisible(true)
                                    setDeletedId(subCate.cat_id)
                                  }}
                                  className="button-action bg-danger"
                                >
                                  <CIcon icon={cilTrash} className="text-white" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {subCate.parentx &&
                            subCate.parentx.map((childCate) => (
                              <React.Fragment key={childCate.cat_id}>
                                <tr>
                                  <td scope="row">
                                    <CFormCheck id="flexCheckDefault" />
                                  </td>
                                  <td>
                                    <img
                                      src="https://vitinhnguyenkim.vn/admin/public/images/row-sub.gif"
                                      alt="Subcategory"
                                      style={{ marginLeft: 16 }}
                                    />
                                    {childCate?.category_desc?.cat_name}
                                  </td>
                                  <td scope="row">
                                    <CImage
                                      src={`${imageBaseUrl}${childCate.background !== null && childCate.background !== '' ? childCate.background : 'no-image.jpg'}`}
                                      width={50}
                                    />
                                  </td>
                                  <td scope="row">{childCate.show_home === 1 ? 'Có' : 'Không'}</td>
                                  <td scope="row">
                                    <div>
                                      <button
                                        onClick={() => handleUpdateClick(childCate.cat_id)}
                                        className="button-action mr-2 bg-info"
                                      >
                                        <CIcon icon={cilColorBorder} className="text-white" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setVisible(true)
                                          setDeletedId(childCate.cat_id)
                                        }}
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
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ProductCategory
