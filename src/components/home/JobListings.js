// components/JobListings.js
export default function JobListings() {
  return (
    <div className='container mx-auto mt-12'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {/* Job 1 */}
        <div className='col-span-1'>
          <div className='relative hover:scale-105 transition-transform'>
            <a href='jobs-grid.html'>
              <div
                className='bg-cover bg-center h-64 rounded-lg'
                style={{
                  backgroundImage:
                    'url(assets/imgs/page/homepage1/location1.png)',
                }}
              >
                <span className='absolute top-4 left-4 text-white text-xs bg-red-500 px-2 py-1 rounded-full'>
                  Hot
                </span>
              </div>
              <div className='p-4'>
                <h5 className='text-xl font-bold text-gray-800'>
                  Paris, France
                </h5>
                <div className='flex justify-between mt-2'>
                  <span className='text-sm text-gray-500'>5 Vacancy</span>
                  <span className='text-sm text-gray-500'>120 companies</span>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Job 2 */}
        <div className='col-span-1'>
          <div className='relative hover:scale-105 transition-transform'>
            <a href='jobs-grid.html'>
              <div
                className='bg-cover bg-center h-64 rounded-lg'
                style={{
                  backgroundImage:
                    'url(assets/imgs/page/homepage1/location2.png)',
                }}
              >
                <span className='absolute top-4 left-4 text-white text-xs bg-blue-500 px-2 py-1 rounded-full'>
                  Trending
                </span>
              </div>
              <div className='p-4'>
                <h5 className='text-xl font-bold text-gray-800'>
                  London, England
                </h5>
                <div className='flex justify-between mt-2'>
                  <span className='text-sm text-gray-500'>7 Vacancy</span>
                  <span className='text-sm text-gray-500'>68 companies</span>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Job 3 */}
        <div className='col-span-1'>
          <div className='relative hover:scale-105 transition-transform'>
            <a href='jobs-grid.html'>
              <div
                className='bg-cover bg-center h-64 rounded-lg'
                style={{
                  backgroundImage:
                    'url(assets/imgs/page/homepage1/location3.png)',
                }}
              >
                <span className='absolute top-4 left-4 text-white text-xs bg-red-500 px-2 py-1 rounded-full'>
                  Hot
                </span>
              </div>
              <div className='p-4'>
                <h5 className='text-xl font-bold text-gray-800'>
                  New York, USA
                </h5>
                <div className='flex justify-between mt-2'>
                  <span className='text-sm text-gray-500'>9 Vacancy</span>
                  <span className='text-sm text-gray-500'>80 companies</span>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Job 4 */}
        <div className='col-span-1'>
          <div className='relative hover:scale-105 transition-transform'>
            <a href='jobs-grid.html'>
              <div
                className='bg-cover bg-center h-64 rounded-lg'
                style={{
                  backgroundImage:
                    'url(assets/imgs/page/homepage1/location4.png)',
                }}
              ></div>
              <div className='p-4'>
                <h5 className='text-xl font-bold text-gray-800'>
                  Amsterdam, Holland
                </h5>
                <div className='flex justify-between mt-2'>
                  <span className='text-sm text-gray-500'>16 Vacancy</span>
                  <span className='text-sm text-gray-500'>86 companies</span>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Job 5 */}
        <div className='col-span-1'>
          <div className='relative hover:scale-105 transition-transform'>
            <a href='jobs-grid.html'>
              <div
                className='bg-cover bg-center h-64 rounded-lg'
                style={{
                  backgroundImage:
                    'url(assets/imgs/page/homepage1/location5.png)',
                }}
              ></div>
              <div className='p-4'>
                <h5 className='text-xl font-bold text-gray-800'>
                  Copenhagen, Denmark
                </h5>
                <div className='flex justify-between mt-2'>
                  <span className='text-sm text-gray-500'>39 Vacancy</span>
                  <span className='text-sm text-gray-500'>186 companies</span>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Job 6 */}
        <div className='col-span-1'>
          <div className='relative hover:scale-105 transition-transform'>
            <a href='jobs-grid.html'>
              <div
                className='bg-cover bg-center h-64 rounded-lg'
                style={{
                  backgroundImage:
                    'url(assets/imgs/page/homepage1/location6.png)',
                }}
              ></div>
              <div className='p-4'>
                <h5 className='text-xl font-bold text-gray-800'>
                  Berlin, Germany
                </h5>
                <div className='flex justify-between mt-2'>
                  <span className='text-sm text-gray-500'>15 Vacancy</span>
                  <span className='text-sm text-gray-500'>632 companies</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
