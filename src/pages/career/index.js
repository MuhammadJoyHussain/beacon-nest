import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/dashboard/Header'
import Footer from '@/components/Footer'
import api from '@/utils/api'
import dynamic from 'next/dynamic'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SelectItem from '@/components/ui/SelectItem'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Vacancies = () => {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [department, setDepartment] = useState('')
  const [vacancies, setVacancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

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

  return (
    <div className='min-h-screen bg-foundation-primaryLight text-foundation-text'>
      <Header />
      <div className='max-w-5xl mx-auto p-6 pt-24'>
        {/* Filters */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-8'>
          <Input
            name='search'
            placeholder='Search by title, company, or location...'
            value={search}
            onChange={(e) => {
              setPage(1)
              setSearch(e.target.value)
            }}
          />

          <Select
            name='type'
            value={type}
            onChange={(e) => {
              setPage(1)
              setType(e.target.value)
            }}
          >
            <option value=''>All Types</option>
            {['Full-Time', 'Part-Time', 'Contract'].map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </Select>

          <Select
            name='department'
            value={department}
            onChange={(e) => {
              setPage(1)
              setDepartment(e.target.value)
            }}
          >
            <option value=''>All Departments</option>
            {[
              'Engineering',
              'Marketing',
              'Design',
              'Product',
              'Customer Success',
              'Sales',
              'Infrastructure',
              'Content Marketing',
              'Human Resources',
              'Data & AI',
            ].map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </Select>
        </div>

        {loading ? (
          <ul className='space-y-6'>
            {[...Array(5)].map((_, i) => (
              <li key={i} className='border rounded-xl p-6 bg-white shadow-sm'>
                <Skeleton height={24} width={200} />
                <Skeleton height={20} width={100} className='mt-2' />
                <Skeleton height={16} width={150} className='mt-1' />
              </li>
            ))}
          </ul>
        ) : vacancies.length === 0 ? (
          <p className='text-center text-foundation-mutedText text-lg py-10'>
            No vacancies found.
          </p>
        ) : (
          <ul className='space-y-6'>
            {vacancies.map((job) => (
              <li
                key={job._id}
                className='border border-foundation-border rounded-xl shadow-sm bg-white
                 hover:shadow-md transition-shadow duration-300 p-6 cursor-pointer'
              >
                <Link href={`/career/${job._id}`} className='block'>
                  <div className='flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0'>
                    <h3 className='text-xl font-semibold text-foundation-primary'>
                      {job.title}
                    </h3>
                    <span className='inline-block bg-foundation-primaryLight text-foundation-primary font-semibold px-3 py-1 rounded-full text-sm'>
                      {job.type}
                    </span>
                  </div>
                  <p className='mt-2 text-foundation-text font-medium'>
                    {job.company}
                  </p>
                  <p className='mt-1 text-foundation-mutedText'>
                    {job.location}
                  </p>
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
                    : 'bg-white hover:bg-foundation-primaryLight text-foundation-primary border-foundation-primary'
                }`}
            >
              Previous
            </button>
            <span className='text-foundation-text font-semibold'>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className={`px-5 py-2 rounded-lg border transition
                ${
                  page === totalPages
                    ? 'bg-gray-200 cursor-not-allowed text-gray-500 border-gray-300'
                    : 'bg-white hover:bg-foundation-primaryLight text-foundation-primary border-foundation-primary'
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
