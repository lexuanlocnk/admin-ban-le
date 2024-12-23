import axios from 'axios'

const token = localStorage.getItem('adminCN')

const axiosClient = axios.create({
  baseURL: 'https://api.chinhnhan.net/api/',
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
const imageBaseUrl = 'https://api.chinhnhan.net/uploads/'
const mainUrl = 'https://web.chinhnhan.net'

export { axiosClient, imageBaseUrl, mainUrl }
