import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Your Express API URL
})

export default api
