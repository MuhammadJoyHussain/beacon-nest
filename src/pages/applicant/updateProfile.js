import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import api from '@/utils/api'
import Sidebar from '@/components/dashboard/Sidebar'
import { Toaster, toast } from 'react-hot-toast'
import Input from '@/components/ui/Input'
import authApi from '@/utils/authApi'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Phone, MapPin, Hash, Globe, UserCog, List } from 'lucide-react'

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    phone: '',
    street: '',
    city: '',
    postcode: '',
    country: '',
    shareCode: '',
    skills: '',
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
          skills: data.skills || '',
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

  const handleEdit = (field) => setEditMode({ ...editMode, [field]: true })

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

  const fieldIcons = {
    phone: <Phone size={18} />,
    street: <MapPin size={18} />,
    city: <MapPin size={18} />,
    postcode: <Hash size={18} />,
    country: <Globe size={18} />,
    shareCode: <UserCog size={18} />,
    skills: <List size={18} />,
  }

  return (
    <div className='flex h-screen bg-gradient-to-br from-indigo-50 to-white'>
      <Toaster />
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='flex-grow overflow-auto p-6'>
          <div className='max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-8 space-y-10'>
            <h2 className='text-3xl font-extrabold text-center text-indigo-700'>
              Update Profile
            </h2>

            <form className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {[
                { name: 'phone', label: 'Phone Number' },
                { name: 'street', label: 'Street Address' },
                { name: 'city', label: 'City' },
                { name: 'postcode', label: 'Postcode' },
                { name: 'country', label: 'Country' },
                { name: 'shareCode', label: 'Share Code' },
                { name: 'skills', label: 'Skills (comma-separated)' },
              ].map((field) => (
                <div
                  key={field.name}
                  className='bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition'
                >
                  {loading ? (
                    <Skeleton height={60} />
                  ) : (
                    <>
                      <label className='flex items-center gap-2 text-gray-700 font-semibold text-sm mb-2'>
                        {fieldIcons[field.name]} {field.label}
                      </label>
                      <Input
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        disabled={!editMode[field.name]}
                      />

                      {!editMode[field.name] ? (
                        <button
                          type='button'
                          onClick={() => handleEdit(field.name)}
                          className='mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800'
                        >
                          ✏️ Edit
                        </button>
                      ) : (
                        <div className='flex gap-3 mt-3'>
                          <button
                            type='button'
                            onClick={() => handleCancel(field.name)}
                            className='text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300'
                          >
                            Cancel
                          </button>
                          <button
                            type='button'
                            onClick={() => handleSave(field.name)}
                            className='text-sm px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700'
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
