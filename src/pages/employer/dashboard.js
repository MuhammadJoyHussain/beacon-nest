import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { parseJwt } from '@/utils/parseJWT'
import api from '@/utils/api'
import Link from 'next/link'

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return setError('Please login again')

    const decoded = parseJwt(token)
    if (!decoded?.id) return setError('Invalid token')

    fetchJobsAndApplicants(decoded.id, token)
  }, [])

  async function fetchJobsAndApplicants(employerId, token) {
    setLoading(true)
    try {
      const res = await api.get(`/vacancy/employer/${employerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const jobsData = Array.isArray(res.data?.results) ? res.data.results : []

      const jobsWithApplicants = await Promise.all(
        jobsData.map(async (job) => {
          try {
            const appsRes = await api.get(`/application/job/${job._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            return { ...job, applicants: appsRes.data || [] }
          } catch {
            return { ...job, applicants: [] }
          }
        })
      )

      setJobs(jobsWithApplicants)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    }
    setLoading(false)
  }

  const totalJobs = jobs.length
  const totalApplicants = jobs.reduce(
    (sum, job) => sum + (job.applicants?.length || 0),
    0
  )

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar />
      <main className='flex-grow overflow-auto p-6'>
        <div className='max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-8 space-y-10'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Employer Dashboard
          </h1>

          {error && (
            <div className='text-red-600 font-medium bg-red-50 p-4 rounded-xl'>
              {error}
            </div>
          )}

          {loading ? (
            <Skeleton count={4} height={40} />
          ) : (
            <>
              {/* Summary Stats */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div className='p-6 bg-indigo-50 rounded-2xl shadow-sm text-center'>
                  <h2 className='text-2xl font-bold text-indigo-700'>
                    {totalJobs}
                  </h2>
                  <p className='text-gray-600 font-medium'>Jobs Posted</p>
                </div>
                <div className='p-6 bg-blue-50 rounded-2xl shadow-sm text-center'>
                  <h2 className='text-2xl font-bold text-blue-700'>
                    {totalApplicants}
                  </h2>
                  <p className='text-gray-600 font-medium'>Total Applicants</p>
                </div>
              </div>

              {/* Job List */}
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-800'>
                  Your Jobs
                </h2>
                {jobs.length === 0 ? (
                  <p className='text-gray-500'>
                    You haven’t posted any jobs yet.
                  </p>
                ) : (
                  <ul className='space-y-4'>
                    {jobs.map((job) => (
                      <li
                        key={job._id}
                        className='p-5 border border-gray-200 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition flex justify-between items-center'
                      >
                        <div>
                          <h3 className='text-lg font-semibold text-gray-900'>
                            {job.title}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {job.company} • {job.location}
                          </p>
                        </div>
                        <div className='flex items-center gap-4'>
                          <span className='px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700'>
                            {job.applicants?.length || 0} applicants
                          </span>
                          <Link
                            href={`/employer/jobs/recommend_user/${job._id}`}
                            className='px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700'
                          >
                            View
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default EmployerDashboard
