import { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Users,
  Briefcase,
  PlusCircle,
  UserSquare2,
  NotebookPen,
} from 'lucide-react'
import { Menu as HMenu } from '@headlessui/react'
import { parseJwt } from '@/utils/parseJWT'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = parseJwt(token)
      setRole(decoded?.role || 'user')
    } else {
      setRole('user')
    }
  }, [])

  const userMenuItems = [
    {
      href: '/applicant/profile',
      label: 'My Profiles',
      icon: <UserSquare2 size={18} />,
    },
    {
      href: '/applicant/myjobs',
      label: 'My Jobs',
      icon: <Briefcase size={18} />,
    },
    {
      href: '/applicant/recommendation',
      label: 'Job Recommended',
      icon: <NotebookPen size={18} />,
    },
    {
      href: '/applicant/updateProfile',
      label: 'Update Profile',
      icon: <Users size={18} />,
    },
  ]

  const adminMenuItems = [
    {
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    { href: '/admin/users', label: 'Manage Users', icon: <Users size={18} /> },
    {
      href: '/admin/jobs',
      label: 'Manage Jobs',
      icon: <Briefcase size={18} />,
    },
    {
      href: '/admin/jobs/post',
      label: 'Post Job',
      icon: <PlusCircle size={18} />,
    },
  ]

  const employerMenuItems = [
    {
      href: '/employer/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      href: '/employer/jobs',
      label: 'My Job Posts',
      icon: <Briefcase size={18} />,
    },
    {
      href: '/employer/jobs/post',
      label: 'Post New Job',
      icon: <PlusCircle size={18} />,
    },
  ]

  const toggleSidebar = () => setIsOpen((s) => !s)

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const menuItems =
    role === 'admin'
      ? adminMenuItems
      : role === 'employer'
      ? employerMenuItems
      : userMenuItems

  // Precise active detection:
  // - For parent listing pages like /employer/jobs and /admin/jobs, highlight ONLY on exact match
  // - For other items, highlight on exact or sub-route match
  const isExactOnly = (href) =>
    href === '/employer/jobs' || href === '/admin/jobs'
  const isActive = (href) => {
    if (isExactOnly(href)) return router.pathname === href
    return router.pathname === href || router.pathname.startsWith(`${href}/`)
  }

  if (role === null) return null

  return (
    <div>
      {/* Mobile Toggle */}
      <button
        onClick={toggleSidebar}
        className='mt-16 lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-foundation-primary text-white shadow-md focus:outline-none focus:ring-2 focus:ring-white/50'
        aria-label='Toggle menu'
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Backdrop (mobile) */}
      {isOpen && (
        <button
          aria-label='Close menu'
          className='fixed inset-0 bg-black/40 z-40 lg:hidden'
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72
          bg-gradient-to-b from-foundation-primary via-foundation-blue to-foundation-blue
          text-white shadow-2xl ring-1 ring-white/10
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static`}
      >
        {/* Header / Brand */}
        <div className='px-6 pt-6 pb-4 border-b border-white/10'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center shadow'>
              <Briefcase size={18} />
            </div>
            <div>
              <div className='text-lg font-semibold leading-tight'>
                Beacon Nest
              </div>
              <div className='text-xs text-white/70 -mt-0.5 tracking-wide'>
                Recruitment Suite
              </div>
            </div>
          </div>

          {/* User Card */}
          <div className='mt-4 flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5'>
            <div className='h-9 w-9 rounded-full bg-white/20 flex items-center justify-center'>
              <Users size={16} />
            </div>
            <div className='flex-1'>
              <div className='text-sm font-medium'>Signed in</div>
              <div className='text-xs text-white/70 capitalize'>{role}</div>
            </div>
            <span className='inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide'>
              {role === 'admin'
                ? 'ADMIN'
                : role === 'employer'
                ? 'EMPLOYER'
                : 'APPLICANT'}
            </span>
          </div>
        </div>

        {/* Nav */}
        <HMenu
          as='nav'
          className='h-[calc(100%-172px)] overflow-y-auto px-3 py-4'
        >
          <ul className='space-y-1'>
            {menuItems.map(({ href, label, icon }) => {
              const active = isActive(href)
              return (
                <HMenu.Item key={href} as={Fragment}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setIsOpen(false)}
                    className={`
                      group relative flex items-center gap-3 rounded-xl px-4 py-3
                      focus:outline-none focus:ring-2 focus:ring-white/40
                      transition
                      ${
                        active
                          ? 'bg-white/15 shadow-inner'
                          : 'hover:bg-white/10'
                      }
                    `}
                  >
                    {/* Active indicator bar */}
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r
                        ${
                          active
                            ? 'bg-white'
                            : 'bg-transparent group-hover:bg-white/60'
                        }`}
                      aria-hidden
                    />
                    <span
                      className={`grid place-items-center h-9 w-9 rounded-lg
                        ${
                          active
                            ? 'bg-white/20'
                            : 'bg-white/10 group-hover:bg-white/15'
                        }
                      `}
                    >
                      {icon}
                    </span>
                    <span className='text-sm font-medium'>{label}</span>
                  </Link>
                </HMenu.Item>
              )
            })}

            {/* Divider */}
            <li className='my-2 border-t border-white/10' />

            {/* Logout */}
            <HMenu.Item as={Fragment}>
              <button
                onClick={handleLogout}
                className='group relative w-full text-left flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 transition'
              >
                <span className='grid place-items-center h-9 w-9 rounded-lg bg-white/10 group-hover:bg-white/15'>
                  <LogOut size={18} />
                </span>
                <span className='text-sm font-medium'>Logout</span>
              </button>
            </HMenu.Item>
          </ul>
        </HMenu>

        {/* Footer */}
        <div className='absolute bottom-0 inset-x-0 px-6 py-3 border-t border-white/10 text-[11px] text-white/70'>
          <div className='flex items-center justify-between'>
            <span>v1.0</span>
            <span className='hidden sm:inline'>
              © {new Date().getFullYear()} Beacon Nest
            </span>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default Sidebar
