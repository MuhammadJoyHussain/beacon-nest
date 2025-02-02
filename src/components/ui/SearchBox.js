'use client'
import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Search, MapPin, Briefcase } from 'lucide-react'

export default function SearchBox() {
  const [industry, setIndustry] = useState('Industry')
  const [location, setLocation] = useState('Location')

  return (
    <div className='flex items-center bg-white shadow-md rounded-full p-2 w-full max-w-3xl'>
      {/* Industry Dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className='flex items-center px-4 py-2 text-gray-600 cursor-pointer'>
          <Briefcase className='w-5 h-5 mr-2' /> {industry}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className='bg-white shadow-lg rounded-md p-2'>
            <DropdownMenu.Item
              className='p-2 hover:bg-gray-100 cursor-pointer'
              onSelect={() => setIndustry('Technology')}
            >
              Technology
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className='p-2 hover:bg-gray-100 cursor-pointer'
              onSelect={() => setIndustry('Healthcare')}
            >
              Healthcare
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className='p-2 hover:bg-gray-100 cursor-pointer'
              onSelect={() => setIndustry('Finance')}
            >
              Finance
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <span className='text-gray-400 mx-2'>|</span>

      {/* Location Dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className='flex items-center px-4 py-2 text-gray-600 cursor-pointer'>
          <MapPin className='w-5 h-5 mr-2' /> {location}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className='bg-white shadow-lg rounded-md p-2'>
            <DropdownMenu.Item
              className='p-2 hover:bg-gray-100 cursor-pointer'
              onSelect={() => setLocation('New York')}
            >
              New York
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className='p-2 hover:bg-gray-100 cursor-pointer'
              onSelect={() => setLocation('Los Angeles')}
            >
              Los Angeles
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className='p-2 hover:bg-gray-100 cursor-pointer'
              onSelect={() => setLocation('San Francisco')}
            >
              San Francisco
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <span className='text-gray-400 mx-2'>|</span>

      {/* Keyword Input */}
      <input
        type='text'
        placeholder='Your keyword...'
        className='border-none focus:ring-0 flex-1 px-4 py-2 outline-none'
      />

      {/* Search Button */}
      <button className='bg-blue-600 text-white px-6 py-2 rounded-full flex items-center'>
        <Search className='w-5 h-5 mr-2' /> Search
      </button>
    </div>
  )
}
