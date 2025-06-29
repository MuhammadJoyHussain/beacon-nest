import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import api from '@/utils/api'
import Header from '@/components/Header'
import { Toaster, toast } from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

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
    <div>
      <Header />
      <Toaster position='top-right' reverseOrder={false} />
      <div className='pt-20 pb-10 px-10'>
        <form
          onSubmit={handleSubmit}
          className='max-w-2xl mx-auto mt-20 w-full p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl shadow-2xl space-y-6'
        >
          <h2 className='text-3xl font-bold text-center text-blue-700'>
            Login
          </h2>
          <Input
            type='email'
            name='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type='password'
            name='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            type='submit'
            className='w-full bg-blue-600 text-white hover:bg-blue-700'
          >
            Login
          </Button>
          <p className='text-center text-sm mt-2'>
            Don't have an account?{' '}
            <a href='/register' className='text-blue-500 underline'>
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
