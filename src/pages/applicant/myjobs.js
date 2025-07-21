import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import api from '@/utils/api'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Link from 'next/link'

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
          _id: app._id,
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

  return (
    <div className='flex h-screen bg-foundation-background'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='flex-grow overflow-auto p-6'>
          <div className='max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 space-y-8'>
            <h2 className='text-2xl font-bold'>My Applications</h2>

            {error && (
              <div className='text-center text-red-500 text-lg'>{error}</div>
            )}

            {loading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className='bg-foundation-pale rounded-xl p-6 shadow-sm'
                  >
                    <Skeleton height={20} width={'60%'} />
                    <Skeleton height={20} width={'40%'} className='mt-2' />
                    <Skeleton height={16} width={'50%'} className='mt-4' />
                    <Skeleton
                      height={28}
                      width={100}
                      className='mt-6 rounded-full'
                    />
                  </div>
                ))}
              </div>
            ) : appliedJobs.length === 0 ? (
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
                    <Link href={`/applicant/job/${job._id}`}>
                      <button className='mt-4 inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition'>
                        View Details
                      </button>
                    </Link>
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
