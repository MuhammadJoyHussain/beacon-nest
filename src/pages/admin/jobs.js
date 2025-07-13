import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api from '@/utils/api'
import LoadingScreen from '@/components/Loading'

function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1]
    const payload = atob(base64Payload)
    return JSON.parse(payload)
  } catch (e) {
    console.error('Failed to parse JWT', e)
    return null
  }
}

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

  if (loading) return <LoadingScreen />

  return (
    <div className='flex h-screen bg-foundation-background'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <Header />
        <main className='pt-20 pb-16 px-4 sm:px-8 max-w-6xl mx-auto w-full text-foundation-primary overflow-auto'>
          <h1 className='text-3xl font-bold text-center mb-10'>
            All Job Posts
          </h1>

          <div className='overflow-x-auto bg-white rounded-xl shadow-lg'>
            <table className='w-full table-auto text-left'>
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
                {jobs.map((job) => (
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
                        <Button>View Candidates</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td
                      colSpan='6'
                      className='text-center py-10 text-foundation-softblue'
                    >
                      No jobs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}
