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
  const [courses, setCourses] = useState([])
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
        setCourses(data)
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
          <div className='max-w-6xl mx-auto space-y-12'>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='bg-white shadow rounded-2xl p-8 space-y-4'
            >
              <h1 className='text-3xl font-bold text-gray-900'>
                {loading ? <Skeleton width={300} /> : vacancy?.title}
              </h1>
              <p className='text-lg text-indigo-700 font-medium'>
                {loading ? <Skeleton width={200} /> : vacancy?.company}
              </p>

              {/* Meta */}
              <div className='flex flex-wrap gap-3 text-sm text-gray-600'>
                {loading ? (
                  <Skeleton count={3} width={100} />
                ) : (
                  <>
                    <span className='px-3 py-1 bg-gray-100 rounded-full'>
                      📍 {vacancy?.location}
                    </span>
                    <span className='px-3 py-1 bg-gray-100 rounded-full'>
                      💼 {vacancy?.type}
                    </span>
                    <span className='px-3 py-1 bg-gray-100 rounded-full'>
                      💰 {vacancy?.salary}
                    </span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Job Description Sections */}
            <div className='grid md:grid-cols-3 gap-8'>
              <div className='md:col-span-2 space-y-8'>
                {[
                  {
                    title: 'Company Overview',
                    content: vacancy?.companyOverview,
                  },
                  { title: 'Job Summary', content: vacancy?.jobSummary },
                ].map(
                  (section, i) =>
                    section.content && (
                      <Section key={i} title={section.title}>
                        <p className='text-gray-700 leading-relaxed'>
                          {section.content}
                        </p>
                      </Section>
                    )
                )}

                {[
                  'keyResponsibilities',
                  'requiredQualifications',
                  'preferredQualifications',
                  'benefits',
                ].map(
                  (key, i) =>
                    vacancy?.[key]?.length > 0 && (
                      <Section key={i} title={key.replace(/([A-Z])/g, ' $1')}>
                        <ul className='list-disc list-inside space-y-2 text-gray-700'>
                          {vacancy[key].map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </Section>
                    )
                )}
              </div>

              {/* Sidebar Summary */}
              <aside className='space-y-6'>
                <div className='bg-white rounded-2xl shadow p-6 space-y-3'>
                  <h3 className='text-lg font-semibold text-indigo-700'>
                    Quick Info
                  </h3>
                  <p>
                    <strong>Type:</strong> {vacancy?.type}
                  </p>
                  <p>
                    <strong>Salary:</strong> {vacancy?.salary}
                  </p>
                  <p>
                    <strong>Location:</strong> {vacancy?.location}
                  </p>
                </div>

                {!loading && skillGap.length > 0 && (
                  <div className='bg-white rounded-2xl shadow p-6 space-y-4'>
                    <h3 className='text-lg font-semibold text-indigo-700'>
                      Skill Gap
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      {skillGap.map((skill, i) => (
                        <span
                          key={i}
                          className='px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Recommended Courses */}
                    {skillLoading ? (
                      <Skeleton count={2} />
                    ) : (
                      courses.length > 0 && (
                        <div>
                          <h4 className='text-sm font-semibold text-gray-700 mb-2'>
                            Recommended Courses
                          </h4>
                          <div className='space-y-3'>
                            {courses.map(({ _id, skill, courses }) => (
                              <div key={_id}>
                                <p className='font-semibold text-gray-800 mb-1 capitalize'>
                                  {skill}
                                </p>
                                {courses.map(
                                  ({ _id: cid, title, url, provider }) => (
                                    <a
                                      key={cid}
                                      href={url}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      className='block text-sm text-indigo-600 hover:underline'
                                    >
                                      {title}{' '}
                                      <span className='text-gray-500'>
                                        ({provider})
                                      </span>
                                    </a>
                                  )
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </aside>
            </div>

            {/* Apply Button */}
            <div className='text-center'>
              {loading ? (
                <Skeleton width={140} height={40} />
              ) : (
                <Button
                  className='font-semibold bg-indigo-600 text-white px-6 py-3 rounded-full shadow hover:bg-indigo-700 transition'
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
          </div>
        </main>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className='bg-white rounded-2xl shadow p-6'>
      <h2 className='text-xl font-semibold text-gray-800 border-b pb-2 mb-3'>
        {title}
      </h2>
      {children}
    </div>
  )
}

export default VacancyDetail
