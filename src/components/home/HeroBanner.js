'use client'

import { Search, MapPin, Briefcase } from 'lucide-react'

import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/Dropdown-Menu'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import SearchBox from '../ui/SearchBox'

export default function SectionBox() {
  return (
    <section className='relative max-w-[1770px] mx-auto px-4 md:px-16 pt-10'>
      <div className='grid grid-cols-1 xl:grid-cols-2 items-center gap-10'>
        {/* Left Content */}
        <div>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 leading-tight'>
            The <span className='text-blue-600'>Easiest Way</span>{' '}
            <br className='hidden lg:block' /> to Get Your New Job
          </h1>
          <p className='text-lg text-gray-600 mt-6'>
            Each month, more than 3 million job seekers turn to{' '}
            <br className='hidden lg:block' />
            websites in their search for work, making over 140,000{' '}
            <br className='hidden lg:block' />
            applications every single day.
          </p>
          {/* Job Search Form Placeholder */}
          <SearchBox />
          {/* Popular Searches */}
          <div className='mt-6 text-gray-500 text-sm'>
            <strong>Popular Searches:</strong>{' '}
            <a href='#' className='text-blue-500 hover:underline'>
              Designer
            </a>
            ,
            <a href='#' className='text-blue-500 hover:underline'>
              {' '}
              Web
            </a>
            ,
            <a href='#' className='text-blue-500 hover:underline'>
              {' '}
              IOS
            </a>
            ,
            <a href='#' className='text-blue-500 hover:underline'>
              {' '}
              Developer
            </a>
            ,
            <a href='#' className='text-blue-500 hover:underline'>
              {' '}
              PHP
            </a>
            ,
            <a href='#' className='text-blue-500 hover:underline'>
              {' '}
              Senior
            </a>
            ,
            <a href='#' className='text-blue-500 hover:underline'>
              {' '}
              Engineer
            </a>
          </div>
        </div>
        {/* Right Images */}
        <div className='relative hidden xl:block min-h-[540px]'>
          <div className='absolute top-[10%] -left-22'>
            <Image
              src='/assets/imgs/page/homepage1/banner1.png'
              alt='Job Seekers'
              width={300}
              height={200}
            />
          </div>
          <div className='absolute bottom-[18%] right-44'>
            <Image
              src='/assets/imgs/page/homepage1/banner2.png'
              alt='Team Collaboration'
              width={300}
              height={200}
            />
          </div>
          <div className='absolute top-[21%] right-48'>
            <Image
              src='/assets/imgs/page/homepage1/icon-top-banner.png'
              alt='Top Icon'
              width={70}
              height={70}
            />
          </div>
          <div className='absolute bottom-[28%] '>
            <Image
              src='/assets/imgs/page/homepage1/icon-bottom-banner.png'
              alt='Bottom Icon'
              width={70}
              height={70}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
