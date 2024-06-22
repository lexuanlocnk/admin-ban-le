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

const fakeData = [
  {
    id: 1,
    title: 'Acer',
    imageUrl: 'https://vitinhnguyenkim.vn/uploads/product/brand/thumbs/50x50_acer.png',
    friendlyUrl: 'acer',
  },
  {
    id: 2,
    title: 'Dell',
    imageUrl: 'https://vitinhnguyenkim.vn/uploads/product/brand/thumbs/50x50_dell.png',
    friendlyUrl: 'dell',
  },
]

function ProductBrand() {
  const location = useLocation()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  // selected checkbox
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  // image upload
  const [selectedImage, setSelectedImage] = useState(null)

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  // show deleted Modal
  const [visible, setVisible] = useState(false)
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
    const params = new URLSearchParams(location.search)
    const id = params.get('id')
    const sub = params.get('sub')

    if (sub === 'add') {
      setIsEditing(false)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } else if (sub === 'edit' && id) {
      setIsEditing(true)
      fetchDataById(id)
    }
  }, [location.search])

  const fetchDataById = async (id, dataSearch) => {
    //api?search={dataSearch}
  }

  const handleSubmit = async (values) => {
    console.log(values)
    // if (isEditing) {
    //   //call api update data
    // } else {
    //   //call api post new data
    // }
  }

  const handleAddNewClick = () => {
    navigate('/product/brand?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/product/brand?id=${id}&sub=edit`)
  }

  // delete row
  const handleDelete = (id) => {
    setVisible(true)
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
    fetchDataById(keyword)
  }

  const items = fakeData.map((item) => ({
    id: (
      <CFormCheck
        id={item.id}
        checked={selectedCheckbox.includes(item.id)}
        value={item.id}
        onChange={(e) => {
          const idx = item.id
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
    image: <CImage src={item.imageUrl} alt={`Ảnh thương hiệu ${item.title}`} width={50} />,
    url: item.friendlyUrl,
    actions: (
      <div>
        <button onClick={() => handleEditClick(1)} className="button-action mr-2 bg-info">
          <CIcon icon={cilColorBorder} className="text-white" />
        </button>
        <button onClick={() => handleDelete(1)} className="button-action bg-danger">
          <CIcon icon={cilTrash} className="text-white" />
        </button>
      </div>
    ),
    _cellProps: { id: { scope: 'row' } },
  }))

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
      <DeletedModal visible={visible} setVisible={setVisible} />
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
            {({ setFieldValue }) => (
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
                        <CImage
                          className="mt-2"
                          src={URL.createObjectURL(selectedImage)}
                          alt="Ảnh đã upload"
                          width={300}
                        />
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
            )}
          </Formik>
        </CCol>

        <CCol>
          <Search onSearchData={handleSearch} />
          <CTable className="mt-2" columns={columns} items={items} />

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

export default ProductBrand
