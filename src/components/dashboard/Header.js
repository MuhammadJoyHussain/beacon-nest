import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Bell, Menu, X } from 'lucide-react'
import api from '@/utils/api'
import authApi from '@/utils/authApi'

const Header = () => {
  const [user, setUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const { data } = await authApi.get('/auth/profile', {
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
          <div className='h-9 w-9 bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white font-bold flex items-center justify-center rounded-full text-xl'>
            B
          </div>
          <span className='text-xl font-semibold text-[#3D52A0]'>
            Beacon Nest
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className='hidden md:flex items-center space-x-6'>
          {user ? (
            <>
              <button className='relative text-[#3D52A0] hover:text-[#7091E6] transition-colors'>
                <Bell size={22} />
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>
                  3
                </span>
              </button>
              <Link
                href='/applicant/profile'
                className='text-[#3D52A0] text-sm hover:text-[#7091E6] transition-colors'
              >
                <div className='flex items-center space-x-3'>
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt='Profile'
                      className='h-10 w-10 rounded-full object-cover border'
                    />
                  ) : (
                    <div className='h-10 w-10 rounded-full bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white flex items-center justify-center font-bold text-sm'>
                      {getInitials()}
                    </div>
                  )}
                  <div className='text-left'>
                    <p className='font-semibold text-[#3D52A0] text-sm'>
                      {user.firstName} {user.lastName}
                    </p>
                    {user.role === 'admin' ? (
                      <p className='text-xs text-[#7091E6]'>Recruiter</p>
                    ) : user.role === 'employer' ? (
                      <p className='text-xs text-[#7091E6]'>Employer</p>
                    ) : (
                      <p className='text-xs text-[#7091E6]'>Applicant</p>
                    )}
                  </div>
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link
                href='/login'
                className='text-[#3D52A0] font-semibold hover:text-[#7091E6] transition-colors'
              >
                Login
              </Link>
              <Link
                href='/register'
                className='text-[#3D52A0] font-semibold hover:text-[#7091E6] transition-colors'
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className='md:hidden text-[#3D52A0] hover:text-[#7091E6] transition-colors'
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label='Toggle Menu'
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className='md:hidden bg-white border-t shadow-sm'>
          <div className='flex flex-col p-4 space-y-3'>
            <Link
              href='/'
              className='text-[#3D52A0] hover:text-[#7091E6] transition-colors'
            >
              Home
            </Link>

            {user ? (
              <Link
                href='/applicant/profile'
                className='text-[#3D52A0] hover:text-[#7091E6] transition-colors'
              >
                My Profile
                <div className='flex items-center space-x-3 mt-1'>
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      className='h-10 w-10 rounded-full border object-cover'
                      alt='Profile'
                    />
                  ) : (
                    <div className='h-10 w-10 rounded-full bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white flex items-center justify-center font-bold text-sm'>
                      {getInitials()}
                    </div>
                  )}
                  <span className='text-[#3D52A0] font-medium'>
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              </Link>
            ) : (
              <>
                <Link
                  href='/login'
                  className='text-[#3D52A0] hover:text-[#7091E6] transition-colors'
                >
                  Login
                </Link>
                <Link
                  href='/register'
                  className='text-[#3D52A0] hover:text-[#7091E6] transition-colors'
                >
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
