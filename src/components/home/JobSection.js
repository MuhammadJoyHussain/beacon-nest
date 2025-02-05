export default function JobSection() {
  return (
    <section className='relative mt-16 mb-16 overflow-visible px-4'>
      <div className='container mx-auto flex flex-col-reverse lg:flex-row items-center gap-12'>
        {/* Left Column - Image & Overlays */}
        <div className='w-full lg:w-1/2 flex justify-center relative'>
          <div className='relative w-full max-w-md lg:max-w-lg'>
            <img
              className='w-full rounded-xl shadow-lg'
              src='/assets/imgs/page/homepage1/img1.png'
              alt='Teamwork'
            />
            {/* Floating Elements */}
            <img
              className='absolute top-[-20px] left-[-50px] w-40 sm:w-52 lg:w-64 shadow-xs rounded-lg'
              src='/assets/imgs/page/homepage1/img-chart.png'
              alt='Chart'
            />
            <img
              className='absolute bottom-[-100px] right-[-50px] w-40 sm:w-52 lg:w-64 shadow-xs rounded-lg'
              src='/assets/imgs/page/homepage1/controlcard.png'
              alt='Security Card'
            />
          </div>
        </div>

        {/* Right Column - Text Content */}
        <div className='w-full lg:w-1/2 text-center lg:text-left'>
          <span className='text-gray-400 text-lg md:text-xl'>
            Millions Of Jobs.
          </span>
          <h2 className='text-3xl md:text-5xl font-bold mt-4 leading-snug'>
            Find The One That’s <span className='text-blue-600'>Right</span> For
            You
          </h2>
          <p className='mt-4 md:mt-6 text-base md:text-lg text-gray-600 leading-relaxed'>
            Search all the open positions on the web. Get your own personalized
            salary estimate. Read reviews on over 600,000 companies worldwide.
            The right job is out there.
          </p>
          <div className='mt-6 md:mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
            <a
              href='jobs-grid.html'
              className='bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition text-sm md:text-base'
            >
              Search Jobs
            </a>
            <a
              href='page-about.html'
              className='text-blue-600 underline hover:text-blue-800 text-sm md:text-lg'
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
