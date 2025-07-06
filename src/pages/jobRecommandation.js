import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'

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

  async function getRecommendations(userId) {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(
        `http://localhost:4000/api/auth/recommend/${userId}`
      )
      setRecommendedJobs(res.data)
    } catch (err) {
      setError('Failed to fetch recommendations')
      console.error(err)
    }
    setLoading(false)
  }

  console.log(recommendedJobs)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('No token found, please login')
      return
    }
    const decoded = parseJwt(token)
    if (decoded && decoded.id) {
      getRecommendations(decoded.id)
    } else {
      setError('Invalid token: user ID not found')
    }
  }, [])

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <Header />
        <main className='flex-grow overflow-auto p-6 pt-24'>
          <div className='max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 space-y-8'>
            <h2 className='text-3xl font-bold text-green-800 text-center'>
              Recommended Jobs for You
            </h2>

            <ul className='space-y-6'>
              {recommendedJobs.map((job) => (
                <li
                  key={job._id}
                  className='border border-green-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-300 p-6 cursor-pointer'
                >
                  <Link href={`/career/${job._id}`} className='block'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0'>
                      <h3 className='text-xl font-semibold text-green-800'>
                        {job.title}
                      </h3>
                      <span className='inline-block bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full text-sm'>
                        {job.type}
                      </span>
                    </div>
                    <p className='mt-2 text-gray-700 font-medium'>
                      {job.company}
                    </p>
                    <p className='mt-1 text-gray-600'>{job.location}</p>
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
