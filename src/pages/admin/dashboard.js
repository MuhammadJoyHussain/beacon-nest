import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { User, ShieldCheck, FileText, Briefcase, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import api from '@/utils/api'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import authApi from '@/utils/authApi'

const StatCard = ({
  title,
  value,
  icon: Icon,
  loading,
  color = 'text-foundation-primary',
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className='bg-white shadow-md rounded-2xl p-6 flex items-center space-x-4'
  >
    <div className={`bg-green-100 p-3 rounded-full ${color}`}>
      <Icon size={28} />
    </div>
    <div>
      <h4 className='text-sm text-gray-500'>{title}</h4>
      <p className='text-2xl font-bold'>
        {loading ? <Skeleton width={60} /> : value ?? 0}
      </p>
    </div>
  </motion.div>
)

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const mockChartData = [
    { month: 'Jan', applications: 80 },
    { month: 'Feb', applications: 120 },
    { month: 'Mar', applications: 100 },
    { month: 'Apr', applications: 150 },
  ]

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await authApi.get('/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStats(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='flex-grow overflow-auto p-6 pt-24 space-y-10'>
          <h1 className='text-3xl font-bold text-foundation-primary'>
            Admin Dashboard
          </h1>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            <StatCard
              title='Total Jobs'
              value={stats?.totalJobs}
              icon={Briefcase}
              loading={loading}
            />
            <StatCard
              title='Active Jobs'
              value={stats?.activeJobs}
              icon={FileText}
              loading={loading}
            />
            <StatCard
              title='Applications'
              value={stats?.totalApplications}
              icon={Mail}
              loading={loading}
            />
            <StatCard
              title='Total Users'
              value={stats?.totalUsers}
              icon={User}
              loading={loading}
            />
            <StatCard
              title='Regular Users'
              value={stats?.userCount}
              icon={User}
              loading={loading}
            />
            <StatCard
              title='Admins'
              value={stats?.adminCount}
              icon={ShieldCheck}
              loading={loading}
            />
          </div>

          <div className='bg-white p-6 rounded-2xl shadow-md'>
            <h2 className='text-lg font-semibold mb-4'>Application Trends</h2>
            {loading ? (
              <Skeleton height={300} />
            ) : (
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={mockChartData}>
                  <XAxis dataKey='month' />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey='applications' fill='#10B981' />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
