import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import api from '@/utils/api'
import Link from 'next/link'
import { Briefcase, Bell, UserCircle, FileText } from 'lucide-react'

export default function Dashboard() {
  const [applications, setApplications] = useState([])
  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [profile, setProfile] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, recRes, profileRes] = await Promise.all([
          api.get('/applications/me'),
          api.get('/vacancy/recommended'),
          api.get('/auth/profile'),
        ])
        setApplications(appRes.data)
        setRecommendedJobs(recRes.data)
        setProfile(profileRes.data)
      } catch (err) {
        console.error('Dashboard load error:', err)
      }
    }
    fetchData()
  }, [])

  return (
    <div className='min-h-screen bg-green-50'>
      <Header />
      <main className='pt-24 pb-12 px-6 max-w-6xl mx-auto text-gray-800'>
        <h1 className='text-3xl font-bold text-green-800 mb-6'>
          Welcome, {profile.firstName || 'Applicant'}!
        </h1>

        {/* Profile Summary */}
        <section className='grid md:grid-cols-3 gap-6 mb-10'>
          <div className='bg-white rounded-xl shadow p-6'>
            <UserCircle className='text-green-600 mb-2' size={28} />
            <h2 className='text-lg font-semibold'>Profile Summary</h2>
            <p>Email: {profile.email}</p>
            <p>Phone: {profile.phone}</p>
            <Link
              href='/profile'
              className='text-green-600 hover:underline text-sm mt-2 inline-block'
            >
              Edit Profile
            </Link>
          </div>

          <div className='bg-white rounded-xl shadow p-6'>
            <Bell className='text-green-600 mb-2' size={28} />
            <h2 className='text-lg font-semibold'>Notifications</h2>
            <ul className='list-disc list-inside text-sm mt-2 text-gray-600'>
              <li>New job posted in Marketing</li>
              <li>Interview invite from GreenTech</li>
            </ul>
          </div>

          <div className='bg-white rounded-xl shadow p-6'>
            <FileText className='text-green-600 mb-2' size={28} />
            <h2 className='text-lg font-semibold'>Resume</h2>
            <p>Uploaded: {profile.resume ? 'Yes' : 'No'}</p>
            <Link
              href='/profile'
              className='text-green-600 hover:underline text-sm mt-2 inline-block'
            >
              Manage Resume
            </Link>
          </div>
        </section>

        {/* Applications */}
        <section className='mb-10'>
          <h2 className='text-2xl font-bold text-green-800 mb-4'>
            My Applications
          </h2>
          {applications.length === 0 ? (
            <p className='text-gray-600'>
              You haven’t applied to any jobs yet.
            </p>
          ) : (
            <div className='space-y-4'>
              {applications.map((app) => (
                <div key={app._id} className='bg-white p-4 rounded-xl shadow'>
                  <div className='flex justify-between items-center'>
                    <div>
                      <h3 className='text-lg font-semibold text-green-700'>
                        {app.jobTitle}
                      </h3>
                      <p className='text-sm text-gray-600'>{app.company}</p>
                      <p className='text-sm'>
                        Status:{' '}
                        <span className='font-medium'>{app.status}</span>
                      </p>
                    </div>
                    <Link
                      href={`/career/${app.jobId}`}
                      className='text-green-600 text-sm hover:underline'
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recommended Jobs */}
        <section>
          <h2 className='text-2xl font-bold text-green-800 mb-4'>
            Recommended Jobs
          </h2>
          {recommendedJobs.length === 0 ? (
            <p className='text-gray-600'>
              No recommendations available right now.
            </p>
          ) : (
            <div className='grid md:grid-cols-3 gap-4'>
              {recommendedJobs.slice(0, 3).map((job) => (
                <div
                  key={job._id}
                  className='bg-white p-4 rounded-xl shadow hover:shadow-md transition'
                >
                  <h3 className='text-lg font-semibold text-green-700 mb-1'>
                    {job.title}
                  </h3>
                  <p className='text-sm text-gray-500'>
                    {job.company} – {job.location}
                  </p>
                  <Link
                    href={`/career/${job._id}`}
                    className='text-green-600 text-sm font-medium mt-2 inline-block hover:underline'
                  >
                    View Job →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
