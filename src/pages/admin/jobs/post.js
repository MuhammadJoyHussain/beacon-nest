import { useEffect, useState, memo } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '@/components/dashboard/Sidebar'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import api from '@/utils/api'
import { parseJwt } from '@/utils/parseJWT'

function Section({ title, subtitle, children }) {
  return (
    <section className='rounded-2xl border border-foundation-pale bg-white shadow-sm overflow-hidden'>
      <div className='bg-gradient-to-r from-blue-50 to-slate-50 px-5 py-4'>
        <h2 className='text-lg font-semibold text-foundation-primary'>
          {title}
        </h2>
        {subtitle && (
          <p className='text-sm text-slate-600 mt-0.5'>{subtitle}</p>
        )}
      </div>
      <div className='p-5 space-y-5'>{children}</div>
    </section>
  )
}

const ArrayField = memo(function ArrayField({
  form,
  field,
  label,
  hint,
  onChange,
  onAdd,
  onRemove,
}) {
  return (
    <div>
      <div className='flex items-baseline justify-between mb-2'>
        <label className='font-semibold'>{label}</label>
        {hint && <span className='text-xs text-slate-500'>{hint}</span>}
      </div>
      <div className='space-y-2'>
        {form[field].map((item, index) => (
          <div
            key={`${field}-${index}`}
            className='flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2'
          >
            <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-semibold'>
              {index + 1}
            </span>
            <Input
              value={item}
              onChange={(e) => onChange(e, field, index)}
              className='flex-1 bg-white'
              placeholder={`Enter ${label.toLowerCase().replace(/s$/, '')}...`}
            />
            {form[field].length > 1 && (
              <button
                type='button'
                onClick={() => onRemove(field, index)}
                className='inline-flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition'
                aria-label='Remove item'
                title='Remove'
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      <div className='mt-3'>
        <Button
          type='button'
          onClick={() => onAdd(field)}
          className='inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100'
        >
          <span className='text-lg leading-none'>＋</span> Add{' '}
          {label.split(' ')[0]}
        </Button>
      </div>
    </div>
  )
})

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
    skills: [''], // 👈 added skills
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
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  const removeField = (field, index) => {
    const updated = [...form[field]]
    updated.splice(index, 1)
    setForm((prev) => ({ ...prev, [field]: updated }))
  }

  const isFormValid = () => {
    const requiredFields = ['title', 'company', 'location', 'type', 'salary']
    const hasEmptyRequiredField = requiredFields.some(
      (field) => !form[field]?.trim()
    )
    const hasEmptyArrayField = [
      'keyResponsibilities',
      'requiredQualifications',
      'skills', // 👈 include skills
    ].some((field) => form[field].some((item) => !item.trim()))

    return !hasEmptyRequiredField && !hasEmptyArrayField
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid()) {
      toast.error('Please fill in all required fields.')
      return
    }
    try {
      const token = localStorage.getItem('token')
      const user = parseJwt(token)
      await api.post('/vacancy', form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Job post created')
      if (user?.role === 'employer') {
        router.push('/employer/jobs')
      } else {
        router.push('/admin/jobs')
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create job')
    }
  }

  if (authorized === null) {
    return (
      <div className='min-h-screen p-10'>
        <div className='max-w-3xl mx-auto space-y-6'>
          <Skeleton height={40} width={280} />
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} height={56} />
            ))}
        </div>
      </div>
    )
  }

  if (!authorized) return null

  return (
    <div className='flex flex-col sm:flex-row h-screen bg-foundation-background text-foundation-primary'>
      <Sidebar />
      <main className='flex-1 w-full overflow-auto'>
        <div className='sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur'>
          <div className='mx-auto max-w-5xl px-4 sm:px-8 py-4 flex items-center justify-between'>
            <div>
              <h1 className='text-xl sm:text-2xl font-bold'>Post a New Job</h1>
              <p className='text-sm text-slate-600'>
                Fill the sections below and submit when ready.
              </p>
            </div>
            <div className='hidden sm:flex gap-2'>
              <Button
                type='button'
                className='border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                form='create-job-form'
                className={`${
                  !isFormValid()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : ''
                }`}
                disabled={!isFormValid()}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>

        <div className='py-8 px-4 sm:px-8 max-w-5xl mx-auto space-y-6'>
          <form
            id='create-job-form'
            onSubmit={handleSubmit}
            className='space-y-6'
          >
            <Section
              title='Job Overview'
              subtitle='Core details candidates will see first.'
            >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                  label='Type (e.g., Full-time)'
                  required
                />
                <Input
                  name='salary'
                  value={form.salary}
                  onChange={handleChange}
                  label='Salary'
                  placeholder='e.g., £45,000–£55,000'
                  required
                />
                <Input
                  name='department'
                  value={form.department}
                  onChange={handleChange}
                  label='Department'
                />
              </div>
            </Section>

            <Section
              title='Descriptions'
              subtitle='Help candidates quickly understand the role and your company.'
            >
              <Textarea
                name='companyOverview'
                value={form.companyOverview}
                onChange={handleChange}
                label='Company Overview'
                placeholder='What does your company do? Mission, team, culture...'
              />
              <Textarea
                name='jobSummary'
                value={form.jobSummary}
                onChange={handleChange}
                label='Job Summary'
                placeholder='In 3–5 sentences, describe the purpose and impact of this role.'
              />
            </Section>

            <Section
              title='Responsibilities, Qualifications & Skills'
              subtitle='List the essentials first for clarity.'
            >
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <ArrayField
                  form={form}
                  field='keyResponsibilities'
                  label='Key Responsibilities'
                  hint='Minimum 1 item required'
                  onChange={handleArrayChange}
                  onAdd={addField}
                  onRemove={removeField}
                />
                <ArrayField
                  form={form}
                  field='requiredQualifications'
                  label='Required Qualifications'
                  hint='Minimum 1 item required'
                  onChange={handleArrayChange}
                  onAdd={addField}
                  onRemove={removeField}
                />
                <ArrayField
                  form={form}
                  field='preferredQualifications'
                  label='Preferred Qualifications'
                  hint='Optional'
                  onChange={handleArrayChange}
                  onAdd={addField}
                  onRemove={removeField}
                />
                <ArrayField
                  form={form}
                  field='benefits'
                  label='Benefits'
                  hint='Optional'
                  onChange={handleArrayChange}
                  onAdd={addField}
                  onRemove={removeField}
                />
                <ArrayField
                  form={form}
                  field='skills'
                  label='Skills'
                  hint='Minimum 1 skill required'
                  onChange={handleArrayChange}
                  onAdd={addField}
                  onRemove={removeField}
                />
              </div>
            </Section>

            <Section
              title='Application'
              subtitle='Tell candidates how to apply.'
            >
              <Input
                name='howToApply'
                value={form.howToApply}
                onChange={handleChange}
                label='How to Apply'
                placeholder='e.g., Apply on our careers page or email careers@company.com'
              />
            </Section>

            <div className='sticky bottom-4 z-10'>
              <div className='mx-auto max-w-5xl'>
                <div className='rounded-2xl border border-slate-200 bg-white/90 backdrop-blur px-4 py-3 shadow-lg flex items-center justify-between'>
                  <div className='text-sm text-slate-600'>
                    {isFormValid()
                      ? 'Ready to submit.'
                      : 'Complete the required fields to submit.'}
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      type='button'
                      className='border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                    <Button
                      type='submit'
                      className={`${
                        !isFormValid()
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : ''
                      }`}
                      disabled={!isFormValid()}
                    >
                      Submit Job Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className='rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700'>
            <div className='font-semibold mb-2'>Tips for a standout post</div>
            <ul className='list-disc list-inside space-y-1'>
              <li>Use clear, inclusive language and avoid internal jargon.</li>
              <li>Lead with impact: why this role matters to your mission.</li>
              <li>
                Keep responsibilities concise (5–8 bullet points is ideal).
              </li>
              <li>State compensation transparently to boost conversions.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
