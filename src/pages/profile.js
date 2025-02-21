import { useEffect, useState } from 'react'
import api from '@/utils/api'
import { useRouter } from 'next/router'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'

export default function Profile() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const { data } = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(data)
      } catch (err) {
        alert('Unauthorized. Please login again.')
        router.push('/login')
      }
    }

    fetchProfile()
  }, [])

  return (
    <div className='flex h-screen bg-gray-100'>
      <Header />
      <Sidebar />
      <div className='flex-grow flex items-center justify-center'>
        {user ? (
          <div className='bg-white shadow-lg rounded-xl p-8 w-96 text-center'>
            <div className='flex flex-col items-center'>
              <img
                src={user.profilePic || 'https://via.placeholder.com/150'}
                alt='Profile Picture'
                className='w-32 h-32 rounded-full border-4 border-blue-500 mb-4'
              />
              <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                {user.username}
              </h2>
              <p className='text-gray-600 mb-4'>{user.email}</p>
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  router.push('/login')
                }}
                className='bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition'
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <p className='text-lg text-gray-600'>Loading profile...</p>
        )}
      </div>
    </div>
  )
}
