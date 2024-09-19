import React, { useEffect, useRef, useState } from 'react'
import {
  CButton,
  CImage,
  CCol,
  CContainer,
  CFormCheck,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CTableRow,
  CRow,
  CTable,
} from '@coreui/react'

import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Search from '../../components/search/Search'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'
import ReactPaginate from 'react-paginate'
import DeletedModal from '../../components/deletedModal/DeletedModal'
import { toast } from 'react-toastify'
import { axiosClient, imageBaseUrl } from '../../axiosConfig'

function SocialsIcon() {
  const location = useLocation()
  const navigate = useNavigate()

  // show img
  const [file, setFile] = useState([])
  const [selectedFile, setSelectedFile] = useState('')

  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const sub = params.get('sub')

  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  const [dataSocialsIcon, setDataSocialsIcon] = useState([])

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // checkbox selected
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  const initialValues = {
    title: '',
    color: '',
    iconf: '',
    linkf: '',
    image: '',
    type: '',
    description: '',
    visible: 0,
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc.').min(5, 'Tiêu đề phải có ít nhất 5 ký tự.'),

    iconf: Yup.string().required('icon là bắt buộc.'),
    linkf: Yup.string().required('Link là bắt buộc.'),

    visible: Yup.number()
      .required('Trường này là bắt buộc.')
      .oneOf([0, 1], 'Giá trị phải là 0 hoặc 1.'),
  })

  // useEffect(() => {
  //   if (sub === 'add') {
  //     setIsEditing(false)
  //     if (inputRef.current) {
  //       inputRef.current.focus()
  //     }
  //   } else if (sub === 'edit' && id) {
  //     setIsEditing(true)
  //   }
  // }, [location.search])

  // const fetchDataSocialsIcon = async (dataSearch = '') => {
  //   try {
  //     const response = await axiosClient.get(
  //       `admin/contact-staff?data=${dataSearch}&page=${pageNumber}`,
  //     )

  //     if (response.data.status === true) {
  //       setDataSocialsIcon(response.data.data)
  //     }

  //     if (response.data.status === false && response.data.mess == 'no permission') {
  //       setIsPermissionCheck(false)
  //     }
  //   } catch (error) {
  //     console.error('Fetch data SocialsIcon is error', error)
  //   }
  // }

  // useEffect(() => {
  //   fetchDataSocialsIcon()
  // }, [pageNumber])

  // const fetchDataById = async (setValues) => {
  //   try {
  //     const response = await axiosClient.get(`admin/contact-staff/${id}/edit`)
  //     const data = response.data.contactStaff
  //     if (data) {
  //       setValues({
  //         title: data?.title,
  //         email: data?.email,
  //         phone: data?.phone,
  //         description: data?.description,
  //         visible: data?.display,
  //       })
  //       setSelectedFile(data.picture)
  //     } else {
  //       console.error('No data found for the given ID.')
  //     }

  //     // phân quyền tác vụ edit
  //     if (
  //       sub == 'edit' &&
  //       response.data.status === false &&
  //       response.data.mess == 'no permission'
  //     ) {
  //       toast.warn('Bạn không có quyền thực hiện tác vụ này!')
  //     }
  //   } catch (error) {
  //     console.error('Fetch data id SocialsIcon is error', error.message)
  //   }
  // }

  const handleSubmit = async (values, { resetForm }) => {
    console.log('>>>>>>>>>>>>check', values)
    // if (isEditing) {
    //   //call api update data
    //   try {
    //     const response = await axiosClient.put(`admin/contact-staff/${id}`, {
    //       title: values.title,
    //       email: values.email,
    //       phone: values.phone,
    //       description: values.description,
    //       display: values.visible,
    //     })
    //     if (response.data.status === true) {
    //       toast.success('Cập nhật thành công')
    //       resetForm()
    //       navigate('/')
    //       fetchDataSocialsIcon()
    //     } else {
    //       console.error('No data found for the given ID.')
    //     }

    //     // phân quyền tác vụ update
    //     if (response.data.status === false && response.data.mess == 'no permission') {
    //       toast.warn('Bạn không có quyền thực hiện tác vụ này!')
    //     }
    //   } catch (error) {
    //     console.error('Put data id SocialsIcon is error', error.message)
    //     toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    //   }
    // } else {
    //   //call api post new data
    //   try {
    //     const response = await axiosClient.post('admin/contact-staff', {
    //       title: values.title,
    //       email: values.email,
    //       phone: values.phone,
    //       description: values.description,
    //       display: values.visible,
    //     })

    //     if (response.data.status === true) {
    //       toast.success('Thêm mới thành công!')
    //       fetchDataSocialsIcon()
    //       resetForm()
    //       navigate('/socialsIcon?sub=add') doi
    //     }

    //     // phân quyền tác vụ add
    //     if (response.data.status === false && response.data.mess == 'no permission') {
    //       toast.warn('Bạn không có quyền thực hiện tác vụ này!')
    //     }
    //   } catch (error) {
    //     console.error('Post data SocialsIcon is error', error)
    //     toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    //   }
    // }
  }

  const handleAddNewClick = () => {
    navigate('/seo/social-icons?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/seo/social-icons?id=${id}&sub=edit`)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    // try {
    //   const response = await axiosClient.delete(`admin/contact-staff/${deletedId}`)
    //   if (response.data.status === true) {
    //     setVisible(false)
    //     fetchDataSocialsIcon()
    //   }

    //   // phân quyền tác vụ delete
    //   if (response.data.status === false && response.data.mess == 'no permission') {
    //     toast.warn('Bạn không có quyền thực hiện tác vụ này!')
    //   }
    // } catch (error) {
    //   console.error('Delete department id is error', error)
    //   toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
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

  // search Data
  const handleSearch = (keyword) => {
    //fetchDataSocialsIcon(keyword)
  }

  // const items =
  //   dataSocialsIcon?.data && dataSocialsIcon?.data?.length > 0
  //     ? dataSocialsIcon?.data.map((item) => ({
  //         id: (
  //           <CFormCheck
  //             id={item.staff_id}
  //             checked={selectedCheckbox.includes(item.staff_id)}
  //             value={item.staff_id}
  //             onChange={(e) => {
  //               const idx = item.staff_id
  //               const isChecked = e.target.checked
  //               if (isChecked) {
  //                 setSelectedCheckbox([...selectedCheckbox, idx])
  //               } else {
  //                 setSelectedCheckbox(selectedCheckbox.filter((id) => id !== idx))
  //               }
  //             }}
  //           />
  //         ),

  //         title: item?.title,

  //         actions: (
  //           <div>
  //             <button onClick={() => handleEditClick()} className="button-action mr-2 bg-info">
  //               <CIcon icon={cilColorBorder} className="text-white" />
  //             </button>
  //             <button
  //               onClick={() => {
  //                 setVisible(true)
  //                 setDeletedId(item.staff_id)
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

  const items = [
    {
      id: 1,
      title: 'Youtube',
      img: '---',
      icon: 'fa-youtube',
    },
    {
      id: 2,
      title: 'Twitter',
      img: '---',
      icon: 'fa-twitter',
    },
    {
      id: 3,
      title: 'Facebook',
      img: '---',
      icon: 'fa-facebook',
    },
  ]

  // const columns = [
  //   {
  //     key: 'id',
  //     label: (
  //       <CFormCheck
  //         aria-label="Select all"
  //         checked={isAllCheckbox}
  //         onChange={(e) => {
  //           const isChecked = e.target.checked
  //           setIsAllCheckbox(isChecked)
  //           if (isChecked) {
  //             const allIds = dataSocialsIcon?.data.map((item) => item.staff_id) || []
  //             setSelectedCheckbox(allIds)
  //           } else {
  //             setSelectedCheckbox([])
  //           }
  //         }}
  //       />
  //     ),
  //     _props: { scope: 'col' },
  //   },
  //   {
  //     key: 'title',
  //     label: 'Tiêu đề',
  //     _props: { scope: 'col' },
  //   },
  //   {
  //     key: 'img',
  //     label: 'Hình ảnh',
  //     _props: { scope: 'col' },
  //   },
  //   {
  //     key: 'icon',
  //     label: 'FontAwesome Icon',
  //     _props: { scope: 'col' },
  //   },

  //   {
  //     key: 'actions',
  //     label: 'Tác vụ',
  //     _props: { scope: 'col' },
  //   },
  // ]

  const handleDeleteSelectedCheckbox = async () => {
    console.log('>>> selectedCheckbox', selectedCheckbox)
    // try {
    //   const response = await axiosClient.post('admin/delete-all-comment', {
    //     data: selectedCheckbox,
    //   })
    // } catch (error) {
    //   console.error('Delete selected checkbox is error', error)
    // }
  }

  //set img avatar
  function onFileChange(e) {
    const files = e.target.files
    const selectedFiles = []
    const fileUrls = []

    Array.from(files).forEach((file) => {
      // Create a URL for the file
      fileUrls.push(URL.createObjectURL(file))

      // Read the file as base64
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = (event) => {
        selectedFiles.push(event.target.result)
        // Set base64 data after all files have been read
        if (selectedFiles.length === files.length) {
          setSelectedFile(selectedFiles)
        }
      }
    })

    // Set file URLs for immediate preview
    setFile(fileUrls)
  }

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
            <CCol md={6}>
              <h2>QUẢN LÝ ICON MXH</h2>
            </CCol>
            <CCol md={6}>
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

                <Link to={'/seo/social-icons'}>
                  <CButton color="primary" type="submit" size="sm">
                    Danh sách
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol md={4}>
              <h6>{!isEditing ? 'Thêm icon MXH mới' : 'Cập nhật icon MXH'}</h6>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, setValues }) => {
                  useEffect(() => {
                    // fetchDataById(setValues)
                  }, [setValues, id])
                  return (
                    <Form>
                      <CCol md={12}>
                        <label htmlFor="title-input">Tiêu đề</label>
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
                        <CFormInput
                          name="image"
                          type="file"
                          id="formFile"
                          label="Ảnh"
                          size="sm"
                          onChange={(e) => onFileChange(e)}
                        />
                        <ErrorMessage name="image" component="div" className="text-danger" />
                        <br />
                        <div>
                          {file.length == 0 ? (
                            <div>
                              <CImage
                                className="border"
                                src={`${imageBaseUrl}${selectedFile}`}
                                width={200}
                              />
                            </div>
                          ) : (
                            file.map((item, index) => (
                              <CImage className="border" key={index} src={item} width={200} />
                            ))
                          )}
                        </div>
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="color-input">Màu sắc</label>
                        <Field name="color">
                          {({ field }) => (
                            <CFormInput
                              {...field}
                              type="color"
                              // value={'#000000'}
                              id="color-input"
                              ref={inputRef}
                              text="Màu sắc đại diện icon (sử dụng loại tiêu đề hoặc tiêu đề + màu sắc)."
                              style={{ width: 100 }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="color" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="icon-input">FontAwesome Icon</label>
                        <Field name="iconf">
                          {({ field }) => (
                            <CFormInput
                              {...field}
                              type="text"
                              id="icon-input"
                              ref={inputRef}
                              text="Tham khảo tại: https://fontawesome.com/v4.7.0/icons"
                            />
                          )}
                        </Field>

                        <ErrorMessage name="iconf" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="link-input">Liên kết</label>
                        <Field name="linkf" type="text" as={CFormInput} id="link-input" />
                        <ErrorMessage name="linkf" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="type-select">Đích đến</label>
                        <Field
                          name="type"
                          as={CFormSelect}
                          id="type-select"
                          text="Cửa sổ của liên kết. Mặc định liên kết tại trang (_self)"
                          options={[
                            { label: 'Tại trang (_self)', value: 0 },
                            { label: 'Cửa sổ mới (_blank)', value: 1 },
                            { label: 'Cửa sổ cha (_parent)', value: 3 },
                            { label: 'Cửa sổ trên cùng (_top)', value: 4 },
                          ]}
                        />
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

                      <CCol md={12}>
                        <label htmlFor="visible-select">Hiển thị</label>
                        <Field
                          name="visible"
                          as={CFormSelect}
                          id="visible-select"
                          options={[
                            { label: 'Không', value: 0 },
                            { label: 'Có', value: 1 },
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
              <Search count={dataSocialsIcon?.total} onSearchData={handleSearch} />
              <CCol md={12} className="mt-3">
                <CButton onClick={handleDeleteSelectedCheckbox} color="primary" size="sm">
                  Xóa vĩnh viễn
                </CButton>
              </CCol>

              <CTable className="mt-3">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">
                      <CFormCheck
                        aria-label="Select all"
                        // checked={isAllCheckbox}
                        //onChange={handleSelectAll}
                      />
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Tiêu đề</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Hình ảnh</CTableHeaderCell>
                    <CTableHeaderCell scope="col">FontAwesome Icon</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Tác vụ</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {items.map((item) => (
                    <CTableRow key={item.id}>
                      <CTableDataCell>
                        <CFormCheck
                          aria-label={`Select item ${item.id}`}
                          checked={selectedCheckbox.includes(item.id)}
                          //onChange={() => handleCheckboxChange(item.id)}
                        />
                      </CTableDataCell>
                      <CTableDataCell>{item.title}</CTableDataCell>
                      <CTableDataCell>{item.img}</CTableDataCell>
                      <CTableDataCell>{item.icon}</CTableDataCell>

                      <CTableDataCell style={{ width: 100 }} className="orange-txt">
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
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              {/* <CTable className="mt-3" columns={columns} items={items} /> */}

              {/* <div className="d-flex justify-content-end">
                <ReactPaginate
                  pageCount={Math.ceil(dataSocialsIcon?.total / dataSocialsIcon?.per_page)}
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
              </div> */}
            </CCol>
          </CRow>
        </>
      )}
    </CContainer>
  )
}

export default SocialsIcon
