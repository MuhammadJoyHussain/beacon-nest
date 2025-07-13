import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import SelectItem from '@/components/ui/SelectItem'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'
import api from '@/utils/api'
import LoadingScreen from '@/components/Loading'

export default function JobApplicationsPage() {
  const router = useRouter()
  const { id } = router.query
  const [applications, setApplications] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const fetchApplications = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/application/job/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setApplications(res.data)
      } catch (err) {
        console.error('Error fetching applications:', err)
        toast.error('Failed to load applications')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchApplications()
  }, [id])

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
      const token = localStorage.getItem('token')
      await api.put(`/application/${editingId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setApplications(
        applications.map((a) =>
          a._id === editingId ? { ...a, ...formData } : a
        )
      )
      setEditingId(null)
      toast.success('Candidate updated successfully')
    } catch (err) {
      console.error('Update failed:', err)
      toast.error('Failed to update application')
    }
  }

  const handleDelete = async (appId) => {
    if (!confirm('Are you sure you want to delete this application?')) return

    try {
      const token = localStorage.getItem('token')
      await api.delete(`/application/${appId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setApplications(applications.filter((a) => a._id !== appId))
      toast.success('Application deleted')
    } catch (err) {
      console.error('Delete failed:', err)
      toast.error('Failed to delete application')
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className='flex min-h-screen bg-foundation-background text-foundation-primary'>
      <Sidebar />
      <main className='flex-1 flex flex-col'>
        <Header />
        <div className='pt-20 pb-16 px-4 sm:px-8 max-w-6xl mx-auto w-full'>
          <h1 className='text-3xl font-bold text-center mb-10'>
            Applications for Job ID: {id}
          </h1>

          <div className='overflow-x-auto bg-white rounded-xl shadow-lg'>
            <table className='w-full table-auto text-left'>
              <thead className='bg-foundation-primary text-white'>
                <tr>
                  <th className='px-6 py-4'>Name</th>
                  <th className='px-6 py-4'>Email</th>
                  <th className='px-6 py-4'>Status</th>
                  <th className='px-6 py-4 text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) =>
                  editingId === a._id ? (
                    <tr key={a._id} className='bg-foundation-pale'>
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
                          className='bg-foundation-pale text-foundation-primary'
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={a._id}
                      className='border-b border-foundation-pale hover:bg-foundation-background'
                    >
                      <td className='px-6 py-4'>{a.fullName}</td>
                      <td className='px-6 py-4'>{a.email}</td>
                      <td className='px-6 py-4'>{a.status}</td>
                      <td className='px-6 py-4 text-center space-x-2'>
                        <Button onClick={() => handleEditClick(a)}>Edit</Button>
                        <Button
                          onClick={() => handleDelete(a._id)}
                          className='bg-red-600 hover:bg-red-700'
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  )
                )}
                {applications.length === 0 && (
                  <tr>
                    <td
                      colSpan='4'
                      className='text-center py-10 text-foundation-softblue'
                    >
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
