import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import authApi from '@/utils/authApi'
import { parseJwt } from '@/utils/parseJWT'

export default function AdminUserManagement() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUserId, setEditingUserId] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = parseJwt(token)

    if (!user || user.role !== 'admin') {
      toast.error('Unauthorized: Admins only')
      router.push('/login')
      return
    }

    const fetchUsers = async () => {
      try {
        const { data } = await authApi.get('/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUsers(data)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
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
      const res = await authApi.put(`/admin/users/${editingUserId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(users.map((u) => (u._id === editingUserId ? res.data : u)))
      setEditingUserId(null)
      toast.success('User updated successfully')
    } catch (err) {
      console.error(err)
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
      setUsers(users.filter((u) => u._id !== userId))
      toast.success('User deleted successfully')
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete user')
    }
  }

  return (
    <div className='flex h-screen bg-foundation-background text-foundation-primary'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='pt-20 pb-16 px-4 sm:px-8 max-w-6xl mx-auto w-full overflow-auto'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-10'>
            Admin User Management
          </h1>

          {/* Desktop Table View */}
          <div className='hidden sm:block overflow-x-auto bg-white rounded-xl shadow-lg'>
            <table className='min-w-full table-auto text-sm sm:text-base text-left'>
              <thead className='bg-foundation-primary text-white'>
                <tr>
                  <th className='px-6 py-4'>First Name</th>
                  <th className='px-6 py-4'>Last Name</th>
                  <th className='px-6 py-4'>Email</th>
                  <th className='px-6 py-4'>Role</th>
                  <th className='px-6 py-4 text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className='border-b border-foundation-pale'>
                      <td className='px-6 py-4'>
                        <Skeleton width={100} />
                      </td>
                      <td className='px-6 py-4'>
                        <Skeleton width={100} />
                      </td>
                      <td className='px-6 py-4'>
                        <Skeleton width={150} />
                      </td>
                      <td className='px-6 py-4'>
                        <Skeleton width={80} />
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <Skeleton width={120} height={30} />
                      </td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan='5'
                      className='text-center py-10 text-foundation-softblue'
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) =>
                    editingUserId === user._id ? (
                      <tr
                        key={user._id}
                        className='border-b border-foundation-pale bg-foundation-pale'
                      >
                        <td className='px-6 py-4'>
                          <input
                            type='text'
                            name='firstName'
                            value={formData.firstName}
                            onChange={handleChange}
                            className='w-full rounded-md border border-gray-300 px-2 py-1 text-sm'
                          />
                        </td>
                        <td className='px-6 py-4'>
                          <input
                            type='text'
                            name='lastName'
                            value={formData.lastName}
                            onChange={handleChange}
                            className='w-full rounded-md border border-gray-300 px-2 py-1 text-sm'
                          />
                        </td>
                        <td className='px-6 py-4'>
                          <input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className='w-full rounded-md border border-gray-300 px-2 py-1 text-sm'
                          />
                        </td>
                        <td className='px-6 py-4'>
                          <select
                            name='role'
                            value={formData.role}
                            onChange={handleChange}
                            className='w-full rounded-md border border-gray-300 px-2 py-1 text-sm'
                          >
                            <option value='user'>User</option>
                            <option value='admin'>Admin</option>
                          </select>
                        </td>
                        <td className='px-6 py-4 text-center space-x-2'>
                          <button
                            onClick={handleUpdate}
                            className='bg-foundation-primary text-white px-4 py-1 rounded hover:bg-opacity-90'
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className='bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400'
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr
                        key={user._id}
                        className='border-b border-foundation-pale hover:bg-foundation-background'
                      >
                        <td className='px-6 py-4'>{user.firstName}</td>
                        <td className='px-6 py-4'>{user.lastName}</td>
                        <td className='px-6 py-4 truncate'>{user.email}</td>
                        <td className='px-6 py-4 capitalize'>{user.role}</td>
                        <td className='px-6 py-4 text-center space-x-2'>
                          <button
                            onClick={() => handleEditClick(user)}
                            className='bg-foundation-primary text-white px-4 py-1 rounded hover:bg-opacity-90'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className='bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700'
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

          {/* Mobile Card View */}
          <div className='sm:hidden space-y-4'>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className='bg-white rounded-xl shadow-md p-4 border border-foundation-pale'
                >
                  <Skeleton height={24} width='60%' className='mb-1' />
                  <Skeleton height={18} width='40%' className='mb-1' />
                  <Skeleton height={18} width='70%' className='mb-1' />
                  <Skeleton height={18} width='30%' className='mb-2' />
                  <div className='flex space-x-2 mt-2'>
                    <Skeleton width={80} height={32} />
                    <Skeleton width={80} height={32} />
                  </div>
                </div>
              ))
            ) : users.length === 0 ? (
              <p className='text-center py-10 text-foundation-softblue'>
                No users found.
              </p>
            ) : (
              users.map((user) =>
                editingUserId === user._id ? (
                  <div
                    key={user._id}
                    className='bg-white rounded-xl shadow-md p-4 border border-foundation-pale space-y-2'
                  >
                    <input
                      type='text'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder='First Name'
                      className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm'
                    />
                    <input
                      type='text'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder='Last Name'
                      className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm'
                    />
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder='Email'
                      className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm'
                    />
                    <select
                      name='role'
                      value={formData.role}
                      onChange={handleChange}
                      className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm'
                    >
                      <option value='user'>User</option>
                      <option value='admin'>Admin</option>
                    </select>
                    <div className='flex space-x-2 mt-3'>
                      <button
                        onClick={handleUpdate}
                        className='flex-1 bg-foundation-primary text-white px-4 py-2 rounded hover:bg-opacity-90'
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className='flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={user._id}
                    className='bg-white rounded-xl shadow-md p-4 border border-foundation-pale space-y-1'
                  >
                    <p className='font-semibold text-lg'>
                      {user.firstName} {user.lastName}
                    </p>
                    <p className='truncate text-sm text-gray-600'>
                      {user.email}
                    </p>
                    <p className='capitalize text-sm text-gray-600'>
                      {user.role}
                    </p>
                    <div className='flex space-x-2 mt-3'>
                      <button
                        onClick={() => handleEditClick(user)}
                        className='flex-1 bg-foundation-primary text-white px-4 py-2 rounded hover:bg-opacity-90'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className='flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
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
