import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import dynamic from 'next/dynamic'

const LoadingScreen = dynamic(() => import('@/components/Loading'), {
  ssr: false,
})

// Decode JWT token to get user info
function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1]
    const payload = atob(base64Payload)
    return JSON.parse(payload)
  } catch (e) {
    console.error('Failed to parse JWT', e)
    return null
  }
}

const RecommendationsPage = () => {
  const [recommendedJobs, setRecommendedJobs] = useState([])
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
      getRecommendations(decoded.id, token)
    } else {
      setError('Invalid token: user ID not found')
    }
  }, [])

  async function getRecommendations(userId, token) {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(
        `http://localhost:4000/api/auth/recommend/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setRecommendedJobs(res.data)
    } catch (err) {
      setError('Failed to fetch recommendations')
      console.error(err)
    }
    setLoading(false)
  }

  if (loading) return <LoadingScreen />

  return (
    <div className='flex h-screen background'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='flex-grow overflow-auto p-6'>
          <div className='max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 space-y-8'>
            <h2>Recommended Jobs for You</h2>

            {error && (
              <p className='text-center text-red-500 font-medium'>{error}</p>
            )}

            <ul className='space-y-6'>
              {recommendedJobs.map((job) => (
                <li
                  key={job._id}
                  className='border border-foundation-pale rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-300 p-6 cursor-pointer'
                >
                  <Link href={`/applicant/recommendation/${job._id}`}>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0'>
                      <h3 className=' text-foundation-primary'>{job.title}</h3>
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

export default RecommendationsPage
