import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import api from '@/utils/api'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const JobApplicantsPage = () => {
  const router = useRouter()
  const { id } = router.query

  const [applicants, setApplicants] = useState([])
  const [recommendedCandidates, setRecommendedCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedApplicant, setExpandedApplicant] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || !id) return
    const fetchApplicantsAndRecommendations = async () => {
      setLoading(true)
      try {
        const applicantsRes = await api.get(`/application/job/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setApplicants(applicantsRes.data)

        const recRes = await api.get(`/recommend/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setRecommendedCandidates(recRes.data)
      } catch (err) {
        console.error(err)
        setError('Failed to fetch applicants or recommendations')
      }
      setLoading(false)
    }
    fetchApplicantsAndRecommendations()
  }, [id])

  const toggleDetails = (appId) => {
    setExpandedApplicant((prev) => (prev === appId ? null : appId))
  }

  // Create a map of user_id -> match_probability for quick lookup
  const recommendedMap = recommendedCandidates.reduce((acc, cand) => {
    acc[cand.user_id] = cand.match_probability
    return acc
  }, {})

  return (
    <div className='flex h-screen background'>
      <Sidebar />
      <div className='flex-grow overflow-auto p-6'>
        <div className='max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-10 space-y-8'>
          <h2 className='text-2xl font-bold text-foundation-primary'>
            Applicants for This Job
          </h2>
          {error && <p className='text-red-500'>{error}</p>}
          {loading ? (
            <Skeleton count={5} height={60} />
          ) : (
            <>
              {applicants.length === 0 ? (
                <p>No applicants found for this job.</p>
              ) : (
                <ul className='space-y-6'>
                  {applicants.map((app) => (
                    <li
                      key={app._id}
                      className='border p-6 rounded-xl shadow-sm bg-gray-50 space-y-2'
                    >
                      <h3 className='text-xl font-bold flex items-center space-x-2'>
                        <span>
                          {app.user.firstName} {app.user.lastName}
                        </span>
                        {recommendedMap[app.user._id] > 0.00000000004 && (
                          <span className='text-sm text-green-600 font-semibold bg-green-100 px-2 py-1 rounded'>
                            Recommended
                          </span>
                        )}
                      </h3>
                      <p>
                        <strong>Email:</strong> {app.user.email}
                      </p>
                      {expandedApplicant === app._id && (
                        <div className='space-y-2'>
                          <p>
                            <strong>Phone:</strong> {app.user.phone}
                          </p>
                          <p>
                            <strong>Location:</strong> {app.user.street},{' '}
                            {app.user.city}, {app.user.postcode},{' '}
                            {app.user.country}
                          </p>
                          <p>
                            <strong>Date of Birth:</strong>{' '}
                            {new Date(app.user.dob).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Gender:</strong> {app.user.gender}
                          </p>
                          <p>
                            <strong>Years of Experience:</strong>{' '}
                            {app.experienceYears}
                          </p>
                          <p>
                            <strong>Skills:</strong>{' '}
                            {app.user.skills?.join(', ') || 'N/A'}
                          </p>
                          <p>
                            <strong>Expected Salary:</strong> $
                            {app.expectedSalary?.toLocaleString()}
                          </p>
                          <p>
                            <strong>Start Date:</strong>{' '}
                            {new Date(app.startDate).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>LinkedIn:</strong>{' '}
                            <a
                              href={app.linkedIn}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-500 underline'
                            >
                              {app.linkedIn}
                            </a>
                          </p>
                          <p>
                            <strong>CV:</strong>{' '}
                            <a
                              href={app.cv}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-500 underline'
                            >
                              View CV
                            </a>
                          </p>
                          <p>
                            <strong>Cover Letter:</strong>
                            <br />
                            <span className='whitespace-pre-wrap'>
                              {app.coverLetter}
                            </span>
                          </p>
                          <p>
                            <strong>Additional Info:</strong>{' '}
                            {app.additionalInfo || 'N/A'}
                          </p>
                          <p>
                            <strong>Status:</strong> {app.status}
                          </p>
                          <p>
                            <strong>Applied On:</strong>{' '}
                            {new Date(app.createdAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => toggleDetails(app._id)}
                        className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                      >
                        {expandedApplicant === app._id
                          ? 'Hide Details'
                          : 'Show Details'}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobApplicantsPage
