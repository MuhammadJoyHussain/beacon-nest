import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '@/components/dashboard/Sidebar'
import ProfileItem from '@/components/ProfileItem'
import authApi from '@/utils/authApi'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  User,
  Phone,
  Calendar,
  Building2,
  Briefcase,
  Hash,
  Home,
  Globe,
} from 'lucide-react'

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

  if (!loading && !user) {
    return (
      <div className='flex h-screen items-center justify-center bg-gray-50'>
        <p className='text-red-600 text-xl'>User not found.</p>
      </div>
    )
  }

  const details = [
    { label: 'Username', value: user?.username, icon: <User size={18} /> },
    { label: 'Gender', value: user?.gender, icon: <User size={18} /> },
    {
      label: 'Date of Birth',
      value: user?.dob ? new Date(user.dob).toLocaleDateString() : 'N/A',
      icon: <Calendar size={18} />,
    },
    { label: 'Phone', value: user?.phone, icon: <Phone size={18} /> },
    {
      label: 'Department',
      value: user?.department || 'N/A',
      icon: <Building2 size={18} />,
    },
    {
      label: 'Position',
      value: user?.position || 'N/A',
      icon: <Briefcase size={18} />,
    },
    {
      label: 'Start Date',
      value: user?.startDate
        ? new Date(user.startDate).toLocaleDateString()
        : 'N/A',
      icon: <Calendar size={18} />,
    },
    { label: 'Share Code', value: user?.shareCode, icon: <Hash size={18} /> },
    {
      label: 'Address',
      value:
        user?.street && user?.city && user?.postcode && user?.country
          ? `${user.street}, ${user.city}, ${user.postcode}, ${user.country}`
          : 'N/A',
      icon: <Home size={18} />,
    },
  ]

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='flex-grow overflow-auto p-6'>
          <div className='max-w-6xl mx-auto space-y-10'>
            {/* Header Section */}
            <div className='relative bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-3xl shadow-xl p-10 flex flex-col items-center'>
              {loading ? (
                <Skeleton circle height={128} width={128} />
              ) : user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt='Profile'
                  className='w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover'
                />
              ) : (
                <div className='w-32 h-32 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-3xl font-bold shadow-md border-4 border-white'>
                  {getInitials(user?.firstName, user?.lastName)}
                </div>
              )}

              <h2 className='mt-4 text-3xl font-bold'>
                {loading ? (
                  <Skeleton width={120} />
                ) : (
                  `${user?.firstName} ${user?.lastName}`
                )}
              </h2>
              <p className='text-indigo-100'>
                {loading ? <Skeleton width={200} /> : user?.email}
              </p>
            </div>

            {/* Details Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {details.map((item, i) => (
                <div
                  key={i}
                  className='p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition flex items-start gap-3'
                >
                  <div className='text-indigo-600'>{item.icon}</div>
                  <div>
                    <p className='text-sm text-gray-500'>{item.label}</p>
                    <p className='text-lg font-medium text-gray-800'>
                      {loading ? <Skeleton /> : item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Helper for initials
function getInitials(firstName, lastName) {
  const first = firstName?.[0]?.toUpperCase() || ''
  const last = lastName?.[0]?.toUpperCase() || ''
  return first + last
}
