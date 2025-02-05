import Link from 'next/link'
import { Bell, Plus } from 'lucide-react'

const Header = () => {
  return (
    <header className='bg-white shadow-lg fixed top-0 left-0 w-full flex justify-between items-center px-4 lg:px-8 py-3 z-50'>
      {/* Logo */}
      <Link href='/' className='flex items-center space-x-2'>
        <div className='h-8 w-8 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-full'>
          <span className='text-white font-bold text-xl'>B</span>
        </div>
        <span className='text-2xl font-semibold text-gray-800 hover:text-blue-500 transition duration-300'>
          Beacon Nest
        </span>
      </Link>

      {/* Actions */}
      <div className='flex items-center space-x-4'>
        {/* Search Input */}
        <input
          type='text'
          placeholder='Search...'
          className='hidden sm:block border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 w-64'
        />

        {/* Post Job Button */}
        <Link
          href='/post-job'
          className='hidden sm:flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition'
        >
          <Plus size={16} />
          <span>Post Job</span>
        </Link>

        {/* Notifications */}
        <button className='relative text-gray-700 hover:text-blue-500'>
          <Bell size={24} />
          <span className='absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>
            3
          </span>
        </button>

        {/* Profile */}
        <div className='flex items-center space-x-3'>
          <img
            src='/assets/imgs/page/dashboard/profile.png'
            alt='Profile'
            className='h-10 w-10 rounded-full border'
          />
          <div className='hidden sm:block'>
            <span className='block text-gray-700 font-semibold'>
              Steven Jobs
            </span>
            <span className='block text-sm text-gray-500'>Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
