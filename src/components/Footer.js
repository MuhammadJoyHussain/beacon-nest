import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='bg-gray-100 mt-12 py-8'>
      <div className='container mx-auto px-6'>
        <div className='grid grid-cols-1 md:grid-cols-6 gap-6'>
          <div className='md:col-span-2'>
            <Link href='/'>
              <Image
                src='/assets/imgs/template/jobhub-logo.svg'
                alt='JobBox'
                width={150}
                height={50}
              />
            </Link>
            <p className='mt-4 text-sm text-gray-600'>
              JobBox is the heart of the design community and the best resource
              to discover and connect with designers and jobs worldwide.
            </p>
            <div className='flex space-x-4 mt-4'>
              <Link href='#' className='text-blue-600 hover:text-blue-800'>
                <i className='fab fa-facebook'></i>
              </Link>
              <Link href='#' className='text-blue-400 hover:text-blue-600'>
                <i className='fab fa-twitter'></i>
              </Link>
              <Link href='#' className='text-blue-500 hover:text-blue-700'>
                <i className='fab fa-linkedin'></i>
              </Link>
            </div>
          </div>
          <div>
            <h6 className='font-semibold mb-4'>Resources</h6>
            <ul className='space-y-2'>
              <li>
                <Link href='#'>About us</Link>
              </li>
              <li>
                <Link href='#'>Our Team</Link>
              </li>
              <li>
                <Link href='#'>Products</Link>
              </li>
              <li>
                <Link href='#'>Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className='font-semibold mb-4'>Community</h6>
            <ul className='space-y-2'>
              <li>
                <Link href='#'>Feature</Link>
              </li>
              <li>
                <Link href='#'>Pricing</Link>
              </li>
              <li>
                <Link href='#'>Credit</Link>
              </li>
              <li>
                <Link href='#'>FAQ</Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className='font-semibold mb-4'>Quick Links</h6>
            <ul className='space-y-2'>
              <li>
                <Link href='#'>iOS</Link>
              </li>
              <li>
                <Link href='#'>Android</Link>
              </li>
              <li>
                <Link href='#'>Microsoft</Link>
              </li>
              <li>
                <Link href='#'>Desktop</Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className='font-semibold mb-4'>More</h6>
            <ul className='space-y-2'>
              <li>
                <Link href='#'>Privacy</Link>
              </li>
              <li>
                <Link href='#'>Help</Link>
              </li>
              <li>
                <Link href='#'>Terms</Link>
              </li>
              <li>
                <Link href='#'>FAQ</Link>
              </li>
            </ul>
          </div>
          <div className='md:col-span-2'>
            <h6 className='font-semibold mb-4'>Download App</h6>
            <p className='text-sm text-gray-600'>
              Download our Apps and get extra 15% Discount on your first Order…!
            </p>
            <div className='flex space-x-2 mt-4'>
              <Link href='#'>
                <Image
                  src='/assets/imgs/template/icons/app-store.png'
                  alt='App Store'
                  width={120}
                  height={40}
                />
              </Link>
              <Link href='#'>
                <Image
                  src='/assets/imgs/template/icons/android.png'
                  alt='Google Play'
                  width={120}
                  height={40}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='border-t mt-8 py-4 text-center text-sm text-gray-600'>
        <p>Copyright &copy; 2022. JobBox all rights reserved</p>
        <div className='flex justify-center space-x-4 mt-2'>
          <Link href='#'>Privacy Policy</Link>
          <Link href='#'>Terms & Conditions</Link>
          <Link href='#'>Security</Link>
        </div>
      </div>
    </footer>
  )
}
