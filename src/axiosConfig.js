import axios from 'axios'

const token = localStorage.getItem('adminCN')

const axiosClient = axios.create({
  baseURL: 'http://192.168.245.190:8000/api/',
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
const imageBaseUrl = 'http://192.168.245.190:8000/uploads/'

export { axiosClient, imageBaseUrl }
