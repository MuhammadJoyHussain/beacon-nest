import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Briefcase, Globe, Users } from 'lucide-react'
import Header from '@/components/dashboard/Header'
import Footer from '@/components/Footer'
import api from '@/utils/api'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const HomePage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchVacancies = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/vacancy', {
        params: { limit: 3 },
      })
      setJobs(data.results || [])
    } catch (error) {
      console.error('Error fetching vacancies:', error)
      setError('Failed to load job listings.')
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
    <div className='bg-[#EDE8F5] text-[#3D52A0] min-h-screen pt-16'>
      <Header />

      {/* Hero Section */}
      <section className='py-24 px-4 text-center relative overflow-hidden'>
        <div className='max-w-6xl mx-auto'>
          <h1 className='text-4xl font-bold'>Beacon Nest</h1>
          <p className='mx-auto mt-4 text-lg'>
            Elevate your career with real opportunities from top companies.
          </p>
          <Link
            href='/career'
            className='inline-block mt-8 bg-[#3D52A0] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7091E6] transition'
          >
            Browse Jobs
          </Link>
        </div>
      </section>

      {/* Feature Icons */}
      <section className='py-16 bg-[#ADBBDA] text-[#3D52A0]'>
        <div className='max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center px-4'>
          <div>
            <Briefcase className='mx-auto mb-4 text-[#3D52A0]' size={36} />
            <h4>Top Companies</h4>
            <p className='text-[#3D52A0]/70'>
              We partner with the most reputable companies across industries.
            </p>
          </div>
          <div>
            <Users className='mx-auto mb-4 text-[#3D52A0]' size={36} />
            <h4>Community Focused</h4>
            <p className='text-[#3D52A0]/70'>
              We support a diverse network of job seekers and employers.
            </p>
          </div>
          <div>
            <Globe className='mx-auto mb-4 text-[#3D52A0]' size={36} />
            <h4>Global Reach</h4>
            <p className='text-[#3D52A0]/70'>
              Find opportunities across the globe or in your local city.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Jobs */}
      <section className='py-20 px-4 bg-[#7091E6]/10 text-[#3D52A0]'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold mb-10 text-center'>
            Popular Job Listings
          </h2>

          {error ? (
            <p className='text-center text-red-500'>{error}</p>
          ) : (
            <div className='grid md:grid-cols-3 gap-6'>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className='bg-white rounded-2xl p-6 shadow-lg'>
                    <h4 className='mb-2 text-lg font-semibold'>
                      <Skeleton width={120} />
                    </h4>
                    <p className='mb-3'>
                      <Skeleton width={180} />
                    </p>
                    <Skeleton height={20} width={100} />
                  </div>
                ))
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <div
                    key={job._id}
                    className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition duration-300'
                  >
                    <h3 className='text-lg font-semibold mb-1'>{job.title}</h3>
                    <p className='text-sm text-[#8697C4] mb-3'>
                      {job.company} – {job.location}
                    </p>
                    <Link
                      href={`/career/${job._id}`}
                      className='text-[#7091E6] font-medium hover:underline'
                    >
                      View Job →
                    </Link>
                  </div>
                ))
              ) : (
                <p className='text-center'>No job listings found.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className='py-20 px-4 bg-[#7091E6] text-white text-center'>
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>
          Ready to Take the Next Step?
        </h2>
        <p className='mb-8 text-lg max-w-xl mx-auto'>
          Join thousands of job seekers and build your future with Beacon Nest.
        </p>
        <Link
          href='/register'
          className='bg-white text-[#3D52A0] font-semibold px-6 py-3 rounded-full hover:bg-[#EDE8F5] transition'
        >
          Create Account
        </Link>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage
