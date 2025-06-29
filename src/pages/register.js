import Header from '@/components/Header'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SelectItem from '@/components/ui/SelectItem'
import api from '@/utils/api'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'

const Register = () => {
  const [file, setFile] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const { register, handleUploadSubmit, reset } = useForm()
  const router = useRouter()
  const [formData, setFormData] = useState({
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
    username: '',
    password: '',
    confirmPassword: '',
    shareCode: '',
    terms: false,
    gdpr: false,
  })

  const genders = ['Male', 'Female', 'Other']
  const countries = [
    'United Kingdom',
    'United States',
    'Canada',
    'Australia',
    'Germany',
  ]
  const departments = ['HR', 'IT', 'Sales', 'Marketing', 'Finance']

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleFileChange = (e) => setFile(e.target.files[0])

  const handleUpload = async () => {
    if (!file) return alert('Please select a PDF file first')
    const formData = new FormData()
    formData.append('pdf', file)

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData)
      console.log(res.data)

      setExtractedData(res.data)
      reset(res.data) // update form with extracted values
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading PDF')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.terms || !formData.gdpr) {
      alert('Please agree to Terms & Conditions and GDPR policy.')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.')
      return
    }
    console.log('Form Submitted:', formData)
    try {
      const { data } = await api.post('auth/register', formData)
      localStorage.setItem('token', data.token)
      toast.success('Login successful! Redirecting to Profile...')
      setTimeout(() => router.push('/profile'), 1500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div>
      <Header />
      <div className='pt-20 pb-10'>
        <form
          onSubmit={handleSubmit}
          className='max-w-3xl mx-auto p-8 bg-gradient-to-r text-black from-blue-50 to-blue-100 rounded-3xl shadow-2xl space-y-8'
        >
          <h2 className='text-3xl font-bold text-center text-blue-700'>
            Employee Registration
          </h2>

          {/* Personal Details */}
          <div className='space-y-4'>
            <h3 className='text-2xl font-semibold text-blue-600'>
              Personal Details
            </h3>
            <h2>PDF Upload & Extract</h2>

            {/* PDF Upload Section */}
            <input
              type='file'
              accept='application/pdf'
              onChange={handleFileChange}
            />
            <button onClick={handleUpload} style={{ marginLeft: '1rem' }}>
              Upload PDF
            </button>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                name='firstName'
                placeholder='First Name*'
                value={formData.firstName}
                onChange={handleChange}
                register={register}
                required
              />
              <Input
                name='lastName'
                placeholder='Last Name*'
                value={formData.lastName}
                onChange={handleChange}
                register={register}
                required
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                name='dob'
                type='date'
                placeholder='Date of Birth*'
                value={formData.dob}
                onChange={handleChange}
                required
              />

              <Select
                name='gender'
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value=''>Select Gender*</option>
                {genders.map((gen) => (
                  <SelectItem key={gen} value={gen}>
                    {gen}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Input
              name='shareCode'
              placeholder='Share Code*'
              value={formData.shareCode}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contact Information */}
          <div className='space-y-4'>
            <h3 className='text-2xl font-semibold text-blue-600'>
              Contact Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                name='email'
                type='email'
                placeholder='Email*'
                value={formData.email}
                onChange={handleChange}
                register={register}
                required
              />
              <Input
                name='phone'
                placeholder='Phone Number*'
                value={formData.phone}
                onChange={handleChange}
                register={register}
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className='space-y-4'>
            <h3 className='text-2xl font-semibold text-blue-600'>Address</h3>
            <Input
              name='street'
              placeholder='Street Address*'
              value={formData.street}
              onChange={handleChange}
              register={register}
              required
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                name='city'
                placeholder='City*'
                value={formData.city}
                onChange={handleChange}
                register={register}
                required
              />
              <Input
                name='postcode'
                placeholder='Postcode*'
                value={formData.postcode}
                onChange={handleChange}
                required
              />
            </div>
            <Select
              name='country'
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value=''>Select Country*</option>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Employment Details */}
          <div className='space-y-4'>
            <h3 className='text-2xl font-semibold text-blue-600'>
              Employee Experience
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                name='department'
                placeholder='Department*'
                value={formData.department}
                onChange={handleChange}
                register={register}
                required
              />
              <Input
                name='position'
                placeholder='Position*'
                value={formData.position}
                onChange={handleChange}
                register={register}
                required
              />
            </div>
            <Input
              name='startDate'
              type='date'
              placeholder='Start Date*'
              value={formData.startDate}
              onChange={handleChange}
              register={register}
              required
            />
            <Input
              name='endDate'
              type='date'
              placeholder='End Date*'
              value={formData.endDate}
              onChange={handleChange}
              register={register}
              required
            />
          </div>

          {/* Account Setup */}
          <div className='space-y-4'>
            <h3 className='text-2xl font-semibold text-blue-600'>
              Account Setup
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                name='username'
                placeholder='Username*'
                value={formData.username}
                onChange={handleChange}
                required
              />
              <Input
                name='password'
                type='password'
                placeholder='Password*'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Input
              name='confirmPassword'
              type='password'
              placeholder='Confirm Password*'
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Consent */}
          <div className='space-y-2'>
            <label className='flex items-center space-x-2'>
              <Checkbox
                name='terms'
                checked={formData.terms}
                onChange={handleChange}
              />
              <span>I agree to the Terms & Conditions*</span>
            </label>
            <label className='flex items-center space-x-2'>
              <Checkbox
                name='gdpr'
                checked={formData.gdpr}
                onChange={handleChange}
              />
              <span>I agree to the GDPR Policy*</span>
            </label>
          </div>

          {/* Submit */}
          <Button
            type='submit'
            className='w-full bg-blue-600 text-white hover:bg-blue-700'
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Register
