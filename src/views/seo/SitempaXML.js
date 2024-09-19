import { ErrorMessage, Field, Form, Formik } from 'formik'
import { CButton, CCol, CContainer, CFormCheck, CRow, CFormTextarea } from '@coreui/react'
import React, { useEffect, useState, useParams } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

function SitemapXML() {
  const handleSubmit = async (values) => {
    console.log('>>> check values')
  }

  return (
    <CContainer>
      <CRow className="mb-5">
        <CCol md={6}>
          <h2>SITEMAP XML</h2>
        </CCol>
      </CRow>

      <CRow>
        <Formik>
          <Form>
            <CCol md={12}>
              <CRow>
                <CCol md={2}>
                  <label htmlFor="desc-input" className="form-label">
                    Link Sitemap XML
                  </label>
                </CCol>
                <CCol md={8}>
                  <a
                    href="https://chinhnhan.vn/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://chinhnhan.vn/sitemap.xml
                  </a>
                  <br />
                  <CButton color="primary" size="sm" className="mt-5">
                    Cập nhật
                  </CButton>
                </CCol>
              </CRow>
            </CCol>
          </Form>
        </Formik>
      </CRow>
    </CContainer>
  )
}

export default SitemapXML
