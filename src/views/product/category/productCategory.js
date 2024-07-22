import { CButton, CCol, CContainer, CFormCheck, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Search from '../../../components/search/Search'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'
import { Link, useNavigate } from 'react-router-dom'
import DeletedModal from '../../../components/deletedModal/DeletedModal'
import axios from 'axios'

const fakeData = [
  {
    categories: [
      {
        id: 1,
        name: 'Laptop',
        subcategories: [
          {
            id: 11,
            name: 'Laptop HP',
            products: [
              {
                id: 111,
                name: 'HP Pavilion 15',
                price: 700,
                specifications: {
                  processor: 'Intel Core i5',
                  ram: '8GB',
                  storage: '512GB SSD',
                  screen: '15.6 inch',
                },
              },
              {
                id: 112,
                name: 'HP Envy 13',
                price: 900,
                specifications: {
                  processor: 'Intel Core i7',
                  ram: '16GB',
                  storage: '1TB SSD',
                  screen: '13.3 inch',
                },
              },
            ],
          },
          {
            id: 12,
            name: 'Laptop Dell',
            products: [
              {
                id: 121,
                name: 'Dell XPS 13',
                price: 1000,
                specifications: {
                  processor: 'Intel Core i7',
                  ram: '16GB',
                  storage: '512GB SSD',
                  screen: '13.3 inch',
                },
              },
              {
                id: 122,
                name: 'Dell Inspiron 15',
                price: 750,
                specifications: {
                  processor: 'Intel Core i5',
                  ram: '8GB',
                  storage: '1TB HDD',
                  screen: '15.6 inch',
                },
              },
            ],
          },
        ],
      },
    ],
  },
]

function ProductCategory() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // selected checkbox
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  const fetchDataCategories = async () => {
    try {
      const response = await axios.get('http://192.168.245.190:8000/api/category')
      const data = response.data

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

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axios.delete(`http://192.168.245.190:8000/api/category/${deletedId}`)
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
          <Search />
          <table className="table table-hover caption-top mt-3">
            <thead className="thead-dark">
              <tr>
                <th scope="col">
                  <CFormCheck id="flexCheckDefault" />
                </th>
                <th scope="col">Tên</th>
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
                        <div>
                          <button
                            onClick={() => handleUpdateClick(cate.cat_id)}
                            className="button-action mr-2 bg-info"
                          >
                            <CIcon icon={cilColorBorder} className="text-white" />
                          </button>
                          <button className="button-action bg-danger">
                            <CIcon icon={cilTrash} className="text-white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {cate.sub_categories &&
                      cate.sub_categories.map((subCate) => (
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
                              <div>
                                <button
                                  onClick={() => handleUpdateClick(subCate.cat_id)}
                                  className="button-action mr-2 bg-info"
                                >
                                  <CIcon icon={cilColorBorder} className="text-white" />
                                </button>
                                <button className="button-action bg-danger">
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

export default ProductCategory
