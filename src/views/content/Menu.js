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
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Search from '../../components/search/Search'

import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'
import ReactPaginate from 'react-paginate'
import DeletedModal from '../../components/deletedModal/DeletedModal'
import { toast } from 'react-toastify'
import { axiosClient, imageBaseUrl } from '../../axiosConfig'

const menuData = [
  {
    id: 1,
    title: 'Tin tức',
    link: 'tin-tuc',
  },
  {
    id: 2,
    title: 'Laptop',
    link: 'laptop',
    children: [
      {
        id: 3,
        title: 'Thương hiệu',
        link: 'laptop',
        children: [
          {
            id: 4,
            title: 'Apple Macbook',
            link: 'macbook-apple',
          },
          {
            id: 5,
            title: 'HP',
            link: 'laptop/hp',
          },
          {
            id: 6,
            title: 'Dell',
            link: 'laptop/dell',
          },
          {
            id: 7,
            title: 'Asus',
            link: 'laptop/asus',
          },
          {
            id: 8,
            title: 'Acer',
            link: 'laptop/acer',
          },
          {
            id: 9,
            title: 'Lenovo',
            link: 'laptop/lenovo',
          },
          {
            id: 10,
            title: 'LG',
            link: 'laptop-lg',
          },
        ],
      },
      {
        id: 11,
        title: 'Nhu cầu sử dụng',
        link: './',
        children: [
          {
            id: 12,
            title: 'Laptop cho doanh nhân',
            link: '/laptop?op_id=49&price=10000000-100000000',
          },
          {
            id: 13,
            title: 'Laptop cho kỹ thuật viên',
            link: '/laptop?op_id=49,182&price=0-100000000',
          },
          {
            id: 14,
            title: 'Laptop cho văn phòng',
            link: '/laptop?price=0-4500000',
          },
          {
            id: 15,
            title: 'Laptop cho sinh viên',
            link: '/laptop?price=0-2500000',
          },
        ],
      },
    ],
  },
]

function Menu() {
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const sub = params.get('sub')

  // check permission state
  const [isPermissionCheck, setIsPermissionCheck] = useState(true)

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef(null)

  const [dataDepartment, setDataDepartment] = useState([])

  // show deleted Modal
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)

  // checkbox selected
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])

  // upload image and show image
  const [selectedFile, setSelectedFile] = useState('')
  const [file, setFile] = useState([])

  //pagination state
  const [pageNumber, setPageNumber] = useState(1)

  const initialValues = {
    title: '',
    url: '',
    name: '',
    target: '',
    childOf: '',
    visible: 0,
  }

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Tiêu đề là bắt buộc.')
      .min(3, 'Tiêu đề phải có ít nhất 3 ký tự.')
      .max(100, 'Tiêu đề không được vượt quá 100 ký tự.'),

    url: Yup.string().required('Liên kết là bắt buộc.').url('Liên kết không hợp lệ.'),

    name: Yup.string()
      .required('Tên action là bắt buộc.')
      .min(3, 'Tên action phải có ít nhất 3 ký tự.')
      .max(50, 'Tên action không được vượt quá 50 ký tự.'),

    target: Yup.string()
      .required('Đích đến là bắt buộc.')
      .oneOf(['_self', '_blank', '_parent', '_top'], 'Đích đến không hợp lệ.'),

    visible: Yup.number()
      .required('Trường hiển thị là bắt buộc.')
      .oneOf([0, 1], 'Giá trị hiển thị phải là 0 hoặc 1.'),
  })

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

  const fetchDataDepartment = async (dataSearch = '') => {
    try {
      const response = await axiosClient.get(
        `admin/contact-staff?data=${dataSearch}&page=${pageNumber}`,
      )

      if (response.data.status === true) {
        setDataDepartment(response.data.data)
      }

      if (response.data.status === false && response.data.mess == 'no permission') {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch data department is error', error)
    }
  }

  useEffect(() => {
    fetchDataDepartment()
  }, [pageNumber])

  const fetchDataById = async (setValues) => {
    try {
      const response = await axiosClient.get(`admin/contact-staff/${id}/edit`)
      const data = response.data.contactStaff
      if (data) {
        setValues({
          title: data?.title,
          email: data?.email,
          phone: data?.phone,
          description: data?.description,
          visible: data?.display,
        })
        setSelectedFile(data.picture)
      } else {
        console.error('No data found for the given ID.')
      }

      // phân quyền tác vụ edit
      if (
        sub == 'edit' &&
        response.data.status === false &&
        response.data.mess == 'no permission'
      ) {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Fetch data id department is error', error.message)
    }
  }

  const handleSubmit = async (values, { resetForm }) => {
    console.log('>>> check values', values)

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
    //       toast.success('Cập nhật phòng ban thành công')
    //       resetForm()
    //       navigate('/department')
    //       fetchDataDepartment()
    //     } else {
    //       console.error('No data found for the given ID.')
    //     }

    //     // phân quyền tác vụ update
    //     if (response.data.status === false && response.data.mess == 'no permission') {
    //       toast.warn('Bạn không có quyền thực hiện tác vụ này!')
    //     }
    //   } catch (error) {
    //     console.error('Put data id department is error', error.message)
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
    //       toast.success('Thêm mới phòng ban thành công!')
    //       fetchDataDepartment()
    //       resetForm()
    //       navigate('/department?sub=add')
    //     }

    //     // phân quyền tác vụ add
    //     if (response.data.status === false && response.data.mess == 'no permission') {
    //       toast.warn('Bạn không có quyền thực hiện tác vụ này!')
    //     }
    //   } catch (error) {
    //     console.error('Post data department is error', error)
    //     toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    //   }
    // }
  }

  const handleAddNewClick = () => {
    navigate('/content/menu?sub=add')
  }

  const handleEditClick = (id) => {
    navigate(`/content/menu?id=${id}&sub=edit`)
  }

  // delete row
  const handleDelete = async () => {
    setVisible(true)
    try {
      const response = await axiosClient.delete(`admin/contact-staff/${deletedId}`)
      if (response.data.status === true) {
        setVisible(false)
        fetchDataDepartment()
      }

      // phân quyền tác vụ delete
      if (response.data.status === false && response.data.mess == 'no permission') {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Delete department id is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
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
    fetchDataDepartment(keyword)
  }

  const items =
    dataDepartment?.data && dataDepartment?.data?.length > 0
      ? dataDepartment?.data.map((item) => ({
          id: (
            <CFormCheck
              id={item.staff_id}
              checked={selectedCheckbox.includes(item.staff_id)}
              value={item.staff_id}
              onChange={(e) => {
                const idx = item.staff_id
                const isChecked = e.target.checked
                if (isChecked) {
                  setSelectedCheckbox([...selectedCheckbox, idx])
                } else {
                  setSelectedCheckbox(selectedCheckbox.filter((id) => id !== idx))
                }
              }}
            />
          ),
          title: item?.title,

          mail: item?.email,
          actions: (
            <div>
              <button
                onClick={() => handleEditClick(item.staff_id)}
                className="button-action mr-2 bg-info"
              >
                <CIcon icon={cilColorBorder} className="text-white" />
              </button>
              <button
                onClick={() => {
                  setVisible(true)
                  setDeletedId(item.staff_id)
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
              const allIds = dataDepartment?.data.map((item) => item.staff_id) || []
              setSelectedCheckbox(allIds)
            } else {
              setSelectedCheckbox([])
            }
          }}
        />
      ),
      _props: { scope: 'col' },
    },
    {
      key: 'title',
      label: 'Tiêu đề',
      _props: { scope: 'col' },
    },
    {
      key: 'mail',
      label: 'Thư điện tử',
      _props: { scope: 'col' },
    },

    {
      key: 'actions',
      label: 'Tác vụ',
      _props: { scope: 'col' },
    },
  ]

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
              <h2>QUẢN LÝ MENU</h2>
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
                <Link to={'/menu'}>
                  <CButton color="primary" type="submit" size="sm">
                    Danh sách
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol md={4}>
              <h6>{!isEditing ? 'Thêm menu mới' : 'Cập nhật menu'}</h6>
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
                        <label htmlFor="url-input">Liên kết</label>
                        <Field name="url" type="text" as={CFormInput} id="url-input" />
                        <ErrorMessage name="url" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="name-input">Name action</label>
                        <Field name="name" type="text" as={CFormInput} id="name-input" />
                        <ErrorMessage name="name" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="target-select">Đích đến</label>
                        <Field
                          className="component-size"
                          name="target"
                          as={CFormSelect}
                          id="target-select"
                          text="Loại hiển thị của liên kết. Mặc định liên kết tại trang (_self)."
                          options={[
                            { label: 'Chọn đích đến', value: '' },
                            { label: 'Tại trang (_self)', value: '_self' },
                            { label: 'Cửa sổ mới (_blank)', value: '_blank' },
                            { label: 'Cửa sổ cha (_parent)', value: '_parent' },
                            { label: 'Cửa sổ trên cùng (_top)', value: '_top' },
                          ]}
                        />
                        <ErrorMessage name="target" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <label htmlFor="childOf-select">Là con của</label>
                        <CFormSelect
                          className="component-size"
                          aria-label="Chọn yêu cầu lọc"
                          name="childOf"
                          onChange={(e) => setFieldValue('childOf', e.target.value)}
                        >
                          <option value={''}>None</option>
                          {menuData &&
                            menuData?.map((item) => (
                              <React.Fragment key={item.id}>
                                <option value={item.id}>
                                  {item?.title} ({item?.id})
                                </option>
                                {item?.children &&
                                  item?.children.map((subItem) => (
                                    <React.Fragment key={subItem.id}>
                                      <option value={subItem.id}>
                                        &nbsp;&nbsp;&nbsp;{'|--'}
                                        {subItem?.title} ({subItem.id})
                                      </option>

                                      {subItem?.children &&
                                        subItem?.children.map((subSubItem) => (
                                          <option key={subSubItem.id} value={subSubItem.id}>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'|--'}
                                            {subSubItem?.title}({subSubItem.id})
                                          </option>
                                        ))}
                                    </React.Fragment>
                                  ))}
                              </React.Fragment>
                            ))}
                        </CFormSelect>
                        <ErrorMessage name="childOf" component="div" className="text-danger" />
                      </CCol>
                      <br />

                      <CCol md={12}>
                        <CFormInput
                          name="avatar"
                          type="file"
                          id="formFile"
                          label="Ảnh đại diện"
                          size="sm"
                          onChange={(e) => onFileChange(e)}
                        />
                        <br />
                        <ErrorMessage name="avatar" component="div" className="text-danger" />

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
              <Search count={dataDepartment?.total} onSearchData={handleSearch} />
              <CCol md={12} className="mt-3">
                <CButton onClick={handleDeleteSelectedCheckbox} color="primary" size="sm">
                  Xóa vĩnh viễn
                </CButton>
              </CCol>
              <CTable className="mt-3" columns={columns} items={items} />

              <div className="d-flex justify-content-end">
                <ReactPaginate
                  pageCount={Math.ceil(dataDepartment?.total / dataDepartment?.per_page)}
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
        </>
      )}
    </CContainer>
  )
}

export default Menu
