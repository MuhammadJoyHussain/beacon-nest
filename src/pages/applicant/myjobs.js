import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import api from '@/utils/api'
import dynamic from 'next/dynamic'

const LoadingScreen = dynamic(() => import('@/components/Loading'), {
  ssr: false,
})

const Joblist = () => {
  const [appliedJobs, setAppliedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) return <LoadingScreen />

  return (
    <div className='flex h-screen bg-foundation-background'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='flex-grow overflow-auto p-6'>
          <div className='max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 space-y-8'>
            <h2>My Applications</h2>

            {error && (
              <div className='text-center text-red-500 text-lg'>{error}</div>
            )}

            {appliedJobs.length === 0 ? (
              <div className='text-center text-foundation-softblue text-lg py-10'>
                You haven’t applied for any jobs yet.
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {appliedJobs.map((job, index) => (
                  <div
                    key={index}
                    className='bg-foundation-pale rounded-xl p-6 shadow-sm hover:shadow-md transition'
                  >
                    <h3 className='text-white'>{job.title}</h3>
                    <p className='text-white'>{job.company}</p>
                    <p className='text-sm text-white'>
                      Applied: {job.dateApplied}
                    </p>
                    <span className='inline-block mt-3 px-3 py-1 text-sm rounded-full bg-foundation-blue text-white font-medium'>
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
