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

  useEffect(() => {
    const fetchSkillGap = async () => {
      if (!id) return
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
    setSkillLoading(true)
    const fetchCourses = async () => {
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

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='flex-grow overflow-auto p-8'>
          <div className='max-w-6xl mx-auto bg-white shadow-lg rounded-3xl p-12 space-y-10'>
            <h2 className='text-2xl font-bold text-foundation-primary mb-8 border-b-2 border-foundation-blue pb-4'>
              Application Details
            </h2>

            {loading ? (
              <Skeleton count={10} height={25} />
            ) : error ? (
              <h5 className='text-red-500 font-semibold text-center'>
                {error}
              </h5>
            ) : (
              <div className='space-y-10'>
                {/* Job Info */}
                <section className='bg-gray-100 rounded-2xl p-6 shadow-sm'>
                  <h3 className='mb-4 border-b text-foundation-primary border-foundation-blue pb-2'>
                    Job Information
                  </h3>
                  <h5 className='text-foundation-primary'>
                    <strong className='text-semibold'>Title:</strong>{' '}
                    {application.job.title}
                  </h5>
                  <h5 className='text-foundation-primary'>
                    <strong>Company:</strong> {application.job.company}
                  </h5>
                  <h5 className='mt-2'>
                    <strong>Status:</strong>{' '}
                    <span className='inline-block text-sm px-3 py-1 rounded-full bg-foundation-blue text-white font-semibold'>
                      {application.status}
                    </span>
                  </h5>
                </section>

                {/* Applicant Info */}
                <section className='bg-gray-100 rounded-2xl p-6 shadow-sm'>
                  <h3 className=' font-semibold text-foundation-primary mb-4 border-b border-foundation-blue pb-2'>
                    Applicant Info
                  </h3>
                  <h5 className='text-foundation-primary'>
                    <strong>Name:</strong> {application.fullName}
                  </h5>
                  <h5 className='text-foundation-primary'>
                    <strong>Email:</strong> {application.email}
                  </h5>
                  <h5 className='text-foundation-primary'>
                    <strong>Phone:</strong> {application.phone}
                  </h5>
                </section>

                {/* Additional Details */}
                <section className='bg-gray-100 rounded-2xl p-6 shadow-sm'>
                  <h3 className=' font-semibold text-foundation-primary mb-4 border-b border-foundation-blue pb-2'>
                    Details
                  </h3>
                  <h5>
                    <strong>Experience Years:</strong>{' '}
                    {application.experienceYears}
                  </h5>
                  <h5>
                    <strong>Expected Salary:</strong>{' '}
                    {application.expectedSalary}
                  </h5>
                  <h5>
                    <strong>Start Date:</strong>{' '}
                    {new Date(application.startDate).toLocaleDateString(
                      'en-UK',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </h5>
                  <h5>
                    <strong>LinkedIn:</strong>{' '}
                    <a
                      href={application.linkedIn}
                      className='text-foundation-primary underline hover:text-foundation-blue'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Profile Link
                    </a>
                  </h5>
                  <h5>
                    <strong>Authorized to work:</strong>{' '}
                    {application.authorized ? 'Yes' : 'No'}
                  </h5>
                </section>

                {/* Cover Letter */}
                <section className='bg-gray-100 rounded-2xl p-6 shadow-sm whitespace-pre-wrap'>
                  <h3 className=' font-semibold text-foundation-primary mb-4 border-b border-foundation-blue pb-2'>
                    Cover Letter
                  </h3>
                  <h5>{application.coverLetter}</h5>
                </section>

                {/* Additional Info */}
                {application.additionalInfo && (
                  <section className='bg-gray-100 rounded-2xl p-6 shadow-sm whitespace-pre-wrap'>
                    <h3 className=' font-semibold text-foundation-primary mb-4 border-b border-foundation-blue pb-2'>
                      Additional Info
                    </h3>
                    <h5>{application.additionalInfo}</h5>
                  </section>
                )}

                {/* CV */}
                <section className='bg-gray-100 rounded-2xl p-6 shadow-sm'>
                  <h3 className=' font-semibold text-foundation-primary mb-4 border-b border-foundation-blue pb-2'>
                    Uploaded CV
                  </h3>
                  {application.cv ? (
                    <a
                      href={application.cv}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-foundation-primary underline font-semibold hover:text-foundation-softblue'
                    >
                      View CV
                    </a>
                  ) : (
                    <h5 className='text-gray-700'>No CV uploaded.</h5>
                  )}
                </section>

                {/* Skill Gap */}
                <section className='bg-gray-100 rounded-2xl p-6 shadow-sm'>
                  <h3 className=' font-semibold text-foundation-primary mb-4 border-b border-foundation-blue pb-2'>
                    Skill Gap Analysis
                  </h3>
                  {skillLoading ? (
                    <h5 className='text-gray-700 font-medium'>
                      Checking skills...
                    </h5>
                  ) : skillGap.length > 0 ? (
                    <ul className='list-disc ml-6 text-red-400 font-semibold'>
                      {skillGap.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  ) : (
                    <h5>✅ You meet all the skill requirements!</h5>
                  )}
                </section>

                {/* Recommended Courses */}
                {course.length > 0 && (
                  <section className='bg-gray-100 rounded-2xl p-6 shadow-sm'>
                    <h3 className=' font-semibold text-foundation-primary mb-6 border-b border-foundation-blue pb-3'>
                      📚 Recommended Courses
                    </h3>
                    {course.map(({ _id, skill, courses }) => (
                      <div key={_id} className='mb-6'>
                        <h4 className='text-lg font-semibold text-foundation-primary mb-3 capitalize border-b pb-2'>
                          {skill} courses
                        </h4>
                        <ul className='space-y-4 ml-4'>
                          {courses.map(
                            ({ _id: courseId, title, url, provider }) => (
                              <li
                                key={courseId}
                                className='p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow'
                              >
                                <a
                                  href={url}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='text-foundation-primary font-semibold underline hover:text-foundation-blue'
                                >
                                  {title}
                                </a>
                                <h5 className='text-gray-600 text-sm mt-1'>
                                  Provider: {provider}
                                </h5>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    ))}
                  </section>
                )}

                {/* CV Enhancer Placeholder */}
                <button
                  onClick={() =>
                    alert('This will trigger the CV enhancement feature (TBD)')
                  }
                  className='mt-8 px-6 py-3 bg-foundation-primary text-white font-semibold rounded-xl hover:bg-foundation-blue transition'
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
