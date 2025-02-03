export default function Statistics() {
  const stats = [
    { count: '25K+', label: 'Completed Cases' },
    { count: '17+', label: 'Our Office' },
    { count: '86+', label: 'Skilled People' },
    { count: '28+', label: 'Happy Clients' },
  ]

  return (
    <section className='bg-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center'>
          {stats.map((stat, index) => (
            <div key={index} className='flex flex-col items-center'>
              <h1 className='text-brand-2 text-5xl font-bold'>{stat.count}</h1>
              <h5 className='text-lg font-semibold mt-2'>{stat.label}</h5>
              <p className='text-sm text-gray-500 mt-2'>
                We always provide people a complete solution focused on any
                business.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
