import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Header from '../../dashboard/Header'
import Footer from '../../Footer'

export default function CareerDLodader() {
  return (
    <div className='min-h-screen bg-muted text-primary'>
      <Header />
      <main className='max-w-4xl mx-auto px-6 pt-24 pb-10'>
        <div className='bg-white rounded-xl shadow-md p-8'>
          <Skeleton height={36} width={'60%'} className='mb-4' />

          <div className='space-y-2 mb-6'>
            <Skeleton width={200} height={20} />
            <Skeleton width={180} height={20} />
            <Skeleton width={160} height={20} />
            <Skeleton width={140} height={20} />
          </div>

          <section className='space-y-6'>
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <Skeleton height={24} width={220} className='mb-2' />
                <Skeleton count={3} />
              </div>
            ))}

            <div>
              <Skeleton height={45} width={120} className='mt-4' />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
