'use client'
import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Search, MapPin, Briefcase } from 'lucide-react'

export default function SearchBox() {
  const [industry, setIndustry] = useState('Industry')
  const [location, setLocation] = useState('Location')

  return (
    <div className='flex flex-wrap md:flex-nowrap items-center bg-foundation-background shadow-lg rounded-xl px-4 md:px-6 py-4 w-full max-w-3xl border border-foundation-pale gap-3 md:gap-5'>
      {/* Industry Dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className='flex items-center text-foundation-primary cursor-pointer w-full md:w-auto bg-white p-2 rounded-lg shadow-sm'>
          <Briefcase className='w-5 h-5 mr-2 text-foundation-softblue' />
          <span className='text-sm font-medium'>{industry}</span>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className='bg-white shadow-lg rounded-lg p-3 w-40'>
            {['Technology', 'Healthcare', 'Finance'].map((item) => (
              <DropdownMenu.Item
                key={item}
                className='p-2 hover:bg-foundation-pale cursor-pointer text-sm rounded-md text-foundation-primary'
                onSelect={() => setIndustry(item)}
              >
                {item}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <span className='hidden md:block text-foundation-softblue'>|</span>

      {/* Location Dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className='flex items-center text-foundation-primary cursor-pointer w-full md:w-auto bg-white p-2 rounded-lg shadow-sm'>
          <MapPin className='w-5 h-5 mr-2 text-foundation-softblue' />
          <span className='text-sm font-medium'>{location}</span>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className='bg-white shadow-lg rounded-lg p-3 w-40'>
            {['New York', 'Los Angeles', 'San Francisco'].map((item) => (
              <DropdownMenu.Item
                key={item}
                className='p-2 hover:bg-foundation-pale cursor-pointer text-sm rounded-md text-foundation-primary'
                onSelect={() => setLocation(item)}
              >
                {item}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <span className='hidden md:block text-foundation-softblue'>|</span>

      {/* Keyword Input */}
      <input
        type='text'
        placeholder='Enter a keyword...'
        className='border border-foundation-pale rounded-lg flex-1 px-4 py-2 text-foundation-primary outline-none text-sm bg-white placeholder-foundation-softblue w-full shadow-sm'
      />

      {/* Search Button */}
      <button className='bg-foundation-primary hover:bg-foundation-blue text-white px-4 py-2 rounded-lg flex items-center text-sm w-full md:w-auto justify-center shadow-md'>
        <Search className='w-4 h-4 mr-2' /> Search
      </button>
    </div>
  )
}
