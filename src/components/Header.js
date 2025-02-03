import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className='sticky top-0 bg-white shadow-md z-50 w-full'>
      <div className='container mx-auto flex items-center justify-between p-4'>
        {/* Logo */}
        <div className='flex items-center'>
          <Link href='/'>
            <h1 className='text-4xl text-blue-400'>Beacon Nest</h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className='hidden md:flex space-x-6'>
          <Link href='/' className='hover:text-blue-500'>
            Home
          </Link>
          <Link href='/jobs' className='hover:text-blue-500'>
            Jobs
          </Link>
          <Link href='/contact' className='hover:text-blue-500'>
            Contact
          </Link>
        </nav>

        {/* Sign In & Register */}
        <div className='hidden md:flex space-x-4 items-center'>
          <Link href='/register' className='text-blue-600 underline '>
            Register
          </Link>
          <Link
            href='/signin'
            className='bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700'
          >
            Sign in
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden flex flex-col space-y-1.5'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className='w-6 h-0.5 bg-black'></span>
          <span className='w-6 h-0.5 bg-black'></span>
          <span className='w-6 h-0.5 bg-black'></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='md:hidden bg-white shadow-lg p-4'>
          <nav className='flex flex-col space-y-4'>
            <Link href='/' className='hover:text-blue-500'>
              Home
            </Link>
            <Link href='/jobs' className='hover:text-blue-500'>
              Jobs
            </Link>
            <Link href='/contact' className='hover:text-blue-500'>
              Contact
            </Link>
            <Link href='/register' className='text-blue-600 underline'>
              Register
            </Link>
            <Link
              href='/signin'
              className='bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700'
            >
              Sign in
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
