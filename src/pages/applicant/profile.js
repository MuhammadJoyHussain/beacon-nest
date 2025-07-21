import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '@/components/dashboard/Sidebar'
import ProfileItem from '@/components/ProfileItem'
import authApi from '@/utils/authApi'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

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
        const { data } = await authApi.get('/auth/profile', {
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

  function getProfileValue(label, user) {
    switch (label) {
      case 'Username':
        return user.username
      case 'Gender':
        return user.gender
      case 'Date of Birth':
        return user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'
      case 'Phone':
        return user.phone
      case 'Department':
        return user.department || 'N/A'
      case 'Position':
        return user.position || 'N/A'
      case 'Start Date':
        return user.startDate
          ? new Date(user.startDate).toLocaleDateString()
          : 'N/A'
      case 'Share Code':
        return user.shareCode
      case 'Address':
        return user.street && user.city && user.postcode && user.country
          ? `${user.street}, ${user.city}, ${user.postcode}, ${user.country}`
          : 'N/A'
      default:
        return ''
    }
  }

  if (!loading && !user) {
    return (
      <div className='flex h-screen items-center justify-center bg-foundation-background'>
        <p className='text-red-600 text-xl'>User not found.</p>
      </div>
    )
  }

  return (
    <div className='flex h-screen background'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='flex-grow overflow-auto p-6'>
          <div className='max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 space-y-10'>
            <div className='flex flex-col items-center text-center'>
              {loading ? (
                <Skeleton circle height={128} width={128} />
              ) : user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt='Profile Picture'
                  className='w-32 h-32 rounded-full border-4 border-foundation-blue shadow-md object-cover'
                />
              ) : (
                <div className='pro-pic'>
                  {getInitials(user?.firstName, user?.lastName)}
                </div>
              )}

              <h2>
                {loading ? (
                  <Skeleton width={120} />
                ) : (
                  `${user.firstName} ${user.lastName}`
                )}
              </h2>
              <p>{loading ? <Skeleton width={200} /> : user.email}</p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-foundation-primary text-base'>
              {[
                'Username',
                'Gender',
                'Date of Birth',
                'Phone',
                'Department',
                'Position',
                'Start Date',
                'Share Code',
                'Address',
              ].map((label, i) => (
                <ProfileItem
                  key={i}
                  label={label}
                  value={loading ? <Skeleton /> : getProfileValue(label, user)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Helper to get initials
function getInitials(firstName, lastName) {
  const first = firstName?.[0]?.toUpperCase() || ''
  const last = lastName?.[0]?.toUpperCase() || ''
  return first + last
}
