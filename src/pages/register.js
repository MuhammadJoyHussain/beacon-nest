import Header from '@/components/Header'
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

const Register = () => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
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
      department: '',
      position: '',
      startDate: '',
      endDate: '',
      username: '',
      password: '',
      confirmPassword: '',
      shareCode: '',
      terms: false,
      gdpr: false,
      employeeExperience: {
        position: '',
        company: '',
        startDate: '',
        endDate: '',
        city: '',
        country: '',
      },
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('employeeExperience.')) {
      const field = name.split('.')[1]
      setValue(`employeeExperience.${field}`, value)
    } else {
      setValue(name, type === 'checkbox' ? checked : value)
    }
  }

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    if (!selectedFile) return toast.error('Please select a PDF file first')

    const formData = new FormData()
    formData.append('pdf', selectedFile)

    try {
      const res = await api.post('/upload', formData)
      toast.success('PDF uploaded, form data extracted!')

      const data = res.data
      console.log(data)

      if (data.employeeExperience && data.employeeExperience.length > 0) {
        const exp = data.employeeExperience[0]
        setValue('employeeExperience.position', exp.position || '')
        setValue('employeeExperience.company', exp.company || '')
        setValue('employeeExperience.startDate', exp.startDate || '')
        setValue(
          'employeeExperience.endDate',
          exp.endDate?.includes('undefined') ? '' : exp.endDate || ''
        )
        setValue('employeeExperience.city', exp.city || '')
        setValue('employeeExperience.country', exp.country || '')
      }

      reset({ ...formData, ...data })
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Error uploading PDF')
    }
  }

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
      const { data: resData } = await api.post('auth/register', data)
      localStorage.setItem('token', resData.token)
      toast.success('Registration successful! Redirecting...')
      setTimeout(() => router.push('/profile'), 1500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className='min-h-screen bg-green-50'>
      <Header />
      <div className='pt-20 pb-16 px-6 text-black'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-10 space-y-10'
        >
          <h2 className='text-3xl font-extrabold text-green-800 text-center'>
            Employee Registration
          </h2>

          {/* Upload */}
          <section className='space-y-2'>
            <h3 className='text-2xl font-semibold text-green-700'>Upload CV</h3>
            <input
              type='file'
              accept='application/pdf'
              onChange={handleFileChange}
              className='border border-green-300 rounded px-3 py-2 bg-green-50 text-green-900'
            />
          </section>

          {/* Personal Details */}
          <section className='space-y-6'>
            <h3 className='text-2xl font-semibold text-green-700'>
              Personal Details
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Input
                name='firstName'
                placeholder='First Name*'
                register={register}
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                name='lastName'
                placeholder='Last Name*'
                register={register}
                value={formData.lastName}
                onChange={handleChange}
              />
              <Input
                name='dob'
                type='date'
                placeholder='Date of Birth*'
                register={register}
                value={formData.dob}
                onChange={handleChange}
              />
              <Select
                name='gender'
                {...register('gender')}
                value={formData.gender}
                onChange={handleChange}
              >
                <option value=''>Select Gender*</option>
                {genders.map((gen) => (
                  <SelectItem key={gen} value={gen}>
                    {gen}
                  </SelectItem>
                ))}
              </Select>
              <Input
                name='shareCode'
                placeholder='Share Code*'
                {...register('shareCode')}
                value={formData.shareCode}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Contact Info */}
          <section className='space-y-6'>
            <h3 className='text-2xl font-semibold text-green-700'>
              Contact Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Input
                name='email'
                type='email'
                placeholder='Email*'
                register={register}
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                name='phone'
                placeholder='Phone Number*'
                register={register}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Address */}
          <section className='space-y-6'>
            <h3 className='text-2xl font-semibold text-green-700'>Address</h3>
            <Input
              name='street'
              placeholder='Street Address*'
              register={register}
              value={formData.street}
              onChange={handleChange}
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Input
                name='city'
                placeholder='City*'
                register={register}
                value={formData.city}
                onChange={handleChange}
              />
              <Input
                name='postcode'
                placeholder='Postcode*'
                register={register}
                value={formData.postcode}
                onChange={handleChange}
              />
            </div>
            <Select
              name='country'
              register={register}
              value={formData.country}
              onChange={handleChange}
            >
              <option value=''>Select Country*</option>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </Select>
          </section>

          {/* Experience */}
          <section className='space-y-6'>
            <h3 className='text-2xl font-semibold text-green-700'>
              Employee Experience
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Input
                name='employeeExperience.position'
                placeholder='Position*'
                register={register}
                value={formData.employeeExperience?.position || ''}
                onChange={handleChange}
              />
              <Input
                name='employeeExperience.company'
                placeholder='Company*'
                register={register}
                value={formData.employeeExperience?.company || ''}
                onChange={handleChange}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Input
                name='employeeExperience.startDate'
                type='date'
                placeholder='Start Date*'
                register={register}
                value={formData.employeeExperience?.startDate || ''}
                onChange={handleChange}
              />
              <Input
                name='employeeExperience.endDate'
                type='date'
                placeholder='End Date'
                register={register}
                value={formData.employeeExperience?.endDate || ''}
                onChange={handleChange}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Input
                name='employeeExperience.city'
                placeholder='City'
                register={register}
                value={formData.employeeExperience?.city || ''}
                onChange={handleChange}
              />
              <Input
                name='employeeExperience.country'
                placeholder='Country'
                register={register}
                value={formData.employeeExperience?.country || ''}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Account Setup */}
          <section className='space-y-6'>
            <h3 className='text-2xl font-semibold text-green-700'>
              Account Setup
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Input
                name='username'
                placeholder='Username*'
                {...register('username')}
                value={formData.username}
                onChange={handleChange}
              />
              <Input
                name='password'
                type='password'
                placeholder='Password*'
                {...register('password')}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Input
              name='confirmPassword'
              type='password'
              placeholder='Confirm Password*'
              {...register('confirmPassword')}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </section>

          {/* Consent */}
          <section className='space-y-3'>
            <label className='flex items-center space-x-3'>
              <Checkbox
                name='terms'
                checked={formData.terms}
                onChange={handleChange}
              />
              <span className='text-green-900'>
                I agree to the{' '}
                <a href='/terms' className='underline'>
                  Terms & Conditions*
                </a>
              </span>
            </label>
            <label className='flex items-center space-x-3'>
              <Checkbox
                name='gdpr'
                checked={formData.gdpr}
                onChange={handleChange}
              />
              <span className='text-green-900'>
                I agree to the{' '}
                <a href='/gdpr' className='underline'>
                  GDPR Policy*
                </a>
              </span>
            </label>
          </section>

          <Button
            type='submit'
            className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition'
          >
            Register
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default Register
