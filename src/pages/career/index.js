import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/dashboard/Header'
import Footer from '@/components/Footer'
import api from '@/utils/api'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { motion } from 'framer-motion'
import { Search, Filter, MapPin, Building2, ArrowRight } from 'lucide-react'

const Vacancies = () => {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [department, setDepartment] = useState('')
  const [vacancies, setVacancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const departments = [
    'Engineering',
    'Marketing',
    'Design',
    'Product',
    'Customer Success',
    'Sales',
    'Infrastructure',
    'Content Marketing',
    'Human Resources',
    'Data & AI',
  ]
  const types = ['Full-Time', 'Part-Time', 'Contract']

  const fetchVacancies = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/vacancy', {
        params: { search, type, department, page, limit: 5 },
      })
      setVacancies(data.results || [])
      setTotalPages(data.pages || 1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delay = setTimeout(fetchVacancies, 400)
    return () => clearTimeout(delay)
  }, [search, type, department, page])

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1)
  }
  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1)
  }
  const resetFilters = () => {
    setSearch('')
    setType('')
    setDepartment('')
    setPage(1)
  }

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
    <div className='relative min-h-screen overflow-hidden text-[#3D52A0]'>
      <div className='absolute inset-0 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#E9EEFF,transparent_60%),radial-gradient(900px_500px_at_110%_10%,#FFF7F2,transparent_60%),radial-gradient(900px_700px_at_50%_120%,#F2FFFB,transparent_60%)]' />
      <div className='pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#7091E6]/30 blur-3xl animate-blob' />
      <div className='pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#3D52A0]/20 blur-3xl animate-blob animation-delay-2000' />
      <div className='pointer-events-none absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-[#B8C1EC]/20 blur-3xl animate-blob animation-delay-4000' />

      <Header />

      <main className='relative max-w-6xl mx-auto px-4 pt-24 pb-16'>
        <motion.div
          variants={shellIn}
          initial='hidden'
          animate='show'
          className='rounded-3xl bg-white/70 backdrop-blur ring-1 ring-black/5 border border-white/40 shadow-xl p-6 md:p-8 mb-8'
        >
          <div className='flex items-center gap-3 mb-6'>
            <div className='h-9 w-9 grid place-items-center rounded-xl bg-[#E9EEFF] text-[#3D52A0]'>
              <Filter className='h-5 w-5' />
            </div>
            <div className='text-xl font-bold text-[#1B2559]'>
              Find your next role
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-4'>
            <Input
              name='search'
              placeholder='Search by title, company, or location'
              value={search}
              onChange={(e) => {
                setPage(1)
                setSearch(e.target.value)
              }}
              leftIcon={<Search className='h-4 w-4' />}
            />
            <Select
              name='type'
              value={type}
              onChange={(e) => {
                setPage(1)
                setType(e.target.value)
              }}
              label='Type'
            >
              <option value=''>All Types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            <Select
              name='department'
              value={department}
              onChange={(e) => {
                setPage(1)
                setDepartment(e.target.value)
              }}
              label='Department'
            >
              <option value=''>All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
            <Button variant='soft' onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </motion.div>

        {loading ? (
          <ul className='space-y-6'>
            {[...Array(5)].map((_, i) => (
              <li
                key={i}
                className='rounded-2xl bg-white/80 backdrop-blur p-6 ring-1 ring-black/5 border border-white/40 shadow'
              >
                <Skeleton height={22} width={240} />
                <div className='mt-2'>
                  <Skeleton height={16} width={180} />
                </div>
                <div className='mt-1'>
                  <Skeleton height={14} width={220} />
                </div>
                <div className='mt-4'>
                  <Skeleton height={36} width={120} />
                </div>
              </li>
            ))}
          </ul>
        ) : vacancies.length === 0 ? (
          <div className='rounded-2xl bg-white/70 backdrop-blur p-10 text-center ring-1 ring-black/5 border border-white/40'>
            <div className='text-lg font-semibold text-[#1B2559]'>
              No vacancies found
            </div>
            <div className='text-sm text-[#3D52A0]/70 mt-1'>
              Try adjusting your filters or search terms
            </div>
            <div className='mt-6 flex justify-center'>
              <Button variant='soft' onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <motion.ul
            variants={list}
            initial='hidden'
            animate='show'
            className='space-y-6'
          >
            {vacancies.map((job) => (
              <motion.li
                key={job._id}
                variants={item}
                className='group rounded-2xl bg-white/80 backdrop-blur p-6 ring-1 ring-black/5 border border-white/40 shadow hover:shadow-2xl hover:-translate-y-0.5 transition'
              >
                <Link href={`/career/${job._id}`} className='block'>
                  <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='inline-flex items-center gap-1 rounded-full bg-[#E9EEFF] px-2.5 py-1 text-xs font-medium text-[#3D52A0]'>
                          {job.type || 'Type'}
                        </span>
                        {job.department ? (
                          <span className='inline-flex items-center gap-1 rounded-full bg-[#FFF7F2] px-2.5 py-1 text-xs font-medium text-[#3D52A0]'>
                            {job.department}
                          </span>
                        ) : null}
                      </div>
                      <h3 className='mt-2 text-xl font-semibold text-[#1B2559]'>
                        {job.title}
                      </h3>
                      <div className='mt-1 flex flex-wrap items-center gap-4 text-sm text-[#3D52A0]/80'>
                        <span className='inline-flex items-center gap-1'>
                          <Building2 className='h-4 w-4' />
                          {job.company || 'Company'}
                        </span>
                        <span className='inline-flex items-center gap-1'>
                          <MapPin className='h-4 w-4' />
                          {job.location || 'Location'}
                        </span>
                      </div>
                    </div>
                    <div className='md:self-start'>
                      <span className='inline-flex items-center gap-2 rounded-xl bg-[#3D52A0] text-white px-4 py-2 font-medium shadow group-hover:shadow-md group-hover:translate-x-0.5 transition'>
                        View Job <ArrowRight className='h-4 w-4' />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}

        {!loading && totalPages > 1 && (
          <div className='mt-10 flex flex-col items-center gap-4'>
            <div className='flex items-center gap-3'>
              <Button variant='soft' onClick={handlePrev} disabled={page === 1}>
                Previous
              </Button>
              <div className='rounded-xl bg-white/70 backdrop-blur px-4 py-2 ring-1 ring-black/5 border border-white/40 text-sm font-semibold text-[#1B2559]'>
                Page {page} of {totalPages}
              </div>
              <Button
                variant='soft'
                onClick={handleNext}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
            <div className='flex flex-wrap justify-center gap-2'>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 rounded-xl text-sm font-medium transition ${
                    page === i + 1
                      ? 'bg-[#3D52A0] text-white shadow'
                      : 'bg-white/80 text-[#3D52A0] ring-1 ring-black/5 border border-white/40 hover:bg-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Vacancies
