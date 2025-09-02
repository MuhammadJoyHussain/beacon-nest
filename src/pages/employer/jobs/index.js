import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/Sidebar'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { parseJwt } from '@/utils/parseJWT'
import api from '@/utils/api'

const EmployerJobsPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Guard for SSR
    if (typeof window === 'undefined') return

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
    try {
      const res = await api.get(`/vacancy/employer/${employerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setJobs(Array.isArray(res.data?.results) ? res.data.results : [])
    } catch (err) {
      setError('Failed to fetch employer jobs')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const showEmptyState = !loading && !error && jobs.length === 0

  return (
    <div className='flex h-screen background'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='flex-grow overflow-auto p-6'>
          <div className='max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-8 md:p-10 space-y-8'>
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl font-bold text-foundation-primary'>
                Jobs Posted by You
              </h2>
              <Link
                href='/employer/jobs/post'
                className='hidden md:inline-flex items-center gap-2 rounded-2xl bg-foundation-blue px-4 py-2 font-semibold text-white shadow hover:shadow-md hover:bg-foundation-primary focus:outline-none focus:ring-2 focus:ring-foundation-blue/50 transition'
              >
                <span>Post a Job</span>
              </Link>
            </div>

            {error && (
              <div className='rounded-xl border border-red-100 bg-red-50 p-4 text-red-700'>
                {error}
              </div>
            )}

            {/* Empty state */}
            {showEmptyState && (
              <section className='relative overflow-hidden rounded-2xl border border-foundation-pale bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8 md:p-12'>
                {/* subtle background accent */}
                <div
                  aria-hidden
                  className='pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl'
                />
                <div className='grid gap-8 md:grid-cols-[1fr,auto] md:items-center'>
                  <div className='space-y-4'>
                    <h3 className='text-xl md:text-2xl font-semibold text-foundation-primary'>
                      You haven’t posted any jobs yet
                    </h3>
                    <p className='text-slate-600'>
                      Start by creating your first job post so candidates can
                      discover your role. You’ll see applications and smart
                      recommendations here once it’s live.
                    </p>

                    <div className='flex flex-col sm:flex-row gap-3 pt-2'>
                      <Link
                        href='/employer/jobs/post'
                        className='inline-flex items-center justify-center rounded-xl bg-foundation-blue px-5 py-2.5 font-semibold text-white shadow hover:shadow-md hover:bg-foundation-primary focus:outline-none focus:ring-2 focus:ring-foundation-blue/50 transition'
                      >
                        Post a Job
                      </Link>

                      <Link
                        href='/employer/dashboard'
                        className='inline-flex items-center justify-center rounded-xl border border-foundation-pale bg-white px-5 py-2.5 font-medium text-foundation-primary hover:border-foundation-blue/40 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-foundation-blue/30 transition'
                      >
                        Back to Dashboard
                      </Link>
                    </div>
                  </div>

                  {/* Inline SVG illustration (no extra deps) */}
                  <div className='mx-auto md:mx-0'>
                    <svg
                      width='220'
                      height='160'
                      viewBox='0 0 440 320'
                      role='img'
                      aria-label='Clipboard with plus sign'
                      className='drop-shadow-sm'
                    >
                      <defs>
                        <linearGradient id='g1' x1='0' x2='1'>
                          <stop offset='0%' stopColor='#93C5FD' />
                          <stop offset='100%' stopColor='#3B82F6' />
                        </linearGradient>
                      </defs>
                      <rect
                        x='30'
                        y='30'
                        rx='20'
                        ry='20'
                        width='260'
                        height='260'
                        fill='url(#g1)'
                        opacity='0.12'
                      />
                      <rect
                        x='60'
                        y='60'
                        rx='16'
                        ry='16'
                        width='260'
                        height='200'
                        fill='#ffffff'
                        stroke='#BFDBFE'
                      />
                      <rect
                        x='120'
                        y='30'
                        rx='10'
                        ry='10'
                        width='140'
                        height='30'
                        fill='#2563EB'
                        opacity='0.15'
                      />
                      <rect
                        x='90'
                        y='90'
                        width='160'
                        height='14'
                        rx='7'
                        fill='#93C5FD'
                      />
                      <rect
                        x='90'
                        y='120'
                        width='200'
                        height='10'
                        rx='5'
                        fill='#DBEAFE'
                      />
                      <rect
                        x='90'
                        y='144'
                        width='180'
                        height='10'
                        rx='5'
                        fill='#DBEAFE'
                      />
                      <rect
                        x='90'
                        y='168'
                        width='140'
                        height='10'
                        rx='5'
                        fill='#DBEAFE'
                      />
                      <circle
                        cx='360'
                        cy='140'
                        r='42'
                        fill='#EFF6FF'
                        stroke='#BFDBFE'
                      />
                      <rect
                        x='356'
                        y='114'
                        width='8'
                        height='52'
                        rx='4'
                        fill='#3B82F6'
                      />
                      <rect
                        x='334'
                        y='136'
                        width='52'
                        height='8'
                        rx='4'
                        fill='#3B82F6'
                      />
                    </svg>
                  </div>
                </div>
              </section>
            )}

            {/* List / skeletons */}
            {!showEmptyState && (
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
                        className='group border border-foundation-pale rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition'
                      >
                        <Link
                          href={`/employer/jobs/recommend_user/${job._id}`}
                          className='block'
                        >
                          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-2'>
                            <h3 className='text-lg md:text-xl font-semibold text-foundation-primary group-hover:underline underline-offset-4'>
                              {job.title}
                            </h3>
                            <span className='inline-block bg-foundation-blue text-white font-semibold px-3 py-1 rounded-full text-sm'>
                              {job.type}
                            </span>
                          </div>
                          <h4 className='text-foundation-blue/90 pt-2 font-medium'>
                            {job.company}
                          </h4>
                          <p className='text-slate-600'>{job.location}</p>
                        </Link>
                      </li>
                    ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default EmployerJobsPage
