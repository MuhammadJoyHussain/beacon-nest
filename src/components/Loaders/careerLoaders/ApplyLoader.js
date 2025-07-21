import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'
import Skeleton from 'react-loading-skeleton'

const ApplyLoader = () => {
  return (
    <div>
      <div className='min-h-screen bg-muted text-primary'>
        <Header />
        <main className='max-w-3xl mx-auto px-6 pt-24 pb-10'>
          <div className='bg-white p-8 rounded-xl shadow-md'>
            <Skeleton height={40} width='50%' className='mb-6' />
            {[...Array(7)].map((_, i) => (
              <div key={i} className='mb-4'>
                <Skeleton height={24} width='100%' />
              </div>
            ))}
            <Skeleton height={45} width='100%' />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default ApplyLoader
