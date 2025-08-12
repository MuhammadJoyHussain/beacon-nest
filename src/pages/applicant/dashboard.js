import Sidebar from '@/components/dashboard/Sidebar'
import { useState } from 'react'

const dummyUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  location: 'New York, USA',
  skills: ['JavaScript', 'React', 'Node.js'],
}

const dummySavedJobs = [
  {
    id: 'job1',
    title: 'Frontend Developer',
    company: 'Tech Corp',
    location: 'Remote',
  },
  {
    id: 'job2',
    title: 'Full Stack Engineer',
    company: 'Web Solutions',
    location: 'San Francisco',
  },
]

const dummyRecommendedJobs = [
  {
    id: 'job3',
    title: 'Backend Developer',
    company: 'Data Systems',
    location: 'Boston',
  },
  {
    id: 'job4',
    title: 'React Developer',
    company: 'App Makers',
    location: 'Seattle',
  },
]

const UserDashboard = () => {
  const [savedJobs, setSavedJobs] = useState(dummySavedJobs)
  const [recommendedJobs, setRecommendedJobs] = useState(dummyRecommendedJobs)

  return (
    <div className='flex h-screen background'>
      <Sidebar />
      <main className='flex-grow overflow-auto p-8 bg-gray-100'>
        <h1 className='text-3xl font-bold mb-6'>
          Welcome, {dummyUser.firstName}!
        </h1>

        {/* User Profile */}
        <section className='bg-white p-6 rounded shadow mb-8 max-w-xl'>
          <h2 className='text-2xl font-semibold mb-4'>Your Profile</h2>
          <p>
            <strong>Name:</strong> {dummyUser.firstName} {dummyUser.lastName}
          </p>
          <p>
            <strong>Email:</strong> {dummyUser.email}
          </p>
          <p>
            <strong>Location:</strong> {dummyUser.location}
          </p>
          <p>
            <strong>Skills:</strong> {dummyUser.skills.join(', ')}
          </p>
        </section>

        {/* Saved Jobs */}
        <section className='bg-white p-6 rounded shadow mb-8 max-w-3xl'>
          <h2 className='text-2xl font-semibold mb-4'>Saved Jobs</h2>
          {savedJobs.length === 0 ? (
            <p>You have no saved jobs.</p>
          ) : (
            <ul>
              {savedJobs.map((job) => (
                <li key={job.id} className='border p-4 rounded mb-3'>
                  <h3 className='text-xl font-bold'>{job.title}</h3>
                  <p>
                    {job.company} - {job.location}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recommended Jobs */}
        <section className='bg-white p-6 rounded shadow max-w-3xl'>
          <h2 className='text-2xl font-semibold mb-4'>Recommended Jobs</h2>
          {recommendedJobs.length === 0 ? (
            <p>No recommended jobs at the moment.</p>
          ) : (
            <ul>
              {recommendedJobs.map((job) => (
                <li key={job.id} className='border p-4 rounded mb-3'>
                  <h3 className='text-xl font-bold'>{job.title}</h3>
                  <p>
                    {job.company} - {job.location}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default UserDashboard
