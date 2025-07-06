import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import api from '@/utils/api'
import dynamic from 'next/dynamic'

const Joblist = () => {
  const [appliedJobs, setAppliedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const LoadingScreen = dynamic(() => import('@/components/Loading'), {
    ssr: false,
  })

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('You must be logged in to view this page.')
          setLoading(false)
          return
        }

        const { data } = await api.get('/application/my', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Format data to match expected job card format
        const jobs = data.map((app) => ({
          title: app.job.title,
          company: app.job.company,
          dateApplied: new Date(app.createdAt).toLocaleDateString(),
          status: app.status,
        }))

        setAppliedJobs(jobs)
      } catch (err) {
        console.error(err)
        setError('Failed to load applications.')
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <Header />
        <main className='flex-grow overflow-auto p-6 pt-24'>
          <div className='max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 space-y-8'>
            <h2 className='text-3xl font-bold text-green-800 text-center'>
              My Applications
            </h2>

            {appliedJobs.length === 0 ? (
              <div className='text-center text-gray-500 text-lg py-10'>
                You haven’t applied for any jobs yet.
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {appliedJobs.map((job, index) => (
                  <div
                    key={index}
                    className='bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition'
                  >
                    <h3 className='text-xl font-semibold text-green-700 mb-1'>
                      {job.title}
                    </h3>
                    <p className='text-gray-700 mb-1'>{job.company}</p>
                    <p className='text-sm text-gray-500'>
                      Applied: {job.dateApplied}
                    </p>
                    <span className='inline-block mt-3 px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium'>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Joblist
