import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Bell } from 'lucide-react'
import api from '@/utils/api'

const Header = () => {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const { data } = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(data)
      } catch (err) {
        console.error('Failed to load user profile')
        // Optional: logout on failure
        localStorage.removeItem('token')
        router.push('/login')
      }
    }

    fetchUser()
  }, [])

  const getInitials = () => {
    if (!user) return ''
    const initials =
      (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '')
    return initials.toUpperCase()
  }

  return (
    <header className='bg-white shadow-lg fixed top-0 left-0 w-full flex justify-between items-center px-4 lg:px-8 py-3 z-50'>
      {/* Logo */}
      <Link href='/' className='flex items-center space-x-2'>
        <div className='h-8 w-8 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-full'>
          <span className='text-white font-bold text-xl'>B</span>
        </div>
        <span className='text-2xl font-semibold text-gray-800 hover:text-blue-500 transition duration-300'>
          Beacon Nest
        </span>
      </Link>

      {/* Actions */}
      <div className='flex items-center space-x-4'>
        {/* Notifications */}
        <button className='relative text-gray-700 hover:text-blue-500'>
          <Bell size={24} />
          <span className='absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>
            3
          </span>
        </button>

        {/* Profile */}
        <div className='flex items-center space-x-3'>
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt='Profile'
              className='h-10 w-10 rounded-full border object-cover'
            />
          ) : (
            <div className='h-10 w-10 rounded-full flex items-center justify-center bg-green-600 text-white font-bold text-sm'>
              {getInitials()}
            </div>
          )}
          <div className='hidden sm:block'>
            <span className='block text-gray-700 font-semibold'>
              {user ? `${user.firstName} ${user.lastName}` : '...'}
            </span>
            <span className='block text-sm text-gray-500'>Applicant</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
