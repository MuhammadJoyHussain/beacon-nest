import { useState } from 'react'
import api from '@/utils/api'
import { useRouter } from 'next/router'
import Header from '@/components/Header'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const router = useRouter()

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/register', formData)
      alert('Registration successful!')
      router.push('/login')
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <>
      <Header />
      <div className='flex justify-center items-center h-screen'>
        <form
          onSubmit={handleSubmit}
          className='bg-white shadow-md rounded px-8 pt-6 pb-8 w-96'
        >
          <h2 className='text-2xl mb-4 text-center'>Register</h2>
          <input
            type='text'
            name='username'
            placeholder='Username'
            onChange={handleChange}
            className='border w-full p-2 mb-4'
            required
          />
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
            Register
          </button>
          <p className='text-center text-sm mt-4'>
            Already have an account?{' '}
            <a href='/login' className='text-blue-500 underline'>
              Login
            </a>
          </p>
        </form>
      </div>
    </>
  )
}
