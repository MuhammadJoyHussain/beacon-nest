'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const CardBlogSlider = ({
  img,
  category,
  title,
  description,
  authorImg,
  authorName,
  date,
  readTime,
}) => (
  <div className='bg-white p-6 rounded-lg shadow hover:shadow-lg transition'>
    <img
      src={img}
      alt={title}
      className='w-full h-48 object-cover rounded-md mb-4'
    />
    <span className='text-xs font-medium text-blue-600 uppercase'>
      {category}
    </span>
    <h3 className='text-lg font-semibold mt-2'>{title}</h3>
    <p className='text-sm text-gray-600 mt-2'>{description}</p>
    <div className='flex items-center mt-4'>
      <img src={authorImg} alt={authorName} className='w-8 h-8 rounded-full' />
      <div className='ml-3'>
        <p className='text-sm font-medium text-gray-800'>{authorName}</p>
        <p className='text-xs text-gray-500'>
          {date} • {readTime}
        </p>
      </div>
    </div>
  </div>
)

const BlogSlider = () => {
  const blogPosts = [
    {
      img: '/assets/imgs/page/homepage1/img-news1.png',
      category: 'News',
      title: '21 Job Interview Tips: How To Make a Great Impression',
      description:
        'Create the world’s most sustainable healthcare company by creating high-quality products in sustainable packaging.',
      authorImg: '/assets/imgs/page/homepage1/user1.png',
      authorName: 'Sarah Harding',
      date: '06 September',
      readTime: '8 mins to read',
    },
    {
      img: '/assets/imgs/page/homepage1/img-news2.png',
      category: 'Events',
      title: '39 Strengths and Weaknesses To Discuss in a Job Interview',
      description:
        'Create the world’s most sustainable healthcare company by creating high-quality products in sustainable packaging.',
      authorImg: '/assets/imgs/page/homepage1/user2.png',
      authorName: 'Steven Jobs',
      date: '06 September',
      readTime: '6 mins to read',
    },
    {
      img: '/assets/imgs/page/homepage1/img-news3.png',
      category: 'News',
      title: 'Interview Question: Why Don’t You Have a Degree?',
      description:
        'Learn how to respond if an interviewer asks you why you don’t have a degree.',
      authorImg: '/assets/imgs/page/homepage1/user3.png',
      authorName: 'Wiliam Kend',
      date: '06 September',
      readTime: '9 mins to read',
    },
  ]

  return (
    <section className='py-16'>
      <div className='container mx-auto text-center'>
        <h2 className='text-4xl font-bold text-gray-900'>News and Blogs</h2>
        <p className='text-gray-600 mt-2 text-lg'>
          Get the latest news, updates, and tips
        </p>
      </div>
      <div className='container mx-auto mt-12'>
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
        >
          {blogPosts.map((post, index) => (
            <SwiperSlide key={index}>
              <CardBlogSlider {...post} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='text-center mt-8'>
          <a
            href='/blog-grid'
            className='inline-flex items-center justify-center px-6 py-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300'
          >
            <span className='text-lg font-medium'>Load More Posts</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default BlogSlider
