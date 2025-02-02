import Image from 'next/image'
import Link from 'next/link'

const Sidebar = () => {
  return (
    <aside className='w-full p-4'>
      {/* Search Widget */}
      <div className='mb-10'>
        <form className='relative flex items-center border border-gray-200 rounded-lg overflow-hidden'>
          <input
            type='text'
            placeholder='Search…'
            className='w-full p-4 text-lg border-none outline-none'
          />
          <button
            type='submit'
            className='absolute right-4 text-xl text-gray-700'
          >
            🔍
          </button>
        </form>
      </div>

      {/* Trending Now */}
      <div className='mb-10'>
        <h5 className='border-b border-gray-200 font-semibold pb-2 mb-4 text-lg'>
          Trending Now
        </h5>
        <div className='space-y-4'>
          {[
            {
              img: 'img-trending.png',
              title: 'How to get better agents in New York, USA',
              authorImg: 'user1.png',
              author: 'Sugar Rosie',
            },
            {
              img: 'gallery1.png',
              title: 'How To Create a Resume for a Job in Social',
              authorImg: 'user3.png',
              author: 'Harding',
              date: '17 Sep',
            },
            {
              img: 'gallery2.png',
              title: '10 Ways to Avoid a Referee Disaster Zone',
              authorImg: 'user2.png',
              author: 'Steven',
              date: '23 Sep',
            },
            {
              img: 'gallery4.png',
              title: 'How To Set Work-Life Boundaries From Any Location',
              authorImg: 'user3.png',
              author: 'Merias',
              date: '14 Sep',
            },
            {
              img: 'gallery5.png',
              title: 'How to Land Your Dream Marketing Job',
              authorImg: 'user1.png',
              author: 'Rosie',
              date: '12 Sep',
            },
          ].map((post, index) => (
            <div
              key={index}
              className='flex items-center space-x-4 transition-transform duration-200 hover:-translate-y-1'
            >
              <Image
                src={`/assets/imgs/page/blog/${post.img}`}
                alt={post.title}
                width={85}
                height={85}
                className='rounded-md'
              />
              <div>
                <h5 className='text-sm font-semibold leading-5 mb-2'>
                  {post.title}
                </h5>
                <div className='text-xs text-gray-500 flex items-center space-x-2'>
                  <Image
                    src={`/assets/imgs/page/homepage1/${post.authorImg}`}
                    alt={post.author}
                    width={30}
                    height={30}
                    className='rounded-full mr-1'
                  />
                  <span>{post.author}</span>
                  {post.date && <span>{post.date}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hiring Banner */}
      <div className='p-6 bg-gray-100 text-center rounded-lg'>
        <span className='block text-gray-500'>WE ARE</span>
        <span className='block text-xl font-bold text-gray-800'>HIRING</span>
        <p className='text-xs text-gray-600 mt-2'>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae
          architecto.
        </p>
        <Link
          href='#'
          className='inline-block mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm'
        >
          Know More
        </Link>
      </div>

      {/* Gallery */}
      <div className='mt-10'>
        <h5 className='border-b border-gray-200 font-semibold pb-2 mb-4 text-lg'>
          Gallery
        </h5>
        <div className='grid grid-cols-3 gap-2'>
          {Array.from({ length: 9 }, (_, i) => `gallery${i + 1}.png`).map(
            (img, index) => (
              <Link key={index} href='#'>
                <Image
                  src={`/assets/imgs/page/blog/${img}`}
                  alt='Gallery Image'
                  width={70}
                  height={70}
                  className='rounded-md'
                />
              </Link>
            )
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
