'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

export default function BrowseByCategory() {
  const jobCategories = [
    {
      img: '/assets/imgs/page/homepage1/marketing.svg',
      title: 'Marketing & Sale',
      count: '156 Jobs Available',
    },
    {
      img: '/assets/imgs/page/homepage1/finance.svg',
      title: 'Finance',
      count: '156 Jobs Available',
    },
    {
      img: '/assets/imgs/page/homepage1/human.svg',
      title: 'Human Resource',
      count: '156 Jobs Available',
    },
    {
      img: '/assets/imgs/page/homepage1/retail.svg',
      title: 'Retail & Products',
      count: '156 Jobs Available',
    },
    {
      img: '/assets/imgs/page/homepage1/content.svg',
      title: 'Content Writer',
      count: '156 Jobs Available',
    },
    {
      img: '/assets/imgs/page/homepage1/customer.svg',
      title: 'Customer Service',
      count: '156 Jobs Available',
    },
    {
      img: '/assets/imgs/page/homepage1/management.svg',
      title: 'Management',
      count: '156 Jobs Available',
    },
    {
      img: '/assets/imgs/page/homepage1/security.svg',
      title: 'Security Analyst',
      count: '156 Jobs Available',
    },
    {
      img: '/assets/imgs/page/homepage1/research.svg',
      title: 'Market Research',
      count: '156 Jobs Available',
    },
  ]

  return (
    <section className='py-16'>
      <div className='container mx-auto text-center'>
        <h2 className='text-3xl font-bold mb-4'>Browse Jobs Category</h2>
        <p className='text-gray-600 mb-10'>
          Find the job that’s perfect for you. About 800+ new jobs every day
        </p>
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
          navigation
          className='pb-10'
        >
          {jobCategories.map((category, index) => (
            <SwiperSlide key={index}>
              <div className='bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center'>
                <img
                  src={category.img}
                  alt={category.title}
                  className='w-16 h-16 mx-auto mb-4'
                />
                <h3 className='text-lg font-semibold'>{category.title}</h3>
                <p className='text-gray-500 text-sm'>{category.count}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
