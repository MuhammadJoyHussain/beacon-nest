import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api from '@/utils/api'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { parseJwt } from '@/utils/parseJWT'

export default function AllJobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = parseJwt(token)

    if (!user || user.role !== 'admin') {
      toast.error('Unauthorized: Admins only')
      router.push('/login')
      return
    }

    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/vacancy')
        setJobs(data.results)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  return (
    <div className='flex h-screen bg-foundation-background'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <main className='pt-20 pb-16 px-4 flex-grow w-full text-foundation-primary overflow-auto'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-10'>
            All Job Posts
          </h1>

          {/* Desktop Table View */}
          <div className='hidden sm:block overflow-x-auto bg-white rounded-xl shadow-lg'>
            <table className='min-w-full table-auto text-sm sm:text-base text-left'>
              <thead className='bg-foundation-primary text-white'>
                <tr>
                  <th className='px-6 py-4'>Title</th>
                  <th className='px-6 py-4'>Company</th>
                  <th className='px-6 py-4'>Location</th>
                  <th className='px-6 py-4'>Type</th>
                  <th className='px-6 py-4'>Posted</th>
                  <th className='px-6 py-4 text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className='border-b border-foundation-pale'>
                      <td className='px-6 py-4'>
                        <Skeleton width={100} />
                      </td>
                      <td className='px-6 py-4'>
                        <Skeleton width={80} />
                      </td>
                      <td className='px-6 py-4'>
                        <Skeleton width={90} />
                      </td>
                      <td className='px-6 py-4'>
                        <Skeleton width={60} />
                      </td>
                      <td className='px-6 py-4'>
                        <Skeleton width={90} />
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <Skeleton width={120} height={30} />
                      </td>
                    </tr>
                  ))
                ) : jobs.length === 0 ? (
                  <tr>
                    <td
                      colSpan='6'
                      className='text-center py-10 text-foundation-softblue'
                    >
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr
                      key={job._id}
                      className='border-b border-foundation-pale hover:bg-foundation-background'
                    >
                      <td className='px-6 py-4'>{job.title}</td>
                      <td className='px-6 py-4'>{job.company}</td>
                      <td className='px-6 py-4'>{job.location}</td>
                      <td className='px-6 py-4'>{job.type}</td>
                      <td className='px-6 py-4'>
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <Link href={`/admin/candidates/${job._id}`}>
                          <Button>View </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className='sm:hidden space-y-4'>
            {loading
              ? [...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className='bg-white rounded-xl shadow-md p-4 border border-foundation-pale'
                  >
                    <Skeleton height={24} width='60%' />
                    <Skeleton height={18} width='40%' />
                    <Skeleton height={18} width='50%' />
                    <Skeleton height={18} width='30%' />
                    <Skeleton height={14} width='40%' />
                    <div className='mt-3'>
                      <Skeleton width={120} height={32} />
                    </div>
                  </div>
                ))
              : jobs.map((job) => (
                  <div
                    key={job._id}
                    className='bg-white rounded-xl shadow-md p-4 border border-foundation-pale'
                  >
                    <h3 className='text-lg font-semibold text-foundation-primary'>
                      {job.title}
                    </h3>
                    <p className='text-sm text-gray-600'>{job.company}</p>
                    <p className='text-sm text-gray-600'>{job.location}</p>
                    <p className='text-sm text-gray-600 mb-2'>{job.type}</p>
                    <p className='text-xs text-gray-400'>
                      Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    <div className='mt-4'>
                      <Link href={`/admin/candidates/${job._id}`}>
                        <Button>View</Button>
                      </Link>
                    </div>
                  </div>
                ))}
          </div>
        </main>
      </div>
    </div>
  )
}
