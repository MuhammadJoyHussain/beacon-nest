import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import api from '@/utils/api'
import { parseJwt } from '@/utils/parseJWT'

export default function CreateJobPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(null)

  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    salary: '',
    department: '',
    companyOverview: '',
    jobSummary: '',
    keyResponsibilities: [''],
    requiredQualifications: [''],
    preferredQualifications: [''],
    benefits: [''],
    howToApply: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = parseJwt(token)

    if (!user || (user.role !== 'admin' && user.role !== 'employer')) {
      toast.error('Unauthorized: Admins or Employers only')
      setAuthorized(false)
      router.push('/login')
    } else {
      setAuthorized(true)
    }
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (e, field, index) => {
    const updated = [...form[field]]
    updated[index] = e.target.value
    setForm((prev) => ({ ...prev, [field]: updated }))
  }

  const addField = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }))
  }

  const removeField = (field, index) => {
    const updated = [...form[field]]
    updated.splice(index, 1)
    setForm((prev) => ({ ...prev, [field]: updated }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isFormValid()) {
      toast.error('Please fill in all required fields.')
      return
    }

    try {
      await api.post('/vacancy', form)
      toast.success('Job post created')
      router.push('/admin/jobs')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.error || 'Failed to create job')
    }
  }

  const renderArrayField = (field, label) => (
    <div className='mb-6'>
      <label className='block font-semibold mb-2'>{label}</label>
      {form[field].map((item, index) => (
        <div key={index} className='flex items-center gap-2 mb-2'>
          <Input
            value={item}
            onChange={(e) => handleArrayChange(e, field, index)}
            className='flex-1'
          />
          {form[field].length > 1 && (
            <button
              type='button'
              onClick={() => removeField(field, index)}
              className='text-red-500'
              aria-label='Remove item'
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <Button type='button' onClick={() => addField(field)} className='mt-1'>
        + Add {label.split(' ')[0]}
      </Button>
    </div>
  )

  if (authorized === null) {
    return (
      <div className='min-h-screen p-10'>
        <div className='max-w-2xl mx-auto space-y-6'>
          <Skeleton height={40} width={250} />
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} height={48} />
            ))}
        </div>
      </div>
    )
  }

  const isFormValid = () => {
    const requiredFields = ['title', 'company', 'location', 'type', 'salary']

    const hasEmptyRequiredField = requiredFields.some(
      (field) => !form[field]?.trim()
    )

    const hasEmptyArrayField = [
      'keyResponsibilities',
      'requiredQualifications',
    ].some((field) => form[field].some((item) => !item.trim()))

    return !hasEmptyRequiredField && !hasEmptyArrayField
  }

  if (!authorized) return null

  return (
    <div className='flex flex-col sm:flex-row h-screen bg-foundation-background text-foundation-primary'>
      <Sidebar />
      <main className='flex-1 w-full overflow-auto'>
        <div className='pt-20 pb-16 px-4 sm:px-8 max-w-4xl mx-auto'>
          <h1 className='text-3xl font-bold mb-8 text-center'>
            Post a New Job
          </h1>
          <form
            onSubmit={handleSubmit}
            className='space-y-6 bg-white p-6 sm:p-10 rounded-xl shadow'
          >
            <Input
              name='title'
              value={form.title}
              onChange={handleChange}
              label='Job Title'
              required
            />
            <Input
              name='company'
              value={form.company}
              onChange={handleChange}
              label='Company'
              required
            />
            <Input
              name='location'
              value={form.location}
              onChange={handleChange}
              label='Location'
              required
            />
            <Input
              name='type'
              value={form.type}
              onChange={handleChange}
              label='Type (e.g. Full-time)'
              required
            />
            <Input
              name='salary'
              value={form.salary}
              onChange={handleChange}
              label='Salary'
              required
            />
            <Input
              name='department'
              value={form.department}
              onChange={handleChange}
              label='Department'
            />
            <Textarea
              name='companyOverview'
              value={form.companyOverview}
              onChange={handleChange}
              label='Company Overview'
            />
            <Textarea
              name='jobSummary'
              value={form.jobSummary}
              onChange={handleChange}
              label='Job Summary'
            />
            {renderArrayField('keyResponsibilities', 'Key Responsibilities')}
            {renderArrayField(
              'requiredQualifications',
              'Required Qualifications'
            )}
            {renderArrayField(
              'preferredQualifications',
              'Preferred Qualifications'
            )}
            {renderArrayField('benefits', 'Benefits')}
            <Input
              name='howToApply'
              value={form.howToApply}
              onChange={handleChange}
              label='How to Apply'
            />
            <div className='text-center'>
              <Button
                type='submit'
                className={`w-full sm:w-auto ${
                  !isFormValid()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : ''
                }`}
                disabled={!isFormValid()}
              >
                Submit Job Post
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
