import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Bell, Menu, X } from 'lucide-react'
import api from '@/utils/api'

const Header = () => {
  const [user, setUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
        localStorage.removeItem('token')
        router.push('/login')
      }
    }

    fetchUser()
  }, [router])

  const getInitials = () => {
    if (!user) return ''
    return (
      (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '')
    ).toUpperCase()
  }

  return (
    <header className='bg-white shadow-md fixed top-0 left-0 w-full z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center'>
        {/* Logo */}
        <Link href='/' className='flex items-center space-x-2'>
          <div className='h-9 w-9 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold flex items-center justify-center rounded-full text-xl'>
            B
          </div>
          <span className='text-xl font-semibold text-gray-800'>
            Beacon Nest
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className='hidden md:flex items-center space-x-6'>
          <button className='relative text-gray-700 hover:text-blue-500'>
            <Bell size={22} />
            <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>
              3
            </span>
          </button>

          {user ? (
            <Link href='/profile' className='text-blue-500 text-sm'>
              <div className='flex items-center space-x-3'>
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt='Profile'
                    className='h-10 w-10 rounded-full object-cover border'
                  />
                ) : (
                  <div className='h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm'>
                    {getInitials()}
                  </div>
                )}
                <div className='text-left'>
                  <p className='font-semibold text-gray-800 text-sm'>
                    {user.firstName} {user.lastName}
                  </p>
                  {user.role === 'admin' ? (
                    <p className='text-xs text-gray-500'>Recruiter</p>
                  ) : (
                    <p className='text-xs text-gray-500'>Applicant</p>
                  )}
                </div>
              </div>
            </Link>
          ) : (
            <>
              <Link href='/login' className='text-gray-700 font-semibold'>
                Login
              </Link>
              <Link href='/register' className='text-gray-700 font-semibold'>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className='md:hidden text-gray-700'
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className='md:hidden bg-white border-t shadow-sm'>
          <div className='flex flex-col p-4 space-y-3'>
            <Link href='/' className='text-gray-700 hover:text-blue-500'>
              Home
            </Link>

            {user ? (
              <Link href='/profile' className='text-gray-700'>
                My Profile
                <div className='flex items-center space-x-3'>
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      className='h-10 w-10 rounded-full border object-cover'
                      alt='Profile'
                    />
                  ) : (
                    <div className='h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm'>
                      {getInitials()}
                    </div>
                  )}
                  <span className='text-gray-800 font-medium'>
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              </Link>
            ) : (
              <>
                <Link href='/login' className='text-gray-700'>
                  Login
                </Link>
                <Link href='/register' className='text-gray-700'>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
