import api from '@/utils/api'
import { useEffect, useState } from 'react'
import Header from '@/components/dashboard/Header'
import Footer from '@/components/Footer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SelectItem from '@/components/ui/SelectItem'
import toast from 'react-hot-toast'
import Sidebar from '@/components/dashboard/Sidebar'

export default function AdminUserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingUserId, setEditingUserId] = useState(null)
  const [formData, setFormData] = useState({})
  const [token, setToken] = useState(null)

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) {
      setError('No token found. Please login as admin.')
      setLoading(false)
      return
    }
    setToken(t)
  }, [])

  useEffect(() => {
    if (token) fetchUsers()
  }, [token])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(res.data)
    } catch (err) {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(users.filter((u) => u._id !== userId))
      toast.success('User deleted.')
    } catch (err) {
      toast.error('Error deleting user')
    }
  }

  const handleEditClick = (user) => {
    setEditingUserId(user._id)
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    })
  }

  const handleUpdate = async () => {
    try {
      const res = await api.put(`/admin/users/${editingUserId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const updatedUser = res.data
      setUsers(users.map((u) => (u._id === editingUserId ? updatedUser : u)))
      setEditingUserId(null)
      setFormData({})
      toast.success('User updated.')
    } catch (err) {
      toast.error('Error updating user')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className='flex min-h-screen bg-foundation-background text-foundation-primary'>
      <Sidebar />

      {/* Main Content */}
      <main className='flex-1 flex flex-col'>
        <Header />
        <div className='pt-20 pb-16 px-4 sm:px-8 max-w-6xl mx-auto w-full'>
          <h1 className='text-3xl font-bold text-center mb-10'>
            Admin User Management
          </h1>

          {loading && <p className='text-center text-lg'>Loading users...</p>}
          {error && <p className='text-center text-red-600'>{error}</p>}

          {!loading && !error && (
            <div className='overflow-x-auto bg-white rounded-xl shadow-lg'>
              <table className='w-full table-auto text-left'>
                <thead className='bg-foundation-primary text-white'>
                  <tr>
                    <th className='px-6 py-4'>Name</th>
                    <th className='px-6 py-4'>Email</th>
                    <th className='px-6 py-4'>Role</th>
                    <th className='px-6 py-4 text-center'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) =>
                    editingUserId === user._id ? (
                      <tr key={user._id} className='bg-foundation-pale'>
                        <td className='px-6 py-4'>
                          <div className='flex gap-2'>
                            <Input
                              name='firstName'
                              placeholder='First'
                              value={formData.firstName || ''}
                              onChange={handleChange}
                            />
                            <Input
                              name='lastName'
                              placeholder='Last'
                              value={formData.lastName || ''}
                              onChange={handleChange}
                            />
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <Input
                            name='email'
                            placeholder='Email'
                            value={formData.email || ''}
                            onChange={handleChange}
                          />
                        </td>
                        <td className='px-6 py-4'>
                          <Select
                            name='role'
                            value={formData.role || ''}
                            onChange={handleChange}
                          >
                            <SelectItem value='user'>User</SelectItem>
                            <SelectItem value='admin'>Admin</SelectItem>
                          </Select>
                        </td>
                        <td className='px-6 py-4 text-center space-x-2'>
                          <Button onClick={handleUpdate}>Save</Button>
                          <Button
                            className='bg-foundation-pale text-foundation-primary'
                            onClick={() => setEditingUserId(null)}
                          >
                            Cancel
                          </Button>
                        </td>
                      </tr>
                    ) : (
                      <tr
                        key={user._id}
                        className='border-b border-foundation-pale hover:bg-foundation-background'
                      >
                        <td className='px-6 py-4'>
                          {user.firstName} {user.lastName}
                        </td>
                        <td className='px-6 py-4'>{user.email}</td>
                        <td className='px-6 py-4 capitalize'>{user.role}</td>
                        <td className='px-6 py-4 text-center space-x-2'>
                          <Button
                            className='bg-foundation-primary hover:bg-opacity-90'
                            onClick={() => handleEditClick(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            className='bg-red-600 hover:bg-red-700'
                            onClick={() => handleDelete(user._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
