import { useRouter } from 'next/router'
import api from '@/utils/api'
import React, { useState, useEffect } from 'react'
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

    const required = vacancy.skills || []
    const userSkillsLower = userSkills.map((s) => s.toLowerCase())

    const gap = required.filter(
      (skill) => !userSkillsLower.includes(skill.toLowerCase())
    )

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
      } catch (err) {
        console.error('Error fetching course:', err)
      } finally {
        setSkillLoading(false)
      }
    }

    fetchCourses()
  }, [skillGap])

  return (
    <div className='flex h-screen background'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='flex-grow overflow-auto p-6 pt-24'>
          <div className='max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 space-y-8'>
            <h2 className='text-start'>
              {loading ? <Skeleton width={300} height={28} /> : vacancy?.title}
            </h2>

            <div className='text-foundation-softblue space-y-2'>
              {loading ? (
                <>
                  <Skeleton width={280} height={20} />
                  <Skeleton width={280} height={20} />
                  <Skeleton width={280} height={20} />
                  <Skeleton width={280} height={20} />
                </>
              ) : (
                <>
                  <p className='text-lg'>
                    <strong>Company:</strong> {vacancy.company}
                  </p>
                  <p className='text-lg'>
                    <strong>Location:</strong> {vacancy.location}
                  </p>
                  <p className='text-lg'>
                    <strong>Type:</strong> {vacancy.type}
                  </p>
                  <p className='text-lg'>
                    <strong>Salary:</strong> {vacancy.salary}
                  </p>
                </>
              )}
            </div>

            <section className='space-y-6'>
              {loading ? (
                <Skeleton count={8} />
              ) : (
                <>
                  {vacancy.companyOverview && (
                    <div>
                      <h2 className='text-xl font-semibold text-foundation-primary mb-2'>
                        Company Overview
                      </h2>
                      <p className='text-base text-foundation-softblue'>
                        {vacancy.companyOverview}
                      </p>
                    </div>
                  )}

                  {vacancy.jobSummary && (
                    <div>
                      <h2 className='text-xl font-semibold text-foundation-primary mb-2'>
                        Job Summary
                      </h2>
                      <p className='text-base text-foundation-softblue'>
                        {vacancy.jobSummary}
                      </p>
                    </div>
                  )}

                  {vacancy.keyResponsibilities?.length > 0 && (
                    <div>
                      <h2 className='text-xl font-semibold text-foundation-primary mb-2'>
                        Key Responsibilities
                      </h2>
                      <ul className='list-disc list-inside text-foundation-softblue space-y-1'>
                        {vacancy.keyResponsibilities.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {vacancy.requiredQualifications?.length > 0 && (
                    <div>
                      <h2 className='text-xl font-semibold text-foundation-primary mb-2'>
                        Required Qualifications
                      </h2>
                      <ul className='list-disc list-inside text-foundation-softblue space-y-1'>
                        {vacancy.requiredQualifications.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {vacancy.preferredQualifications?.length > 0 && (
                    <div>
                      <h2 className='text-xl font-semibold text-foundation-primary mb-2'>
                        Preferred Qualifications
                      </h2>
                      <ul className='list-disc list-inside text-foundation-softblue space-y-1'>
                        {vacancy.preferredQualifications.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {vacancy.benefits?.length > 0 && (
                    <div>
                      <h2 className='text-xl font-semibold text-foundation-primary mb-2'>
                        Benefits
                      </h2>
                      <ul className='list-disc list-inside text-foundation-softblue space-y-1'>
                        {vacancy.benefits.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* Skill Gap & Recommended Courses */}
              {!loading && skillGap.length > 0 && (
                <div>
                  <h2 className='text-xl font-semibold text-foundation-primary mb-2'>
                    Skill Gap
                  </h2>
                  <ul className='list-disc list-inside text-foundation-softblue space-y-1'>
                    {skillGap.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>

                  <div className='mt-6'>
                    {skillLoading ? (
                      <Skeleton count={3} />
                    ) : (
                      <ul className='list-disc list-inside text-foundation-softblue space-y-1'>
                        {courses.length > 0 && (
                          <section className='bg-gray-100 rounded-2xl p-6 shadow-sm'>
                            <h3 className='font-semibold text-foundation-primary mb-6 border-b border-foundation-blue pb-3'>
                              Recommended Courses
                            </h3>
                            {courses.map(({ _id, skill, courses }) => (
                              <div key={_id} className='mb-6'>
                                <h4 className='text-lg font-semibold text-foundation-primary mb-3 capitalize border-b pb-2'>
                                  {skill}
                                </h4>
                                <ul className='space-y-4 ml-4'>
                                  {courses.map(
                                    ({
                                      _id: courseId,
                                      title,
                                      url,
                                      provider,
                                    }) => (
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
                      </ul>
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
                    className='font-semibold'
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
                    Apply
                  </Button>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default VacancyDetail
