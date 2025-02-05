import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'dashboard.svg' },
    { href: '/candidates', label: 'Candidates', icon: 'candidates.svg' },
    { href: '/recruiters', label: 'Recruiters', icon: 'recruiters.svg' },
    { href: '/joblists', label: 'My Jobs', icon: 'jobs.svg' },
    { href: '/tasks', label: 'Tasks List', icon: 'tasks.svg' },
    { href: '/profile', label: 'My Profiles', icon: 'profiles.svg' },
    { href: '/resume', label: 'CV Manage', icon: 'cv-manage.svg' },
    { href: '/settings', label: 'Setting', icon: 'settings.svg' },
    { href: '/auth', label: 'Authentication', icon: 'authentication.svg' },
    { href: '/logout', label: 'Logout', icon: 'logout.svg' },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-500 text-white shadow-md mt-20'
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`bg-gradient-to-br from-blue-600 to-blue-800 text-white w-64 h-screen fixed top-0 left-0 p-6 z-40 transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:mt-0`}
      >
        <nav>
          <ul className='space-y-4 mt-28 lg:mt-0'>
            {menuItems.map(({ href, label, icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className='flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-blue-500 hover:shadow-md'
                >
                  <img
                    src={`/assets/imgs/page/dashboard/${icon}`}
                    alt={label}
                    className='h-6'
                  />
                  <span className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
                    {label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
