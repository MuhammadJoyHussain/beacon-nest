import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import api from '@/utils/api'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import { Toaster, toast } from 'react-hot-toast'

export default function Profile() {
  const [formData, setFormData] = useState({
    phone: '',
    street: '',
    city: '',
    postcode: '',
    country: '',
    shareCode: '',
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) return router.push('/login')

      try {
        const { data } = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setFormData({
          phone: data.phone || '',
          street: data.street || '',
          city: data.city || '',
          postcode: data.postcode || '',
          country: data.country || '',
          shareCode: data.shareCode || '',
        })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const { data } = await api.put('/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.')
    }
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      <Toaster />
      <Sidebar />
      <div className='flex flex-col flex-grow text-black'>
        <Header />
        <main className='flex-grow overflow-auto p-6 pt-24'>
          <div className='max-w-3xl mx-auto bg-white shadow-lg rounded-3xl p-10'>
            <h2 className='text-3xl font-bold text-green-800 mb-6'>
              Update Profile
            </h2>

            {loading ? (
              <p className='text-gray-500'>Loading profile...</p>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-6'>
                {[
                  { name: 'phone', label: 'Phone Number' },
                  { name: 'street', label: 'Street Address' },
                  { name: 'city', label: 'City' },
                  { name: 'postcode', label: 'Postcode' },
                  { name: 'country', label: 'Country' },
                  { name: 'shareCode', label: 'Share Code' },
                ].map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      {field.label}
                    </label>
                    <input
                      type='text'
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                    />
                  </div>
                ))}

                <button
                  type='submit'
                  className='w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition'
                >
                  Save Changes
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
