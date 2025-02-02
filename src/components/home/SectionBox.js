'use client'
import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Search, MapPin, Briefcase } from 'lucide-react'

export default function SearchBar() {
  const [industry, setIndustry] = useState('Industry')
  const [location, setLocation] = useState('Location')

  return (
    <div className='flex items-center bg-white shadow-md rounded-full px-6 py-3 w-full max-w-3xl border border-gray-200'>
      {/* Industry Dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className='flex items-center text-gray-600 cursor-pointer'>
          <Briefcase className='w-5 h-5 mr-2 text-gray-500' />
          <span className='text-sm font-medium'>{industry}</span>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className='bg-white shadow-md rounded-md p-2 w-36'>
            {['Technology', 'Healthcare', 'Finance'].map((item) => (
              <DropdownMenu.Item
                key={item}
                className='p-2 hover:bg-gray-100 cursor-pointer text-sm'
                onSelect={() => setIndustry(item)}
              >
                {item}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <span className='text-gray-300 mx-4'>|</span>

      {/* Location Dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className='flex items-center text-gray-600 cursor-pointer'>
          <MapPin className='w-5 h-5 mr-2 text-gray-500' />
          <span className='text-sm font-medium'>{location}</span>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className='bg-white shadow-md rounded-md p-2 w-36'>
            {['New York', 'Los Angeles', 'San Francisco'].map((item) => (
              <DropdownMenu.Item
                key={item}
                className='p-2 hover:bg-gray-100 cursor-pointer text-sm'
                onSelect={() => setLocation(item)}
              >
                {item}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <span className='text-gray-300 mx-4'>|</span>

      {/* Keyword Input */}
      <input
        type='text'
        placeholder='Your keyword...'
        className='border-none flex-1 px-4 py-2 text-gray-500 outline-none text-sm bg-transparent placeholder-gray-400'
      />

      {/* Search Button */}
      <button className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full flex items-center font-medium text-sm'>
        <Search className='w-5 h-5 mr-2' /> Search
      </button>
    </div>
  )
}
