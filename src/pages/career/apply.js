import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import api from '@/utils/api'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { toast, Toaster } from 'react-hot-toast'

export default function ApplyJob() {
  const router = useRouter()
  const { id } = router.query

  const [user, setUser] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [expectedSalary, setExpectedSalary] = useState('')
  const [startDate, setStartDate] = useState('')
  const [linkedIn, setLinkedIn] = useState('')
  const [experienceYears, setExperienceYears] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push(`/login?redirect=/career/apply?id=${id}`)
        return
      }

      try {
        const { data } = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(data)
      } catch (err) {
        toast.error('Unauthorized. Please login again.')
        localStorage.removeItem('token')
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await api.post(
        `/application`,
        {
          jobId: id,
          coverLetter,
          additionalInfo,
          expectedSalary,
          startDate,
          linkedIn,
          experienceYears,
          authorized,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      toast.success('Application submitted!')
      router.push('/joblists')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed')
    }
  }

  if (loading) return <div className='p-20 text-center'>Loading...</div>
  if (!user) return null

  return (
    <div className='min-h-screen bg-green-50'>
      <Toaster />
      <Header />
      <main className='max-w-3xl mx-auto px-6 pt-24 pb-10 text-black'>
        <div className='bg-white p-8 rounded-xl shadow-md'>
          <h1 className='text-2xl font-bold mb-6 text-green-800'>
            Apply for Job
          </h1>

          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label className='block text-gray-700 font-medium mb-2'>
                Cover Letter
              </label>
              <textarea
                rows={5}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:outline-none'
                required
              />
            </div>

            <div>
              <label className='block text-gray-700 font-medium mb-2'>
                Why do you want this job?
              </label>
              <textarea
                rows={3}
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:outline-none'
              />
            </div>

            <Input
              label='Expected Salary'
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
              type='number'
              required
            />

            <Input
              label='Available Start Date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              type='date'
              required
            />

            <Input
              label='LinkedIn or Portfolio Link'
              value={linkedIn}
              onChange={(e) => setLinkedIn(e.target.value)}
              type='url'
            />

            <Input
              label='Years of Experience'
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              type='number'
              required
            />

            <div className='flex items-center gap-2'>
              <input
                id='authorized'
                type='checkbox'
                checked={authorized}
                onChange={() => setAuthorized(!authorized)}
                className='h-4 w-4 border-gray-300 rounded'
              />
              <label htmlFor='authorized' className='text-gray-700'>
                I am authorized to work in this country
              </label>
            </div>

            <Button type='submit' className='bg-green-600 text-white w-full'>
              Submit Application
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
