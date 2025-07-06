import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import api from '@/utils/api'
import dynamic from 'next/dynamic'

const Vacancies = () => {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [department, setDepartment] = useState('')
  const [vacancies, setVacancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const LoadingScreen = dynamic(() => import('@/components/Loading'), {
    ssr: false,
  })

  const fetchVacancies = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/vacancy', {
        params: {
          search,
          type,
          department,
          page,
          limit: 5,
        },
      })

      setVacancies(data.results || [])
      setTotalPages(data.pages || 1)
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
  }, [search, type, department, page])

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1)
  }

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1)
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className='min-h-screen bg-green-50 text-gray-800'>
      <Header />
      <div className='max-w-5xl mx-auto p-6 pt-24'>
        {/* Filters */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-8'>
          <input
            type='text'
            placeholder='Search by title, company, or location...'
            value={search}
            onChange={(e) => {
              setPage(1)
              setSearch(e.target.value)
            }}
            className='w-full px-5 py-3 border border-green-300 rounded-lg shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-green-500
                       placeholder-gray-400 text-gray-700 bg-white'
          />

          <select
            value={type}
            onChange={(e) => {
              setPage(1)
              setType(e.target.value)
            }}
            className='w-full px-5 py-3 border border-green-300 rounded-lg shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 bg-white'
          >
            <option value=''>All Types</option>
            <option value='Full-Time'>Full-Time</option>
            <option value='Part-Time'>Part-Time</option>
            <option value='Contract'>Contract</option>
          </select>

          <select
            value={department}
            onChange={(e) => {
              setPage(1)
              setDepartment(e.target.value)
            }}
            className='w-full px-5 py-3 border border-green-300 rounded-lg shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 bg-white'
          >
            <option value=''>All Departments</option>
            <option value='Engineering'>Engineering</option>
            <option value='Marketing'>Marketing</option>
            <option value='Design'>Design</option>
            <option value='Product'>Product</option>
            <option value='Customer Success'>Customer Success</option>
            <option value='Sales'>Sales</option>
            <option value='Infrastructure'>Infrastructure</option>
            <option value='Content Marketing'>Content Marketing</option>
            <option value='Human Resources'>Human Resources</option>
            <option value='Data & AI'>Data & AI</option>
          </select>
        </div>

        {/* Loader / Empty / Jobs */}
        {vacancies.length === 0 ? (
          <p className='text-center text-gray-500 text-lg py-10'>
            No vacancies found.
          </p>
        ) : (
          <ul className='space-y-6'>
            {vacancies.map((job) => (
              <li
                key={job._id}
                className='border border-green-200 rounded-xl shadow-sm bg-white
                           hover:shadow-md transition-shadow duration-300 p-6 cursor-pointer'
              >
                <Link href={`/career/${job._id}`} className='block'>
                  <div className='flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0'>
                    <h3 className='text-xl font-semibold text-green-800'>
                      {job.title}
                    </h3>
                    <span className='inline-block bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full text-sm'>
                      {job.type}
                    </span>
                  </div>
                  <p className='mt-2 text-gray-700 font-medium'>
                    {job.company}
                  </p>
                  <p className='mt-1 text-gray-600'>{job.location}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className='mt-10 flex justify-center items-center space-x-6'>
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`px-5 py-2 rounded-lg border transition
                ${
                  page === 1
                    ? 'bg-gray-200 cursor-not-allowed text-gray-500 border-gray-300'
                    : 'bg-white hover:bg-green-50 text-green-600 border-green-600'
                }`}
            >
              Previous
            </button>
            <span className='text-gray-700 font-semibold'>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className={`px-5 py-2 rounded-lg border transition
                ${
                  page === totalPages
                    ? 'bg-gray-200 cursor-not-allowed text-gray-500 border-gray-300'
                    : 'bg-white hover:bg-green-50 text-green-600 border-green-600'
                }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Vacancies
