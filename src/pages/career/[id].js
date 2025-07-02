import { useRouter } from 'next/router'
import Header from '@/components/Header'
import api from '@/utils/api'
import React, { useState, useEffect } from 'react'
import Footer from '@/components/Footer'
import Button from '@/components/ui/Button'
import Link from 'next/link'

const VacancyDetail = () => {
  const router = useRouter()
  const { id } = router.query

  const [vacancy, setVacancy] = useState(null)
  const [loading, setLoading] = useState(true)

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
    return (
      <div className='min-h-screen bg-green-50 flex items-center justify-center'>
        <p className='text-lg text-gray-600'>Loading...</p>
      </div>
    )
  }

  if (!vacancy) {
    return (
      <div className='min-h-screen bg-green-50 flex items-center justify-center'>
        <p className='text-lg text-red-600'>Vacancy not found.</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-green-50'>
      <Header />
      <main className='max-w-4xl mx-auto px-6 pt-24 pb-10'>
        <div className='bg-white rounded-xl shadow-md p-8'>
          <h1 className='text-3xl font-bold text-green-800 mb-4'>
            {vacancy.title}
          </h1>

          <div className='space-y-2 mb-6'>
            <p className='text-gray-700'>
              <strong>Company:</strong> {vacancy.company}
            </p>
            <p className='text-gray-700'>
              <strong>Location:</strong> {vacancy.location}
            </p>
            <p className='text-gray-700'>
              <strong>Type:</strong> {vacancy.type}
            </p>
            <p className='text-gray-700'>
              <strong>Salary:</strong> {vacancy.salary}
            </p>
          </div>

          <section className='space-y-6'>
            <div>
              <h2 className='text-xl font-semibold text-green-700 mb-2'>
                Company Overview
              </h2>
              <p className='text-gray-600'>{vacancy.companyOverview}</p>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-green-700 mb-2'>
                Job Summary
              </h2>
              <p className='text-gray-600'>{vacancy.jobSummary}</p>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-green-700 mb-2'>
                Key Responsibilities
              </h2>
              <ul className='list-disc list-inside text-gray-600 space-y-1'>
                {vacancy.keyResponsibilities?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-green-700 mb-2'>
                Required Qualifications
              </h2>
              <ul className='list-disc list-inside text-gray-600 space-y-1'>
                {vacancy.requiredQualifications?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-green-700 mb-2'>
                Preferred Qualifications
              </h2>
              <ul className='list-disc list-inside text-gray-600 space-y-1'>
                {vacancy.preferredQualifications?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-green-700 mb-2'>
                Benefits
              </h2>
              <ul className='list-disc list-inside text-gray-600 space-y-1'>
                {vacancy.benefits?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <Button
              className='font-semibold'
              onClick={() => {
                const token = localStorage.getItem('token')
                if (!token) {
                  router.push(`/login?redirect=/career/apply?id=${vacancy._id}`)
                } else {
                  router.push(`/career/apply?id=${vacancy._id}`)
                }
              }}
            >
              Apply
            </Button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default VacancyDetail
