import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import api from '@/utils/api'
import Header from '@/components/Header'
import { Toaster, toast } from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const router = useRouter()
  const { redirect } = router.query // 👈 capture the redirect param

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Optional: You may want to check if the redirect is available here too
      router.push(redirect || '/profile')
    }
  }, [router, redirect])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'email' ? value.toLowerCase() : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', formData)

      localStorage.setItem('token', data.token)
      toast.success('Login successful! Redirecting...')
      setTimeout(() => {
        router.push(redirect || '/profile') // 👈 use redirect if it exists
      }, 1500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className='min-h-screen bg-green-50'>
      <Header />
      <Toaster position='top-right' reverseOrder={false} />
      <div className='pt-20 pb-16 px-6 text-black'>
        <form
          onSubmit={handleSubmit}
          className='max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-10 space-y-8'
        >
          <h2 className='text-3xl font-extrabold text-center text-green-800'>
            Login
          </h2>
          <Input
            type='email'
            name='email'
            placeholder='Email*'
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type='password'
            name='password'
            placeholder='Password*'
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            type='submit'
            className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition'
          >
            Login
          </Button>
          <p className='text-center text-sm text-green-800'>
            Don't have an account?{' '}
            <Link
              href={`/register${redirect ? `?redirect=${redirect}` : ''}`}
              className='text-green-600 underline hover:text-green-700'
            >
              Register
            </Link>
          </p>
        </form>
      </div>
      <Footer />
    </div>
  )
}
