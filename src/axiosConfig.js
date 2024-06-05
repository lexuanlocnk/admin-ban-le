import axios from 'axios'

const token = localStorage.getItem('adminCN')

const axiosClient = axios.create({
  baseURL: 'http://admin.chinhnhan.vn',
  headers: {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  },
})

// Configuration for images
const imageBaseUrl = 'http://media.chinhnhan.vn/'

export { axiosClient, imageBaseUrl }
