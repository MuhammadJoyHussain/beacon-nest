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
      position: '',
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

  // Define input fields for each section
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setValue(name, type === 'checkbox' ? checked : value)
  }

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
      if (data.employeeExperience && data.employeeExperience.length > 0) {
        const exp = data.employeeExperience[0]
        setValue('position', exp.position || '')
        setValue('company', exp.company || '')
        setValue('startDate', exp.startDate || '')
        setValue(
          'endDate',
          exp.endDate?.includes('undefined') ? '' : exp.endDate || ''
        )
        setValue('expCity', exp.city || '')
        setValue('expCountry', exp.country || '')
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
    <div className='min-h-screen background text-[#3D52A0]'>
      <Header />
      <div className='pt-20 pb-16 px-4'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='max-w-4xl bg-white mx-auto shadow-xl rounded-3xl p-10 space-y-10'
        >
          <h2>Employee Registration</h2>

          {/* Upload */}
          <section className='space-y-4'>
            <h3 className='text-xl font-semibold text-[#3D52A0]'>Upload CV</h3>

            <div className='relative w-full bg-[#F3F4FA] border border-[#ADBBDA] rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition-shadow'>
              <div className='flex items-center gap-4'>
                <div className='bg-[#7091E6] p-3 rounded-xl'>
                  <FileText className='text-white w-6 h-6' />
                </div>
                <div>
                  <p className='text-sm font-medium text-[#3D52A0]'>
                    {file ? file.name : 'No file selected'}
                  </p>
                  <p className='text-xs text-gray-500'>
                    Upload only PDF format. Max size 5MB.
                  </p>
                </div>
              </div>

              <label
                htmlFor='cv-upload'
                className='inline-flex items-center gap-2 text-sm text-white bg-[#7091E6] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#3D52A0] transition-colors'
              >
                <Upload className='w-4 h-4' />
                Upload
                <input
                  id='cv-upload'
                  type='file'
                  accept='application/pdf'
                  onChange={handleFileChange}
                  className='hidden'
                />
              </label>
            </div>
          </section>

          {/* Personal Details */}
          <section className='space-y-6'>
            <h3>Personal Details</h3>
            <div className='grid md:grid-cols-2 gap-6'>
              {personalFields.map(({ name, placeholder, type }) => (
                <Input
                  key={name}
                  label={placeholder}
                  name={name}
                  type={type || 'text'}
                  placeholder={placeholder}
                  register={register}
                  value={formData[name]}
                  onChange={handleChange}
                />
              ))}
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
            </div>
          </section>

          {/* Contact Information */}
          <section className='space-y-6'>
            <h3>Contact Information</h3>
            <div className='grid md:grid-cols-2 gap-6'>
              {contactFields.map(({ name, placeholder, type }) => (
                <Input
                  key={name}
                  name={name}
                  label={placeholder}
                  type={type || 'text'}
                  placeholder={placeholder}
                  register={register}
                  value={formData[name]}
                  onChange={handleChange}
                />
              ))}
            </div>
          </section>

          {/* Address */}
          <section className='space-y-6'>
            <h3>Address</h3>
            <div className='grid md:grid-cols-2 gap-6'>
              {addressFields.map(({ name, placeholder }) => (
                <Input
                  key={name}
                  name={name}
                  label={placeholder}
                  placeholder={placeholder}
                  register={register}
                  value={formData[name]}
                  onChange={handleChange}
                />
              ))}
              <Select
                className='pt-6'
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
            </div>
          </section>

          {/* Employee Experience */}
          <section className='space-y-6'>
            <h3>Employee Experience</h3>
            <div className='grid md:grid-cols-2 gap-6'>
              {experienceFields.slice(0, 2).map(({ name, placeholder }) => (
                <Input
                  key={name}
                  name={name}
                  placeholder={placeholder}
                  register={register}
                  value={formData[name]}
                  onChange={handleChange}
                />
              ))}
            </div>
            <div className='grid md:grid-cols-2 gap-6'>
              {experienceFields
                .slice(2, 4)
                .map(({ name, placeholder, type }) => (
                  <Input
                    key={name}
                    name={name}
                    placeholder={placeholder}
                    type={type || 'text'}
                    register={register}
                    value={formData[name]}
                    onChange={handleChange}
                  />
                ))}
            </div>
            <div className='grid md:grid-cols-2 gap-6'>
              {experienceFields.slice(4).map(({ name, placeholder }) => (
                <Input
                  key={name}
                  name={name}
                  placeholder={placeholder}
                  register={register}
                  value={formData[name]}
                  onChange={handleChange}
                />
              ))}
            </div>
          </section>

          {/* Account Setup */}
          <section className='space-y-6'>
            <h3 className='text-2xl font-semibold text-[#7091E6]'>
              Account Setup
            </h3>
            <div className='grid md:grid-cols-2 gap-6'>
              {accountFields.slice(0, 1).map(({ name, placeholder }) => (
                <Input
                  key={name}
                  name={name}
                  placeholder={placeholder}
                  register={register}
                  value={formData[name]}
                  onChange={handleChange}
                />
              ))}
            </div>
            <div className='grid md:grid-cols-2 gap-6'>
              {accountFields.slice(1).map(({ name, placeholder, type }) => (
                <Input
                  key={name}
                  name={name}
                  placeholder={placeholder}
                  type={type || 'text'}
                  register={register}
                  value={formData[name]}
                  onChange={handleChange}
                />
              ))}
            </div>
          </section>

          {/* Terms & Privacy */}
          <section className='space-y-3'>
            {policyFields.map(({ name, label, href }) => (
              <label className='flex items-center space-x-3'>
                <Checkbox
                  name={name}
                  checked={formData.name}
                  onChange={handleChange}
                />
                <span>
                  I agree to the{' '}
                  <a href={href} className='underline text-[#3D52A0]'>
                    {label}
                  </a>
                </span>
              </label>
            ))}
          </section>

          <Button type='submit'>Register</Button>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default Register
