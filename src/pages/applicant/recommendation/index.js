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
    <div className='flex h-screen bg-gray-50'>
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
                        className='group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 duration-200 p-6'
                      >
                        <Link href={`/applicant/recommendation/${jobId}`}>
                          <div className='flex flex-col gap-4'>
                            {/* Header */}
                            <div className='flex items-start justify-between'>
                              <div className='min-w-0'>
                                <h3 className='text-lg font-bold text-gray-900 truncate'>
                                  {job.title || 'Untitled Role'}
                                </h3>
                                <p className='mt-1 text-sm text-gray-600'>
                                  <span className='font-medium text-indigo-600'>
                                    {job.company}
                                  </span>
                                  {job.location && <> • {job.location}</>}
                                  {job.type && <> • {job.type}</>}
                                </p>
                              </div>

                              {/* Circular match badge */}
                              <div className='flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-md'>
                                {percent}
                              </div>
                            </div>

                            {/* Summary */}
                            {job.summary && (
                              <p className='text-sm text-gray-700 line-clamp-3'>
                                {job.summary}
                              </p>
                            )}

                            {/* Progress bar */}
                            <div>
                              <div className='flex justify-between text-xs text-gray-500 mb-1'>
                                <span>Match Probability</span>
                                <span>{percent}</span>
                              </div>
                              <div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden'>
                                <div
                                  className='h-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-500'
                                  style={{
                                    width: `${Math.round(prob * 100)}%`,
                                  }}
                                />
                              </div>
                            </div>

                            {/* Skills */}
                            {matched.length > 0 && (
                              <div className='mt-3 flex flex-wrap gap-2'>
                                {matched.slice(0, 8).map((skill) => (
                                  <span
                                    key={skill}
                                    className='px-2 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-200'
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {matched.length > 8 && (
                                  <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600'>
                                    +{matched.length - 8} more
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
