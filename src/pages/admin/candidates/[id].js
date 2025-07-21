import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import SelectItem from '@/components/ui/SelectItem'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'
import api from '@/utils/api'
import { parseJwt } from '@/utils/parseJWT'

export default function JobApplicationsPage() {
  const router = useRouter()
  const { id } = router.query

  const [applications, setApplications] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')
  const [error, setError] = useState('')

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
        setApplications(res.data)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load applications')
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [token, id])

  const handleEditClick = (app) => {
    setEditingId(app._id)
    setFormData({
      fullName: app.fullName,
      email: app.email,
      status: app.status || 'Under Review',
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
    } catch (err) {
      toast.error('Update failed')
    }
  }

  const handleDelete = async (appId) => {
    if (!confirm('Are you sure you want to delete this application?')) return
    try {
      await api.delete(`/application/${appId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setApplications(applications.filter((a) => a._id !== appId))
      toast.success('Deleted')
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen text-red-600'>
        {error}
      </div>
    )
  }

  return (
    <div className='flex min-h-screen bg-foundation-background text-foundation-primary'>
      <Sidebar />
      <main className='flex-1 flex flex-col'>
        <div className='pt-20 pb-16 px-4 sm:px-8 max-w-6xl mx-auto w-full'>
          <h1 className='text-3xl font-bold text-center mb-10'>
            Applications for Job ID: {id}
          </h1>

          {/* TABLE VIEW */}
          <div className='hidden sm:block overflow-x-auto bg-white rounded-xl shadow-lg'>
            <table className='min-w-full table-auto text-left text-sm sm:text-base'>
              <thead className='bg-foundation-primary text-white'>
                <tr>
                  <th className='px-6 py-4'>Name</th>
                  <th className='px-6 py-4'>Email</th>
                  <th className='px-6 py-4'>Status</th>
                  <th className='px-6 py-4 text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && applications.length === 0 ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i} className='border-b'>
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
                          <Skeleton width={70} height={30} />
                        </td>
                      </tr>
                    ))
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan='4' className='text-center py-10 text-gray-500'>
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  applications.map((a) =>
                    editingId === a._id ? (
                      <tr key={a._id} className='bg-gray-50'>
                        <td className='px-6 py-4'>
                          <Input
                            name='fullName'
                            value={formData.fullName}
                            onChange={handleChange}
                          />
                        </td>
                        <td className='px-6 py-4'>
                          <Input
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </td>
                        <td className='px-6 py-4'>
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
                        <td className='px-6 py-4 text-center space-x-2'>
                          <Button onClick={handleUpdate}>Save</Button>
                          <Button
                            onClick={() => setEditingId(null)}
                            className='bg-gray-300 text-black'
                          >
                            Cancel
                          </Button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={a._id} className='hover:bg-gray-100 border-b'>
                        <td className='px-6 py-4'>{a.fullName}</td>
                        <td className='px-6 py-4'>{a.email}</td>
                        <td className='px-6 py-4'>{a.status}</td>
                        <td className='px-6 py-4 text-center space-x-2'>
                          <Button onClick={() => handleEditClick(a)}>
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(a._id)}
                            className='bg-red-600 hover:bg-red-700'
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* CARD VIEW FOR MOBILE */}
          <div className='sm:hidden space-y-4'>
            {loading && applications.length === 0
              ? Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className='bg-white rounded-xl shadow-md p-4 space-y-3'
                    >
                      <Skeleton height={20} width='60%' />
                      <Skeleton height={20} width='80%' />
                      <Skeleton height={20} width='40%' />
                      <div className='flex space-x-2'>
                        <Skeleton height={36} width={80} />
                        <Skeleton height={36} width={80} />
                      </div>
                    </div>
                  ))
              : applications.map((a) =>
                  editingId === a._id ? (
                    <div
                      key={a._id}
                      className='bg-gray-100 p-4 rounded-lg shadow space-y-3'
                    >
                      <Input
                        name='fullName'
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder='Full name'
                      />
                      <Input
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Email'
                      />
                      <Select
                        name='status'
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <SelectItem value='Under Review'>
                          Under Review
                        </SelectItem>
                        <SelectItem value='Shortlisted'>Shortlisted</SelectItem>
                        <SelectItem value='Interviewed'>Interviewed</SelectItem>
                        <SelectItem value='Rejected'>Rejected</SelectItem>
                      </Select>
                      <div className='flex space-x-2'>
                        <Button onClick={handleUpdate}>Save</Button>
                        <Button
                          onClick={() => setEditingId(null)}
                          className='bg-gray-300 text-black'
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={a._id}
                      className='bg-white rounded-xl shadow-md p-4 space-y-2'
                    >
                      <p>
                        <strong>Name:</strong> {a.fullName}
                      </p>
                      <p>
                        <strong>Email:</strong> {a.email}
                      </p>
                      <p>
                        <strong>Status:</strong> {a.status}
                      </p>
                      <div className='flex space-x-2'>
                        <Button
                          onClick={() => handleEditClick(a)}
                          className='flex-1'
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(a._id)}
                          className='flex-1 bg-red-600'
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )
                )}
          </div>
        </div>
      </main>
    </div>
  )
}
