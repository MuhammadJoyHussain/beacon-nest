import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Bell,
  Menu,
  X,
  ChevronDown,
  Search,
  LogOut,
  User as UserIcon,
  Sparkles,
  Briefcase,
  Plus,
} from 'lucide-react'
import authApi from '@/utils/authApi'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [user, setUser] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const notifRef = useRef(null)
  const profileRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) return
    authApi
      .get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setUser(data))
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
  }, [router.asPath])

  useEffect(() => {
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false)
    }
    const onScroll = () => setScrolled(window.scrollY > 8)
    document.addEventListener('mousedown', onClick)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => {
      document.removeEventListener('mousedown', onClick)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const getInitials = () =>
    ((user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')).toUpperCase()
  const isActive = (href) => router.pathname === href || router.asPath === href
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  const nav = [
    { href: '/', label: 'Home' },
    { href: '/career', label: 'Jobs' },
    { href: '/about', label: 'About' },
  ]

  const shell = {
    hidden: { opacity: 0, y: -10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 22 },
    },
  }

  return (
    <header className='fixed top-0 left-0 w-full z-50'>
      <div className='absolute inset-0 -z-10 bg-gradient-to-b from-white/60 to-transparent' />
      <motion.div
        variants={shell}
        initial='hidden'
        animate='show'
        className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
      >
        <div
          className={`mt-3 px-4 py-2.5 rounded-2xl transition-all ${
            scrolled
              ? 'backdrop-blur bg-white/80 ring-1 ring-black/5 border border-white/40 shadow-sm'
              : 'backdrop-blur bg-white/60 ring-1 ring-black/5 border border-white/40'
          }`}
        >
          <div className='flex items-center justify-between gap-3'>
            <Link href='/' className='flex items-center gap-2'>
              <div className='h-9 w-9 rounded-xl bg-gradient-to-r from-[#3D52A0] to-[#7091E6] grid place-items-center text-white font-bold text-lg'>
                B
              </div>
              <span className='text-lg md:text-xl font-extrabold tracking-tight text-[#1B2559]'>
                Beacon Nest
              </span>
            </Link>

            <nav className='hidden md:flex items-center gap-1 relative'>
              <div className='flex items-center gap-1'>
                {nav.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition relative ${
                      isActive(n.href)
                        ? 'text-[#1B2559]'
                        : 'text-[#3D52A0] hover:bg-white'
                    }`}
                  >
                    {n.label}
                    {isActive(n.href) && (
                      <motion.span
                        layoutId='active-underline'
                        className='absolute left-2 right-2 -bottom-0.5 h-[2px] rounded-full bg-[#7091E6]'
                      />
                    )}
                  </Link>
                ))}
              </div>
            </nav>

            <div className='hidden md:flex items-center gap-2'>
              <button
                onClick={() => setSearchOpen(true)}
                className='h-10 px-3 rounded-xl bg-white hover:bg-white text-[#3D52A0] ring-1 ring-black/5 border border-white/40 flex items-center gap-2'
              >
                <Search size={16} />
                <span className='text-sm'>Search</span>
              </button>

              {user ? (
                <>
                  <div ref={notifRef} className='relative'>
                    <button
                      onClick={() => {
                        setNotifOpen((s) => !s)
                        setProfileOpen(false)
                      }}
                      className='relative h-10 w-10 rounded-xl grid place-items-center text-[#3D52A0] hover:bg-white ring-1 ring-black/5 border border-white/40'
                    >
                      <Bell size={18} />
                      <span className='absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 grid place-items-center'>
                        3
                      </span>
                    </button>
                    <AnimatePresence>
                      {notifOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 8, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{
                            type: 'spring',
                            stiffness: 220,
                            damping: 18,
                          }}
                          className='absolute right-0 mt-1 w-80 rounded-2xl bg-white/90 backdrop-blur ring-1 ring-black/5 border border-white/40 shadow-xl p-3'
                        >
                          <div className='text-sm font-semibold text-[#1B2559] px-1'>
                            Notifications
                          </div>
                          <ul className='mt-2 space-y-2 text-sm'>
                            <li className='rounded-xl px-3 py-2 bg-[#F7F8FF]'>
                              Your application was viewed
                            </li>
                            <li className='rounded-xl px-3 py-2 bg-[#FFF7F2]'>
                              New role matches your profile
                            </li>
                            <li className='rounded-xl px-3 py-2 bg-[#F2FFFB]'>
                              Interview reminder tomorrow
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div ref={profileRef} className='relative'>
                    <button
                      onClick={() => {
                        setProfileOpen((s) => !s)
                        setNotifOpen(false)
                      }}
                      className='flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-xl hover:bg-white ring-1 ring-transparent'
                    >
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt='Profile'
                          className='h-9 w-9 rounded-xl object-cover ring-1 ring-black/5'
                        />
                      ) : (
                        <div className='h-9 w-9 rounded-xl bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white grid place-items-center text-sm font-bold'>
                          {getInitials()}
                        </div>
                      )}
                      <div className='text-left'>
                        <div className='text-sm font-semibold leading-4 text-[#1B2559]'>
                          {user.firstName} {user.lastName}
                        </div>
                        <div className='text-[11px] text-[#3D52A0]/70'>
                          {user.role === 'admin' ? 'Recruiter' : 'Applicant'}
                        </div>
                      </div>
                      <ChevronDown size={16} className='text-[#3D52A0]' />
                    </button>
                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 8, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{
                            type: 'spring',
                            stiffness: 220,
                            damping: 18,
                          }}
                          className='absolute right-0 mt-1 w-64 rounded-2xl bg-white/90 backdrop-blur ring-1 ring-black/5 border border-white/40 shadow-xl p-2'
                        >
                          <Link
                            href='/applicant/profile'
                            className='flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white'
                          >
                            <UserIcon size={16} /> Profile
                          </Link>
                          <button
                            onClick={logout}
                            className='w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white text-left'
                          >
                            <LogOut size={16} /> Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    href={
                      user.role === 'admin' ? '/recruiter/post' : '/register'
                    }
                    className='hidden lg:inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#3D52A0] via-[#5F79D4] to-[#7091E6] px-4 py-2 text-white text-sm font-semibold shadow hover:shadow-md active:scale-[.99]'
                  >
                    <Plus size={16} />{' '}
                    {user.role === 'admin' ? 'Post a Job' : 'Create Account'}
                  </Link>
                </>
              ) : (
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setSearchOpen(true)}
                    className='h-10 w-10 rounded-xl grid place-items-center bg-white text-[#3D52A0] ring-1 ring-black/5 border border-white/40 md:hidden'
                  >
                    <Search size={16} />
                  </button>
                  <Link
                    href='/login'
                    className='px-4 py-2 rounded-xl text-sm font-semibold text-[#3D52A0] hover:bg-white ring-1 ring-black/5 border border-white/40'
                  >
                    Login
                  </Link>
                  <Link
                    href='/register'
                    className='inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#3D52A0] via-[#5F79D4] to-[#7091E6] px-4 py-2 text-white text-sm font-semibold shadow hover:shadow-md active:scale-[.99]'
                  >
                    <Briefcase size={16} /> Get Started
                  </Link>
                </div>
              )}
            </div>

            <button
              className='md:hidden h-10 w-10 rounded-xl grid place-items-center text-[#3D52A0] hover:bg-white ring-1 ring-black/5 border border-white/40'
              onClick={() => setMobileOpen((s) => !s)}
              aria-label='Toggle Menu'
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className='md:hidden px-4 sm:px-6 lg:px-8'
          >
            <div className='mt-2 rounded-2xl bg-white/90 backdrop-blur ring-1 ring-black/5 border border-white/40 shadow-xl px-4 py-4'>
              <div className='flex items-center gap-2 mb-3'>
                <Search size={16} className='text-[#3D52A0]' />
                <input
                  placeholder='Search roles, companies…'
                  className='flex-1 bg-transparent outline-none text-sm text-[#1B2559]'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      router.push(
                        `/career?search=${encodeURIComponent(
                          e.currentTarget.value
                        )}`
                      )
                      setMobileOpen(false)
                    }
                  }}
                />
              </div>
              <nav className='flex flex-col gap-1'>
                {nav.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2 rounded-xl ${
                      isActive(n.href)
                        ? 'bg-[#E9EEFF] text-[#1B2559]'
                        : 'text-[#3D52A0] hover:bg-white'
                    }`}
                  >
                    {n.label}
                  </Link>
                ))}
                {!user ? (
                  <>
                    <Link
                      href='/login'
                      onClick={() => setMobileOpen(false)}
                      className='px-3 py-2 rounded-xl text-[#3D52A0] hover:bg-white'
                    >
                      Login
                    </Link>
                    <Link
                      href='/register'
                      onClick={() => setMobileOpen(false)}
                      className='px-3 py-2 rounded-xl text-[#3D52A0] hover:bg-white'
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href='/applicant/profile'
                      onClick={() => setMobileOpen(false)}
                      className='px-3 py-2 rounded-xl text-[#3D52A0] hover:bg-white'
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false)
                        logout()
                      }}
                      className='text-left px-3 py-2 rounded-xl text-[#3D52A0] hover:bg-white'
                    >
                      Logout
                    </button>
                  </>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className='fixed inset-0 z-[60] grid place-items-start pt-24 bg-black/40 p-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 8, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 8, scale: 0.98, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className='w-full max-w-2xl rounded-2xl bg-white/90 backdrop-blur ring-1 ring-black/5 border border-white/40 shadow-2xl p-4'
            >
              <div className='flex items-center gap-2'>
                <Search size={18} className='text-[#3D52A0]' />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      router.push(`/career?search=${encodeURIComponent(query)}`)
                      setSearchOpen(false)
                    }
                  }}
                  placeholder='Search roles, companies, locations…'
                  className='flex-1 bg-transparent outline-none text-[#1B2559] text-sm'
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className='h-9 w-9 grid place-items-center rounded-xl hover:bg-slate-100'
                >
                  <X size={18} />
                </button>
              </div>
              <div className='mt-3 text-xs text-[#3D52A0]/70'>
                Try “Frontend London”, “Remote designer”, “NHS nurse”…
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
