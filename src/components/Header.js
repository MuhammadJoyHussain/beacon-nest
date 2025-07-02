'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className='bg-white shadow-md fixed w-full z-10'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='text-xl font-bold text-green-700'>
            <Link href='/'>Beacon Nest</Link>
          </div>

          {/* Desktop Links */}
          <div className='hidden md:flex space-x-6 items-center'>
            <Link href='/login' className='text-gray-700 hover:text-blue-600'>
              Login
            </Link>
            <Link
              href='/register'
              className='text-gray-700 hover:text-blue-600'
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='text-gray-700 focus:outline-none'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                {isOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className='md:hidden px-4 pb-4'>
          <Link
            href='/login'
            className='block py-2 text-gray-700 hover:text-blue-600'
          >
            Login
          </Link>
          <Link
            href='/register'
            className='block py-2 text-gray-700 hover:text-blue-600'
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  )
}
