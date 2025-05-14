import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://ap.chinhnhan.vn/api/',
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
const imageBaseUrl = 'https://ap.chinhnhan.vn/uploads/'
const mainUrl = 'https://test.chinhnhan.vn/'

export { axiosClient, imageBaseUrl, mainUrl }
