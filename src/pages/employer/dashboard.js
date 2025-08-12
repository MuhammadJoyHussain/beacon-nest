import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'

const dummyJobs = [
  {
    id: 'job1',
    title: 'Frontend Developer',
    applicantsCount: 10,
    recommendedCandidates: [
      {
        id: 'c1',
        name: 'Alice Smith',
        email: 'alice@example.com',
        match_probability: 0.65,
      },
      {
        id: 'c2',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        match_probability: 0.48,
      },
    ],
  },
  {
    id: 'job2',
    title: 'Backend Developer',
    applicantsCount: 7,
    recommendedCandidates: [
      {
        id: 'c3',
        name: 'Carol Williams',
        email: 'carol@example.com',
        match_probability: 0.72,
      },
    ],
  },
]

const EmployerDashboard = () => {
  const [selectedJob, setSelectedJob] = useState(null)

  return (
    <div className='flex h-screen background'>
      <Sidebar />
      <main className='flex-grow overflow-auto p-8 bg-gray-100'>
        <h1 className='text-3xl font-bold mb-6'>Employer Dashboard</h1>

        <div className='flex gap-8'>
          {/* Jobs list */}
          <div className='w-1/3 bg-white p-6 rounded shadow'>
            <h2 className='text-xl font-semibold mb-4'>Your Jobs</h2>
            <ul>
              {dummyJobs.map((job) => (
                <li
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`cursor-pointer p-3 rounded mb-2 ${
                    selectedJob?.id === job.id
                      ? 'bg-blue-100 font-semibold'
                      : 'hover:bg-blue-50'
                  }`}
                >
                  <div>{job.title}</div>
                  <div className='text-sm text-gray-600'>
                    Applicants: {job.applicantsCount}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Selected job details */}
          <div className='flex-1 bg-white p-6 rounded shadow'>
            {selectedJob ? (
              <>
                <h2 className='text-2xl font-bold mb-4'>{selectedJob.title}</h2>
                <h3 className='text-lg font-semibold mb-2'>
                  Recommended Candidates
                </h3>
                {selectedJob.recommendedCandidates.length > 0 ? (
                  <ul>
                    {selectedJob.recommendedCandidates.map((cand) => (
                      <li key={cand.id} className='mb-3 border p-3 rounded'>
                        <p>
                          <strong>Name:</strong> {cand.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {cand.email}
                        </p>
                        <p>
                          <strong>Match Probability:</strong>{' '}
                          {(cand.match_probability * 100).toFixed(2)}%
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No recommended candidates yet.</p>
                )}
              </>
            ) : (
              <p>Select a job to see details and recommendations.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default EmployerDashboard
