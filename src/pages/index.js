import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Globe,
  Users,
  MapPin,
  Building2,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import Header from '@/components/dashboard/Header'
import Footer from '@/components/Footer'
import api from '@/utils/api'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { motion } from 'framer-motion'

const HomePage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchVacancies = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/vacancy', { params: { limit: 3 } })
      setJobs(data.results || [])
    } catch (error) {
      setError('Failed to load job listings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delay = setTimeout(fetchVacancies, 400)
    return () => clearTimeout(delay)
  }, [])

  const shellIn = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 160, damping: 18 },
    },
  }
  const list = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  }
  const item = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 20 },
    },
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-[#EDE8F5] text-[#3D52A0]'>
      <div className='absolute inset-0 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#E9EEFF,transparent_60%),radial-gradient(900px_500px_at_110%_10%,#FFF7F2,transparent_60%),radial-gradient(900px_700px_at_50%_120%,#F2FFFB,transparent_60%)]' />
      <div className='pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#7091E6]/30 blur-3xl animate-blob' />
      <div className='pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#3D52A0]/20 blur-3xl animate-blob animation-delay-2000' />
      <div className='pointer-events-none absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-[#B8C1EC]/20 blur-3xl animate-blob animation-delay-4000' />

      <Header />

      <section className='relative overflow-hidden'>
        <motion.div
          variants={shellIn}
          initial='hidden'
          animate='show'
          className='max-w-7xl mx-auto pt-24 pb-16 px-4 text-center'
        >
          <div className='mx-auto inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-xs font-medium ring-1 ring-black/5 border border-white/40'>
            <Sparkles className='h-3.5 w-3.5' />
            New roles added weekly
          </div>
          <h1 className='mt-5 text-4xl md:text-5xl font-extrabold tracking-tight text-[#1B2559]'>
            Find work that fits your life
          </h1>
          <p className='mx-auto mt-4 max-w-2xl text-base md:text-lg text-[#3D52A0]/80'>
            Beacon Nest connects you with real opportunities from trusted
            companies across the globe.
          </p>
          <div className='mt-8 flex items-center justify-center gap-3'>
            <Link
              href='/career'
              className='inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#3D52A0] via-[#5F79D4] to-[#7091E6] px-6 py-3 text-white font-semibold shadow hover:shadow-md active:scale-[.99] transition'
            >
              Browse Jobs <ArrowRight className='h-4 w-4' />
            </Link>
            <Link
              href='/register'
              className='inline-flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur px-6 py-3 text-[#3D52A0] font-semibold ring-1 ring-black/5 border border-white/40 hover:bg-white'
            >
              Create Account
            </Link>
          </div>

          <div className='mt-10 grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='rounded-2xl bg-white/70 backdrop-blur p-4 ring-1 ring-black/5 border border-white/40'>
              <div className='text-2xl font-extrabold text-[#1B2559]'>3k+</div>
              <div className='text-xs text-[#3D52A0]/70'>Active roles</div>
            </div>
            <div className='rounded-2xl bg-white/70 backdrop-blur p-4 ring-1 ring-black/5 border border-white/40'>
              <div className='text-2xl font-extrabold text-[#1B2559]'>1.2k</div>
              <div className='text-xs text-[#3D52A0]/70'>Hiring partners</div>
            </div>
            <div className='rounded-2xl bg-white/70 backdrop-blur p-4 ring-1 ring-black/5 border border-white/40'>
              <div className='text-2xl font-extrabold text-[#1B2559]'>52</div>
              <div className='text-xs text-[#3D52A0]/70'>Countries</div>
            </div>
            <div className='rounded-2xl bg-white/70 backdrop-blur p-4 ring-1 ring-black/5 border border-white/40'>
              <div className='text-2xl font-extrabold text-[#1B2559]'>30k+</div>
              <div className='text-xs text-[#3D52A0]/70'>Placed candidates</div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className='relative py-14'>
        <motion.div
          variants={list}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.3 }}
          className='max-w-7xl mx-auto grid md:grid-cols-3 gap-6 px-4'
        >
          <motion.div
            variants={item}
            className='rounded-2xl bg-white/80 backdrop-blur p-6 ring-1 ring-black/5 border border-white/40 hover:shadow-xl transition'
          >
            <div className='mx-auto h-12 w-12 grid place-items-center rounded-xl bg-[#E9EEFF] text-[#3D52A0]'>
              <Briefcase className='h-6 w-6' />
            </div>
            <h4 className='mt-4 text-lg font-semibold text-[#1B2559]'>
              Top Companies
            </h4>
            <p className='mt-1 text-sm text-[#3D52A0]/80'>
              Work with reputable employers across tech, finance, healthcare,
              and more.
            </p>
          </motion.div>
          <motion.div
            variants={item}
            className='rounded-2xl bg-white/80 backdrop-blur p-6 ring-1 ring-black/5 border border-white/40 hover:shadow-xl transition'
          >
            <div className='mx-auto h-12 w-12 grid place-items-center rounded-xl bg-[#E9EEFF] text-[#3D52A0]'>
              <Users className='h-6 w-6' />
            </div>
            <h4 className='mt-4 text-lg font-semibold text-[#1B2559]'>
              Community Focused
            </h4>
            <p className='mt-1 text-sm text-[#3D52A0]/80'>
              Inclusive hiring and real support for every step of your journey.
            </p>
          </motion.div>
          <motion.div
            variants={item}
            className='rounded-2xl bg-white/80 backdrop-blur p-6 ring-1 ring-black/5 border border-white/40 hover:shadow-xl transition'
          >
            <div className='mx-auto h-12 w-12 grid place-items-center rounded-xl bg-[#E9EEFF] text-[#3D52A0]'>
              <Globe className='h-6 w-6' />
            </div>
            <h4 className='mt-4 text-lg font-semibold text-[#1B2559]'>
              Global Reach
            </h4>
            <p className='mt-1 text-sm text-[#3D52A0]/80'>
              Remote and on-site roles spanning cities worldwide.
            </p>
          </motion.div>
        </motion.div>
      </section>

      <section className='relative py-16'>
        <div className='max-w-7xl mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center text-[#1B2559]'>
            Popular Job Listings
          </h2>
          <p className='mt-2 text-center text-[#3D52A0]/80'>
            Handpicked roles trending with candidates this week
          </p>

          {error ? (
            <p className='mt-10 text-center text-red-500'>{error}</p>
          ) : (
            <motion.div
              variants={list}
              initial='hidden'
              whileInView='show'
              viewport={{ once: true, amount: 0.2 }}
              className='mt-10 grid md:grid-cols-3 gap-6'
            >
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className='rounded-2xl bg-white/80 backdrop-blur p-6 ring-1 ring-black/5 border border-white/40'
                  >
                    <h4 className='mb-2 text-lg font-semibold'>
                      <Skeleton width={160} />
                    </h4>
                    <p className='mb-3'>
                      <Skeleton width={220} />
                    </p>
                    <Skeleton height={36} width={120} />
                  </div>
                ))
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <motion.div
                    key={job._id}
                    variants={item}
                    className='group rounded-2xl bg-white/80 backdrop-blur p-6 ring-1 ring-black/5 border border-white/40 hover:shadow-2xl hover:-translate-y-0.5 transition'
                  >
                    <div className='flex items-center gap-2 text-xs text-[#3D52A0]/70'>
                      <span className='inline-flex items-center gap-1 rounded-full bg-[#E9EEFF] px-2 py-1'>
                        Featured
                      </span>
                      <span className='inline-flex items-center gap-1 rounded-full bg-[#FFF7F2] px-2 py-1'>
                        New
                      </span>
                    </div>
                    <h3 className='mt-3 text-lg font-semibold text-[#1B2559]'>
                      {job.title}
                    </h3>
                    <div className='mt-1 flex items-center gap-3 text-sm text-[#3D52A0]/80'>
                      <span className='inline-flex items-center gap-1'>
                        <Building2 className='h-4 w-4' />
                        {job.company || 'Company'}
                      </span>
                      <span className='inline-flex items-center gap-1'>
                        <MapPin className='h-4 w-4' />
                        {job.location || 'Location'}
                      </span>
                    </div>
                    <Link
                      href={`/career/${job._id}`}
                      className='mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3D52A0] px-4 py-2 font-medium shadow hover:shadow-md group-hover:translate-x-0.5 transition'
                    >
                      View Job <ArrowRight className='h-4 w-4' />
                    </Link>
                  </motion.div>
                ))
              ) : (
                <p className='text-center col-span-3'>No job listings found.</p>
              )}
            </motion.div>
          )}

          <div className='mt-10 text-center'>
            <Link
              href='/career'
              className='inline-flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur px-6 py-3 text-[#3D52A0] font-semibold ring-1 ring-black/5 border border-white/40 hover:bg-white'
            >
              Explore all jobs
            </Link>
          </div>
        </div>
      </section>

      <section className='relative py-20 px-4'>
        <div className='max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-[#3D52A0] via-[#5F79D4] to-[#7091E6] p-10 text-white shadow-xl'>
          <h2 className='text-3xl md:text-4xl font-bold'>
            Ready to take the next step?
          </h2>
          <p className='mt-2 text-white/90 max-w-2xl'>
            Join thousands of job seekers building their future with Beacon
            Nest.
          </p>
          <div className='mt-6 flex flex-wrap items-center gap-3'>
            <Link
              href='/register'
              className='inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-[#3D52A0] font-semibold shadow hover:shadow-md active:scale-[.99] transition'
            >
              Create Account <ArrowRight className='h-4 w-4' />
            </Link>
            <Link
              href='/career'
              className='inline-flex items-center gap-2 rounded-2xl bg-white/20 px-6 py-3 text-white font-semibold ring-1 ring-white/40 hover:bg-white/25'
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage
