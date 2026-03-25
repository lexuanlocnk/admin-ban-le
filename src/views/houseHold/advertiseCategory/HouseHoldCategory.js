import React, { useEffect, useRef, useState } from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CRow,
  CSpinner,
  CTable,
} from '@coreui/react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Search from '../../../components/search/Search'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilColorBorder } from '@coreui/icons'
import ReactPaginate from 'react-paginate'
import DeletedModal from '../../../components/deletedModal/DeletedModal'
import { toast } from 'react-toastify'
import { axiosClient } from '../../../axiosConfig'
import Loading from '../../../components/loading/Loading'

const DEFAULT_FORM_VALUES = {
  title: '',
  name: '',
  width: '',
  height: '',
  show: '',
  description: '',
  display: 0,
}

const DEFAULT_PAGINATION = {
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
}

function HouseHoldCategory() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const sub = params.get('sub')
  const inputRef = useRef(null)

  const [isPermissionCheck, setIsPermissionCheck] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [dataAdvertiseCategory, setDataAdvertiseCategory] = useState([])
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION)
  const [visible, setVisible] = useState(false)
  const [deletedId, setDeletedId] = useState(null)
  const [isAllCheckbox, setIsAllCheckbox] = useState(false)
  const [selectedCheckbox, setSelectedCheckbox] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [dataSearch, setDataSearch] = useState('')
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES)

  const validationSchema = Yup.object({
    title: Yup.string().required('Tiêu đề là bắt buộc.'),
    name: Yup.string().required('Name là bắt buộc.'),
    width: Yup.string().required('Chiều rộng banner là bắt buộc.'),
    height: Yup.string().required('Chiều cao banner là bắt buộc.'),
    show: Yup.string().required('Số lượng banner là bắt buộc.'),
    display: Yup.string().required('Hiển thị là bắt buộc.'),
  })

  const isNoPermission = (responseData) =>
    responseData?.status === false &&
    (responseData?.mess === 'no permission' || responseData?.message === 'no permission')

  const isSuccessResponse = (status) => status === true || status === 'success'

  const fetchDataAdvertiseCategory = async (keyword = dataSearch, page = pageNumber) => {
    try {
      setIsLoadingList(true)
      const response = await axiosClient.get(`admin/household/ad-pos?data=${keyword}&page=${page}`)
      const responseData = response.data

      if (isSuccessResponse(responseData?.status)) {
        const list = responseData?.data?.items || []
        const paginateData = responseData?.data?.pagination || DEFAULT_PAGINATION
        setDataAdvertiseCategory(list)
        setPagination(paginateData)
      }

      if (isNoPermission(responseData)) {
        setIsPermissionCheck(false)
      }
    } catch (error) {
      console.error('Fetch household ad position is error', error)
    } finally {
      setIsLoadingList(false)
    }
  }

  const fetchDataById = async (positionId) => {
    try {
      const response = await axiosClient.get(`admin/household/ad-pos/${positionId}/edit`)
      const responseData = response.data
      const data = responseData?.data

      if (data) {
        setFormValues({
          title: data?.title || '',
          name: data?.name || '',
          width: data?.width || '',
          height: data?.height || '',
          show: data?.show || '',
          description: data?.description || '',
          display: data?.display ?? 0,
        })
      }

      if (isNoPermission(responseData)) {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Fetch household ad position detail is error', error.message)
    }
  }

  useEffect(() => {
    fetchDataAdvertiseCategory(dataSearch, pageNumber)
  }, [pageNumber])

  useEffect(() => {
    setSelectedCheckbox([])
    setIsAllCheckbox(false)
  }, [dataAdvertiseCategory])

  useEffect(() => {
    if (sub === 'edit' && id) {
      setIsEditing(true)
      fetchDataById(id)
      return
    }

    setIsEditing(false)
    setFormValues(DEFAULT_FORM_VALUES)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [sub, id])

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      title: values.title,
      name: values.name,
      width: values.width,
      height: values.height,
      show: values.show,
      description: values.description,
      display: Number(values.display),
    }

    if (isEditing) {
      try {
        setIsSubmitting(true)
        const response = await axiosClient.put(`admin/household/ad-pos/${id}`, payload)
        if (response.data.status === true) {
          toast.success('Cập nhật vị trí gia dụng thành công!')
          setIsEditing(false)
          setFormValues(DEFAULT_FORM_VALUES)
          resetForm()
          fetchDataAdvertiseCategory(dataSearch, pageNumber)
          navigate('/household/category')
        }

        if (isNoPermission(response.data)) {
          toast.warn('Bạn không có quyền thực hiện tác vụ này!')
        }
      } catch (error) {
        console.error('Put household ad position is error', error.message)
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    try {
      setIsSubmitting(true)
      const response = await axiosClient.post('admin/household/ad-pos', payload)

      if (response.data.status === true) {
        toast.success('Thêm mới vị trí gia dụng thành công!')
        setFormValues(DEFAULT_FORM_VALUES)
        resetForm()
        fetchDataAdvertiseCategory(dataSearch, pageNumber)
        navigate('/household/category?sub=add')
      }

      if (isNoPermission(response.data)) {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Post household ad position is error', error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddNewClick = () => {
    navigate('/household/category?sub=add')
  }

  const handleEditClick = (positionId) => {
    navigate(`/household/category?id=${positionId}&sub=edit`)
  }

  const handleDelete = async () => {
    if (!deletedId) {
      return
    }

    try {
      const response = await axiosClient.post('admin/household/ad-pos-delete', {
        _method: 'DELETE',
        ids: [deletedId],
      })

      if (response.data.status === true) {
        setVisible(false)
        toast.success('Xóa vị trí gia dụng thành công!')
        fetchDataAdvertiseCategory(dataSearch, pageNumber)
      }

      if (isNoPermission(response.data)) {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Delete household ad position is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  const handleDeleteSelectedCheckbox = async () => {
    if (selectedCheckbox.length === 0) {
      toast.warn('Vui lòng chọn dữ liệu cần xóa!')
      return
    }

    try {
      const response = await axiosClient.post('admin/household/ad-pos-delete', {
        _method: 'DELETE',
        ids: selectedCheckbox,
      })

      if (response.data.status === true) {
        toast.success('Đã xóa các mục được chọn!')
        setSelectedCheckbox([])
        setIsAllCheckbox(false)
        fetchDataAdvertiseCategory(dataSearch, pageNumber)
      }

      if (isNoPermission(response.data)) {
        toast.warn('Bạn không có quyền thực hiện tác vụ này!')
      }
    } catch (error) {
      console.error('Delete selected household ad position is error', error)
      toast.error('Đã xảy ra lỗi khi xóa. Vui lòng thử lại!')
    }
  }

  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1
    window.scrollTo(0, 0)
    setPageNumber(newPage)
  }

  const handleSearch = (keyword) => {
    setDataSearch(keyword)
    setPageNumber(1)
    fetchDataAdvertiseCategory(keyword, 1)
  }

  const items =
    dataAdvertiseCategory && dataAdvertiseCategory.length > 0
      ? dataAdvertiseCategory.map((item) => ({
          id: (
            <CFormCheck
              key={item?.id}
              aria-label="Select row"
              id={`flexCheckDefault_${item?.id}`}
              value={item?.id}
              checked={selectedCheckbox.includes(item?.id)}
              onChange={(e) => {
                const positionId = item?.id
                const isChecked = e.target.checked
                if (isChecked) {
                  setSelectedCheckbox((prev) => [...prev, positionId])
                  return
                }
                setSelectedCheckbox((prev) =>
                  prev.filter((selectedId) => selectedId !== positionId),
                )
              }}
            />
          ),
          title: item?.title,
          name: item?.name,
          dimension: `${item?.width} x ${item?.height}`,
          show: item?.show,
          display: item?.display === 1 ? 'Có' : 'Không',
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
              const allIds = dataAdvertiseCategory?.map((item) => item.id) || []
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
      key: 'title',
      label: 'Tiêu đề',
      _props: { scope: 'col' },
    },
    {
      key: 'name',
      label: 'Name',
      _props: { scope: 'col' },
    },
    {
      key: 'dimension',
      label: 'Kích thước',
      _props: { scope: 'col' },
    },
    {
      key: 'show',
      label: 'Số banner',
      _props: { scope: 'col' },
    },
    {
      key: 'display',
      label: 'Hiển thị',
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
            <CCol md={6}>
              <h3>QUẢN LÝ VỊ TRÍ ADS GIA DỤNG</h3>
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
                <Link to={'/household/category'}>
                  <CButton color="primary" type="button" size="sm">
                    Danh sách
                  </CButton>
                </Link>
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol md={4}>
              <h6>{!isEditing ? 'Thêm vị trí mới' : 'Cập nhật vị trí'}</h6>
              <Formik
                enableReinitialize
                initialValues={formValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {() => (
                  <Form>
                    <CCol md={12}>
                      <label htmlFor="title-input">Tiêu đề</label>
                      <Field name="title">
                        {({ field }) => (
                          <CFormInput {...field} type="text" id="title-input" ref={inputRef} />
                        )}
                      </Field>
                      <ErrorMessage name="title" component="div" className="text-danger" />
                    </CCol>
                    <br />

                    <CCol md={12}>
                      <label htmlFor="name-input">Name</label>
                      <Field name="name" type="text" as={CFormInput} id="name-input" />
                      <ErrorMessage name="name" component="div" className="text-danger" />
                    </CCol>
                    <br />

                    <CCol md={12}>
                      <label htmlFor="width-input">Chiều rộng</label>
                      <Field name="width" type="text" as={CFormInput} id="width-input" />
                      <ErrorMessage name="width" component="div" className="text-danger" />
                    </CCol>
                    <br />

                    <CCol md={12}>
                      <label htmlFor="height-input">Chiều cao</label>
                      <Field name="height" type="text" as={CFormInput} id="height-input" />
                      <ErrorMessage name="height" component="div" className="text-danger" />
                    </CCol>
                    <br />

                    <CCol md={12}>
                      <label htmlFor="show-input">Số banner hiển thị</label>
                      <Field name="show" type="number" as={CFormInput} id="show-input" />
                      <ErrorMessage name="show" component="div" className="text-danger" />
                    </CCol>
                    <br />

                    <CCol md={12}>
                      <label htmlFor="description-input">Mô tả</label>
                      <Field
                        style={{ height: '100px' }}
                        name="description"
                        type="text"
                        as={CFormTextarea}
                        id="description-input"
                      />
                      <ErrorMessage name="description" component="div" className="text-danger" />
                    </CCol>
                    <br />

                    <CCol md={12}>
                      <label htmlFor="display-select">Hiển thị</label>
                      <Field
                        name="display"
                        as={CFormSelect}
                        id="display-select"
                        options={[
                          { label: 'Không', value: 0 },
                          { label: 'Có', value: 1 },
                        ]}
                      />
                      <ErrorMessage name="display" component="div" className="text-danger" />
                    </CCol>
                    <br />

                    <CCol xs={12}>
                      <CButton color="primary" type="submit" size="sm" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <CSpinner size="sm"></CSpinner> Đang xử lý...
                          </>
                        ) : isEditing ? (
                          'Cập nhật'
                        ) : (
                          'Thêm mới'
                        )}
                      </CButton>
                    </CCol>
                  </Form>
                )}
              </Formik>
            </CCol>

            <CCol>
              <Search count={pagination?.total || 0} onSearchData={handleSearch} />
              <CCol className="my-3">
                <CButton onClick={handleDeleteSelectedCheckbox} color="primary" size="sm">
                  Xóa vĩnh viễn
                </CButton>
              </CCol>

              {isLoadingList ? (
                <Loading />
              ) : (
                <CTable className="mt-2" columns={columns} items={items} />
              )}

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
            </CCol>
          </CRow>
        </>
      )}
    </CContainer>
  )
}

export default HouseHoldCategory
