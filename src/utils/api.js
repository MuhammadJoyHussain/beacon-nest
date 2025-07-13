import axios from 'axios'

const api = axios.create({
  baseURL: 'https://backend-two-bice.vercel.app/api', 
})

export default api
