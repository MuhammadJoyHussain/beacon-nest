import axios from 'axios'

const authApi = axios.create({
  baseURL: 'https://beacon-kohl.vercel.app/api',
})

export default authApi
