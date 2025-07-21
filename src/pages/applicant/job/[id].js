import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import api from '@/utils/api'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const ApplicationDetails = () => {
  const router = useRouter()
  const { id } = router.query

  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem('token')
        const { data } = await api.get(`/application/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setApplication(data)
      } catch (err) {
        console.error(err)
        setError('Application not found or unauthorized.')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchApplication()
  }, [id])

  return (
    <div className='flex h-screen bg-foundation-background'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='flex-grow overflow-auto p-6'>
          <div className='max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 space-y-8'>
            <h2 className='text-2xl font-bold'>Application Details</h2>

            {loading ? (
              <Skeleton count={10} />
            ) : error ? (
              <p className='text-red-500'>{error}</p>
            ) : (
              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold'>Job Information</h3>
                  <p>
                    <strong>Title:</strong> {application.job.title}
                  </p>
                  <p>
                    <strong>Company:</strong> {application.job.company}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className='text-sm px-2 py-1 bg-foundation-blue text-white rounded-full'>
                      {application.status}
                    </span>
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold'>Applicant Info</h3>
                  <p>
                    <strong>Name:</strong> {application.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {application.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {application.phone}
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold'>Details</h3>
                  <p>
                    <strong>Experience Years:</strong>{' '}
                    {application.experienceYears}
                  </p>
                  <p>
                    <strong>Expected Salary:</strong>{' '}
                    {application.expectedSalary}
                  </p>
                  <p>
                    <strong>Start Date:</strong> {application.startDate}
                  </p>
                  <p>
                    <strong>LinkedIn:</strong>{' '}
                    <a
                      href={application.linkedIn}
                      className='text-blue-500 underline'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Profile Link
                    </a>
                  </p>
                  <p>
                    <strong>Authorized to work:</strong>{' '}
                    {application.authorized ? 'Yes' : 'No'}
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold'>Cover Letter</h3>
                  <p className='bg-foundation-pale p-4 rounded-md whitespace-pre-wrap'>
                    {application.coverLetter}
                  </p>
                </div>

                {application.additionalInfo && (
                  <div>
                    <h3 className='text-lg font-semibold'>Additional Info</h3>
                    <p className='bg-foundation-pale p-4 rounded-md whitespace-pre-wrap'>
                      {application.additionalInfo}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className='text-lg font-semibold'>Uploaded CV</h3>
                  {application.cv ? (
                    <a
                      href={application.cv}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 underline'
                    >
                      View CV
                    </a>
                  ) : (
                    <p>No CV uploaded.</p>
                  )}
                </div>

                <button
                  onClick={() =>
                    alert('This will trigger the CV enhancement feature (TBD)')
                  }
                  className='mt-4 px-5 py-2 bg-primary text-white rounded hover:bg-primary-dark transition'
                >
                  Enhance My CV
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default ApplicationDetails
