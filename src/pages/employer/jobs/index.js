import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/Sidebar'
import authApi from '@/utils/authApi'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { parseJwt } from '@/utils/parseJWT'
import api from '@/utils/api'

const EmployerJobsPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setError('No token found, please login')
      return
    }

    const decoded = parseJwt(token)
    if (decoded && decoded.id) {
      fetchEmployerJobs(decoded.id, token)
    } else {
      setError('Invalid token: employer ID not found')
    }
  }, [])

  async function fetchEmployerJobs(employerId, token) {
    setLoading(true)
    setError(null)

    console.log(employerId)

    try {
      const res = await api.get(`/vacancy/employer/${employerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log(res.data.results)

      setJobs(res.data.results)
    } catch (err) {
      setError('Failed to fetch employer jobs')
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <div className='flex h-screen background'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='flex-grow overflow-auto p-6'>
          <div className='max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 space-y-8'>
            <h2 className='text-2xl font-bold text-foundation-primary'>
              Jobs Posted by You
            </h2>

            {error && (
              <p className='text-center text-red-500 font-medium'>{error}</p>
            )}

            <ul className='space-y-6'>
              {loading
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <li
                      key={idx}
                      className='border border-foundation-pale rounded-xl p-6 bg-white shadow-sm'
                    >
                      <Skeleton height={20} width={'60%'} />
                      <Skeleton
                        height={18}
                        width={100}
                        className='mt-2 rounded-full'
                      />
                      <Skeleton height={18} width={'40%'} className='mt-2' />
                      <Skeleton height={16} width={'30%'} className='mt-1' />
                    </li>
                  ))
                : jobs.map((job) => (
                    <li
                      key={job._id}
                      className='border border-foundation-pale rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-300 p-6 cursor-pointer'
                    >
                      <Link href={`/employer/jobs/recommend_user/${job._id}`}>
                        <div className='flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0'>
                          <h3 className='text-foundation-primary'>
                            {job.title}
                          </h3>
                          <span className='inline-block bg-foundation-blue text-white font-semibold px-3 py-1 rounded-full text-sm'>
                            {job.type}
                          </span>
                        </div>
                        <h4 className='text text-foundation-blue pt-2'>
                          {job.company}
                        </h4>
                        <p>{job.location}</p>
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
}

export default EmployerJobsPage
