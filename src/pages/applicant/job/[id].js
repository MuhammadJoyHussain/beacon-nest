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

  const [skillGap, setSkillGap] = useState([])
  const [course, setCourse] = useState([])
  const [skillLoading, setSkillLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem('token')
        const { data } = await api.get(`/application/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setApplication(data)
      } catch (err) {
        setError('Application not found or unauthorized.')
      } finally {
        setLoading(false)
      }
    }
    fetchApplication()
  }, [id])

  useEffect(() => {
    if (!id) return
    const fetchSkillGap = async () => {
      setSkillLoading(true)
      try {
        const token = localStorage.getItem('token')
        const { data } = await api.get(`/application/${id}/skill-gap`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSkillGap(data.skillGap)
      } catch (err) {
        console.error('Error fetching skill gap:', err)
      } finally {
        setSkillLoading(false)
      }
    }
    fetchSkillGap()
  }, [id])

  useEffect(() => {
    if (skillGap.length === 0) return
    const fetchCourses = async () => {
      setSkillLoading(true)
      try {
        const query = skillGap.map((s) => s.toLowerCase()).join(',')
        const { data } = await api.get(`/course?skills=${query}`)
        setCourse(data)
      } catch (err) {
        console.error('Error fetching course:', err)
      } finally {
        setSkillLoading(false)
      }
    }
    fetchCourses()
  }, [skillGap])

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Accepted: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
  }

  return (
    <div className='flex h-screen bg-gradient-to-br from-gray-50 to-white'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='flex-grow overflow-auto p-8'>
          <div className='max-w-6xl mx-auto space-y-10'>
            {/* Header */}
            <h2 className='text-3xl font-bold text-gray-900'>
              Application Details
            </h2>

            {loading ? (
              <Skeleton count={12} height={25} />
            ) : error ? (
              <h5 className='text-red-500 font-semibold text-center'>
                {error}
              </h5>
            ) : (
              <>
                {/* Applicant Card */}
                <div className='bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
                  <div>
                    <h3 className='text-2xl font-bold text-gray-900'>
                      {application.fullName}
                    </h3>
                    <p className='text-gray-600'>{application.email}</p>
                    <p className='text-gray-600'>{application.phone}</p>
                    {application.linkedIn && (
                      <a
                        href={application.linkedIn}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-indigo-600 hover:underline mt-2 block'
                      >
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                  <div className='flex flex-col items-start md:items-end gap-3'>
                    <span
                      className={`px-4 py-1 text-sm font-medium rounded-full ${
                        statusColors[application.status] ||
                        'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {application.status}
                    </span>
                    {application.cv && (
                      <a
                        href={application.cv}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='px-4 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition'
                      >
                        View CV
                      </a>
                    )}
                  </div>
                </div>

                {/* Job + Applicant Info in two columns */}
                <div className='grid md:grid-cols-2 gap-8'>
                  <Section title='Job Information'>
                    <p>
                      <strong>Title:</strong> {application.job?.title}
                    </p>
                    <p>
                      <strong>Company:</strong> {application.job?.company}
                    </p>
                    <p>
                      <strong>Expected Salary:</strong>{' '}
                      {application.expectedSalary}
                    </p>
                    <p>
                      <strong>Start Date:</strong>{' '}
                      {new Date(application.startDate).toLocaleDateString(
                        'en-UK',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </p>
                  </Section>

                  <Section title='Applicant Information'>
                    <p>
                      <strong>Experience Years:</strong>{' '}
                      {application.experienceYears}
                    </p>
                    <p>
                      <strong>Department:</strong>{' '}
                      {application.department || 'N/A'}
                    </p>
                    <p>
                      <strong>Authorized to Work:</strong>{' '}
                      {application.authorized ? 'Yes' : 'No'}
                    </p>
                    <p>
                      <strong>Share Code:</strong>{' '}
                      {application.shareCode || 'N/A'}
                    </p>
                  </Section>
                </div>

                {/* Cover Letter */}
                <Section title='Cover Letter'>
                  <p className='whitespace-pre-wrap'>
                    {application.coverLetter}
                  </p>
                </Section>

                {/* Additional Info */}
                {application.additionalInfo && (
                  <Section title='Additional Information'>
                    <p className='whitespace-pre-wrap'>
                      {application.additionalInfo}
                    </p>
                  </Section>
                )}

                {/* Skill Gap */}
                <Section title='Skill Gap Analysis'>
                  {skillLoading ? (
                    <p className='text-gray-600'>Checking skills...</p>
                  ) : skillGap.length > 0 ? (
                    <div className='flex flex-wrap gap-2'>
                      {skillGap.map((skill, index) => (
                        <span
                          key={index}
                          className='px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className='text-green-600 font-medium'>
                      ✅ You meet all the skill requirements!
                    </p>
                  )}
                </Section>

                {/* Recommended Courses */}
                {course.length > 0 && (
                  <Section title='Recommended Courses'>
                    {course.map(({ _id, skill, courses }) => (
                      <div key={_id} className='mb-6'>
                        <h4 className='text-lg font-semibold text-gray-800 mb-3 capitalize border-b pb-2'>
                          {skill} Courses
                        </h4>
                        <div className='grid md:grid-cols-2 gap-4'>
                          {courses.map(
                            ({ _id: courseId, title, url, provider }) => (
                              <a
                                key={courseId}
                                href={url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='p-4 bg-white border rounded-xl shadow hover:shadow-md transition'
                              >
                                <p className='font-semibold text-indigo-600'>
                                  {title}
                                </p>
                                <p className='text-sm text-gray-500'>
                                  Provider: {provider}
                                </p>
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </Section>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

// Reusable styled section
function Section({ title, children }) {
  return (
    <section className='bg-white rounded-2xl shadow p-6 space-y-3'>
      <h3 className='text-xl font-semibold text-indigo-700 border-b border-indigo-200 pb-2'>
        {title}
      </h3>
      {children}
    </section>
  )
}

export default ApplicationDetails
