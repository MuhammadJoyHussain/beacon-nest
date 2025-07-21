import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Menu as HMenu } from '@headlessui/react'
import { useRouter } from 'next/router'

function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1]
    const payload = atob(base64Payload)
    return JSON.parse(payload)
  } catch (e) {
    console.error('Failed to parse JWT', e)
    return null
  }
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = parseJwt(token)
      setRole(decoded?.role || 'user')
    }
  }, [])

  const userMenuItems = [
    { href: '/applicant/profile', label: 'My Profiles', icon: 'profiles.svg' },
    { href: '/applicant/myjobs', label: 'My Jobs', icon: 'jobs.svg' },
    {
      href: '/applicant/recommendation',
      label: 'Job Recommended',
      icon: 'jobs.svg',
    },
    {
      href: '/applicant/updateProfile',
      label: 'Update Profile',
      icon: 'cv-manage.svg',
    },
  ]

  const adminMenuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard.svg' },
    { href: '/admin/users', label: 'Manage Users', icon: 'profiles.svg' },
    { href: '/admin/jobs', label: 'Manage Jobs', icon: 'jobs.svg' },
    { href: '/admin/jobs/post', label: 'Post Job', icon: 'jobs.svg' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const toggleSidebar = () => setIsOpen(!isOpen)

  const menuItems = role === 'admin' ? adminMenuItems : userMenuItems

  if (role === null) return null

  return (
    <div>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className='mt-16 lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-foundation-primary text-white shadow-md'
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden'
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-br from-foundation-primary to-foundation-blue shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static`}
      >
        <div className='h-full p-6 overflow-y-auto text-white'>
          <HMenu as='nav' className='space-y-2'>
            {menuItems.map(({ href, label, icon }) => {
              const isActive = router.pathname === href

              return (
                <HMenu.Item key={href} as='div'>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition cursor-pointer ${
                      isActive ? 'bg-white bg-opacity-20 font-bold' : ''
                    }`}
                  >
                    <img
                      src={`/assets/imgs/page/dashboard/${icon}`}
                      alt={label}
                      className='h-5 w-5'
                    />
                    <span>{label}</span>
                  </Link>
                </HMenu.Item>
              )
            })}

            {/* Logout */}
            <HMenu.Item as='div'>
              <button
                onClick={handleLogout}
                className='flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left transition bg-opacity-0 hover:bg-white hover:bg-opacity-10'
              >
                <img
                  src={`/assets/imgs/page/dashboard/logout.svg`}
                  alt='Logout'
                  className='h-5 w-5'
                />
                <span>Logout</span>
              </button>
            </HMenu.Item>
          </HMenu>
        </div>
      </aside>
    </div>
  )
}

export default Sidebar
