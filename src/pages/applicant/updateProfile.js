import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import api from '@/utils/api'
import Sidebar from '@/components/dashboard/Sidebar'
import { Toaster, toast } from 'react-hot-toast'
import Input from '@/components/ui/Input'
import authApi from '@/utils/authApi'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    phone: '',
    street: '',
    city: '',
    postcode: '',
    country: '',
    shareCode: '',
  })

  const [originalData, setOriginalData] = useState({})
  const [editMode, setEditMode] = useState({})
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) return router.push('/login')

      try {
        const { data } = await authApi.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const cleaned = {
          phone: data.phone || '',
          street: data.street || '',
          city: data.city || '',
          postcode: data.postcode || '',
          country: data.country || '',
          shareCode: data.shareCode || '',
        }

        setFormData(cleaned)
        setOriginalData(cleaned)
        setEditMode(
          Object.fromEntries(Object.keys(cleaned).map((k) => [k, false]))
        )
      } catch (err) {
        toast.error('Unauthorized. Please login again.')
        localStorage.removeItem('token')
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleEdit = (field) => {
    setEditMode({ ...editMode, [field]: true })
  }

  const handleCancel = (field) => {
    setFormData((prev) => ({ ...prev, [field]: originalData[field] }))
    setEditMode({ ...editMode, [field]: false })
  }

  const handleSave = async (field) => {
    try {
      const token = localStorage.getItem('token')
      const updatedField = { [field]: formData[field] }

      await authApi.put('/auth/profile', updatedField, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success(`${field} updated successfully`)
      setOriginalData((prev) => ({ ...prev, [field]: formData[field] }))
      setEditMode({ ...editMode, [field]: false })
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to update ${field}`)
    }
  }

  return (
    <div className='flex h-screen background'>
      <Toaster />
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='flex-grow overflow-auto p-6'>
          <div className='max-w-3xl mx-auto bg-white shadow-lg rounded-3xl p-4 sm:p-6 md:p-10'>
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-[#3D52A0] mb-8'>
              Update Profile
            </h2>

            <form className='space-y-6'>
              {[
                { name: 'phone', label: 'Phone Number' },
                { name: 'street', label: 'Street Address' },
                { name: 'city', label: 'City' },
                { name: 'postcode', label: 'Postcode' },
                { name: 'country', label: 'Country' },
                { name: 'shareCode', label: 'Share Code' },
              ].map((field) => (
                <div key={field.name} className='space-y-2'>
                  {loading ? (
                    <Skeleton height={60} />
                  ) : (
                    <>
                      <Input
                        label={field.label}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        disabled={!editMode[field.name]}
                        required
                      />

                      {!editMode[field.name] ? (
                        <button
                          type='button'
                          onClick={() => handleEdit(field.name)}
                          className='text-sm text-blue-600 underline hover:text-blue-800 transition'
                        >
                          Edit
                        </button>
                      ) : (
                        <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0'>
                          <button
                            type='button'
                            onClick={() => handleCancel(field.name)}
                            className='text-sm text-gray-600 underline hover:text-gray-800 transition'
                          >
                            Cancel
                          </button>
                          <button
                            type='button'
                            onClick={() => handleSave(field.name)}
                            className='text-sm text-green-600 underline hover:text-green-800 transition'
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default UpdateProfile
