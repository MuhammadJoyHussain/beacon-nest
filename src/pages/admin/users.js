import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import toast from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import authApi from '@/utils/authApi'
import { parseJwt } from '@/utils/parseJWT'
import api from '@/utils/api'

export default function AdminUserManagement() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingUserId, setEditingUserId] = useState(null)
  const [formData, setFormData] = useState({})
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [view, setView] = useState('table')

  const isAdminRole = (r) => (r || '').toLowerCase() === 'admin'

  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('token')
    const me = token ? parseJwt(token) : null
    if (!me || me.role !== 'admin') {
      toast.error('Unauthorized: Admins only')
      router.replace('/login')
      return
    }
    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      try {
        let page = 1
        let hasMore = true
        let all = []
        while (hasMore) {
          const { data } = await api.get('/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, limit: 100 },
          })
          const batch = Array.isArray(data)
            ? data
            : Array.isArray(data?.results)
            ? data.results
            : Array.isArray(data?.users)
            ? data.users
            : []
          all = all.concat(batch)
          if (Array.isArray(data)) {
            hasMore = false
          } else {
            const totalPages =
              data?.totalPages ??
              data?.total_pages ??
              data?.pagination?.totalPages ??
              null
            const currentPage =
              data?.page ?? data?.currentPage ?? data?.pagination?.page ?? page
            if (totalPages) {
              hasMore = currentPage < totalPages
              page = currentPage + 1
            } else {
              const next = data?.next ?? data?.pagination?.next ?? null
              if (next) {
                page += 1
                hasMore = true
              } else {
                hasMore = batch.length === 100
                page += 1
              }
            }
          }
        }
        setUsers(all.filter((u) => u._id !== (me.id || me._id || me.sub)))
      } catch {
        setError('Failed to load users')
        toast.error('Failed to load users')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [router])

  const handleEditClick = (user) => {
    if (isAdminRole(user.role)) return
    setEditingUserId(user._id)
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      role: user.role || 'user',
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await api.put(
        `/admin/users/${editingUserId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setUsers((prev) => prev.map((u) => (u._id === editingUserId ? data : u)))
      setEditingUserId(null)
      toast.success('User updated successfully')
    } catch {
      toast.error('Failed to update user')
    }
  }

  const handleDelete = async (userId, role) => {
    if (isAdminRole(role)) return
    if (!confirm('Delete this user?')) return
    try {
      const token = localStorage.getItem('token')
      await authApi.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers((prev) => prev.filter((u) => u._id !== userId))
      toast.success('User deleted')
    } catch {
      toast.error('Failed to delete user')
    }
  }

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase()
    return users.filter((u) => {
      const matchRole =
        roleFilter === 'all'
          ? true
          : (u.role || '').toLowerCase() === roleFilter
      const matchText =
        !term ||
        (u.firstName || '').toLowerCase().includes(term) ||
        (u.lastName || '').toLowerCase().includes(term) ||
        (u.email || '').toLowerCase().includes(term)
      return matchRole && matchText
    })
  }, [users, search, roleFilter])

  const counts = useMemo(() => {
    const c = { total: users.length, admin: 0, employer: 0, user: 0 }
    users.forEach((u) => {
      const r = (u.role || 'user').toLowerCase()
      if (r === 'admin') c.admin += 1
      else if (r === 'employer') c.employer += 1
      else c.user += 1
    })
    return c
  }, [users])

  const RoleBadge = ({ value }) => {
    const role = (value || '').toLowerCase()
    const style =
      role === 'admin'
        ? 'bg-red-100 text-red-700 border-red-200'
        : role === 'employer'
        ? 'bg-amber-100 text-amber-700 border-amber-200'
        : 'bg-blue-100 text-blue-700 border-blue-200'
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${style}`}
      >
        {role || 'user'}
      </span>
    )
  }

  return (
    <div className='flex h-screen bg-foundation-primaryLight/30 text-foundation-primary'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='pt-20 pb-16 px-4 sm:px-8 max-w-6xl mx-auto w-full overflow-auto'>
          <div className='rounded-2xl bg-gradient-to-r from-foundation-primary to-foundation-blue text-white p-5 shadow-md'>
            <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
              <div>
                <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight'>
                  Admin User Management
                </h1>
                <p className='text-white/80 text-sm'>
                  Search, edit roles, and manage users.
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setView('table')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                    view === 'table'
                      ? 'bg-white text-foundation-primary'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setView('grid')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                    view === 'grid'
                      ? 'bg-white text-foundation-primary'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>
            <div className='mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3'>
              <div className='rounded-xl bg-white/10 backdrop-blur px-4 py-3'>
                <p className='text-xs text-white/80'>Total</p>
                <p className='text-lg text-white font-bold'>
                  {loading ? '—' : counts.total}
                </p>
              </div>
              <div className='rounded-xl bg-white/10 backdrop-blur px-4 py-3'>
                <p className='text-xs text-white/80'>Admins</p>
                <p className='text-lg text-white font-bold'>
                  {loading ? '—' : counts.admin}
                </p>
              </div>
              <div className='rounded-xl bg-white/10 backdrop-blur px-4 py-3'>
                <p className='text-xs text-white/80'>Employers</p>
                <p className='text-lg text-white font-bold'>
                  {loading ? '—' : counts.employer}
                </p>
              </div>
              <div className='rounded-xl bg-white/10 backdrop-blur px-4 py-3'>
                <p className='text-xs text-white/80'>Users</p>
                <p className='text-lg text-white font-bold'>
                  {loading ? '—' : counts.user}
                </p>
              </div>
            </div>
          </div>

          <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex gap-3 w-full sm:w-auto'>
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search by name or email...'
                className='w-full sm:w-80 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foundation-blue/40'
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className='w-40 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foundation-blue/40'
              >
                <option value='all'>All roles</option>
                <option value='admin'>Admin</option>
                <option value='employer'>Employer</option>
                <option value='user'>User</option>
              </select>
            </div>
          </div>

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
                    <th className='px-6 py-4 font-semibold'>First Name</th>
                    <th className='px-6 py-4 font-semibold'>Last Name</th>
                    <th className='px-6 py-4 font-semibold'>Email</th>
                    <th className='px-6 py-4 font-semibold'>Role</th>
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
                          <Skeleton width={100} />
                        </td>
                        <td className='px-6 py-4'>
                          <Skeleton width={100} />
                        </td>
                        <td className='px-6 py-4'>
                          <Skeleton width={180} />
                        </td>
                        <td className='px-6 py-4'>
                          <Skeleton width={80} />
                        </td>
                        <td className='px-6 py-4 text-center'>
                          <Skeleton width={140} height={28} />
                        </td>
                      </tr>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan='5' className='py-12 text-center'>
                        <div className='mx-auto max-w-md space-y-2'>
                          <p className='text-lg font-medium'>No users found</p>
                          <p className='text-slate-600 text-sm'>
                            Try adjusting your search or role filter.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) =>
                      editingUserId === user._id ? (
                        <tr
                          key={user._id}
                          className='border-b border-slate-100 bg-slate-50'
                        >
                          <td className='px-6 py-4'>
                            <input
                              type='text'
                              name='firstName'
                              value={formData.firstName}
                              onChange={handleChange}
                              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-foundation-blue/30'
                            />
                          </td>
                          <td className='px-6 py-4'>
                            <input
                              type='text'
                              name='lastName'
                              value={formData.lastName}
                              onChange={handleChange}
                              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-foundation-blue/30'
                            />
                          </td>
                          <td className='px-6 py-4'>
                            <input
                              type='email'
                              name='email'
                              value={formData.email}
                              onChange={handleChange}
                              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-foundation-blue/30'
                            />
                          </td>
                          <td className='px-6 py-4'>
                            <select
                              name='role'
                              value={formData.role}
                              onChange={handleChange}
                              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-foundation-blue/30'
                            >
                              <option value='user'>User</option>
                              <option value='admin'>Admin</option>
                              <option value='employer'>Employer</option>
                            </select>
                          </td>
                          <td className='px-6 py-4 text-center space-x-2'>
                            <button
                              onClick={handleUpdate}
                              className='inline-flex items-center rounded-lg bg-foundation-primary text-white px-4 py-1.5 text-sm hover:bg-opacity-90'
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingUserId(null)}
                              className='inline-flex items-center rounded-lg bg-slate-200 text-slate-700 px-4 py-1.5 text-sm hover:bg-slate-300'
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr
                          key={user._id}
                          className='border-b border-slate-100 hover:bg-slate-50/60'
                        >
                          <td className='px-6 py-4'>{user.firstName}</td>
                          <td className='px-6 py-4'>{user.lastName}</td>
                          <td className='px-6 py-4 truncate'>{user.email}</td>
                          <td className='px-6 py-4'>
                            <RoleBadge value={user.role} />
                          </td>
                          <td className='px-6 py-4 text-center space-x-2'>
                            {!isAdminRole(user.role) && (
                              <>
                                <button
                                  onClick={() => handleEditClick(user)}
                                  className='inline-flex items-center rounded-lg bg-foundation-primary text-white px-4 py-1.5 text-sm hover:bg-opacity-90'
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete(user._id, user.role)
                                  }
                                  className='inline-flex items-center rounded-lg bg-red-600 text-white px-4 py-1.5 text-sm hover:bg-red-700'
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      )
                    )
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
                    <Skeleton height={22} width='60%' className='mb-1' />
                    <Skeleton height={16} width='70%' className='mb-1' />
                    <Skeleton height={16} width='40%' className='mb-3' />
                    <div className='flex gap-2 mt-2'>
                      <Skeleton width={80} height={32} />
                      <Skeleton width={80} height={32} />
                    </div>
                  </div>
                ))
              ) : filteredUsers.length === 0 ? (
                <div className='col-span-full bg-white rounded-2xl shadow-sm p-8 ring-1 ring-slate-200 text-center'>
                  <p className='text-base font-medium'>No users found</p>
                  <p className='text-slate-600 text-sm mt-1'>
                    Try adjusting your search or role filter.
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) =>
                  editingUserId === user._id ? (
                    <div
                      key={user._id}
                      className='bg-slate-50 rounded-2xl shadow-sm p-5 ring-1 ring-slate-200 space-y-3'
                    >
                      <input
                        type='text'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder='First Name'
                        className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-foundation-blue/30'
                      />
                      <input
                        type='text'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder='Last Name'
                        className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-foundation-blue/30'
                      />
                      <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Email'
                        className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-foundation-blue/30'
                      />
                      <select
                        name='role'
                        value={formData.role}
                        onChange={handleChange}
                        className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-foundation-blue/30'
                      >
                        <option value='user'>User</option>
                        <option value='admin'>Admin</option>
                        <option value='employer'>Employer</option>
                      </select>
                      <div className='flex gap-2'>
                        <button
                          onClick={handleUpdate}
                          className='flex-1 rounded-lg bg-foundation-primary text-white px-4 py-2 text-sm hover:bg-opacity-90'
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className='flex-1 rounded-lg bg-slate-200 text-slate-700 px-4 py-2 text-sm hover:bg-slate-300'
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={user._id}
                      className='bg-white rounded-2xl shadow-sm p-5 ring-1 ring-slate-200'
                    >
                      <p className='font-semibold text-lg'>
                        {user.firstName} {user.lastName}
                      </p>
                      <p className='truncate text-sm text-slate-600'>
                        {user.email}
                      </p>
                      <div className='mt-2'>
                        <RoleBadge value={user.role} />
                      </div>
                      {!isAdminRole(user.role) && (
                        <div className='flex gap-2 mt-4'>
                          <button
                            onClick={() => handleEditClick(user)}
                            className='flex-1 rounded-lg bg-foundation-primary text-white px-4 py-2 text-sm hover:bg-opacity-90'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id, user.role)}
                            className='flex-1 rounded-lg bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700'
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )
                )
              )}
            </div>
          )}

          <div className='sm:hidden h-6' />
        </main>
      </div>
    </div>
  )
}
