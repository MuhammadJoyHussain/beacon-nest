'use client'
import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Search, MapPin, Briefcase } from 'lucide-react'

export default function SearchBox() {
  const [industry, setIndustry] = useState('Industry')
  const [location, setLocation] = useState('Location')

  return (
    <div className='flex flex-wrap md:flex-nowrap items-center bg-gray-100 shadow-lg rounded-xl px-4 md:px-6 py-4 w-full max-w-3xl border border-gray-300 gap-3 md:gap-5'>
      {/* Industry Dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className='flex items-center text-gray-700 cursor-pointer w-full md:w-auto bg-white p-2 rounded-lg shadow-sm'>
          <Briefcase className='w-5 h-5 mr-2 text-gray-600' />
          <span className='text-sm font-medium'>{industry}</span>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className='bg-white shadow-lg rounded-lg p-3 w-40'>
            {['Technology', 'Healthcare', 'Finance'].map((item) => (
              <DropdownMenu.Item
                key={item}
                className='p-2 hover:bg-gray-200 cursor-pointer text-sm rounded-md'
                onSelect={() => setIndustry(item)}
              >
                {item}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <span className='hidden md:block text-gray-400'>|</span>

      {/* Location Dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className='flex items-center text-gray-700 cursor-pointer w-full md:w-auto bg-white p-2 rounded-lg shadow-sm'>
          <MapPin className='w-5 h-5 mr-2 text-gray-600' />
          <span className='text-sm font-medium'>{location}</span>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className='bg-white shadow-lg rounded-lg p-3 w-40'>
            {['New York', 'Los Angeles', 'San Francisco'].map((item) => (
              <DropdownMenu.Item
                key={item}
                className='p-2 hover:bg-gray-200 cursor-pointer text-sm rounded-md'
                onSelect={() => setLocation(item)}
              >
                {item}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <span className='hidden md:block text-gray-400'>|</span>

      {/* Keyword Input */}
      <input
        type='text'
        placeholder='Enter a keyword...'
        className='border border-gray-300 rounded-lg flex-1 px-4 py-2 text-gray-700 outline-none text-sm bg-white placeholder-gray-500 w-full shadow-sm'
      />

      {/* Search Button */}
      <button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm w-full md:w-auto justify-center shadow-md'>
        <Search className='w-4 h-4 mr-2' /> Search
      </button>
    </div>
  )
}
