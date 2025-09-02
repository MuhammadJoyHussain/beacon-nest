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

  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('token')
    const user = parseJwt(token)
    if (!user || user.role !== 'admin') {
      toast.error('Unauthorized: Admins only')
      router.push('/login')
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
        setUsers(all)
      } catch (err) {
        setError('Failed to load users')
        toast.error('Failed to load users')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [router])

  const handleEditClick = (user) => {
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
      const { data } = await authApi.put(
        `/admin/users/${editingUserId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setUsers((prev) => prev.map((u) => (u._id === editingUserId ? data : u)))
      setEditingUserId(null)
      toast.success('User updated successfully')
    } catch (err) {
      toast.error('Failed to update user')
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const token = localStorage.getItem('token')
      await authApi.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers((prev) => prev.filter((u) => u._id !== userId))
      toast.success('User deleted successfully')
    } catch (err) {
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
    <div className='flex h-screen bg-foundation-background text-foundation-primary'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='pt-20 pb-16 px-4 sm:px-8 max-w-6xl mx-auto w-full overflow-auto'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6'>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold'>
                Admin User Management
              </h1>
              <p className='text-sm text-slate-600'>
                Search, edit roles, and manage users.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-3'>
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search by name or email...'
                className='w-full sm:w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foundation-blue/30'
                aria-label='Search users'
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className='w-full sm:w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foundation-blue/30'
                aria-label='Filter by role'
              >
                <option value='all'>All roles</option>
                <option value='admin'>Admin</option>
                <option value='employer'>Employer</option>
                <option value='user'>User</option>
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
                            className='w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:ring-2 focus:ring-foundation-blue/30'
                          />
                        </td>
                        <td className='px-6 py-4'>
                          <input
                            type='text'
                            name='lastName'
                            value={formData.lastName}
                            onChange={handleChange}
                            className='w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:ring-2 focus:ring-foundation-blue/30'
                          />
                        </td>
                        <td className='px-6 py-4'>
                          <input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className='w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:ring-2 focus:ring-foundation-blue/30'
                          />
                        </td>
                        <td className='px-6 py-4'>
                          <select
                            name='role'
                            value={formData.role}
                            onChange={handleChange}
                            className='w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:ring-2 focus:ring-foundation-blue/30'
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
                          <button
                            onClick={() => handleEditClick(user)}
                            className='inline-flex items-center rounded-lg bg-foundation-primary text-white px-4 py-1.5 text-sm hover:bg-opacity-90'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className='inline-flex items-center rounded-lg bg-red-600 text-white px-4 py-1.5 text-sm hover:bg-red-700'
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )
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
                  <Skeleton height={22} width='60%' className='mb-1' />
                  <Skeleton height={16} width='70%' className='mb-1' />
                  <Skeleton height={16} width='40%' className='mb-2' />
                  <div className='flex gap-2 mt-2'>
                    <Skeleton width={80} height={32} />
                    <Skeleton width={80} height={32} />
                  </div>
                </div>
              ))
            ) : filteredUsers.length === 0 ? (
              <div className='bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200 text-center'>
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
                    className='bg-white rounded-xl shadow-sm p-4 ring-1 ring-slate-200 space-y-2'
                  >
                    <input
                      type='text'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder='First Name'
                      className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-foundation-blue/30'
                    />
                    <input
                      type='text'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder='Last Name'
                      className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-foundation-blue/30'
                    />
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder='Email'
                      className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-foundation-blue/30'
                    />
                    <select
                      name='role'
                      value={formData.role}
                      onChange={handleChange}
                      className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-foundation-blue/30'
                    >
                      <option value='user'>User</option>
                      <option value='admin'>Admin</option>
                      <option value='employer'>Employer</option>
                    </select>
                    <div className='flex gap-2 mt-3'>
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
                    className='bg-white rounded-xl shadow-sm p-4 ring-1 ring-slate-200'
                  >
                    <p className='font-semibold text-lg'>
                      {user.firstName} {user.lastName}
                    </p>
                    <p className='truncate text-sm text-slate-600'>
                      {user.email}
                    </p>
                    <div className='mt-1'>
                      <RoleBadge value={user.role} />
                    </div>
                    <div className='flex gap-2 mt-3'>
                      <button
                        onClick={() => handleEditClick(user)}
                        className='flex-1 rounded-lg bg-foundation-primary text-white px-4 py-2 text-sm hover:bg-opacity-90'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className='flex-1 rounded-lg bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700'
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
