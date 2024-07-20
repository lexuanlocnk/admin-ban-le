import React, { useEffect, useRef, useState } from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CImage,
  CRow,
  CTable,
} from '@coreui/react'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useLocation, useNavigate } from 'react-router-dom'
import Search from '../../components/search/Search'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'
import ReactPaginate from 'react-paginate'
import DeletedModal from '../../components/deletedModal/DeletedModal'
import axios from 'axios'
import { toast } from 'react-toastify'

function ProductBrand() {
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const sub = params.get('sub')

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  const [dataBrands, setDataBrands] = useState([])
  const [countBrand, setCountBrand] = useState(null)

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // selected checkbox
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  // image upload
  const [selectedImage, setSelectedImage] = useState(null)

  // search input
  const [dataSearch, setDataSearch] = useState('')

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  const initialValues = {
    title: '',
    description: '',
    friendlyUrl: '',
    pageTitle: '',
    metaKeyword: '',
    metaDesc: '',
    visible: '',
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc.'),
    // description: Yup.string().required('Mô tả là bắt buộc.'),
    // friendlyUrl: Yup.string().required('Chuỗi đường dẫn là bắt buộc.'),
    pageTitle: Yup.string().required('Tiêu đề bài viết là bắt buộc.'),
    metaKeyword: Yup.string().required('Meta keywords là bắt buộc.'),
    metaDesc: Yup.string().required('Meta description là bắt buộc.'),
    visible: Yup.string().required('Cho phép hiển thị là bắt buộc.'),
  })

  useEffect(() => {
    if (sub === 'add') {
      setIsEditing(false)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } else if (sub === 'edit' && id) {
      setIsEditing(true)
    }
  }, [location.search])

  const fetchDataBrands = async (dataSearch) => {
    try {
      const response = await axios.get(
        `http://192.168.245.190:8000/api/brand?data=${dataSearch}&page=${pageNumber}`,
      )
      if (response.data.status === true) {
        setDataBrands(response.data.list)
        setCountBrand(response.data.total)
      }
    } catch (error) {
      console.error('Fetch data product brand is error', error)
    }
  }

  useEffect(() => {
    fetchDataBrands()
  }, [pageNumber, dataSearch])

  const fetchDataById = async (setValues) => {
    try {
      const response = await axios.get(`http://192.168.245.190:8000/api/brand/${id}/edit`)
      const data = response.data.brand
      if (data) {
        setValues({
          title: data.brand_desc.title,
          description: data.brand_desc.description,
          friendly_url: data.brand_desc.friendlyUrl,
          metakey: data.brand_desc.metaKeyword,
          metadesc: data.brand_desc.metaDesc,
          display: data.display,
        })
        setSelectedImage(data.picture)
      } else {
        console.error('No data found for the given ID.')
      }
    } catch (error) {
      console.error('Fetch data id product brand is error', error.message)
    }
  }

  const handleSubmit = async (values) => {
    if (isEditing) {
      //call api update data
    } else {
      //call api post new data

      try {
        const response = await axios.post(
          'http://192.168.245.190:8000/api/brand',
          {
            title: values.title,
            description: values.visible,
            friendly_url: values.friendlyUrl,
            metakey: values.metaKeyword,
            metadesc: values.metaDesc,
            display: values.visible,
            picture: selectedImage,
          },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        if (response.data.status === true) {
          toast.success('Thêm mới thương hiệu thành công!')
          fetchDataBrands()
        }
      } catch (error) {
        console.error('Post data product brand is error', error)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      }
    }
  }

  const handleAddNewClick = () => {
    navigate('/product/brand?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/product/brand?id=${id}&sub=edit`)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axios.delete(`http://192.168.245.190:8000/api/brand/${deletedId}`)
      if (response.data.status === true) {
        setVisible(false)
        fetchDataBrands()
      }
    } catch (error) {
      console.error('Delete brand id is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  const handleImageUpload = (event) => {
    setSelectedImage(event.target.files[0])
  }

  const handleImageRemove = () => {
    setSelectedImage(null)
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
    fetchDataBrands(keyword)
  }

  const items =
    dataBrands && dataBrands?.length > 0
      ? dataBrands.map((item) => ({
          id: (
            <CFormCheck
              id={item.brandId}
              checked={selectedCheckbox.includes(item.brandId)}
              value={item.brandId}
              onChange={(e) => {
                const idx = item.brandId
                const isChecked = e.target.checked
                if (isChecked) {
                  setSelectedCheckbox([...selectedCheckbox, idx])
                } else {
                  setSelectedCheckbox(selectedCheckbox.filter((id) => id !== idx))
                }
              }}
            />
          ),
          title: item.title,
          image: (
            <CImage
              src={`http://192.168.245.190:8000/uploads/${item.picture}`}
              alt={`Ảnh thương hiệu ${item.title}`}
              width={50}
            />
          ),
          url: item.friendlyUrl,
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
      key: 'actions',
      label: 'Tác vụ',
      _props: { scope: 'col' },
    },
  ]

  return (
    <CContainer>
      <DeletedModal visible={visible} setVisible={setVisible} onDelete={handleDelete} />
      <CRow className="mb-3">
        <CCol>
          <h5>THƯƠNG HIỆU SẢN PHẨM</h5>
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
            <CButton color="primary" type="submit" size="sm">
              Danh sách
            </CButton>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={4}>
          <h6>{!isEditing ? 'Thêm thương hiệu mới' : 'Cập nhật thương hiệu'}</h6>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, setValues }) => {
              useEffect(() => {
                fetchDataById(setValues)
              }, [setValues, id])
              return (
                <Form>
                  <CCol md={12}>
                    <label htmlFor="title-input">Tiêu đề </label>
                    <Field name="title">
                      {({ field }) => (
                        <CFormInput
                          {...field}
                          type="text"
                          id="title-input"
                          ref={inputRef}
                          text="Tên riêng sẽ hiển thị lên trang web của bạn."
                        />
                      )}
                    </Field>
                    <ErrorMessage name="title" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="avatar-input">Ảnh thương hiệu</label>
                    <div>
                      <CFormInput
                        type="file"
                        id="avatar-input"
                        size="sm"
                        onChange={handleImageUpload}
                      />
                      <ErrorMessage name="avatar" component="div" className="text-danger" />
                      {selectedImage && (
                        <div>
                          {typeof selectedImage === 'string' ? (
                            <CImage
                              className="mt-2"
                              src={`http://192.168.245.190:8000/uploads/${selectedImage}`}
                              alt="Ảnh đã upload"
                              width={300}
                            />
                          ) : (
                            <CImage
                              className="mt-2"
                              src={URL.createObjectURL(selectedImage)}
                              alt="Ảnh đã upload"
                              width={300}
                            />
                          )}
                          <CButton
                            className="mt-2"
                            color="danger"
                            size="sm"
                            onClick={handleImageRemove}
                          >
                            Xóa
                          </CButton>
                        </div>
                      )}
                    </div>
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="desc-input">Mô tả</label>
                    <Field
                      style={{ height: '100px' }}
                      name="description"
                      type="text"
                      as={CFormTextarea}
                      id="desc-input"
                      text="Mô tả bình thường không được sử dụng trong giao diện, tuy nhiên có vài giao diện hiện thị mô tả này."
                    />
                    <ErrorMessage name="description" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <h6>Search Engine Optimization</h6>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="url-input">Chuỗi đường dẫn</label>
                    <Field
                      name="friendlyUrl"
                      type="text"
                      as={CFormInput}
                      id="url-input"
                      text="Chuỗi dẫn tĩnh là phiên bản của tên hợp chuẩn với Đường dẫn (URL). Chuỗi này bao gồm chữ cái thường, số và dấu gạch ngang (-). VD: vi-tinh-nguyen-kim-to-chuc-su-kien-tri-an-dip-20-nam-thanh-lap"
                    />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="pageTitle-input">Tiêu đề trang</label>
                    <Field
                      name="pageTitle"
                      type="text"
                      as={CFormInput}
                      id="pageTitle-input"
                      text="Độ dài của tiêu đề trang tối đa 60 ký tự."
                    />
                    <ErrorMessage name="pageTitle" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="metaKeyword-input">Meta keywords</label>
                    <Field
                      name="metaKeyword"
                      type="text"
                      as={CFormInput}
                      id="metaKeyword-input"
                      text="Độ dài của meta keywords chuẩn là từ 100 đến 150 ký tự, trong đó có ít nhất 4 dấu phẩy (,)."
                    />
                    <ErrorMessage name="metaKeyword" component="div" className="text-danger" />
                  </CCol>
                  <br />
                  <CCol md={12}>
                    <label htmlFor="metaDesc-input">Meta description</label>
                    <Field
                      name="metaDesc"
                      type="text"
                      as={CFormInput}
                      id="metaDesc-input"
                      text="Thẻ meta description chỉ nên dài khoảng 140 kí tự để có thể hiển thị hết được trên Google. Tối đa 200 ký tự."
                    />
                    <ErrorMessage name="metaDesc" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol md={12}>
                    <label htmlFor="visible-select">Hiển thị</label>
                    <Field
                      name="visible"
                      as={CFormSelect}
                      id="visible-select"
                      options={[
                        { label: 'Không', value: '0' },
                        { label: 'Có', value: '1' },
                      ]}
                    />
                    <ErrorMessage name="visible" component="div" className="text-danger" />
                  </CCol>
                  <br />

                  <CCol xs={12}>
                    <CButton color="primary" type="submit" size="sm">
                      {isEditing ? 'Cập nhật' : 'Thêm mới'}
                    </CButton>
                  </CCol>
                </Form>
              )
            }}
          </Formik>
        </CCol>

        <CCol>
          <Search count={countBrand} onSearchData={handleSearch} />
          <CTable className="mt-2" columns={columns} items={items} />

          <div className="d-flex justify-content-end">
            <ReactPaginate
              pageCount={Math.ceil(countBrand / 10)}
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

export default ProductBrand
