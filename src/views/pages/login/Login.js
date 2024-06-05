import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

import Logo from '../../../assets/images/logo/logo CN.png'

import { axiosClient } from '../../../axiosConfig'

const Login = () => {
  const [username, setUserName] = useState('')
  const [password, setPassWord] = useState('')
  const navigate = useNavigate()

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  const handleLogin = async () => {
    try {
      const res = await axios.post('/login-admin', { username, password })
      if (res.data.status == true) {
        localStorage.setItem('adminCN', res.data.token)
        // window.location.reload()
        navigate('/')
      } else {
        if (res.data.mess == 'username') {
          alert('Sai tên đăng nhập')
        } else if (res.data.mess == 'pass') {
          alert('Sai mật khẩu')
        }
        alert('đăng nhập thất bại !!!')
      }
    } catch (error) {
      console.error('login error', error)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <div style={{ width: '100%', marginBottom: 10 }}>
                      <CImage align="center" rounded src={Logo} width={200} />
                    </div>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Tên đăng nhập" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Mật khẩu"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow className="justify-content-md-center">
                      <CCol xs={12}>
                        <CButton color="primary" className="px-4 w-100">
                          Đăng nhập
                        </CButton>
                      </CCol>
                      <CCol xs={12} className="text-right mt-2">
                        <CButton color="link" className="px-0">
                          Quên mật khẩu?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
