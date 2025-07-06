import { useRouter } from 'next/router'
import Header from '@/components/dashboard/Header'
import api from '@/utils/api'
import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/dashboard/Sidebar'

const VacancyDetail = () => {
  const router = useRouter()
  const { id } = router.query

  const [vacancy, setVacancy] = useState(null)
  const [loading, setLoading] = useState(true)

  const LoadingScreen = dynamic(() => import('@/components/Loading'), {
    ssr: false,
  })

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

  if (loading) {
    return <LoadingScreen />
  }

  if (!vacancy) {
    return (
      <div className='min-h-screen bg-green-50 flex items-center justify-center'>
        <p className='text-lg text-red-600'>Vacancy not found.</p>
      </div>
    )
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <Header />

        <main className='flex-grow overflow-auto p-6 pt-24'>
          <div className='max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 space-y-8'>
            <h1 className='text-3xl font-bold text-green-800 text-center'>
              {vacancy.title}
            </h1>

            <div className='text-gray-700 space-y-2 text-center'>
              <p>
                <strong>Company:</strong> {vacancy.company}
              </p>
              <p>
                <strong>Location:</strong> {vacancy.location}
              </p>
              <p>
                <strong>Type:</strong> {vacancy.type}
              </p>
              <p>
                <strong>Salary:</strong> {vacancy.salary}
              </p>
            </div>

            <section className='space-y-6'>
              {vacancy.companyOverview && (
                <div>
                  <h2 className='text-xl font-semibold text-green-700 mb-2'>
                    Company Overview
                  </h2>
                  <p className='text-gray-600'>{vacancy.companyOverview}</p>
                </div>
              )}

              {vacancy.jobSummary && (
                <div>
                  <h2 className='text-xl font-semibold text-green-700 mb-2'>
                    Job Summary
                  </h2>
                  <p className='text-gray-600'>{vacancy.jobSummary}</p>
                </div>
              )}

              {vacancy.keyResponsibilities?.length > 0 && (
                <div>
                  <h2 className='text-xl font-semibold text-green-700 mb-2'>
                    Key Responsibilities
                  </h2>
                  <ul className='list-disc list-inside text-gray-600 space-y-1'>
                    {vacancy.keyResponsibilities.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {vacancy.requiredQualifications?.length > 0 && (
                <div>
                  <h2 className='text-xl font-semibold text-green-700 mb-2'>
                    Required Qualifications
                  </h2>
                  <ul className='list-disc list-inside text-gray-600 space-y-1'>
                    {vacancy.requiredQualifications.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {vacancy.preferredQualifications?.length > 0 && (
                <div>
                  <h2 className='text-xl font-semibold text-green-700 mb-2'>
                    Preferred Qualifications
                  </h2>
                  <ul className='list-disc list-inside text-gray-600 space-y-1'>
                    {vacancy.preferredQualifications.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {vacancy.benefits?.length > 0 && (
                <div>
                  <h2 className='text-xl font-semibold text-green-700 mb-2'>
                    Benefits
                  </h2>
                  <ul className='list-disc list-inside text-gray-600 space-y-1'>
                    {vacancy.benefits.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className='text-center'>
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
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default VacancyDetail
