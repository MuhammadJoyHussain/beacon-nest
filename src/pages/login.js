import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import api from '@/utils/api'
import Header from '@/components/dashboard/Header'
import { Toaster, toast } from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const router = useRouter()
  const { redirect } = router.query

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push(redirect || '/applicant/profile')
    }
  }, [router, redirect])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'email' ? value.toLowerCase() : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', formData)

      localStorage.setItem('token', data.token)
      toast.success('Login successful! Redirecting...')
      setTimeout(() => {
        router.push(redirect || '/applicant/profile')
      }, 1500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }
  }

  const fields = [
    {
      name: 'email',
      type: 'email',
      label: 'email',
      placeholder: 'Email*',
    },
    {
      name: 'password',
      type: 'password',
      label: 'password',
      placeholder: 'Password*',
    },
  ]

  return (
    <div className='min-h-screen background text-[#3D52A0]'>
      <Header />
      <Toaster position='top-right' reverseOrder={false} />

      <div className='pt-20 pb-16 px-6 flex justify-center'>
        <form
          onSubmit={handleSubmit}
          className='w-full max-w-md bg-white rounded-3xl shadow-lg p-10 space-y-8'
        >
          <h2 className='text-4xl font-extrabold text-center text-[#3D52A0]'>
            Login
          </h2>

          {fields.map((field) => (
            <Input
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              required
            />
          ))}

          <Button type='submit'>Login</Button>

          <p className='text-center text-[#3D52A0] text-sm'>
            Don't have an account?{' '}
            <Link
              href={`/register${redirect ? `?redirect=${redirect}` : ''}`}
              className='text-[#7091E6] font-semibold underline hover:text-[#3D52A0]'
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
