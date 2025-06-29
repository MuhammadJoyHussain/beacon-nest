import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-200 py-10 px-6'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10'>
        {/* Branding */}
        <div>
          <div className='flex items-center space-x-2 mb-4'>
            <div className='h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center rounded-full'>
              <span className='text-white text-xl font-bold'>B</span>
            </div>
            <span className='text-xl font-semibold text-white'>
              Beacon Nest
            </span>
          </div>
          <p className='text-sm text-gray-400'>
            Empowering connections between talent and opportunity through
            technology.
          </p>
        </div>

        {/* Navigation */}
        <div className='flex flex-col space-y-2'>
          <h3 className='text-lg font-semibold text-white mb-2'>Quick Links</h3>
          <Link href='/' className='hover:text-blue-400 transition'>
            Home
          </Link>
          <Link href='/about' className='hover:text-blue-400 transition'>
            About Us
          </Link>
          <Link href='/jobs' className='hover:text-blue-400 transition'>
            Jobs
          </Link>
          <Link href='/contact' className='hover:text-blue-400 transition'>
            Contact
          </Link>
        </div>

        {/* Social & Copyright */}
        <div className='flex flex-col space-y-4'>
          <h3 className='text-lg font-semibold text-white mb-2'>Follow Us</h3>
          <div className='flex space-x-4'>
            <a
              href='https://facebook.com'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-blue-500'
            >
              <Facebook size={20} />
            </a>
            <a
              href='https://twitter.com'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-blue-400'
            >
              <Twitter size={20} />
            </a>
            <a
              href='https://instagram.com'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-pink-500'
            >
              <Instagram size={20} />
            </a>
            <a
              href='https://linkedin.com'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-blue-300'
            >
              <Linkedin size={20} />
            </a>
          </div>
          <p className='text-sm text-gray-500 mt-4'>
            &copy; {new Date().getFullYear()} Beacon Nest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
