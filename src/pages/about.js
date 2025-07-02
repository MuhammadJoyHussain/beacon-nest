import Header from '@/components/Header'
import Footer from '@/components/Footer'
import React from 'react'

const AboutUs = () => {
  return (
    <div className='min-h-screen bg-green-50'>
      <Header />

      <main className='pt-20 pb-16 px-6 lg:px-24'>
        <div className='max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8'>
          <div className='text-center mb-10'>
            <h1 className='text-4xl font-bold text-green-800 mb-4'>
              About Beacon Nest
            </h1>
            <p className='text-lg text-gray-600'>
              At <strong>Beacon Nest</strong>, we believe that every career move
              should feel like a leap forward. As a dynamic recruitment agency,
              we specialize in connecting talented professionals with
              organizations that value growth, purpose, and people.
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <h2 className='text-2xl font-semibold text-green-700 mb-3'>
                Who We Are
              </h2>
              <p className='text-gray-600'>
                Founded by a team of passionate recruiters and HR strategists,
                Beacon Nest was built with a mission to make hiring more human.
                We partner with companies—from fast-growing startups to Fortune
                500s—to find the right people for the right roles.
              </p>
            </div>

            <div>
              <h2 className='text-2xl font-semibold text-green-700 mb-3'>
                Our Vision
              </h2>
              <p className='text-gray-600'>
                We envision a world where talent shines through, and
                organizations thrive because of the people behind them. Beacon
                Nest serves as the bridge—illuminating opportunities and helping
                candidates and companies reach new heights.
              </p>
            </div>

            <div>
              <h2 className='text-2xl font-semibold text-green-700 mb-3'>
                What We Do
              </h2>
              <ul className='list-disc list-inside text-gray-600 space-y-1'>
                <li>Permanent and contract recruitment</li>
                <li>Executive search and leadership hiring</li>
                <li>Tech, marketing, sales, and operations roles</li>
                <li>Candidate screening and employer branding</li>
              </ul>
            </div>

            <div>
              <h2 className='text-2xl font-semibold text-green-700 mb-3'>
                Why Choose Us
              </h2>
              <p className='text-gray-600'>
                We don’t just fill positions—we build teams. Our consultative
                approach, industry expertise, and personalized support make us a
                trusted hiring partner across industries.
              </p>
            </div>
          </div>

          <div className='text-center mt-12'>
            <h3 className='text-xl font-semibold text-green-800 mb-2'>
              Ready to grow with us?
            </h3>
            <p className='text-gray-600 mb-4'>
              Whether you're hiring or job hunting, Beacon Nest is here to guide
              the way.
            </p>
            <a
              href='/contact'
              className='inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition'
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AboutUs
