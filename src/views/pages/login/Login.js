import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CButton, CForm, CSpinner } from '@coreui/react'
import { FaUser, FaLock, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa'
import { MdErrorOutline } from 'react-icons/md'

import Logo from '../../../assets/images/logo/logo CN.png'
import { axiosClient } from '../../../axiosConfig'
import { toast } from 'react-toastify'
import './Login.css'

const Login = () => {
  const [username, setUserName] = useState('')
  const [password, setPassWord] = useState('')
  const [key, setKey] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showKey, setShowKey] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const triggerShake = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleLogin()
    }
  }

  const handleLogin = async () => {
    // 1. Kiểm tra validation client
    if (!username || !username.trim()) {
      const msg = 'Vui lòng nhập tên tài khoản!'
      setErrorMessage(msg)
      triggerShake()
      toast.warning(msg)
      return
    }

    if (!password) {
      const msg = 'Vui lòng nhập mật khẩu!'
      setErrorMessage(msg)
      triggerShake()
      toast.warning(msg)
      return
    }

    try {
      setLoading(true)
      setErrorMessage('')

      const res = await axiosClient.post('/admin-login', {
        username: username.trim(),
        password,
        passwordSecurity: key,
      })

      if (res?.data?.status === true) {
        setErrorMessage('')
        localStorage.setItem('adminCN', res.data.token)
        localStorage.setItem('username', res.data.username)
        toast.success('Đăng nhập thành công! Đang chuyển hướng...')
        navigate('/')
      } else {
        // 2. Lấy thông báo lỗi từ backend
        const errorMsg =
          res?.data?.message ||
          (res?.data?.mess === 'username'
            ? 'Sai tên đăng nhập! Vui lòng kiểm tra lại.'
            : res?.data?.mess === 'pass'
            ? 'Sai mật khẩu! Vui lòng kiểm tra lại.'
            : res?.data?.mess === 'wrong passwordSecurity'
            ? 'Sai khóa bảo mật! Vui lòng kiểm tra lại.'
            : 'Tài khoản hoặc mật khẩu không chính xác!')

        setErrorMessage(errorMsg)
        triggerShake()
        toast.error(errorMsg)
        console.error('Đăng nhập thất bại:', res?.data)
      }
    } catch (error) {
      console.error('Post login data is error:', error)
      const errorMsg =
        error.response?.data?.message ||
        (error.response?.status === 401 || error.response?.status === 403
          ? 'Tài khoản hoặc mật khẩu không chính xác!'
          : 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau!')

      setErrorMessage(errorMsg)
      triggerShake()
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page-wrapper">
      <div className={`login-card ${isShaking ? 'shake' : ''}`}>
        <div className="login-logo-container">
          <img src={Logo} alt="Chính Nhân Logo" className="login-logo-img" />
          <span className="login-badge">Admin Portal</span>
          <h1 className="login-title">Hệ Thống Quản Trị</h1>
          <p className="login-subtitle">Vui lòng đăng nhập để tiếp tục</p>
        </div>

        {/* Thông báo lỗi dạng Alert Banner nổi bật */}
        {errorMessage && (
          <div className="login-alert-banner">
            <MdErrorOutline style={{ fontSize: '18px', flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <CForm onKeyDown={handleKeyDown}>
          {/* Ô nhập Tài khoản */}
          <div className="login-input-group">
            <label className="login-input-label">Tên tài khoản</label>
            <div className={`login-input-wrapper ${errorMessage ? 'is-error' : ''}`}>
              <FaUser className="login-input-icon" />
              <input
                type="text"
                className="login-input-field"
                placeholder="Nhập tên tài khoản"
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUserName(e.target.value)
                  if (errorMessage) setErrorMessage('')
                }}
                disabled={loading}
              />
            </div>
          </div>

          {/* Ô nhập Mật khẩu */}
          <div className="login-input-group">
            <label className="login-input-label">Mật khẩu</label>
            <div className={`login-input-wrapper ${errorMessage ? 'is-error' : ''}`}>
              <FaLock className="login-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input-field"
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassWord(e.target.value)
                  if (errorMessage) setErrorMessage('')
                }}
                disabled={loading}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Ô nhập Khóa bảo mật (nếu có) */}
          <div className="login-input-group mb-4">
            <label className="login-input-label">Khóa bảo mật (nếu có)</label>
            <div className="login-input-wrapper">
              <FaShieldAlt className="login-input-icon" />
              <input
                type={showKey ? 'text' : 'password'}
                className="login-input-field"
                placeholder="Nhập khóa bảo mật"
                autoComplete="off"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowKey(!showKey)}
                tabIndex="-1"
                title={showKey ? 'Ẩn khóa' : 'Hiện khóa'}
              >
                {showKey ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Nút Đăng nhập */}
          <CButton
            onClick={handleLogin}
            disabled={loading}
            color="primary"
            className="login-submit-btn d-flex align-items-center justify-content-center"
          >
            {loading ? (
              <>
                <CSpinner size="sm" className="me-2" /> Đang xác thực...
              </>
            ) : (
              'Đăng nhập'
            )}
          </CButton>
        </CForm>

        <p className="login-footer-text">
          © {new Date().getFullYear()} Công ty Vi Tính Chính Nhân. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Login
