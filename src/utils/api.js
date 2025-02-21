import axios from 'axios'

const api = axios.create({
  baseURL: 'https://beacon-nest-backend.vercel.app/api', // Your Express API URL
})

export default api
