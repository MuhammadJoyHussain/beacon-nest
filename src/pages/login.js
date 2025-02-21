import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import api from '@/utils/api'
import Header from '@/components/Header'
import { Toaster, toast } from 'react-hot-toast'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/profile')
    }
  }, [router])

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', formData)

      localStorage.setItem('token', data.token)

      toast.success('Login successful! Redirecting to Profile...')
      setTimeout(() => router.push('/profile'), 1500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <>
      <Header />
      <Toaster position='top-right' reverseOrder={false} />
      <div className='flex justify-center items-center h-screen'>
        <form
          onSubmit={handleSubmit}
          className='bg-white shadow-md rounded px-8 pt-6 pb-8 w-96'
        >
          <h2 className='text-2xl mb-4 text-center'>Login</h2>
          <input
            type='email'
            name='email'
            placeholder='Email'
            onChange={handleChange}
            className='border w-full p-2 mb-4'
            required
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            onChange={handleChange}
            className='border w-full p-2 mb-4'
            required
          />
          <button
            type='submit'
            className='bg-blue-500 text-white w-full py-2 rounded'
          >
            Login
          </button>
          <p className='text-center text-sm mt-4'>
            Don't have an account?{' '}
            <a href='/register' className='text-blue-500 underline'>
              Register
            </a>
          </p>
        </form>
      </div>
    </>
  )
}
