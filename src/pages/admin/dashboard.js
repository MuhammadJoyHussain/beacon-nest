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

import authApi from '@/utils/authApi'
import Sidebar from '@/components/dashboard/Sidebar'

const StatCard = ({ title, value, icon: Icon }) => (
  <motion.div
    whileHover={{ y: -3, scale: 1.01 }}
    className='relative overflow-hidden rounded-2xl bg-white/90 shadow-sm ring-1 ring-slate-200 p-5'
  >
    <div className='absolute -top-10 -right-10 h-32 w-32 rounded-full bg-foundation-primary/10 blur-2xl' />
    <div className='flex items-center gap-4'>
      <div className='grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-foundation-primary to-foundation-blue text-white shadow'>
        <Icon size={20} />
      </div>
      <div>
        <div className='text-sm text-slate-500'>{title}</div>
        <div className='mt-0.5 text-2xl font-extrabold tracking-tight'>
          {value ?? 0}
        </div>
      </div>
    </div>
  </motion.div>
)

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const chartData = [
    { month: 'Jan', applications: 80 },
    { month: 'Feb', applications: 120 },
    { month: 'Mar', applications: 100 },
    { month: 'Apr', applications: 150 },
    { month: 'May', applications: 130 },
    { month: 'Jun', applications: 170 },
  ]

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await authApi.get('/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStats(res.data)
      } catch {
        setStats(null)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className='flex h-screen overflow-hidden bg-[radial-gradient(60rem_30rem_at_0%_-10%,#EEF2FF_20%,transparent_60%),radial-gradient(60rem_30rem_at_120%_10%,#F5F3FF_20%,transparent_60%)]'>
      <Sidebar />

      {/* Only this scrolls */}
      <main className='flex-1 overflow-y-auto pt-16 md:pt-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <h1 className='text-2xl md:text-3xl font-extrabold tracking-tight text-foundation-primary'>
                Admin Dashboard
              </h1>
              <p className='text-sm text-slate-600'>
                Snapshot of jobs, users, and applications.
              </p>
            </div>
          </div>

          <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
            {loading ? (
              Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className='rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200'
                  >
                    <Skeleton height={24} width={120} />
                    <div className='mt-2'>
                      <Skeleton height={28} width={80} />
                    </div>
                  </div>
                ))
            ) : (
              <>
                <StatCard
                  title='Total Jobs'
                  value={stats?.totalJobs}
                  icon={Briefcase}
                />
                <StatCard
                  title='Active Jobs'
                  value={stats?.activeJobs}
                  icon={FileText}
                />
                <StatCard
                  title='Applications'
                  value={stats?.totalApplications}
                  icon={Mail}
                />
                <StatCard
                  title='Total Users'
                  value={stats?.totalUsers}
                  icon={User}
                />
                <StatCard
                  title='Regular Users'
                  value={stats?.userCount}
                  icon={User}
                />
                <StatCard
                  title='Admins'
                  value={stats?.adminCount}
                  icon={ShieldCheck}
                />
              </>
            )}
          </div>

          <div className='mt-6 grid grid-cols-1 xl:grid-cols-3 gap-5'>
            <div className='xl:col-span-2 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden'>
              <div className='flex items-center justify-between px-5 py-4 border-b border-slate-200'>
                <h2 className='text-base font-semibold text-foundation-primary'>
                  Application Trends
                </h2>
              </div>
              <div className='p-5'>
                {loading ? (
                  <Skeleton height={320} />
                ) : (
                  <div className='h-[320px]'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <BarChart data={chartData}>
                        <XAxis
                          dataKey='month'
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Bar
                          dataKey='applications'
                          fill='#3D52A0'
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            <div className='rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden'>
              <div className='flex items-center justify-between px-5 py-4 border-b border-slate-200'>
                <h2 className='text-base font-semibold text-foundation-primary'>
                  At a Glance
                </h2>
              </div>
              <div className='p-5 space-y-4'>
                {loading ? (
                  <>
                    <Skeleton height={20} />
                    <Skeleton height={20} />
                    <Skeleton height={20} />
                    <Skeleton height={20} />
                  </>
                ) : (
                  <>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-slate-600'>
                        Active rate
                      </span>
                      <span className='text-sm font-semibold'>
                        {stats?.totalJobs
                          ? Math.round(
                              ((stats?.activeJobs || 0) / stats.totalJobs) * 100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-slate-600'>
                        Users per job
                      </span>
                      <span className='text-sm font-semibold'>
                        {stats?.totalJobs
                          ? Math.round(
                              (stats?.totalUsers || 0) / stats.totalJobs
                            )
                          : 0}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-slate-600'>
                        Apps per job
                      </span>
                      <span className='text-sm font-semibold'>
                        {stats?.totalJobs
                          ? Math.round(
                              (stats?.totalApplications || 0) / stats.totalJobs
                            )
                          : 0}
                      </span>
                    </div>
                    <div className='rounded-xl bg-foundation-primary/5 p-4 ring-1 ring-foundation-primary/10'>
                      <div className='text-sm text-foundation-primary'>Tip</div>
                      <div className='text-sm text-slate-700'>
                        Keep posting clear, detailed roles to boost quality
                        applications.
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className='h-6' />
        </div>
      </main>
    </div>
  )
}
