import { useState } from 'react'
import { useRouter } from 'next/router'
import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import api from '@/utils/api'

export default function CreateJobPage() {
  const router = useRouter()

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
      <label className='block font-semibold text-foundation-primary mb-2'>
        {label}
      </label>
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
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <Button type='button' onClick={() => addField(field)}>
        + Add {label.split(' ')[0]}
      </Button>
    </div>
  )

  return (
    <div className='flex h-screen bg-foundation-background text-foundation-primary'>
      <Sidebar />
      <div className='flex flex-col flex-grow'>
        <Header />
        <main className='w-full pt-20 pb-16 px-4 sm:px-8 max-w-4xl mx-auto overflow-auto'>
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
            />
            <Input
              name='company'
              value={form.company}
              onChange={handleChange}
              label='Company'
            />
            <Input
              name='location'
              value={form.location}
              onChange={handleChange}
              label='Location'
            />
            <Input
              name='type'
              value={form.type}
              onChange={handleChange}
              label='Type (e.g. Full-time)'
            />
            <Input
              name='salary'
              value={form.salary}
              onChange={handleChange}
              label='Salary'
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
              <Button type='submit'>Submit Job Post</Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
