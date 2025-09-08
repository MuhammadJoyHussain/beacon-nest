import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api from '@/utils/api'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { parseJwt } from '@/utils/parseJWT'
import {
  Briefcase,
  Building2,
  MapPin,
  CalendarClock,
  LayoutGrid,
  Table as TableIcon,
  Search,
} from 'lucide-react'

export default function AllJobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [view, setView] = useState('table')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = parseJwt(token)
    if (!user || user.role !== 'admin') {
      toast.error('Unauthorized: Admins only')
      router.push('/login')
      return
    }
    const fetchJobs = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get('/vacancy')
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.jobs)
          ? data.jobs
          : []
        setJobs(list)
      } catch (err) {
        setError('Failed to load jobs')
        toast.error('Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [router])

  const jobTypes = useMemo(() => {
    const set = new Set()
    jobs.forEach((j) => j?.type && set.add(j.type))
    return ['all', ...Array.from(set)]
  }, [jobs])

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase()
    const base = jobs.filter((j) => {
      const byType =
        typeFilter === 'all'
          ? true
          : (j.type || '').toLowerCase() === typeFilter.toLowerCase()
      const byText =
        !term ||
        (j.title || '').toLowerCase().includes(term) ||
        (j.company || '').toLowerCase().includes(term) ||
        (j.location || '').toLowerCase().includes(term)
      return byType && byText
    })
    return base.sort((a, b) => {
      const da = new Date(a.createdAt || a.updatedAt || 0).getTime()
      const db = new Date(b.createdAt || b.updatedAt || 0).getTime()
      return sortOrder === 'newest' ? db - da : da - db
    })
  }, [jobs, search, typeFilter, sortOrder])

  const formatDate = (d) => {
    if (!d) return '—'
    const dt = new Date(d)
    return isNaN(dt) ? '—' : dt.toLocaleDateString()
  }

  const TypeBadge = ({ children }) => {
    const v = String(children || '').toLowerCase()
    const style =
      v === 'full-time'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : v === 'part-time'
        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
        : v === 'contract'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-blue-50 text-blue-700 border-blue-200'
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${style}`}
      >
        {children || '—'}
      </span>
    )
  }

  return (
    <div className='flex h-screen bg-foundation-primaryLight/20'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='pt-20 pb-16 px-4 sm:px-8 flex-grow w-full text-foundation-primary overflow-auto'>
          <section className='rounded-2xl p-6 shadow-md bg-gradient-to-r from-foundation-primary to-foundation-blue text-white'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-center gap-3'>
                <div className='h-10 w-10 rounded-xl bg-white/20 grid place-items-center'>
                  <Briefcase size={18} />
                </div>
                <div>
                  <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight'>
                    All Job Posts
                  </h1>
                  <p className='text-white/80 text-sm'>
                    {loading
                      ? 'Loading…'
                      : `${filteredJobs.length} result${
                          filteredJobs.length === 1 ? '' : 's'
                        }`}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setView('table')}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition
                    ${
                      view === 'table'
                        ? 'bg-white text-foundation-primary'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                >
                  <TableIcon className='h-4 w-4' />
                  Table
                </button>
                <button
                  onClick={() => setView('grid')}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition
                    ${
                      view === 'grid'
                        ? 'bg-white text-foundation-primary'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                >
                  <LayoutGrid className='h-4 w-4' />
                  Cards
                </button>
              </div>
            </div>

            <div className='mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3'>
              <div className='rounded-xl bg-white/10 backdrop-blur px-4 py-3'>
                <p className='text-xs text-white/80'>Total</p>
                <p className='text-lg font-bold'>
                  {loading ? '—' : jobs.length}
                </p>
              </div>
              <div className='rounded-xl bg-white/10 backdrop-blur px-4 py-3'>
                <p className='text-xs text-white/80'>Newest</p>
                <p className='text-lg font-bold'>
                  {loading || filteredJobs.length === 0
                    ? '—'
                    : formatDate(filteredJobs[0]?.createdAt)}
                </p>
              </div>
              <div className='rounded-xl bg-white/10 backdrop-blur px-4 py-3'>
                <p className='text-xs text-white/80'>Types</p>
                <p className='text-lg font-bold'>
                  {loading ? '—' : jobTypes.length - 1}
                </p>
              </div>
              <div className='rounded-xl bg-white/10 backdrop-blur px-4 py-3'>
                <p className='text-xs text-white/80'>Filter</p>
                <p className='text-lg font-bold capitalize'>{typeFilter}</p>
              </div>
            </div>
          </section>

          <section className='mt-6 rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-4 sm:p-5'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3'>
              <div className='relative flex-1 min-w-[240px]'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                <input
                  type='text'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='Search title, company, or location…'
                  className='w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foundation-blue/40'
                  aria-label='Search jobs'
                />
              </div>
              <div className='flex gap-3'>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className='rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foundation-blue/40'
                  aria-label='Filter by type'
                >
                  {jobTypes.map((t) => (
                    <option key={t} value={t}>
                      {t === 'all' ? 'All types' : t}
                    </option>
                  ))}
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className='rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foundation-blue/40'
                  aria-label='Sort order'
                >
                  <option value='newest'>Newest first</option>
                  <option value='oldest'>Oldest first</option>
                </select>
              </div>
            </div>
          </section>

          {error && (
            <div className='mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700'>
              {error}
            </div>
          )}

          {view === 'table' ? (
            <div className='mt-5 hidden sm:block overflow-x-auto bg-white rounded-2xl shadow-sm ring-1 ring-slate-200'>
              <table className='min-w-full table-auto text-sm text-left'>
                <thead className='bg-gradient-to-r from-foundation-primary to-foundation-blue text-white'>
                  <tr>
                    <th className='px-6 py-4 font-semibold'>Title</th>
                    <th className='px-6 py-4 font-semibold'>Company</th>
                    <th className='px-6 py-4 font-semibold'>Location</th>
                    <th className='px-6 py-4 font-semibold'>Type</th>
                    <th className='px-6 py-4 font-semibold'>Posted</th>
                    <th className='px-6 py-4 text-center font-semibold'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(6)].map((_, i) => (
                      <tr key={i} className='border-b border-slate-100'>
                        <td className='px-6 py-4'>
                          <Skeleton width={160} />
                        </td>
                        <td className='px-6 py-4'>
                          <Skeleton width={120} />
                        </td>
                        <td className='px-6 py-4'>
                          <Skeleton width={120} />
                        </td>
                        <td className='px-6 py-4'>
                          <Skeleton width={80} />
                        </td>
                        <td className='px-6 py-4'>
                          <Skeleton width={100} />
                        </td>
                        <td className='px-6 py-4 text-center'>
                          <Skeleton width={120} height={28} />
                        </td>
                      </tr>
                    ))
                  ) : filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan='6' className='py-12 text-center'>
                        <div className='mx-auto max-w-md space-y-2'>
                          <p className='text-lg font-medium'>No jobs found</p>
                          <p className='text-slate-600 text-sm'>
                            Try adjusting your search or filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job) => (
                      <tr
                        key={job._id}
                        className='border-b border-slate-100 hover:bg-slate-50/60'
                      >
                        <td className='px-6 py-4'>{job.title}</td>
                        <td className='px-6 py-4'>{job.company}</td>
                        <td className='px-6 py-4'>{job.location}</td>
                        <td className='px-6 py-4'>
                          <TypeBadge>{job.type}</TypeBadge>
                        </td>
                        <td className='px-6 py-4'>
                          {formatDate(job.createdAt)}
                        </td>
                        <td className='px-6 py-4 text-center'>
                          <Link href={`/admin/candidates/${job._id}`}>
                            <Button>View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className='bg-white rounded-2xl shadow-sm p-5 ring-1 ring-slate-200'
                  >
                    <Skeleton height={22} width='70%' />
                    <Skeleton className='mt-1' height={16} width='45%' />
                    <Skeleton className='mt-1' height={16} width='55%' />
                    <Skeleton className='mt-1' height={16} width='40%' />
                    <Skeleton className='mt-3' width={120} height={32} />
                  </div>
                ))
              ) : filteredJobs.length === 0 ? (
                <div className='col-span-full bg-white rounded-2xl shadow-sm p-8 ring-1 ring-slate-200 text-center'>
                  <p className='text-base font-medium'>No jobs found</p>
                  <p className='text-slate-600 text-sm mt-1'>
                    Try adjusting your search or filters.
                  </p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    className='bg-white rounded-2xl shadow-sm p-5 ring-1 ring-slate-200 hover:shadow-md transition'
                  >
                    <h3 className='text-lg font-semibold text-foundation-primary'>
                      {job.title}
                    </h3>
                    <div className='mt-2 space-y-1 text-slate-700 text-sm'>
                      <p className='flex items-center gap-2'>
                        <Building2 className='h-4 w-4 text-slate-400' />
                        {job.company}
                      </p>
                      <p className='flex items-center gap-2'>
                        <MapPin className='h-4 w-4 text-slate-400' />
                        {job.location}
                      </p>
                      <p className='flex items-center gap-2'>
                        <CalendarClock className='h-4 w-4 text-slate-400' />
                        Posted {formatDate(job.createdAt)}
                      </p>
                    </div>
                    <div className='mt-3'>
                      <TypeBadge>{job.type}</TypeBadge>
                    </div>
                    <div className='mt-4'>
                      <Link href={`/admin/candidates/${job._id}`}>
                        <Button>View</Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
