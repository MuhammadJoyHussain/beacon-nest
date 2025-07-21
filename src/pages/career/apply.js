import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import api from '@/utils/api'
import Header from '@/components/dashboard/Header'
import Footer from '@/components/Footer'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import Checkbox from '@/components/ui/Checkbox'
import { toast, Toaster } from 'react-hot-toast'
import authApi from '@/utils/authApi'
import ApplyLoader from '@/components/Loaders/careerLoaders/ApplyLoader'

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
        const { data } = await authApi.get('/auth/profile', {
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

  if (loading) return <ApplyLoader />

  if (!user) return null

  return (
    <div className='min-h-screen bg-muted'>
      <Toaster />
      <Header />
      <main className='max-w-3xl mx-auto px-6 pt-24 pb-10 text-primary'>
        <div className='bg-white p-8 rounded-xl shadow-md'>
          <h1 className='text-2xl font-bold mb-6 text-primary'>
            Apply for Job
          </h1>

          <form className='space-y-6' onSubmit={handleSubmit}>
            <Textarea
              label='Cover Letter'
              name='coverLetter'
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
              required
            />

            <Textarea
              label='Why do you want this job?'
              name='additionalInfo'
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={3}
            />

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

            <Checkbox
              name='authorized'
              label='I am authorized to work in this country'
              checked={authorized}
              onChange={() => setAuthorized(!authorized)}
            />

            <Button type='submit' className='bg-primary text-white w-full'>
              Submit Application
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
