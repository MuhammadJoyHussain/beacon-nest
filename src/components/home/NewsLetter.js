export default function Newsletter() {
  return (
    <section
      className='w-full bg-cover bg-center bg-no-repeat py-16'
      style={{
        backgroundImage: "url('/assets/imgs/page/homepage4/bg-newsletter.png')",
      }}
    >
      <div className='container mx-auto px-6 lg:px-12'>
        <div className='flex flex-col lg:flex-row items-center justify-between rounded-2xl p-8'>
          {/* Decorative Image */}
          <div className='mb-8 lg:mb-0 lg:w-1/3 flex justify-center'>
            <img
              src='/assets/imgs/page/homepage4/img-newsletter.png'
              alt='Decorative'
              className='rounded-lg w-full max-w-xs lg:max-w-sm'
            />
          </div>

          {/* Newsletter Text and Form */}
          <div className='lg:w-2/3 ml-2 text-center lg:text-left'>
            <h2 className='text-white text-3xl lg:text-4xl font-bold'>
              Subscribe to our newsletter
            </h2>
            <p className='mt-4 text-lg text-white'>
              New things will always update regularly
            </p>

            {/* Newsletter Form */}
            <form className='mt-6 flex flex-col sm:flex-row items-center'>
              <input
                className='w-full sm:flex-grow px-4 py-3 rounded-lg sm:rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                type='email'
                placeholder='Enter your email here'
              />
              <button
                className='mt-4 sm:mt-0 sm:ml-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg sm:rounded-r-lg hover:bg-blue-700 transition-colors'
                type='submit'
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
