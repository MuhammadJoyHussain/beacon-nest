import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import api from '@/utils/api'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { User } from 'lucide-react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

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
        setRecommendedCandidates(recRes.data.matches || [])
        console.log(recRes.data.matches)
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

  const recommendedMap = Array.isArray(recommendedCandidates)
    ? recommendedCandidates.reduce((acc, cand) => {
        acc[cand.candidate_id] = cand.probability
        return acc
      }, {})
    : {}

  function pct(prob) {
    return `${(prob * 100).toFixed(0)}%`
  }

  function getInitials(first, last) {
    return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase()
  }

  return (
    <div className={`${inter.variable} font-sans flex h-screen bg-gray-50`}>
      <Sidebar />
      <div className='flex-grow overflow-auto p-6'>
        <div className='max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-10 space-y-8'>
          <h2 className='text-3xl font-extrabold text-gray-900'>
            Applicants for This Job
          </h2>

          {error && (
            <p className='text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg p-3'>
              {error}
            </p>
          )}

          {loading ? (
            <Skeleton count={5} height={80} />
          ) : applicants.length === 0 ? (
            <div className='text-center text-gray-500 py-10'>
              <User className='mx-auto mb-3 text-gray-400' size={36} />
              <p className='text-lg font-medium'>No applicants found</p>
            </div>
          ) : (
            <ul className='space-y-6'>
              {applicants.map((app) => {
                const prob = recommendedMap[app.user._id] || 0
                return (
                  <li
                    key={app._id}
                    className='bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition p-6'
                  >
                    <div className='flex items-center justify-between'>
                      {/* Avatar + Name */}
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold'>
                          {getInitials(app.user.firstName, app.user.lastName)}
                        </div>
                        <div>
                          <h3 className='text-lg font-semibold text-gray-900'>
                            {app.user.firstName} {app.user.lastName}
                          </h3>
                          <p className='text-sm text-gray-500'>
                            {app.user.email}
                          </p>
                        </div>
                      </div>

                      {/* Match Badge */}
                      {prob > 0 && (
                        <span className='px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow'>
                          Match {pct(prob)}
                        </span>
                      )}
                    </div>

                    {/* Progress bar with percentage */}
                    {prob > 0 && (
                      <div className='mt-4'>
                        <div className='flex items-center justify-between text-xs text-gray-600 mb-1'>
                          <span>Match Probability</span>
                          <span className='font-semibold text-gray-900'>
                            {pct(prob)}
                          </span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div
                            className='h-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all'
                            style={{ width: pct(prob) }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Expandable Details */}
                    {expandedApplicant === app._id && (
                      <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700'>
                        <p>
                          <span className='font-semibold text-gray-900'>
                            Phone:
                          </span>{' '}
                          {app.user.phone}
                        </p>
                        <p>
                          <span className='font-semibold text-gray-900'>
                            Location:
                          </span>{' '}
                          {`${app.user.street}, ${app.user.city}, ${app.user.postcode}, ${app.user.country}`}
                        </p>
                        <p>
                          <span className='font-semibold text-gray-900'>
                            Date of Birth:
                          </span>{' '}
                          {new Date(app.user.dob).toLocaleDateString()}
                        </p>
                        <p>
                          <span className='font-semibold text-gray-900'>
                            Gender:
                          </span>{' '}
                          {app.user.gender}
                        </p>
                        <p>
                          <span className='font-semibold text-gray-900'>
                            Experience:
                          </span>{' '}
                          {app.experienceYears} yrs
                        </p>
                        <p>
                          <span className='font-semibold text-gray-900'>
                            Skills:
                          </span>{' '}
                          {app.user.skills?.join(', ') || 'N/A'}
                        </p>
                        <p>
                          <span className='font-semibold text-gray-900'>
                            Expected Salary:
                          </span>{' '}
                          ${app.expectedSalary?.toLocaleString()}
                        </p>
                        <p>
                          <span className='font-semibold text-gray-900'>
                            Start Date:
                          </span>{' '}
                          {new Date(app.startDate).toLocaleDateString()}
                        </p>
                        <p className='col-span-2'>
                          <span className='font-semibold text-gray-900'>
                            LinkedIn:
                          </span>{' '}
                          <a
                            href={app.linkedIn}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-indigo-600 underline'
                          >
                            {app.linkedIn}
                          </a>
                        </p>
                        <p className='col-span-2'>
                          <span className='font-semibold text-gray-900'>
                            CV:
                          </span>{' '}
                          <a
                            href={app.cv}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-indigo-600 underline'
                          >
                            View CV
                          </a>
                        </p>
                        <p className='col-span-2 whitespace-pre-wrap'>
                          <span className='font-semibold text-gray-900'>
                            Cover Letter:
                          </span>
                          <br />
                          {app.coverLetter}
                        </p>
                        {app.additionalInfo && (
                          <p className='col-span-2'>
                            <span className='font-semibold text-gray-900'>
                              Additional Info:
                            </span>{' '}
                            {app.additionalInfo}
                          </p>
                        )}
                        <p>
                          <span className='font-semibold text-gray-900'>
                            Status:
                          </span>{' '}
                          {app.status}
                        </p>
                        <p>
                          <span className='font-semibold text-gray-900'>
                            Applied On:
                          </span>{' '}
                          {new Date(app.createdAt).toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Toggle Button */}
                    <button
                      onClick={() => toggleDetails(app._id)}
                      className='mt-4 w-full sm:w-auto px-5 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition'
                    >
                      {expandedApplicant === app._id
                        ? 'Hide Details'
                        : 'Show Details'}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobApplicantsPage
