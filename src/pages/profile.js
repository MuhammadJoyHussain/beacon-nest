import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import api from '@/utils/api'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import dynamic from 'next/dynamic'

const LoadingScreen = dynamic(() => import('@/components/Loading'), {
  ssr: false,
})

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const { data } = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(data)
      } catch (err) {
        alert('Unauthorized. Please login again.')
        localStorage.removeItem('token')
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return (
      <div className='flex h-screen items-center justify-center bg-gray-100'>
        <p className='text-red-600 text-xl'>User not found.</p>
      </div>
    )
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <Header />
        <main className='flex-grow overflow-auto p-6 pt-24'>
          <div className='max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 space-y-10'>
            <div className='flex flex-col items-center text-center'>
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt='Profile Picture'
                  className='w-32 h-32 rounded-full border-4 border-blue-500 shadow-md object-cover'
                />
              ) : (
                <div className='w-32 h-32 rounded-full bg-green-600 text-white flex items-center justify-center text-4xl font-bold border-4 border-blue-500 shadow-md'>
                  {getInitials(user?.firstName, user?.lastName)}
                </div>
              )}

              <h2 className='mt-4 text-3xl font-semibold text-gray-800'>
                {user?.firstName} {user?.lastName}
              </h2>
              <p className='text-gray-500 text-lg'>{user?.email}</p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700 text-base'>
              <ProfileItem label='Username' value={user?.username} />
              <ProfileItem label='Gender' value={user?.gender} />
              <ProfileItem
                label='Date of Birth'
                value={
                  user?.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'
                }
              />
              <ProfileItem label='Phone' value={user?.phone} />
              <ProfileItem
                label='Department'
                value={user?.department || 'N/A'}
              />
              <ProfileItem label='Position' value={user?.position || 'N/A'} />
              <ProfileItem
                label='Start Date'
                value={
                  user?.startDate
                    ? new Date(user.startDate).toLocaleDateString()
                    : 'N/A'
                }
              />
              <ProfileItem label='Share Code' value={user?.shareCode} />
              <div className='col-span-full'>
                <ProfileItem
                  label='Address'
                  value={
                    user?.street &&
                    user?.city &&
                    user?.postcode &&
                    user?.country
                      ? `${user.street}, ${user.city}, ${user.postcode}, ${user.country}`
                      : 'N/A'
                  }
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Helper component
function ProfileItem({ label, value }) {
  return (
    <div className='bg-gray-50 p-4 rounded-xl shadow-sm'>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='font-medium text-gray-800'>{value}</p>
    </div>
  )
}

// Helper to get initials
function getInitials(firstName, lastName) {
  const first = firstName?.[0]?.toUpperCase() || ''
  const last = lastName?.[0]?.toUpperCase() || ''
  return first + last
}
