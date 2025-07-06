import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Briefcase, Globe, Users } from 'lucide-react'
import Header from '@/components/dashboard/Header'
import Footer from '@/components/Footer'
import api from '@/utils/api'

const HomePage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchVacancies = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/vacancy', {
        params: {
          limit: 3,
        },
      })

      setJobs(data.results || [])
    } catch (error) {
      console.error('Error fetching vacancies:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchVacancies()
    }, 400)
    return () => clearTimeout(delay)
  }, [])

  return (
    <div>
      <Header />
      <div className='bg-white text-gray-800 pt-16'>
        {/* Hero */}
        <section className='bg-gradient-to-r from-green-400 to-green-600 text-white py-20 px-4'>
          <div className='max-w-7xl mx-auto text-center'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              Find Your Dream Job
            </h1>
            <p className='text-lg md:text-xl mb-8'>
              Connect with top employers and land your ideal role today.
            </p>
            <Link
              href='/career'
              className='inline-block bg-white text-green-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition'
            >
              Browse Jobs
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className='py-16 px-4'>
          <div className='max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center'>
            <div>
              <Briefcase className='mx-auto mb-4 text-green-600' size={32} />
              <h3 className='text-xl font-semibold mb-2'>Top Companies</h3>
              <p>
                We partner with the most reputable companies across industries.
              </p>
            </div>
            <div>
              <Users className='mx-auto mb-4 text-green-600' size={32} />
              <h3 className='text-xl font-semibold mb-2'>Community Focused</h3>
              <p>We support a diverse network of job seekers and employers.</p>
            </div>
            <div>
              <Globe className='mx-auto mb-4 text-green-600' size={32} />
              <h3 className='text-xl font-semibold mb-2'>Global Reach</h3>
              <p>Find opportunities across the globe or in your local city.</p>
            </div>
          </div>
        </section>

        {/* Popular Jobs */}
        <section className='bg-gray-50 py-16 px-4'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='text-3xl font-bold mb-8 text-center'>
              Popular Job Listings
            </h2>

            {loading && <p className='text-center'>Loading jobs...</p>}
            {error && <p className='text-center text-red-600'>{error}</p>}

            {!loading && !error && (
              <div className='grid md:grid-cols-3 gap-6'>
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <div
                      key={job._id}
                      className='bg-white p-6 rounded-xl shadow hover:shadow-md transition'
                    >
                      <h3 className='text-lg font-semibold mb-1'>
                        {job.title}
                      </h3>
                      <p className='text-sm text-gray-500'>
                        {job.company} – {job.location}
                      </p>
                      <Link
                        href={`/career/${job._id}`}
                        className='text-green-600 font-medium mt-4 inline-block hover:underline'
                      >
                        View Job →
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className='text-center text-gray-600'>
                    No job listings found.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className='py-20 bg-gradient-to-r from-green-400 to-green-600 text-white text-center px-4'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Ready to Take the Next Step?
          </h2>
          <p className='mb-8 text-lg'>
            Join thousands of job seekers and build your future with Beacon
            Nest.
          </p>
          <Link
            href='/register'
            className='bg-white text-green-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition'
          >
            Create Account
          </Link>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default HomePage
