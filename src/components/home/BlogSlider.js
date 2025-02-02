'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

// Reusable Blog Card Component
const CardBlogSlider = ({
  img,
  category,
  title,
  description,
  authorImg,
  authorName,
  date,
  readTime,
}) => {
  return (
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
        <img
          src={authorImg}
          alt={authorName}
          className='w-8 h-8 rounded-full'
        />
        <div className='ml-3'>
          <p className='text-sm font-medium text-gray-800'>{authorName}</p>
          <p className='text-xs text-gray-500'>
            {date} • {readTime}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function BlogSlider() {
  const blogPosts = [
    {
      img: '/assets/imgs/page/homepage1/img-news1.png',
      category: 'News',
      title: '21 Job Interview Tips: How To Make a Great Impression',
      description:
        'Our mission is to create the world’s most sustainable healthcare company by creating high-quality healthcare products in iconic, sustainable packaging.',
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
        'Our mission is to create the world’s most sustainable healthcare company by creating high-quality healthcare products in iconic, sustainable packaging.',
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
        'Learn how to respond if an interviewer asks you why you don’t have a degree, and read example answers that can help you craft.',
      authorImg: '/assets/imgs/page/homepage1/user3.png',
      authorName: 'Wiliam Kend',
      date: '06 September',
      readTime: '9 mins to read',
    },
  ]

  return (
    <section className='py-16'>
      <div className='container mx-auto mt-12'>
        <div className='box-swiper style-nav-top'>
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
                <CardBlogSlider
                  img={post.img}
                  category={post.category}
                  title={post.title}
                  description={post.description}
                  authorImg={post.authorImg}
                  authorName={post.authorName}
                  date={post.date}
                  readTime={post.readTime}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='text-center mt-8'>
            <a
              href='/blog-grid'
              className='btn btn-brand-1 btn-icon-load hover-up'
            >
              Load More Posts
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
