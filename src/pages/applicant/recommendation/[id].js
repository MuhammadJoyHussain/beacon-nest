import { useRouter } from 'next/router'
import api from '@/utils/api'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import Sidebar from '@/components/dashboard/Sidebar'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import authApi from '@/utils/authApi'

const VacancyDetail = () => {
  const router = useRouter()
  const { id } = router.query

  const [vacancy, setVacancy] = useState(null)
  const [loading, setLoading] = useState(true)

  const [userSkills, setUserSkills] = useState([])
  const [skillGap, setSkillGap] = useState([])
  const [courses, setCourse] = useState([])
  const [skillLoading, setSkillLoading] = useState(false)

  useEffect(() => {
    if (!router.isReady || !id) return

    const fetchVacancy = async () => {
      try {
        const { data } = await api.get(`/vacancy/${id}`)
        setVacancy(data)
      } catch (error) {
        console.error('Error fetching vacancy:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVacancy()
  }, [router.isReady, id])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const fetchUserSkills = async () => {
      try {
        const { data } = await authApi.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })

        setUserSkills(data.skills || [])
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    fetchUserSkills()
  }, [])

  useEffect(() => {
    if (!vacancy || !userSkills.length) return

    const required = (vacancy.skills || []).map((s) => s.toLowerCase())
    const userSkillsLower = userSkills.map((s) => s.toLowerCase())

    const gap = required.filter((skill) => !userSkillsLower.includes(skill))

    setSkillGap(gap)
  }, [vacancy, userSkills])

  useEffect(() => {
    if (skillGap.length === 0) return

    const fetchCourses = async () => {
      setSkillLoading(true)
      try {
        const query = skillGap.map((s) => s.toLowerCase()).join(',')
        const { data } = await api.get(`/course?skills=${query}`)

        setCourse(data)

        console.log(courses)
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
        <main className='flex-grow overflow-auto p-6 pt-24'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-10 space-y-10'
          >
            {/* Job Title */}
            <h1 className='text-3xl font-bold text-gray-900'>
              {loading ? <Skeleton width={300} height={28} /> : vacancy?.title}
            </h1>

            {/* Job Meta */}
            <div className='grid md:grid-cols-2 gap-4 text-gray-600'>
              {loading ? (
                <Skeleton count={4} height={20} />
              ) : (
                <>
                  <p>
                    <span className='font-semibold'>Company:</span>{' '}
                    {vacancy.company}
                  </p>
                  <p>
                    <span className='font-semibold'>Location:</span>{' '}
                    {vacancy.location}
                  </p>
                  <p>
                    <span className='font-semibold'>Type:</span> {vacancy.type}
                  </p>
                  <p>
                    <span className='font-semibold'>Salary:</span>{' '}
                    {vacancy.salary}
                  </p>
                </>
              )}
            </div>

            {/* Sections */}
            <div className='space-y-8'>
              {[
                {
                  title: 'Company Overview',
                  content: vacancy?.companyOverview,
                },
                { title: 'Job Summary', content: vacancy?.jobSummary },
              ].map((section, i) =>
                section.content && !loading ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className='bg-gray-50 rounded-2xl p-6 shadow-sm'
                  >
                    <h2 className='text-xl font-semibold text-gray-800 border-b pb-2 mb-3'>
                      {section.title}
                    </h2>
                    <p className='text-gray-600'>{section.content}</p>
                  </motion.div>
                ) : null
              )}

              {/* Lists */}
              {[
                'keyResponsibilities',
                'requiredQualifications',
                'preferredQualifications',
                'benefits',
              ].map((key, i) =>
                vacancy?.[key]?.length > 0 && !loading ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.15 }}
                    className='bg-gray-50 rounded-2xl p-6 shadow-sm'
                  >
                    <h2 className='text-xl font-semibold text-gray-800 border-b pb-2 mb-3'>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </h2>
                    <ul className='list-disc list-inside space-y-2 text-gray-600'>
                      {vacancy[key].map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </motion.div>
                ) : null
              )}
            </div>

            {/* Skill Gap */}
            {!loading && skillGap.length > 0 && (
              <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-inner'>
                <h2 className='text-xl font-semibold text-indigo-700 mb-4'>
                  Skill Gap
                </h2>
                <div className='flex flex-wrap gap-2'>
                  {skillGap.map((skill, i) => (
                    <span
                      key={i}
                      className='px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium'
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Recommended Courses */}
                <div className='mt-6'>
                  {skillLoading ? (
                    <Skeleton count={3} />
                  ) : (
                    courses.length > 0 && (
                      <section>
                        <h3 className='text-lg font-semibold text-indigo-700 mb-4'>
                          Recommended Courses
                        </h3>
                        <div className='grid md:grid-cols-2 gap-4'>
                          {courses.map(({ _id, skill, courses }) => (
                            <div key={_id} className='space-y-4'>
                              <h4 className='text-gray-800 font-semibold border-b pb-2 capitalize'>
                                {skill}
                              </h4>
                              {courses.map(
                                ({ _id: courseId, title, url, provider }) => (
                                  <a
                                    key={courseId}
                                    href={url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='block p-4 bg-white rounded-xl shadow hover:shadow-lg transition'
                                  >
                                    <p className='font-semibold text-indigo-600'>
                                      {title}
                                    </p>
                                    <span className='text-sm text-gray-500'>
                                      Provider: {provider}
                                    </span>
                                  </a>
                                )
                              )}
                            </div>
                          ))}
                        </div>
                      </section>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Apply Button */}
            <div className='text-center'>
              {loading ? (
                <Skeleton width={120} height={40} />
              ) : (
                <Button
                  className='font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-3 rounded-full shadow hover:opacity-90 transition'
                  onClick={() => {
                    const token = localStorage.getItem('token')
                    if (!token) {
                      router.push(
                        `/login?redirect=/career/apply?id=${vacancy._id}`
                      )
                    } else {
                      router.push(`/career/apply?id=${vacancy._id}`)
                    }
                  }}
                >
                  Apply Now
                </Button>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default VacancyDetail
