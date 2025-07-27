import axios from 'axios'

const api = axios.create({
  baseURL: 'https://https://beacon-kohl.vercel.app/api',
})

export default api
