import Header from '@/components/Header'
import React, { useState } from 'react'

const jobsData = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechFlow',
    location: 'Remote',
    type: 'Full Time',
    posted: '2 days ago',
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'CodeNest',
    location: 'San Francisco, CA',
    type: 'Part Time',
    posted: '5 days ago',
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'PixelHub',
    location: 'New York, NY',
    type: 'Contract',
    posted: '1 week ago',
  },
  // Add more jobs as needed
]

const Vacancies = () => {
  const [search, setSearch] = useState('')

  const filteredJobs = jobsData.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <Header />
      <div className='max-w-4xl mx-auto p-4'>
        <div className='mb-6'>
          <input
            type='text'
            placeholder='Search by title, company, or location...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {filteredJobs.length === 0 ? (
          <p className='text-gray-500'>No jobs found.</p>
        ) : (
          <ul className='space-y-4'>
            {filteredJobs.map((job) => (
              <li
                key={job.id}
                className='border p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white'
              >
                <div className='flex justify-between items-center'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    {job.title}
                  </h3>
                  <span className='text-sm text-blue-600'>{job.type}</span>
                </div>
                <p className='text-gray-600'>{job.company}</p>
                <p className='text-sm text-gray-500'>{job.location}</p>
                <p className='text-sm text-gray-400'>{job.posted}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Vacancies
