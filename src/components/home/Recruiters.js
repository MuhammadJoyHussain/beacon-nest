import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const recruiters = [
  {
    img: '/assets/imgs/brands/brand-1.png',
    name: 'Linkedin',
    location: 'New York, US',
    jobs: 25,
    rating: 4.6,
  },
  {
    img: '/assets/imgs/brands/brand-2.png',
    name: 'Adobe',
    location: 'San Francisco, US',
    jobs: 18,
    rating: 4.5,
  },
  {
    img: '/assets/imgs/brands/brand-3.png',
    name: 'Dailymotion',
    location: 'Los Angeles, US',
    jobs: 32,
    rating: 4.7,
  },
  {
    img: '/assets/imgs/brands/brand-4.png',
    name: 'NewSum',
    location: 'Seattle, US',
    jobs: 20,
    rating: 4.3,
  },
  {
    img: '/assets/imgs/brands/brand-5.png',
    name: 'PowerHome',
    location: 'Boston, US',
    jobs: 15,
    rating: 4.2,
  },
  {
    img: '/assets/imgs/brands/brand-6.png',
    name: 'Whop.com',
    location: 'Chicago, US',
    jobs: 22,
    rating: 4.4,
  },
]

export default function TopRecruiters() {
  return (
    <section className='bg-gray-50 py-16 px-4'>
      <div className='container mx-auto text-center'>
        <h2 className='text-4xl font-bold text-gray-900'>Top Recruiters</h2>
        <p className='text-gray-600 mt-2 text-lg'>
          Discover your next career move, freelance gig, or internship
        </p>
      </div>

      <div className='container mx-auto mt-32 relative'>
        {/* Swiper Navigation Buttons */}
        <div className='absolute top-[-60px] right-0 flex space-x-2'>
          <button className='swiper-button-prev-1 bg-gray-300 px-3 py-1 rounded-full shadow-md'>
            ❮
          </button>
          <button className='swiper-button-next-1 bg-gray-300 px-3 py-1 rounded-full shadow-md'>
            ❯
          </button>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
          navigation={{
            nextEl: '.swiper-button-next-1',
            prevEl: '.swiper-button-prev-1',
          }}
          className='pb-8'
        >
          {recruiters.map((recruiter, index) => (
            <SwiperSlide key={index}>
              <div className='bg-white p-6 rounded-xl shadow-md text-center border border-gray-200'>
                <div className='flex justify-center mb-4'>
                  <Image
                    src={recruiter.img}
                    alt={recruiter.name}
                    width={60}
                    height={60}
                    className='rounded-full'
                  />
                </div>
                <h4 className='text-lg font-semibold text-gray-800'>
                  {recruiter.name}
                </h4>
                <p className='text-gray-500 text-sm'>{recruiter.location}</p>
                <div className='flex items-center justify-center mt-3'>
                  <span className='text-yellow-500 text-lg'>
                    ★ {recruiter.rating}
                  </span>
                </div>
                <p className='text-gray-700 mt-2 text-sm'>
                  {recruiter.jobs} Open Jobs
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
