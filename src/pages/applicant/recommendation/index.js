'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/Sidebar'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { parseJwt } from '@/utils/parseJWT'
import api from '@/utils/api'

const RecommendationsPage = () => {
  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      setError('No token found, please login')
      return
    }

    let decoded = null
    try {
      decoded = parseJwt(token)
    } catch {
      setError('Invalid token')
      return
    }

    if (decoded && decoded.id) {
      getRecommendations(decoded.id, token)
    } else {
      setError('Invalid token: user ID not found')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function getRecommendations(userId, token) {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/recommend/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = res.data
      const list = Array.isArray(data)
        ? data
        : (data && data.recommendations) || []
      setRecommendedJobs(list)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch recommendations')
      setRecommendedJobs([])
    } finally {
      setLoading(false)
    }
  }

  function getProbability(job) {
    if (typeof job.probability === 'number') return job.probability
    if (typeof job.match_probability === 'number') return job.match_probability
    if (typeof job.match_probability_pct === 'number')
      return job.match_probability_pct / 100
    if (typeof job.score === 'number') return job.score
    return 0
  }

  function pctStr(prob) {
    return `${(Math.max(0, Math.min(1, prob)) * 100).toFixed(1)}%`
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='flex-grow overflow-auto p-6'>
          <div className='max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-8 md:p-10 space-y-8'>
            <div className='flex items-center justify-between flex-wrap gap-3'>
              <h2 className='text-2xl md:text-3xl font-bold text-foundation-primary'>
                Recommended Jobs for You
              </h2>
              <div className='text-sm text-gray-500'>
                Ranked by your skills & profile
              </div>
            </div>

            {error && (
              <div className='rounded-xl border border-red-200 bg-red-50 text-red-800 p-4'>
                {error}
              </div>
            )}

            <ul className='space-y-5'>
              {loading
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <li
                      key={idx}
                      className='border border-foundation-pale rounded-2xl p-6 bg-white shadow-sm'
                    >
                      <Skeleton height={22} width={'60%'} />
                      <Skeleton
                        height={16}
                        width={120}
                        className='mt-2 rounded-full'
                      />
                      <Skeleton height={16} width={'40%'} className='mt-2' />
                      <Skeleton height={14} width={'30%'} className='mt-3' />
                      <Skeleton height={8} width={'100%'} className='mt-3' />
                    </li>
                  ))
                : recommendedJobs.map((job) => {
                    const prob = getProbability(job)
                    const percent = pctStr(prob)
                    const matched = Array.isArray(job.matched_skills)
                      ? job.matched_skills
                      : []
                    const jobId = job.job_id || job._id || job.id || ''

                    return (
                      <li
                        key={jobId}
                        className='group border border-gray-100 rounded-2xl shadow-sm bg-white hover:shadow-md transition-all duration-200 p-6'
                      >
                        <Link href={`/applicant/recommendation/${jobId}`}>
                          <div className='flex flex-col gap-3'>
                            <div className='flex items-start justify-between gap-4'>
                              <div className='min-w-0'>
                                <h3 className='text-lg md:text-xl font-semibold text-gray-900 truncate'>
                                  {job.title || 'Untitled role'}
                                </h3>
                                <div className='mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600'>
                                  {job.company && (
                                    <span className='font-medium text-foundation-blue'>
                                      {job.company}
                                    </span>
                                  )}
                                  {job.location && (
                                    <>
                                      <span aria-hidden>•</span>
                                      <span>{job.location}</span>
                                    </>
                                  )}
                                  {job.type && (
                                    <>
                                      <span aria-hidden>•</span>
                                      <span>{job.type}</span>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className='shrink-0'>
                                <span
                                  className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold
                                  bg-gradient-to-r from-foundation-blue to-foundation-primary text-white shadow-sm'
                                  title='Match probability'
                                >
                                  {percent}
                                </span>
                              </div>
                            </div>

                            {job.summary && (
                              <p className='text-sm text-gray-700 line-clamp-3'>
                                {job.summary}
                              </p>
                            )}

                            <div className='mt-2'>
                              <div className='flex items-center justify-between text-xs text-gray-500 mb-1'>
                                <span>Match</span>
                                <span>{percent}</span>
                              </div>
                              <div
                                className='h-2 w-full rounded-full bg-gray-100 overflow-hidden'
                                role='progressbar'
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={Math.round(prob * 100)}
                                aria-label='Match probability'
                              >
                                <div
                                  className='h-full w-0 rounded-full bg-gradient-to-r from-foundation-blue to-foundation-primary transition-all duration-500'
                                  style={{
                                    width: `${
                                      Math.max(0, Math.min(1, prob)) * 100
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>

                            {matched.length > 0 && (
                              <div className='mt-3 flex flex-wrap gap-2'>
                                {matched.slice(0, 10).map((skill) => (
                                  <span
                                    key={skill}
                                    className='px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200'
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {matched.length > 10 && (
                                  <span className='px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200'>
                                    +{matched.length - 10} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </Link>
                      </li>
                    )
                  })}
            </ul>

            {!loading && recommendedJobs.length === 0 && !error && (
              <div className='text-center text-gray-500 py-10'>
                No recommendations yet — update your skills to get better
                matches.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default RecommendationsPage
