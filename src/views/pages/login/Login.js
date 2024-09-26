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

import { axiosClient, setAuthToken } from '../../../axiosConfig'
import { toast } from 'react-toastify'
import axios from 'axios'
import LoadingPage from '../../../components/loading/LoadingPage'

const Login = () => {
  const [username, setUserName] = useState('')
  const [password, setPassWord] = useState('')
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  const handleLogin = async () => {
    try {
      setLoading(true)
      const res = await axiosClient.post('/admin-login', {
        username,
        password,
      })

      if (res.data.status === true) {
        localStorage.setItem('adminCN', res.data.token)
        localStorage.setItem('username', res.data.username)
        navigate('/')
        // window.location.reload()
      } else {
        if (res.data.mess == 'username') {
          toast.error('Sai tên đăng nhập!. Vui lòng kiểm tra lại!')
        } else if (res.data.mess == 'pass') {
          toast.error('Sai mật khẩu. Vui lòng kiểm tra lại!')
        }
        console.error('Đăng nhập thất bại!!!')
      }
    } catch (error) {
      console.error('Post login data is error', error)
      toast.error('Đã xảy ra lỗi. Vui lòng kiểm tra lại thông tin!')
    } finally {
      setLoading(false)
    }
  }

  // if (loading) return <LoadingPage />

  return (
    <>
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={4}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onKeyDown={handleKeyDown}>
                      <div style={{ width: '100%', marginBottom: 10 }}>
                        <CImage align="center" rounded src={Logo} width={200} />
                      </div>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Tài khoản"
                          autoComplete="username"
                          value={username}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Mật khẩu"
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassWord(e.target.value)}
                        />
                      </CInputGroup>
                      <CRow className="justify-content-md-center">
                        <CCol xs={12}>
                          <CButton
                            onKeyDown={handleKeyDown}
                            onClick={handleLogin}
                            color="primary"
                            className="px-4 w-100"
                          >
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
    </>
  )
}

export default Login
