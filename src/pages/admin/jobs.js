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

export default function AllJobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

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

  return (
    <div className='flex h-screen bg-foundation-background'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='pt-20 pb-16 px-4 sm:px-8 flex-grow w-full text-foundation-primary overflow-auto'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6'>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold'>All Job Posts</h1>
              <p className='text-sm text-slate-600'>
                {loading
                  ? 'Loading…'
                  : `${filteredJobs.length} result${
                      filteredJobs.length === 1 ? '' : 's'
                    }`}
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-3'>
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search title, company, location…'
                className='w-full sm:w-72 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foundation-blue/30'
                aria-label='Search jobs'
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className='w-full sm:w-44 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foundation-blue/30'
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
                className='w-full sm:w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foundation-blue/30'
                aria-label='Sort order'
              >
                <option value='newest'>Newest first</option>
                <option value='oldest'>Oldest first</option>
              </select>
            </div>
          </div>

          {error && (
            <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700'>
              {error}
            </div>
          )}

          <div className='hidden sm:block overflow-x-auto bg-white rounded-2xl shadow-sm ring-1 ring-slate-200'>
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
                        <Skeleton width={140} />
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
                        <span className='inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700'>
                          {job.type || '—'}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        {job.createdAt
                          ? new Date(job.createdAt).toLocaleDateString()
                          : '—'}
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

          <div className='sm:hidden space-y-4'>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className='bg-white rounded-xl shadow-sm p-4 ring-1 ring-slate-200'
                >
                  <Skeleton height={22} width='70%' />
                  <Skeleton height={16} width='45%' />
                  <Skeleton height={16} width='55%' />
                  <Skeleton height={16} width='40%' />
                  <Skeleton height={14} width='40%' />
                  <div className='mt-3'>
                    <Skeleton width={120} height={32} />
                  </div>
                </div>
              ))
            ) : filteredJobs.length === 0 ? (
              <div className='bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200 text-center'>
                <p className='text-base font-medium'>No jobs found</p>
                <p className='text-slate-600 text-sm mt-1'>
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className='bg-white rounded-xl shadow-sm p-4 ring-1 ring-slate-200'
                >
                  <h3 className='text-lg font-semibold text-foundation-primary'>
                    {job.title}
                  </h3>
                  <p className='text-sm text-slate-700'>{job.company}</p>
                  <p className='text-sm text-slate-700'>{job.location}</p>
                  <div className='mt-1'>
                    <span className='inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700'>
                      {job.type || '—'}
                    </span>
                  </div>
                  <p className='text-xs text-slate-500 mt-1'>
                    Posted{' '}
                    {job.createdAt
                      ? new Date(job.createdAt).toLocaleDateString()
                      : '—'}
                  </p>
                  <div className='mt-4'>
                    <Link href={`/admin/candidates/${job._id}`}>
                      <Button>View</Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
