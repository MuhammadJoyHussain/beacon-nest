import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='py-10 px-6' style={{ backgroundColor: '#2F3D82' }}>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-[#EDE8F5]'>
        {/* Branding */}
        <div>
          <div className='flex items-center space-x-2 mb-4'>
            <div className='h-10 w-10 bg-gradient-to-r from-[#5A7BD4] to-[#2F3D82] flex items-center justify-center rounded-full'>
              <span className='text-white text-xl font-bold'>B</span>
            </div>
            <span className='text-xl font-semibold text-white'>
              Beacon Nest
            </span>
          </div>
          <p className='text-sm text-[#D9D2EB]'>
            Empowering connections between talent and opportunity through
            technology.
          </p>
        </div>

        {/* Navigation */}
        <div className='flex flex-col space-y-2'>
          <h3 className='text-lg font-semibold text-white mb-2'>Quick Links</h3>
          <Link href='/' className='hover:text-[#ADBBD4] transition'>
            Home
          </Link>
          <Link href='/about' className='hover:text-[#ADBBD4] transition'>
            About Us
          </Link>
          <Link href='/career' className='hover:text-[#ADBBD4] transition'>
            Career
          </Link>
          <Link href='/contact' className='hover:text-[#ADBBD4] transition'>
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
              className='hover:text-[#7091E6]'
            >
              <Facebook size={20} />
            </a>
            <a
              href='https://twitter.com'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-[#5A7BD4]'
            >
              <Twitter size={20} />
            </a>
            <a
              href='https://instagram.com'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-pink-400'
            >
              <Instagram size={20} />
            </a>
            <a
              href='https://linkedin.com'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-[#8697C4]'
            >
              <Linkedin size={20} />
            </a>
          </div>
          <p className='text-sm text-[#ADBBD4] mt-4'>
            &copy; {new Date().getFullYear()} Beacon Nest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
