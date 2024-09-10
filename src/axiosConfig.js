import axios from 'axios'

const token = localStorage.getItem('adminCN')

const axiosClient = axios.create({
  baseURL: 'http://api.chinhnhan.com/api/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  },
})

// Configuration for images
const imageBaseUrl = 'http://api.chinhnhan.com/uploads/'

export { axiosClient, imageBaseUrl }
