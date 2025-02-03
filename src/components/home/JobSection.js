export default function JobSection() {
  return (
    <section className='relative mt-24 mb-24 overflow-visible'>
      <div className='container mx-auto px-4 flex flex-wrap items-center'>
        {/* Left Column - Image & Overlays */}
        <div className='w-full lg:w-1/2 relative flex justify-center'>
          <div className='relative w-3/4'>
            <img
              className='w-full rounded-xl shadow-lg'
              src='/assets/imgs/page/homepage1/img1.png'
              alt='Teamwork'
            />
            {/* Floating Elements */}
            <img
              className='absolute top-[-32px] left-[-90px] w-64 shadow-xs rounded-lg'
              src='/assets/imgs/page/homepage1/img-chart.png'
              alt='Chart'
            />
            <img
              className='absolute bottom-[-150px] right-[-90px] w-64 shadow-xs rounded-lg'
              src='/assets/imgs/page/homepage1/controlcard.png'
              alt='Security Card'
            />
          </div>
        </div>

        {/* Right Column - Text Content */}
        <div className='w-full lg:w-1/2 flex flex-col items-start lg:items-start px-6'>
          <span className='text-gray-400 text-xl'>Millions Of Jobs.</span>
          <h2 className='text-5xl font-bold mt-4 leading-tight'>
            Find The One That’s <span className='text-blue-600'>Right</span> For
            You
          </h2>
          <p className='mt-6 text-lg text-gray-600 leading-relaxed'>
            Search all the open positions on the web. Get your own personalized
            salary estimate. Read reviews on over 600,000 companies worldwide.
            The right job is out there.
          </p>
          <div className='mt-8 flex gap-4'>
            <a
              href='jobs-grid.html'
              className='bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition'
            >
              Search Jobs
            </a>
            <a
              href='page-about.html'
              className='text-blue-600 underline hover:text-blue-800 text-lg'
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
