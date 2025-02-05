'use client'

import React from 'react'
import Image from 'next/image'

export default function HiringBanner() {
  return (
    <section className='flex justify-center py-10 px-4'>
      <div className='w-full max-w-5xl bg-gradient-to-r from-blue-50 to-indigo-100 border border-gray-200 p-8 md:p-12 rounded-xl shadow-lg relative flex flex-col items-center text-center'>
        {/* Decorative Images */}
        <div className='absolute left-2 bottom-2 hidden md:block'>
          <Image
            width={70}
            height={70}
            src='/assets/imgs/page/homepage1/bg-left-hiring.svg'
            alt='Left Decorative Image'
          />
        </div>
        <div className='absolute right-2 bottom-2 hidden md:block'>
          <Image
            width={130}
            height={70}
            src='/assets/imgs/page/homepage1/bg-right-hiring.svg'
            alt='Right Decorative Image'
          />
        </div>

        {/* Content */}
        <div className='z-10 flex flex-col items-center text-center space-y-4'>
          {/* Text Section */}
          <p className='text-gray-500 text-sm uppercase tracking-wide font-medium'>
            Join Our Team
          </p>
          <h2 className='text-4xl font-bold text-gray-900 leading-tight'>
            We Are <span className='text-indigo-600'>Hiring</span>!
          </h2>
          <p className='text-gray-700 text-lg'>
            Let's <span className='text-indigo-600 font-semibold'>Work</span>{' '}
            Together &{' '}
            <span className='text-indigo-600 font-semibold'>Explore</span>{' '}
            Opportunities.
          </p>

          {/* Apply Button */}
          <button
            className='flex items-center gap-3 bg-indigo-600 text-white text-md px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 focus:outline-none'
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
    </section>
  )
}
