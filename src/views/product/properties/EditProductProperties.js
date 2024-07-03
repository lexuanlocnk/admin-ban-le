import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilX } from '@coreui/icons'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const fakeData = [
  {
    cate_id: 1,
    cate_name: 'Laptop',
    sub_cate: [
      {
        sub_id: 1,
        sub_name: 'Laptop-HP',
      },
      {
        sub_id: 2,
        sub_name: 'Laptop-Dell',
      },
    ],
  },
  {
    cate_id: 2,
    cate_name: 'Máy tính để bàn',
    sub_cate: [
      {
        sub_id: 1,
        sub_name: 'Máy tính all in one',
      },
      {
        sub_id: 2,
        sub_name: 'Máy tính mini/nuc',
      },
    ],
  },
]

function EditProductProperties() {
  const [propertiesName, setPropertiesName] = useState('')
  const [category, setCategory] = useState([])

  //add value properties
  const [arr, setArr] = useState([])
  const [inputFields, setInputFields] = useState([{ title: '' }])
  const addInputField = () => {
    setInputFields([
      ...inputFields,
      {
        title: '',
      },
    ])
  }
  const removeInputFields = (index) => {
    let arrNew = [...arr]
    console.log('>>> check arrNew', arrNew)
    arrNew.splice(index, 1)
    console.log('>>>> check a1', arrNew)
    setArr(arrNew)

    const rows = [...inputFields]
    rows.splice(index, 1)
    setInputFields(rows)
  }

  const handleInputChange = (e, index) => {
    const { name, value } = e.target
    const list = [...inputFields]
    list[index][name] = value
    setInputFields(list)

    const arrNew = [...arr]
    arrNew[index] = value
    setArr(arrNew)
  }

  const handleSubmit = () => {
    // api for submit
  }

  return (
    <CContainer>
      <CRow className="mb-3">
        <CCol>
          <h3>THÊM MỚI THUỘC TÍNH</h3>
        </CCol>
        <CCol md={{ span: 4, offset: 4 }}>
          <div className="d-flex justify-content-end">
            <Link to={`/product/properties`}>
              <CButton color="primary" type="submit" size="sm">
                Danh sách
              </CButton>
            </Link>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={8}>
          <h6></h6>
          <CForm className="row gy-3">
            <CCol md={12}>
              <CFormInput
                id="inputName"
                label="Tên thuộc tính"
                value={propertiesName}
                onChange={(e) => setPropertiesName(e.target.value)}
              />
            </CCol>

            <CCol md={12}>
              <h6>Lựa chọn nghành hàng hoặc nghành hàng con cho thuộc tính:</h6>
              <div>
                {fakeData &&
                  fakeData.length > 0 &&
                  fakeData.map((item) => (
                    <React.Fragment key={item.cate_id}>
                      <div className="d-flex align-items-center justify-content-between">
                        <CFormCheck
                          className="mb-4"
                          id={item.cate_id}
                          label={item.cate_name}
                          value={item.cate_id}
                          checked={category.includes(item.cate_id)}
                          onChange={(e) => {
                            const idDe = item.cate_id
                            const isChecked = e.target.checked
                            if (isChecked) {
                              setCategory([...category, idDe])
                            } else {
                              setCategory(category.filter((id) => id !== idDe))
                            }
                          }}
                        />
                        <CFormSelect
                          className="component-size"
                          style={{ maxWidth: 300 }}
                          aria-label="Chọn danh mục con"
                          options={
                            item.sub_cate &&
                            item.sub_cate.length > 0 &&
                            item.sub_cate.map((subCate) => ({
                              label: subCate.sub_name,
                              value: subCate.sub_id,
                            }))
                          }
                        />
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            </CCol>

            <CCol md={12}>
              <div>
                <CButton color="success" size="sm" onClick={addInputField}>
                  Thêm dữ liệu thuộc tính
                </CButton>
              </div>
              {inputFields.map((item, index) => {
                return (
                  <div className="my-3 " key={index}>
                    <div className="form-group">
                      <label>Dữ liệu thuộc tính</label>
                      <div className="d-flex justify-content-between align-items-center">
                        <CFormInput
                          className="flex-grow-1"
                          type="text"
                          id={index}
                          // label="Dữ liệu thuộc tính"
                          placeholder=""
                          name={`title-${index}`}
                          aria-describedby="exampleFormControlInputHelpInline"
                          value={arr[index]}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                        {inputFields.length !== 1 ? (
                          <CButton
                            className="mx-3"
                            color="danger"
                            variant="outline"
                            onClick={(e) => removeInputFields(index)}
                          >
                            <CIcon icon={cilX} />
                          </CButton>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </CCol>

            <CCol xs={12}>
              <CButton onClick={handleSubmit} color="primary" type="submit" size="sm">
                Thêm mới
              </CButton>
            </CCol>
          </CForm>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default EditProductProperties
