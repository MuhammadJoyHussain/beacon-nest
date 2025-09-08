import { useRouter } from 'next/router'
import Header from '@/components/dashboard/Header'
import api from '@/utils/api'
import React, { useState, useEffect } from 'react'
import Footer from '@/components/Footer'
import Button from '@/components/ui/Button'
import CareerDLodader from '@/components/Loaders/careerLoaders/CareerDetailsLoader'
import { motion } from 'framer-motion'
import {
  MapPin,
  Building2,
  Briefcase,
  Banknote,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
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
      } catch {
        setVacancy(null)
      } finally {
        setLoading(false)
      }
    }
    fetchVacancy()
  }, [router.isReady, id])

  const shellIn = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 160, damping: 18 },
    },
  }
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 20 },
    },
  }

  if (loading) return <CareerDLodader />

  if (!vacancy) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[radial-gradient(1200px_600px_at_-10%_-10%,#E9EEFF,transparent_60%),radial-gradient(900px_500px_at_110%_10%,#FFF7F2,transparent_60%),radial-gradient(900px_700px_at_50%_120%,#F2FFFB,transparent_60%)]'>
        <div className='rounded-2xl bg-white/80 backdrop-blur p-8 ring-1 ring-black/5 border border-white/40 text-[#3D52A0]'>
          Vacancy not found.
        </div>
      </div>
    )
  }

  const goApply = () => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) router.push(`/login?redirect=/career/apply?id=${vacancy._id}`)
    else router.push(`/career/apply?id=${vacancy._id}`)
  }

  return (
    <div className='relative min-h-screen overflow-hidden text-[#3D52A0]'>
      <div className='absolute inset-0 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#E9EEFF,transparent_60%),radial-gradient(900px_500px_at_110%_10%,#FFF7F2,transparent_60%),radial-gradient(900px_700px_at_50%_120%,#F2FFFB,transparent_60%)]' />
      <div className='pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#7091E6]/30 blur-3xl animate-blob' />
      <div className='pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#3D52A0]/20 blur-3xl animate-blob animation-delay-2000' />
      <div className='pointer-events-none absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-[#B8C1EC]/20 blur-3xl animate-blob animation-delay-4000' />

      <Header />

      <main className='relative max-w-6xl mx-auto px-4 pt-24 pb-12'>
        <motion.div
          variants={shellIn}
          initial='hidden'
          animate='show'
          className='mb-6 flex items-center gap-3'
        >
          <Link
            href='/career'
            className='inline-flex items-center gap-2 rounded-xl bg-white/70 backdrop-blur px-4 py-2 ring-1 ring-black/5 border border-white/40 hover:bg-white'
          >
            <ArrowLeft className='h-4 w-4' /> Back to jobs
          </Link>
        </motion.div>

        <motion.div
          variants={shellIn}
          initial='hidden'
          animate='show'
          className='grid lg:grid-cols-[1fr,320px] gap-6'
        >
          <div className='space-y-6'>
            <div className='rounded-3xl bg-white/80 backdrop-blur ring-1 ring-black/5 border border-white/40 shadow-xl p-6 md:p-8'>
              <div className='flex flex-wrap items-start justify-between gap-4'>
                <div>
                  <h1 className='text-2xl md:text-3xl font-extrabold text-[#1B2559]'>
                    {vacancy.title}
                  </h1>
                  <div className='mt-2 flex flex-wrap items-center gap-4 text-sm text-[#3D52A0]/80'>
                    <span className='inline-flex items-center gap-1'>
                      <Building2 className='h-4 w-4' />
                      {vacancy.company}
                    </span>
                    <span className='inline-flex items-center gap-1'>
                      <MapPin className='h-4 w-4' />
                      {vacancy.location}
                    </span>
                    <span className='inline-flex items-center gap-1'>
                      <Briefcase className='h-4 w-4' />
                      {vacancy.type}
                    </span>
                    {vacancy.salary ? (
                      <span className='inline-flex items-center gap-1'>
                        <Banknote className='h-4 w-4' />
                        {vacancy.salary}
                      </span>
                    ) : null}
                  </div>
                </div>
                <Button
                  onClick={goApply}
                  rightIcon={<ArrowRight className='h-4 w-4' />}
                >
                  Apply
                </Button>
              </div>

              <div className='mt-6 flex flex-wrap items-center gap-2'>
                {vacancy.type ? (
                  <span className='rounded-full bg-[#E9EEFF] px-3 py-1 text-xs font-medium'>
                    {vacancy.type}
                  </span>
                ) : null}
                {vacancy.department ? (
                  <span className='rounded-full bg-[#FFF7F2] px-3 py-1 text-xs font-medium'>
                    {vacancy.department}
                  </span>
                ) : null}
                {vacancy.mode ? (
                  <span className='rounded-full bg-[#F2FFFB] px-3 py-1 text-xs font-medium'>
                    {vacancy.mode}
                  </span>
                ) : null}
              </div>
            </div>

            <motion.section
              variants={item}
              initial='hidden'
              animate='show'
              className='rounded-3xl bg-white/80 backdrop-blur ring-1 ring-black/5 border border-white/40 shadow p-6 md:p-8'
            >
              <h2 className='text-xl font-semibold text-[#1B2559]'>
                Company Overview
              </h2>
              <p className='mt-2 text-[#3D52A0]/85 leading-relaxed'>
                {vacancy.companyOverview || '—'}
              </p>
            </motion.section>

            <motion.section
              variants={item}
              initial='hidden'
              animate='show'
              className='rounded-3xl bg-white/80 backdrop-blur ring-1 ring-black/5 border border-white/40 shadow p-6 md:p-8'
            >
              <h2 className='text-xl font-semibold text-[#1B2559]'>
                Job Summary
              </h2>
              <p className='mt-2 text-[#3D52A0]/85 leading-relaxed'>
                {vacancy.jobSummary || '—'}
              </p>
            </motion.section>

            <motion.section
              variants={item}
              initial='hidden'
              animate='show'
              className='rounded-3xl bg-white/80 backdrop-blur ring-1 ring-black/5 border border-white/40 shadow p-6 md:p-8'
            >
              <h2 className='text-xl font-semibold text-[#1B2559]'>
                Key Responsibilities
              </h2>
              <ul className='mt-3 space-y-2'>
                {(vacancy.keyResponsibilities || []).map((t, i) => (
                  <li
                    key={i}
                    className='flex items-start gap-2 text-[#3D52A0]/90'
                  >
                    <CheckCircle2 className='h-4 w-4 mt-0.5 text-[#7091E6]' />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            <motion.section
              variants={item}
              initial='hidden'
              animate='show'
              className='rounded-3xl bg-white/80 backdrop-blur ring-1 ring-black/5 border border-white/40 shadow p-6 md:p-8'
            >
              <h2 className='text-xl font-semibold text-[#1B2559]'>
                Required Qualifications
              </h2>
              <ul className='mt-3 space-y-2'>
                {(vacancy.requiredQualifications || []).map((t, i) => (
                  <li
                    key={i}
                    className='flex items-start gap-2 text-[#3D52A0]/90'
                  >
                    <CheckCircle2 className='h-4 w-4 mt-0.5 text-[#7091E6]' />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            <motion.section
              variants={item}
              initial='hidden'
              animate='show'
              className='rounded-3xl bg-white/80 backdrop-blur ring-1 ring-black/5 border border-white/40 shadow p-6 md:p-8'
            >
              <h2 className='text-xl font-semibold text-[#1B2559]'>
                Preferred Qualifications
              </h2>
              <ul className='mt-3 space-y-2'>
                {(vacancy.preferredQualifications || []).map((t, i) => (
                  <li
                    key={i}
                    className='flex items-start gap-2 text-[#3D52A0]/90'
                  >
                    <CheckCircle2 className='h-4 w-4 mt-0.5 text-[#7091E6]' />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            <motion.section
              variants={item}
              initial='hidden'
              animate='show'
              className='rounded-3xl bg-white/80 backdrop-blur ring-1 ring-black/5 border border-white/40 shadow p-6 md:p-8'
            >
              <h2 className='text-xl font-semibold text-[#1B2559]'>Benefits</h2>
              <ul className='mt-3 space-y-2'>
                {(vacancy.benefits || []).map((t, i) => (
                  <li
                    key={i}
                    className='flex items-start gap-2 text-[#3D52A0]/90'
                  >
                    <CheckCircle2 className='h-4 w-4 mt-0.5 text-[#7091E6]' />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>

          <motion.aside
            variants={item}
            initial='hidden'
            animate='show'
            className='space-y-6'
          >
            <div className='sticky top-24 rounded-3xl bg-white/80 backdrop-blur ring-1 ring-black/5 border border-white/40 shadow-xl p-6'>
              <div className='text-sm text-[#3D52A0]/70'>Quick actions</div>
              <div className='mt-3 space-y-3'>
                <Button
                  className='w-full'
                  onClick={goApply}
                  rightIcon={<ArrowRight className='h-4 w-4' />}
                >
                  Apply Now
                </Button>
                <Link href='/register' className='block'>
                  <Button className='w-full' variant='soft'>
                    Create Account
                  </Button>
                </Link>
                <Link href='/career' className='block'>
                  <Button className='w-full' variant='outline'>
                    Browse More Jobs
                  </Button>
                </Link>
              </div>
              <div className='mt-6 grid grid-cols-2 gap-3 text-xs'>
                <div className='rounded-xl bg-[#E9EEFF] px-3 py-2'>
                  <div className='font-semibold text-[#1B2559]'>
                    {vacancy.type || '—'}
                  </div>
                  <div className='text-[#3D52A0]/70'>Type</div>
                </div>
                <div className='rounded-xl bg-[#FFF7F2] px-3 py-2'>
                  <div className='font-semibold text-[#1B2559]'>
                    {vacancy.salary || '—'}
                  </div>
                  <div className='text-[#3D52A0]/70'>Salary</div>
                </div>
                <div className='rounded-xl bg-[#F2FFFB] px-3 py-2 col-span-2'>
                  <div className='font-semibold text-[#1B2559]'>
                    {vacancy.location || '—'}
                  </div>
                  <div className='text-[#3D52A0]/70'>Location</div>
                </div>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

export default VacancyDetail
