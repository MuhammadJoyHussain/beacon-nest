import { useRouter } from 'next/router'
import Header from '@/components/dashboard/Header'
import api from '@/utils/api'
import React, { useState, useEffect } from 'react'
import Footer from '@/components/Footer'
import Button from '@/components/ui/Button'
import dynamic from 'next/dynamic'
import CareerDLodader from '@/components/Loaders/careerLoaders/CareerDetailsLoader'

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

  if (loading) return <CareerDLodader />

  if (!vacancy) {
    return (
      <div className='min-h-screen bg-muted flex items-center justify-center'>
        <p className='text-lg text-destructive'>Vacancy not found.</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-muted text-primary'>
      <Header />
      <main className='max-w-4xl mx-auto px-6 pt-24 pb-10'>
        <div className='bg-white rounded-xl shadow-md p-8'>
          <h2 className='font-bold'>{vacancy.title}</h2>

          <div className='space-y-2 mb-6 text-muted-foreground'>
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

          <section className='space-y-6 text-muted-foreground'>
            <div>
              <h2 className='text-xl font-semibold text-primary mb-2'>
                Company Overview
              </h2>
              <p>{vacancy.companyOverview}</p>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-primary mb-2'>
                Job Summary
              </h2>
              <p>{vacancy.jobSummary}</p>
            </div>

            <div>
              <h2 className='text-xl font-semibold  mb-2'>
                Key Responsibilities
              </h2>
              <ul className='list-disc list-inside space-y-1'>
                {vacancy.keyResponsibilities?.map((item, i) => (
                  <p key={i} className='text-muted-foreground'>
                    {item}
                  </p>
                ))}
              </ul>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-primary mb-2'>
                Required Qualifications
              </h2>
              <ul className='list-disc list-inside space-y-1'>
                {vacancy.requiredQualifications?.map((item, i) => (
                  <p key={i} className='text-primary'>
                    {item}
                  </p>
                ))}
              </ul>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-primary mb-2'>
                Preferred Qualifications
              </h2>
              <p className='list-disc list-inside space-y-1'>
                {vacancy.preferredQualifications?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </p>
            </div>

            <div>
              <h2 className='text-xl font-semibold text-primary mb-2'>
                Benefits
              </h2>
              <ul className='list-disc list-inside space-y-1'>
                {vacancy.benefits?.map((item, i) => (
                  <p key={i}>{item}</p>
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
