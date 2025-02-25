export default function JobSection() {
  return (
    <section className='relative py-16 px-4 bg-gray-50'>
      <div className='container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
        {/* Left Column - Text Content */}
        <div className='text-center lg:text-left'>
          <h2 className='text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight'>
            Discover Your <span className='text-blue-600'>Dream Job</span> Today
          </h2>
          <p className='mt-6 text-lg text-gray-600'>
            Browse thousands of job opportunities tailored to your skills and
            preferences. Find the perfect role and take the next step in your
            career.
          </p>
          <div className='mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
            <a
              href='jobs-grid.html'
              className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-base text-center'
            >
              Explore Jobs
            </a>
            <a
              href='page-about.html'
              className='text-blue-600 underline hover:text-blue-800 text-base text-center'
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className='relative flex justify-center'>
          <img
            className='w-full max-w-md lg:max-w-lg rounded-xl object-cover'
            src='/assets/imgs/page/homepage1/img1.png'
            alt='Teamwork'
          />
          {/* Floating Elements */}
          <img
            className='absolute top-[-10%] sm:left-[-10] left-[-2%] w-20 sm:w-32 lg:w-40 rounded-lg'
            src='/assets/imgs/page/homepage1/img-chart.png'
            alt='Chart'
          />
          <img
            className='absolute bottom-[-20%] sm:left-[-10] right-[-2%] w-20 sm:w-32 lg:w-40 rounded-lg'
            src='/assets/imgs/page/homepage1/controlcard.png'
            alt='Security Card'
          />
        </div>
      </div>
    </section>
  )
}
