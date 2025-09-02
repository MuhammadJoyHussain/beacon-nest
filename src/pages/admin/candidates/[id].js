import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  Mail,
  FileText,
  Link as LinkIcon,
  Edit3,
  Trash2,
  Search,
} from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import SelectItem from '@/components/ui/SelectItem'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'
import api from '@/utils/api'
import { parseJwt } from '@/utils/parseJWT'

const Btn = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  icon: Icon,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto'
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }
  const variants = {
    primary:
      'bg-foundation-primary text-white hover:bg-foundation-primary/90 focus:ring-foundation-blue',
    outline:
      'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
    subtle:
      'bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-300',
  }
  return (
    <Button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon ? <Icon size={16} /> : null}
      {children}
    </Button>
  )
}

export default function JobApplicationsPage() {
  const router = useRouter()
  const { id } = router.query

  const [applications, setApplications] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) {
      setError('No token found. Please login.')
      setLoading(false)
      return
    }
    const decoded = parseJwt(t)
    if (!decoded || decoded.role !== 'admin') {
      setError('Access denied. Admins only.')
      setLoading(false)
      return
    }
    setToken(t)
  }, [])

  useEffect(() => {
    if (!token || !id) return
    const fetchApplications = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/application/job/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.results)
          ? res.data.results
          : []
        setApplications(list)
      } catch {
        toast.error('Failed to load applications')
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [token, id])

  const getUserInfo = (a) => {
    const u = a?.user
    const first =
      u && typeof u === 'object'
        ? u.firstName || u.givenName || u.name?.first || ''
        : ''
    const last =
      u && typeof u === 'object'
        ? u.lastName || u.surname || u.name?.last || ''
        : ''
    const name = first || last ? `${first} ${last}`.trim() : a.fullName || ''
    const email =
      u && typeof u === 'object' && u.email ? u.email : a.email || ''
    return { name: name || 'Unknown', email: email || '—' }
  }

  const handleEditClick = (app) => {
    setEditingId(app._id)
    setFormData({ status: app.status || 'Under Review' })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const handleUpdate = async () => {
    try {
      await api.put(`/application/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setApplications((apps) =>
        apps.map((a) => (a._id === editingId ? { ...a, ...formData } : a))
      )
      setEditingId(null)
      toast.success('Updated successfully')
    } catch {
      toast.error('Update failed')
    }
  }

  const handleDelete = async (appId) => {
    if (!confirm('Are you sure you want to delete this application?')) return
    try {
      await api.delete(`/application/${appId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setApplications((apps) => apps.filter((a) => a._id !== appId))
      toast.success('Deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  const StatusBadge = ({ value }) => {
    const v = (value || 'Under Review').toLowerCase()
    const style =
      v === 'shortlisted'
        ? 'bg-amber-100 text-amber-700 border-amber-200'
        : v === 'interviewed'
        ? 'bg-blue-100 text-blue-700 border-blue-200'
        : v === 'rejected'
        ? 'bg-red-100 text-red-700 border-red-200'
        : 'bg-slate-100 text-slate-700 border-slate-200'
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${style}`}
      >
        {value || 'Under Review'}
      </span>
    )
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const base = applications.filter((a) => {
      const { name, email } = getUserInfo(a)
      const byStatus =
        statusFilter === 'all'
          ? true
          : (a.status || '').toLowerCase() === statusFilter.toLowerCase()
      const byText =
        !term ||
        name.toLowerCase().includes(term) ||
        email.toLowerCase().includes(term)
      return byStatus && byText
    })
    return base.sort((a, b) => {
      const da = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const db = new Date(b.updatedAt || b.createdAt || 0).getTime()
      return sortOrder === 'newest' ? db - da : da - db
    })
  }, [applications, search, statusFilter, sortOrder])

  const stats = useMemo(() => {
    const s = {
      total: applications.length,
      under: 0,
      short: 0,
      interview: 0,
      reject: 0,
    }
    applications.forEach((a) => {
      const v = (a.status || '').toLowerCase()
      if (v === 'shortlisted') s.short++
      else if (v === 'interviewed') s.interview++
      else if (v === 'rejected') s.reject++
      else s.under++
    })
    return s
  }, [applications])

  if (error)
    return (
      <div className='flex items-center justify-center min-h-screen text-red-600'>
        {error}
      </div>
    )

  return (
    <div className='flex min-h-screen bg-foundation-background text-foundation-primary'>
      <Sidebar />
      <main className='flex-1 flex flex-col'>
        <div className='pt-20 pb-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full'>
          <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold'>Applications</h1>
              <p className='text-sm text-slate-600'>Job ID: {id || '—'}</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto'>
              <div className='relative'>
                <Search
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-500'
                  size={16}
                />
                <input
                  type='text'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='Search by name or email…'
                  className='w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foundation-blue/30'
                  aria-label='Search applications'
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className='w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foundation-blue/30'
                aria-label='Filter by status'
              >
                <option value='all'>All statuses</option>
                <option value='Under Review'>Under Review</option>
                <option value='Shortlisted'>Shortlisted</option>
                <option value='Interviewed'>Interviewed</option>
                <option value='Rejected'>Rejected</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className='w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foundation-blue/30'
                aria-label='Sort'
              >
                <option value='newest'>Newest first</option>
                <option value='oldest'>Oldest first</option>
              </select>
            </div>
          </div>

          <div className='mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3'>
            <div className='rounded-2xl bg-white ring-1 ring-slate-200 p-3 text-center'>
              <div className='text-xs text-slate-500'>Total</div>
              <div className='text-xl font-semibold'>{stats.total}</div>
            </div>
            <div className='rounded-2xl bg-white ring-1 ring-slate-200 p-3 text-center'>
              <div className='text-xs text-slate-500'>Under Review</div>
              <div className='text-xl font-semibold'>{stats.under}</div>
            </div>
            <div className='rounded-2xl bg-white ring-1 ring-slate-200 p-3 text-center'>
              <div className='text-xs text-slate-500'>Shortlisted</div>
              <div className='text-xl font-semibold'>{stats.short}</div>
            </div>
            <div className='rounded-2xl bg-white ring-1 ring-slate-200 p-3 text-center'>
              <div className='text-xs text-slate-500'>Interviewed</div>
              <div className='text-xl font-semibold'>{stats.interview}</div>
            </div>
            <div className='rounded-2xl bg-white ring-1 ring-slate-200 p-3 text-center'>
              <div className='text-xs text-slate-500'>Rejected</div>
              <div className='text-xl font-semibold'>{stats.reject}</div>
            </div>
          </div>

          {/* Desktop/Tablet (md+) */}
          <div className='mt-6 hidden md:block rounded-2xl bg-white shadow-sm ring-1 ring-slate-200'>
            <div className='overflow-x-auto'>
              <table className='min-w-full table-auto text-left text-sm'>
                <thead className='bg-gradient-to-r from-foundation-primary to-foundation-blue text-white'>
                  <tr>
                    <th className='px-4 lg:px-6 py-3 lg:py-4 font-semibold'>
                      Applicant
                    </th>
                    <th className='px-4 lg:px-6 py-3 lg:py-4 font-semibold'>
                      Email
                    </th>
                    <th className='px-4 lg:px-6 py-3 lg:py-4 font-semibold'>
                      Status
                    </th>
                    <th className='px-4 lg:px-6 py-3 lg:py-4 font-semibold'>
                      Salary
                    </th>
                    <th className='px-4 lg:px-6 py-3 lg:py-4 font-semibold'>
                      Start
                    </th>
                    <th className='px-4 lg:px-6 py-3 lg:py-4 font-semibold'>
                      Exp (yrs)
                    </th>
                    <th className='px-4 lg:px-6 py-3 lg:py-4 font-semibold'>
                      CV
                    </th>
                    <th className='px-4 lg:px-6 py-3 lg:py-4 font-semibold'>
                      LinkedIn
                    </th>
                    <th className='px-4 lg:px-6 py-3 lg:py-4 text-center font-semibold'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='align-top'>
                  {loading && applications.length === 0 ? (
                    Array(6)
                      .fill(0)
                      .map((_, i) => (
                        <tr key={i} className='border-b'>
                          <td className='px-4 lg:px-6 py-4'>
                            <Skeleton width={160} />
                          </td>
                          <td className='px-4 lg:px-6 py-4'>
                            <Skeleton width={220} />
                          </td>
                          <td className='px-4 lg:px-6 py-4'>
                            <Skeleton width={100} />
                          </td>
                          <td className='px-4 lg:px-6 py-4'>
                            <Skeleton width={80} />
                          </td>
                          <td className='px-4 lg:px-6 py-4'>
                            <Skeleton width={100} />
                          </td>
                          <td className='px-4 lg:px-6 py-4'>
                            <Skeleton width={60} />
                          </td>
                          <td className='px-4 lg:px-6 py-4'>
                            <Skeleton width={60} />
                          </td>
                          <td className='px-4 lg:px-6 py-4'>
                            <Skeleton width={80} />
                          </td>
                          <td className='px-4 lg:px-6 py-4 text-center'>
                            <Skeleton width={160} height={28} />
                          </td>
                        </tr>
                      ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan='9' className='py-12 text-center'>
                        <div className='mx-auto max-w-md space-y-2'>
                          <p className='text-lg font-medium'>
                            No applications found
                          </p>
                          <p className='text-slate-600 text-sm'>
                            Try adjusting your search or filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((a) => {
                      const { name, email } = getUserInfo(a)
                      const salary =
                        a.expectedSalary != null ? a.expectedSalary : '—'
                      const start = a.startDate
                        ? new Date(a.startDate).toLocaleDateString()
                        : '—'
                      const exp =
                        a.experienceYears != null ? a.experienceYears : '—'
                      return editingId === a._id ? (
                        <tr key={a._id} className='bg-slate-50 border-b'>
                          <td className='px-4 lg:px-6 py-4'>{name}</td>
                          <td className='px-4 lg:px-6 py-4 break-all'>
                            {email}
                          </td>
                          <td className='px-4 lg:px-6 py-4'>
                            <Select
                              name='status'
                              value={formData.status}
                              onChange={handleChange}
                            >
                              <SelectItem value='Under Review'>
                                Under Review
                              </SelectItem>
                              <SelectItem value='Shortlisted'>
                                Shortlisted
                              </SelectItem>
                              <SelectItem value='Interviewed'>
                                Interviewed
                              </SelectItem>
                              <SelectItem value='Rejected'>Rejected</SelectItem>
                            </Select>
                          </td>
                          <td className='px-4 lg:px-6 py-4'>{salary}</td>
                          <td className='px-4 lg:px-6 py-4'>{start}</td>
                          <td className='px-4 lg:px-6 py-4'>{exp}</td>
                          <td className='px-4 lg:px-6 py-4'>
                            {a.cv ? (
                              <a
                                href={a.cv}
                                target='_blank'
                                rel='noreferrer'
                                className='inline-flex items-center gap-1 text-foundation-blue hover:underline'
                              >
                                <FileText size={16} />
                                Open
                              </a>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className='px-4 lg:px-6 py-4'>
                            {a.linkedIn ? (
                              <a
                                href={a.linkedIn}
                                target='_blank'
                                rel='noreferrer'
                                className='inline-flex items-center gap-1 text-foundation-blue hover:underline'
                              >
                                <LinkIcon size={16} />
                                Profile
                              </a>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className='px-4 lg:px-6 py-4'>
                            <div className='flex flex-wrap items-center justify-center gap-2'>
                              <Btn
                                onClick={handleUpdate}
                                variant='primary'
                                size='md'
                              >
                                Save
                              </Btn>
                              <Btn
                                onClick={() => setEditingId(null)}
                                variant='outline'
                                size='md'
                              >
                                Cancel
                              </Btn>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr key={a._id} className='hover:bg-slate-50 border-b'>
                          <td className='px-4 lg:px-6 py-4'>{name}</td>
                          <td className='px-4 lg:px-6 py-4 break-all'>
                            <a
                              href={`mailto:${email}`}
                              className='inline-flex items-center gap-1 text-foundation-blue hover:underline'
                            >
                              <Mail size={16} />
                              <span className='truncate'>{email}</span>
                            </a>
                          </td>
                          <td className='px-4 lg:px-6 py-4'>
                            <StatusBadge value={a.status} />
                          </td>
                          <td className='px-4 lg:px-6 py-4'>{salary}</td>
                          <td className='px-4 lg:px-6 py-4'>{start}</td>
                          <td className='px-4 lg:px-6 py-4'>{exp}</td>
                          <td className='px-4 lg:px-6 py-4'>
                            {a.cv ? (
                              <a
                                href={a.cv}
                                target='_blank'
                                rel='noreferrer'
                                className='inline-flex items-center gap-1 text-foundation-blue hover:underline'
                              >
                                <FileText size={16} />
                                Open
                              </a>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className='px-4 lg:px-6 py-4'>
                            {a.linkedIn ? (
                              <a
                                href={a.linkedIn}
                                target='_blank'
                                rel='noreferrer'
                                className='inline-flex items-center gap-1 text-foundation-blue hover:underline'
                              >
                                <LinkIcon size={16} />
                                Profile
                              </a>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className='px-4 lg:px-6 py-4'>
                            <div className='flex flex-wrap items-center justify-center gap-2'>
                              <Btn
                                onClick={() => handleEditClick(a)}
                                variant='subtle'
                                size='md'
                                icon={Edit3}
                              >
                                Edit
                              </Btn>
                              <Btn
                                onClick={() => handleDelete(a._id)}
                                variant='danger'
                                size='md'
                                icon={Trash2}
                              >
                                Delete
                              </Btn>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile (sm and down) */}
          <div className='md:hidden space-y-4 mt-6'>
            {loading && applications.length === 0 ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className='bg-white rounded-2xl shadow-sm p-4 space-y-3 ring-1 ring-slate-200'
                  >
                    <Skeleton height={20} width='60%' />
                    <Skeleton height={16} width='80%' />
                    <Skeleton height={16} width='40%' />
                    <div className='flex gap-2'>
                      <Skeleton height={36} width={80} />
                      <Skeleton height={36} width={80} />
                    </div>
                  </div>
                ))
            ) : filtered.length === 0 ? (
              <div className='bg-white rounded-2xl shadow-sm p-6 ring-1 ring-slate-200 text-center'>
                <p className='text-base font-medium'>No applications found</p>
                <p className='text-slate-600 text-sm mt-1'>
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              filtered.map((a) => {
                const { name, email } = getUserInfo(a)
                const salary = a.expectedSalary != null ? a.expectedSalary : '—'
                const start = a.startDate
                  ? new Date(a.startDate).toLocaleDateString()
                  : '—'
                const exp = a.experienceYears != null ? a.experienceYears : '—'
                return editingId === a._id ? (
                  <div
                    key={a._id}
                    className='bg-slate-50 p-4 rounded-2xl shadow-sm ring-1 ring-slate-200 space-y-3'
                  >
                    <div className='text-sm'>
                      <span className='font-semibold'>Applicant:</span> {name}
                    </div>
                    <div className='text-sm break-all'>
                      <span className='font-semibold'>Email:</span> {email}
                    </div>
                    <Select
                      name='status'
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <SelectItem value='Under Review'>Under Review</SelectItem>
                      <SelectItem value='Shortlisted'>Shortlisted</SelectItem>
                      <SelectItem value='Interviewed'>Interviewed</SelectItem>
                      <SelectItem value='Rejected'>Rejected</SelectItem>
                    </Select>
                    <div className='grid grid-cols-2 gap-2'>
                      <Btn
                        onClick={handleUpdate}
                        variant='primary'
                        className='w-full'
                      >
                        Save
                      </Btn>
                      <Btn
                        onClick={() => setEditingId(null)}
                        variant='outline'
                        className='w-full'
                      >
                        Cancel
                      </Btn>
                    </div>
                  </div>
                ) : (
                  <div
                    key={a._id}
                    className='bg-white rounded-2xl shadow-sm p-4 ring-1 ring-slate-200 space-y-3'
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <div className='min-w-0'>
                        <p className='font-semibold text-lg truncate'>{name}</p>
                        <a
                          href={`mailto:${email}`}
                          className='inline-flex items-center gap-1 text-sm text-foundation-blue break-all'
                        >
                          <Mail size={16} />
                          {email}
                        </a>
                      </div>
                      <StatusBadge value={a.status} />
                    </div>
                    <div className='flex flex-wrap items-center gap-3 text-xs text-slate-600'>
                      <span>Salary: {salary}</span>
                      <span>Start: {start}</span>
                      <span>Exp: {exp} yrs</span>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      {a.cv ? (
                        <a
                          href={a.cv}
                          target='_blank'
                          rel='noreferrer'
                          className='inline-flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700'
                        >
                          <FileText size={16} /> CV
                        </a>
                      ) : (
                        <div className='inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500'>
                          No CV
                        </div>
                      )}
                      {a.linkedIn ? (
                        <a
                          href={a.linkedIn}
                          target='_blank'
                          rel='noreferrer'
                          className='inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700'
                        >
                          <LinkIcon size={16} /> LinkedIn
                        </a>
                      ) : (
                        <div className='inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500'>
                          No Profile
                        </div>
                      )}
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      <Btn
                        onClick={() => handleEditClick(a)}
                        variant='subtle'
                        className='w-full'
                        icon={Edit3}
                      >
                        Edit
                      </Btn>
                      <Btn
                        onClick={() => handleDelete(a._id)}
                        variant='danger'
                        className='w-full'
                        icon={Trash2}
                      >
                        Delete
                      </Btn>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
