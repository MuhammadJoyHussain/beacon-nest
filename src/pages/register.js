import Header from '@/components/dashboard/Header'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SelectItem from '@/components/ui/SelectItem'
import api from '@/utils/api'
import { useRouter } from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import Footer from '@/components/Footer'
import { FileText, Upload } from 'lucide-react'
import authApi from '@/utils/authApi'

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      dob: '',
      gender: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      postcode: '',
      country: '',
      employeeExperience: [
        {
          position: '',
          company: '',
          startDate: '',
          endDate: '',
          city: '',
          country: '',
        },
      ],
      company: '',
      startDate: '',
      endDate: '',
      expCity: '',
      expCountry: '',
      username: '',
      password: '',
      confirmPassword: '',
      shareCode: '',
      terms: false,
      gdpr: false,
      skills: [''], // start with one skill input
    },
  })

  const router = useRouter()
  const [file, setFile] = useState(null)
  const formData = watch()

  const genders = ['Male', 'Female', 'Other']
  const countries = [
    'United Kingdom',
    'United States',
    'Canada',
    'Australia',
    'Germany',
  ]

  // Fields arrays for easier map rendering
  const personalFields = [
    { name: 'firstName', placeholder: 'First Name*' },
    { name: 'lastName', placeholder: 'Last Name*' },
    { name: 'dob', placeholder: 'Date of Birth*', type: 'date' },
    { name: 'shareCode', placeholder: 'Share Code*' },
  ]

  const contactFields = [
    { name: 'email', placeholder: 'Email*', type: 'email' },
    { name: 'phone', placeholder: 'Phone Number*' },
  ]

  const addressFields = [
    { name: 'street', placeholder: 'Street Address*' },
    { name: 'city', placeholder: 'City*' },
    { name: 'postcode', placeholder: 'Postcode*' },
  ]

  const experienceFields = [
    { name: 'position', placeholder: 'Position*' },
    { name: 'company', placeholder: 'Company*' },
    { name: 'startDate', placeholder: 'Start Date*', type: 'date' },
    { name: 'endDate', placeholder: 'End Date', type: 'date' },
    { name: 'expCity', placeholder: 'City' },
    { name: 'expCountry', placeholder: 'Country' },
  ]

  const accountFields = [
    { name: 'username', placeholder: 'Username*' },
    { name: 'password', placeholder: 'Password*', type: 'password' },
    {
      name: 'confirmPassword',
      placeholder: 'Confirm Password*',
      type: 'password',
    },
  ]

  const policyFields = [
    { name: 'terms', label: 'Terms & Conditions*', href: '/terms' },
    { name: 'gdpr', label: 'GDPR*', href: '/gdpr' },
  ]

  // Handle file upload and extract form data from API
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    if (!selectedFile) return toast.error('Please select a PDF file first')

    const formDataUpload = new FormData()
    formDataUpload.append('pdf', selectedFile)

    try {
      const res = await api.post('/upload', formDataUpload)
      toast.success('PDF uploaded, form data extracted!')

      const data = res.data
      console.log(data.employeeExperience)

      if (data.employeeExperience && data.employeeExperience.length > 0) {
        const exp = data.employeeExperience[0]
        setValue('employeeExperience', [
          {
            position: exp.position || '',
            company: exp.company || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate?.includes('undefined')
              ? ''
              : exp.endDate || '',
            city: exp.city || '',
            country: exp.country || '',
          },
        ])
      }

      reset({ ...formData, ...data })
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Error uploading PDF')
    }
  }

  const addExperience = () => {
    setValue('employeeExperience', [
      ...formData.employeeExperience,
      {
        position: '',
        company: '',
        startDate: '',
        endDate: '',
        city: '',
        country: '',
      },
    ])
  }

  const removeExperience = (index) => {
    const updated = [...formData.employeeExperience]
    updated.splice(index, 1)
    setValue('employeeExperience', updated)
  }

  const handleExperienceChange = (e, index, field) => {
    const updated = [...formData.employeeExperience]
    updated[index][field] = e.target.value
    setValue('employeeExperience', updated)
  }

  // Skills management handlers
  const addSkill = () => {
    setValue('skills', [...formData.skills, ''])
  }

  const removeSkill = (index) => {
    if (formData.skills.length <= 1) return
    const updated = [...formData.skills]
    updated.splice(index, 1)
    setValue('skills', updated)
  }

  const handleSkillChange = (e, index) => {
    const updated = [...formData.skills]
    updated[index] = e.target.value
    setValue('skills', updated)
  }

  // Submit handler
  const onSubmit = async (data) => {
    if (!data.terms || !data.gdpr) {
      toast.error('Please agree to Terms & Conditions and GDPR policy.')
      return
    }
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    try {
      const { data: resData } = await authApi.post('auth/register', data)
      localStorage.setItem('token', resData.token)
      toast.success('Registration successful! Redirecting...')
      setTimeout(() => router.push('/profile'), 1500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
  }
  const formatToUKDate = (dateStr) => {
    const date = new Date(dateStr)
    return !isNaN(date) ? date.toISOString().split('T')[0] : ''
  }

  // Replace your Experience section with this function call
  function renderExperienceFields() {
    return (
      <section className='space-y-6'>
        <h3 className='text-xl font-semibold mb-4'>Experience</h3>
        {formData.employeeExperience.map((exp, index) => (
          <div
            key={index}
            className='grid md:grid-cols-2 gap-6 mb-4 p-4 rounded-xl'
          >
            <Input
              label='Position*'
              value={exp.position}
              onChange={(e) => handleExperienceChange(e, index, 'position')}
              {...register(`employeeExperience.${index}.position`)}
              placeholder='Position'
            />
            <Input
              label='Company*'
              value={exp.company}
              onChange={(e) => handleExperienceChange(e, index, 'company')}
              {...register(`employeeExperience.${index}.company`)}
              placeholder='Company'
            />
            <Input
              label='Start Date*'
              type='date'
              value={formatToUKDate(exp.startDate)}
              onChange={(e) => handleExperienceChange(e, index, 'startDate')}
              {...register(`employeeExperience.${index}.startDate`)}
            />
            {
              // If endDate is a date, show date input. If it's text like "Present", show text input
              isNaN(new Date(exp.endDate)) ? (
                <Input
                  label='End Date'
                  type='text'
                  value={exp.endDate}
                  onChange={(e) => handleExperienceChange(e, index, 'endDate')}
                  {...register(`employeeExperience.${index}.endDate`)}
                />
              ) : (
                <Input
                  label='End Date'
                  type='date'
                  value={formatToUKDate(exp.endDate)}
                  onChange={(e) => handleExperienceChange(e, index, 'endDate')}
                  {...register(`employeeExperience.${index}.endDate`)}
                />
              )
            }
            <Input
              label='City'
              value={exp.city}
              onChange={(e) => handleExperienceChange(e, index, 'city')}
              {...register(`employeeExperience.${index}.city`)}
              placeholder='City'
            />
            <Input
              label='Country'
              value={exp.country}
              onChange={(e) => handleExperienceChange(e, index, 'country')}
              {...register(`employeeExperience.${index}.country`)}
              placeholder='Country'
            />
            {formData.employeeExperience.length > 1 && (
              <div className='md:col-span-2 text-right'>
                <button
                  type='button'
                  onClick={() => removeExperience(index)}
                  className='text-red-500'
                >
                  ✕ Remove Experience
                </button>
              </div>
            )}
          </div>
        ))}
        <Button type='button' onClick={addExperience} className='mt-2'>
          + Add Experience
        </Button>
      </section>
    )
  }

  return (
    <div className='min-h-screen background text-[#3D52A0]'>
      <Header />
      <div className='pt-20 pb-16 px-4'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='max-w-4xl bg-white mx-auto shadow-xl rounded-3xl p-10 space-y-10'
        >
          <h2 className='text-2xl font-semibold mb-8'>Employee Registration</h2>

          {/* Upload CV Section */}
          <section className='space-y-4'>
            <h3 className='text-xl font-semibold text-[#3D52A0]'>Upload CV</h3>

            <label
              htmlFor='cv-upload'
              className='relative w-full cursor-pointer bg-[#F3F4FA] border border-[#ADBBDA] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 hover:shadow-md transition-shadow'
            >
              <div className='flex items-center gap-4'>
                <div className='bg-[#7091E6] p-3 rounded-xl'>
                  <FileText className='text-white w-6 h-6 sm:w-7 sm:h-7' />
                </div>
                <div>
                  <p className='text-sm font-medium text-[#3D52A0] truncate max-w-xs sm:max-w-md'>
                    {file
                      ? file.name
                      : 'Click here or drag and drop a PDF file'}
                  </p>
                  <p className='text-xs text-gray-500'>
                    Upload only PDF format. Max size 5MB.
                  </p>
                </div>
              </div>

              {/* Hidden input */}
              <input
                id='cv-upload'
                type='file'
                accept='application/pdf'
                onChange={handleFileChange}
                className='hidden'
              />
            </label>
          </section>

          {/* Personal Details */}
          <section className='space-y-6'>
            <h3 className='text-xl font-semibold mb-4'>Personal Details</h3>
            <div className='grid md:grid-cols-2 gap-6'>
              {personalFields.map(({ name, placeholder, type }) => (
                <Input
                  key={name}
                  label={placeholder}
                  name={name}
                  type={type || 'text'}
                  value={formData[name]}
                  placeholder={placeholder}
                  {...register(name, { required: placeholder.endsWith('*') })}
                  error={errors[name]}
                />
              ))}
              <Select
                label='Gender'
                name='gender'
                {...register('gender')}
                value={formData.gender}
                onChange={(e) => setValue('gender', e.target.value)}
                className='w-full'
              >
                <option value=''>Select Gender</option>
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
            </div>
          </section>

          {/* Contact Details */}
          <section className='space-y-6'>
            <h3 className='text-xl font-semibold mb-4'>Contact Details</h3>
            <div className='grid md:grid-cols-2 gap-6'>
              {contactFields.map(({ name, placeholder, type }) => (
                <Input
                  key={name}
                  label={placeholder}
                  value={formData[name]}
                  name={name}
                  type={type || 'text'}
                  placeholder={placeholder}
                  {...register(name, { required: placeholder.endsWith('*') })}
                  error={errors[name]}
                />
              ))}
            </div>
          </section>

          {/* Address */}
          <section className='space-y-6'>
            <h3 className='text-xl font-semibold mb-4'>Address</h3>
            <div className='grid md:grid-cols-2 gap-6'>
              {addressFields.map(({ name, placeholder, type }) => (
                <Input
                  key={name}
                  label={placeholder}
                  name={name}
                  value={formData[name]}
                  type={type || 'text'}
                  placeholder={placeholder}
                  {...register(name, { required: placeholder.endsWith('*') })}
                  error={errors[name]}
                />
              ))}
              <Select
                label='Country'
                name='country'
                {...register('country')}
                value={formData.country}
                onChange={(e) => setValue('country', e.target.value)}
                className='w-full'
              >
                <option value=''>Select Country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </section>

          {/* Experience */}

          {renderExperienceFields()}

          {/* Skills (Dynamic Inputs) */}
          {renderSkillsField()}

          {/* Account Details */}
          <section className='space-y-6'>
            <h3 className='text-xl font-semibold mb-4'>Account Details</h3>
            <div className='grid md:grid-cols-2 gap-6'>
              {accountFields.map(({ name, placeholder, type }) => (
                <Input
                  key={name}
                  label={placeholder}
                  name={name}
                  type={type || 'text'}
                  placeholder={placeholder}
                  {...register(name, { required: placeholder.endsWith('*') })}
                  error={errors[name]}
                />
              ))}
            </div>
          </section>

          {/* Policies */}
          <section>
            {policyFields.map(({ name, label, href }) => (
              <div className='flex'>
                <Checkbox
                  key={name}
                  label={
                    <>
                      I agree to{' '}
                      <a
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 underline'
                      >
                        {label}
                      </a>
                    </>
                  }
                  name={name}
                  {...register(name, { required: true })}
                  error={errors[name]}
                />
              </div>
            ))}
          </section>

          <Button type='submit' className='w-full'>
            Register
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  )

  // Render Skills Field inside component to access formData etc.
  function renderSkillsField() {
    return (
      <section className='space-y-6'>
        <h3 className='text-xl font-semibold mb-4'>Skills</h3>
        {formData.skills.map((skill, index) => (
          <div key={index} className='flex items-center gap-2 mb-2'>
            <Input
              {...register(`skills.${index}`)}
              value={skill}
              label={'eg.. React, HTML, JavaScript'}
              onChange={(e) => handleSkillChange(e, index)}
              className='flex-1'
              placeholder='Enter skill'
            />
            {formData.skills.length > 1 && (
              <button
                type='button'
                onClick={() => removeSkill(index)}
                className='text-red-500 font-bold text-lg px-2'
                aria-label='Remove skill'
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <Button type='button' onClick={addSkill} className='mt-1'>
          + Add Skill
        </Button>
      </section>
    )
  }
}

export default Register
