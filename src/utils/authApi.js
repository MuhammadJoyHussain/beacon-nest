import axios from 'axios'

const authApi = axios.create({
  baseURL: 'https://auth-nine-tan.vercel.app/api',
})

export default authApi
