import axios from 'axios'

const token = localStorage.getItem('adminCN')

const axiosClient = axios.create({
  baseURL: 'http://192.168.245.190:8000/api/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  },
})

// Configuration for images
const imageBaseUrl = 'http://192.168.245.190:8000/uploads/'

export { axiosClient, imageBaseUrl }
