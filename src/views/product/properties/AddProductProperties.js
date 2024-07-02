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

const handleSubmit = () => {
  // api for submit
}

function AddProductProperties() {
  const [propertiesName, setPropertiesName] = useState('')
  const [category, setCategory] = useState([])

  //add value properties
  const [arr, setArr] = useState([])
  const [inputFields, setInputFields] = useState([{ fullName: '' }])
  const addInputField = () => {
    setInputFields([
      ...inputFields,
      {
        fullName: '',
      },
    ])
  }
  const removeInputFields = (index) => {
    let arrNew = Object.values(arr)
    arrNew.splice(index, 1)
    setArr(arrNew)

    const rows = [...inputFields]
    rows.splice(index, 1)
    setInputFields(rows)
  }

  const handleChange = (index, evnt) => {
    const { name, value } = evnt.target

    const list = [...inputFields]
    list[index][name] = value
    setInputFields(list)
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

            <div className="row">
              <div className="col-sm-12">
                {inputFields.map((item, index) => {
                  return (
                    <div className="row my-3" key={index}>
                      <div className="col">
                        <div className="form-group">
                          <CFormInput
                            type="text"
                            id={index}
                            label="Dữ liệu thuộc tính"
                            placeholder=""
                            name={`title-${index}`}
                            aria-describedby="exampleFormControlInputHelpInline"
                            value={arr[index]}
                            onChange={(e) => handleChangeInput(e, index)}
                          />
                        </div>
                      </div>
                      <div className="col-1">
                        {inputFields.length !== 1 ? (
                          <button
                            className="btn btn-outline-danger"
                            onClick={(e) => removeInputFields(index)}
                          >
                            x
                          </button>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  )
                })}
                <div className="row">
                  <div className="col-sm-12">
                    <a className="btn btn-outline-success" onClick={addInputField}>
                      Thêm dữ liệu thuộc tính
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <CCol md={12}>
              <CFormInput
                id="inputProperties"
                label="Dữ liệu thuộc tính"
                value={propertiesName}
                onChange={(e) => setPropertiesName(e.target.value)}
              />
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

export default AddProductProperties
