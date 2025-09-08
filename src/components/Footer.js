import React, { useState } from 'react'
import Link from 'next/link'
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  ArrowUpRight,
} from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const year = new Date().getFullYear()

  const submit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setDone(true)
    setEmail('')
    setTimeout(() => setDone(false), 3000)
  }

  return (
    <footer className='relative mt-16 text-[#EDE8F5]'>
      <div className='absolute inset-0 bg-gradient-to-tr from-[#2F3D82] via-[#3D52A0] to-[#7091E6]' />
      <div className='pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-black/10 blur-3xl' />

      <div className='relative max-w-7xl mx-auto px-6 py-14'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
          <div>
            <div className='flex items-center gap-3'>
              <div className='h-10 w-10 rounded-xl bg-gradient-to-r from-white/90 to-white/60 text-[#2F3D82] grid place-items-center font-bold'>
                B
              </div>
              <span className='text-xl font-extrabold tracking-tight'>
                Beacon Nest
              </span>
            </div>
            <p className='mt-3 text-sm/6 text-[#D9D2EB] max-w-xs'>
              Empowering connections between talent and opportunity through
              thoughtful, people-first hiring.
            </p>
            <div className='mt-5 flex items-center gap-3'>
              <a
                aria-label='Facebook'
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='h-10 w-10 grid place-items-center rounded-xl bg-white/10 hover:bg-white/15 ring-1 ring-white/15'
              >
                <Facebook size={18} />
              </a>
              <a
                aria-label='Twitter'
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='h-10 w-10 grid place-items-center rounded-xl bg-white/10 hover:bg-white/15 ring-1 ring-white/15'
              >
                <Twitter size={18} />
              </a>
              <a
                aria-label='Instagram'
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='h-10 w-10 grid place-items-center rounded-xl bg-white/10 hover:bg-white/15 ring-1 ring-white/15'
              >
                <Instagram size={18} />
              </a>
              <a
                aria-label='LinkedIn'
                href='https://linkedin.com'
                target='_blank'
                rel='noopener noreferrer'
                className='h-10 w-10 grid place-items-center rounded-xl bg-white/10 hover:bg-white/15 ring-1 ring-white/15'
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className='text-white text-lg font-semibold'>Company</h4>
            <ul className='mt-3 space-y-2 text-[#D9D2EB]'>
              <li>
                <Link href='/about' className='hover:text-white transition'>
                  About
                </Link>
              </li>
              <li>
                <Link href='/career' className='hover:text-white transition'>
                  Jobs
                </Link>
              </li>
              <li>
                <Link href='/contact' className='hover:text-white transition'>
                  Contact
                </Link>
              </li>
              <li>
                <Link href='/' className='hover:text-white transition'>
                  Home
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='text-white text-lg font-semibold'>Resources</h4>
            <ul className='mt-3 space-y-2 text-[#D9D2EB]'>
              <li>
                <Link href='/blog' className='hover:text-white transition'>
                  Blog
                </Link>
              </li>
              <li>
                <Link href='/guides' className='hover:text-white transition'>
                  Guides
                </Link>
              </li>
              <li>
                <Link href='/faq' className='hover:text-white transition'>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href='/support' className='hover:text-white transition'>
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div className='lg:pl-6'>
            <h4 className='text-white text-lg font-semibold'>Newsletter</h4>
            <p className='mt-3 text-sm text-[#D9D2EB]'>
              Get curated roles and hiring tips in your inbox.
            </p>
            <form onSubmit={submit} className='mt-4'>
              <label htmlFor='newsletter' className='sr-only'>
                Email
              </label>
              <div className='flex items-center gap-2'>
                <div className='relative flex-1'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-white/70'>
                    <Mail size={16} />
                  </span>
                  <input
                    id='newsletter'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='you@example.com'
                    className='w-full rounded-xl bg-white/15 placeholder-white/60 text-white pl-10 pr-3 py-3 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/40'
                    required
                  />
                </div>
                <button
                  type='submit'
                  className='inline-flex items-center gap-2 rounded-xl bg-white text-[#2F3D82] font-semibold px-4 py-3 hover:shadow active:scale-[.98] transition'
                >
                  Join <ArrowUpRight size={16} />
                </button>
              </div>
              <div
                className={`mt-2 text-xs ${
                  done ? 'text-emerald-200' : 'text-white/70'
                }`}
              >
                {done ? 'Thanks for subscribing!' : 'We respect your privacy.'}
              </div>
            </form>
          </div>
        </div>

        <div className='mt-10 h-px w-full bg-white/10' />

        <div className='mt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[#D9D2EB]'>
          <p>© {year} Beacon Nest. All rights reserved.</p>
          <div className='flex items-center gap-4'>
            <Link href='/privacy' className='hover:text-white transition'>
              Privacy
            </Link>
            <Link href='/terms' className='hover:text-white transition'>
              Terms
            </Link>
            <Link href='/cookies' className='hover:text-white transition'>
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
