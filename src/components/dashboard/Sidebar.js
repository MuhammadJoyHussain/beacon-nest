import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Menu as HMenu } from '@headlessui/react'
import { useRouter } from 'next/router'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const menuItems = [
    { href: '/profile', label: 'My Profiles', icon: 'profiles.svg' },
    // { href: '/dashboard', label: 'Dashboard', icon: 'dashboard.svg' },
    // { href: '/candidates', label: 'Candidates', icon: 'candidates.svg' },
    // { href: '/recruiters', label: 'Recruiters', icon: 'recruiters.svg' },
    { href: '/joblists', label: 'My Jobs', icon: 'jobs.svg' },
    // { href: '/tasks', label: 'Tasks List', icon: 'tasks.svg' },
    { href: '/updateProfile', label: 'Update Profile', icon: 'cv-manage.svg' },
    // { href: '/settings', label: 'Setting', icon: 'settings.svg' },
    // { href: '/auth', label: 'Authentication', icon: 'authentication.svg' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className='mt-16 lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-green-600 text-white shadow-md'
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden'
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none lg:bg-gradient-to-br from-green-600 to-green-800`}
      >
        <div className='h-full p-6 overflow-y-auto lg:text-white'>
          {/* Brand/Logo */}
          <div className='mb-10 text-center font-bold text-2xl text-green-700 lg:text-white'>
            <span className='hidden lg:inline'>RecruitPro</span>
          </div>

          {/* Menu */}
          <HMenu as='nav' className='space-y-2'>
            {menuItems.map(({ href, label, icon }) => {
              const isActive = router.pathname === href

              return (
                <HMenu.Item key={href} as='div'>
                  {({ active }) => {
                    const baseClasses =
                      'flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition'
                    const activeClasses = isActive
                      ? 'bg-green-700 text-white shadow-md'
                      : active
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700 hover:bg-green-100 lg:hover:bg-green-500 lg:hover:text-white'

                    return (
                      <Link
                        href={href}
                        className={`${baseClasses} ${activeClasses}`}
                      >
                        <img
                          src={`/assets/imgs/page/dashboard/${icon}`}
                          alt={label}
                          className='h-5 w-5'
                        />
                        <span>{label}</span>
                      </Link>
                    )
                  }}
                </HMenu.Item>
              )
            })}

            {/* Logout */}
            <HMenu.Item as='div'>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left cursor-pointer transition ${
                    active
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700 hover:bg-green-100 lg:hover:bg-green-500 lg:hover:text-white'
                  }`}
                >
                  <img
                    src={`/assets/imgs/page/dashboard/logout.svg`}
                    alt='Logout'
                    className='h-5 w-5'
                  />
                  <span>Logout</span>
                </button>
              )}
            </HMenu.Item>
          </HMenu>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
