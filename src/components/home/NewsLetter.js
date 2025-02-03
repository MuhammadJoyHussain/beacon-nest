export default function Newsletter() {
  return (
    <section
      style={{
        backgroundImage: "url('/assets/imgs/page/homepage4/bg-newsletter.png')",
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%',
      }}
    >
      <div className=' rounded-2xl p-10 relative'>
        <div className='container mx-auto'>
          <div className='row flex flex-wrap justify-between items-center px-12'>
            {/* Decorative Images */}
            <div>
              <img
                src='assets/imgs/page/homepage4/img-newsletter.png'
                alt='Decorative'
                className=' rounded-md shadow-sm'
              />
            </div>

            {/* Newsletter Text and Form */}
            <div className='col-xl-8 col-lg-12 col-12 text-center'>
              <div className='text-start mx-auto max-w-2xl'>
                <h2 className='text-white text-3xl font-semibold'>
                  Subscribe to our newsletter
                </h2>
                <p className='mt-4 text-lg text-white'>
                  New things will always update regularly
                </p>

                {/* Newsletter Form */}
                <div className='box-form-newsletter mt-10'>
                  <form className='form-newsletter flex items-center'>
                    <input
                      className='input-newsletter flex-grow px-4 py-3 rounded-l-lg border-none focus:ring-2 focus:ring-blue-500'
                      type='email'
                      placeholder='Enter your email here'
                    />
                    <button
                      className='btn btn-default font-heading icon-send-letter px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700'
                      type='submit'
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
