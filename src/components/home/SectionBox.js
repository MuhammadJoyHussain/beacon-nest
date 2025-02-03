'use client'

import React from 'react'
import Image from 'next/image'

export default function HiringBanner() {
  return (
    <section className='flex justify-center py-8'>
      <div className='w-[90%] max-w-5xl bg-white border border-gray-200 p-8 md:p-12 flex items-center rounded-lg shadow-lg relative overflow-hidden'>
        {/* Left Decorative Image */}
        <div className='absolute left-4 bottom-4 hidden md:block'>
          <Image
            width={100}
            height={100}
            src='/assets/imgs/page/homepage1/bg-left-hiring.svg'
            alt='Left Decorative Image'
          />
        </div>

        {/* Right Decorative Image */}
        <div className='absolute right-4 bottom-4 hidden md:block'>
          <Image
            width={180}
            height={100}
            src='/assets/imgs/page/homepage1/bg-right-hiring.svg'
            alt='Right Decorative Image'
          />
        </div>

        {/* Content */}
        <div className='z-10 flex flex-col md:flex-row items-center w-full justify-between px-48'>
          {/* Text Section */}
          <div className='flex'>
            <div className='px-2'>
              <p className='text-gray-500 text-sm uppercase tracking-wide font-medium'>
                We are
              </p>
              <p className='text-4xl font-extrabold text-gray-900 mt-1'>
                Hiring
              </p>
            </div>
            <div className='px-2'>
              <p className='text-lg text-gray-600 mt-3'>
                Let’s{' '}
                <span className='text-indigo-600 font-semibold'>Work</span>{' '}
                Together <br />&{' '}
                <span className='text-indigo-600 font-semibold'>Explore</span>{' '}
                Opportunities
              </p>
            </div>
          </div>

          {/* Apply Now Button */}
          <div className='flex-shrink-0'>
            <button
              className='flex items-center gap-2 bg-indigo-600 text-white text-md px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300 focus:outline-none'
              data-bs-toggle='modal'
              data-bs-target='#ModalApplyJobForm'
            >
              <Image
                width={20}
                height={20}
                src='/assets/imgs/template/icons/apply.svg'
                alt='Apply Icon'
              />
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
