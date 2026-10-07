import axios from 'axios'

const apiOrigin = new URL(process.env.REACT_APP_API_HOST || 'https://api.chinhnhan.com')
if (process.env.REACT_APP_API_PORT) {
  apiOrigin.port = process.env.REACT_APP_API_PORT
}
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || `${apiOrigin.origin}/api/`

const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('adminCN')
      ? `Bearer ${localStorage.getItem('adminCN')}`
      : '',
  },
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminCN')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Configuration for images
const imageBaseUrl = `${new URL(apiBaseUrl).origin}/uploads/`
const mainUrl = 'https://chinhnhan.vn/'

export { axiosClient, imageBaseUrl, mainUrl }
