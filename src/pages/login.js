import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '@/components/dashboard/Header'
import Footer from '@/components/Footer'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Link from 'next/link'
import authApi from '@/utils/authApi'
import { Toaster, toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Mail, Lock, ChevronRight } from 'lucide-react'
import { parseJwt } from '@/utils/parseJWT'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const router = useRouter()
  const { redirect } = router.query || {}
  const DOMAIN = '@beaconnest.com'

  const roleHome = (role) => {
    if (role === 'admin') return '/admin/profile'
    if (role === 'employer') return '/employer/profile'
    return '/applicant/profile'
  }

  useEffect(() => {
    if (!formData.email) {
      setFormData((p) => ({ ...p, email: DOMAIN }))
    }
  }, [])

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) return
    try {
      const payload = parseJwt(token) || {}
      const target = redirect || roleHome(payload.role)
      router.replace(target)
    } catch {
      router.replace(redirect || '/applicant/profile')
    }
  }, [router, redirect])

  const placeCaretBeforeDomain = () => {
    const el = document.getElementById('email-input')
    if (!el) return
    const pos = (formData.email || '').indexOf('@')
    if (pos < 0) return
    requestAnimationFrame(() => {
      el.focus()
      if (typeof el.setSelectionRange === 'function')
        el.setSelectionRange(pos, pos)
    })
  }

  const handleEmailChange = (e) => {
    let v = e.target.value.toLowerCase()
    const at = v.indexOf('@')
    if (at >= 0) v = v.slice(0, at)
    setFormData((prev) => ({ ...prev, email: `${v}${DOMAIN}` }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'email') return handleEmailChange(e)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const localPart = (formData.email || '').split('@')[0]
    if (!localPart || !formData.password) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
      toast.error('Please enter your email and password.')
      return
    }
    try {
      setLoading(true)
      const { data } = await authApi.post('/auth/login', {
        ...formData,
        email: `${localPart}${DOMAIN}`,
      })
      localStorage.setItem('token', data.token)
      let role = 'user'
      try {
        role = (parseJwt(data.token) || {}).role || 'user'
      } catch {}
      const target = redirect || roleHome(role)
      toast.success('Login successful! Redirecting...')
      setTimeout(() => router.push(target), 900)
    } catch (err) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
      toast.error(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const shellIn = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 140, damping: 16 },
    },
  }
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  }
  const item = {
    hidden: { y: 12, opacity: 0, scale: 0.98 },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 180, damping: 18 },
    },
  }

  return (
    <div className='min-h-screen relative overflow-hidden text-[#3D52A0]'>
      <div className='absolute inset-0 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#E9EEFF,transparent_60%),radial-gradient(900px_500px_at_110%_10%,#FFF7F2,transparent_60%),radial-gradient(900px_700px_at_50%_120%,#F2FFFB,transparent_60%)]' />
      <div className='pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#7091E6]/30 blur-3xl animate-blob' />
      <div className='pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#3D52A0]/20 blur-3xl animate-blob animation-delay-2000' />
      <div className='pointer-events-none absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-[#B8C1EC]/20 blur-3xl animate-blob animation-delay-4000' />

      <Header />
      <Toaster position='top-right' />

      <main className='relative pt-20 pb-16 px-4'>
        <motion.div
          variants={shellIn}
          initial='hidden'
          animate='show'
          className={`max-w-5xl mx-auto grid md:grid-cols-2 rounded-3xl shadow-xl ring-1 ring-black/5 overflow-hidden backdrop-blur-xl border border-white/40 bg-white/70 ${
            shake ? 'animate-shake' : ''
          }`}
        >
          <div className='hidden md:block relative p-10 bg-gradient-to-br from-[#E9EEFF]/80 via-white/60 to-[#FFF7F2]/80'>
            <div className='absolute inset-0 opacity-30 pointer-events-none'>
              <svg width='100%' height='100%'>
                <defs>
                  <pattern
                    id='grid-login'
                    width='32'
                    height='32'
                    patternUnits='userSpaceOnUse'
                  >
                    <path
                      d='M 32 0 L 0 0 0 32'
                      fill='none'
                      stroke='#3D52A0'
                      strokeOpacity='0.08'
                      strokeWidth='1'
                    />
                  </pattern>
                </defs>
                <rect width='100%' height='100%' fill='url(#grid-login)' />
              </svg>
            </div>
            <div className='relative z-10 h-full flex flex-col justify-between'>
              <div className='space-y-3'>
                <div className='text-3xl font-extrabold text-[#3D52A0] leading-tight'>
                  Welcome back
                </div>
                <div className='text-sm text-[#3D52A0]/80'>
                  Access your profile, applications, and tailored matches.
                </div>
              </div>
              <ul className='mt-8 space-y-3 text-sm text-[#3D52A0]/80'>
                <li className='flex items-start gap-3'>
                  <span className='mt-1 h-2 w-2 rounded-full bg-[#7091E6]' />
                  Smooth sign-in with clean UI
                </li>
                <li className='flex items-start gap-3'>
                  <span className='mt-1 h-2 w-2 rounded-full bg-[#3D52A0]' />
                  Secure and privacy-first
                </li>
                <li className='flex items-start gap-3'>
                  <span className='mt-1 h-2 w-2 rounded-full bg-[#B8C1EC]' />
                  Subtle motion and feedback
                </li>
              </ul>
            </div>
          </div>

          <motion.form
            variants={container}
            initial='hidden'
            animate='show'
            onSubmit={handleSubmit}
            aria-busy={loading}
            className='p-6 md:p-10 bg-white/80'
          >
            <motion.div variants={item} className='mb-6'>
              <div className='text-3xl font-extrabold text-[#3D52A0] text-center'>
                Login
              </div>
              <div className='text-sm text-[#3D52A0]/70 text-center mt-2'>
                Enter your details to continue
              </div>
            </motion.div>

            <motion.div variants={item} className='space-y-5'>
              <Input
                id='email-input'
                label='Email*'
                name='email'
                type='text'
                inputMode='email'
                autoComplete='email'
                placeholder={`name${DOMAIN}`}
                value={formData.email}
                onChange={handleChange}
                onFocus={placeCaretBeforeDomain}
                onClick={placeCaretBeforeDomain}
                leftIcon={<Mail className='h-4 w-4' />}
              />
              <Input
                label='Password*'
                name='password'
                type='password'
                placeholder='••••••••'
                value={formData.password}
                onChange={handleChange}
                leftIcon={<Lock className='h-4 w-4' />}
              />
            </motion.div>

            <motion.div
              variants={item}
              className='mt-2 flex items-center justify-between text-sm'
            >
              <Checkbox
                name='remember'
                label='Remember me'
                onChange={() => {}}
              />
              <Link
                href='/forgot-password'
                className='text-[#7091E6] hover:text-[#3D52A0] underline'
              >
                Forgot password?
              </Link>
            </motion.div>

            <motion.div
              variants={item}
              className='mt-6'
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type='submit'
                className='w-full'
                loading={loading}
                rightIcon={<ChevronRight className='h-4 w-4' />}
              >
                {loading ? 'Logging in…' : 'Login'}
              </Button>
            </motion.div>

            <motion.p
              variants={item}
              className='mt-6 text-center text-[#3D52A0] text-sm'
            >
              Don&apos;t have an account?{' '}
              <Link
                href={`/register${redirect ? `?redirect=${redirect}` : ''}`}
                className='text-[#7091E6] font-semibold underline hover:text-[#3D52A0]'
              >
                Register
              </Link>
            </motion.p>
          </motion.form>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
