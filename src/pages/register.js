import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SelectItem from '@/components/ui/SelectItem'
import { useState } from 'react'

export default function EmployeeRegistrationForm() {
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

  const handleSubmit = (e) => {
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
    // Here, you can send formData to your Node.js API using fetch or axios
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6'
    >
      <h2 className='text-2xl font-bold text-center'>Employee Registration</h2>

      {/* Personal Details */}
      <div>
        <h3 className='text-xl font-semibold'>Personal Details</h3>
        <Input
          name='firstName'
          placeholder='First Name*'
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <Input
          name='lastName'
          placeholder='Last Name*'
          value={formData.lastName}
          onChange={handleChange}
          className='mt-2'
          required
        />
        <Input
          name='dob'
          type='date'
          placeholder='Date of Birth*'
          value={formData.dob}
          onChange={handleChange}
          className='mt-2'
          required
        />
        <Select
          name='gender'
          value={formData.gender}
          onChange={handleChange}
          className='mt-2'
        >
          <option value=''>Select Gender*</option>
          {genders.map((gen) => (
            <SelectItem key={gen} value={gen}>
              {gen}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className='text-xl font-semibold'>Contact Information</h3>
        <Input
          name='email'
          type='email'
          placeholder='Email*'
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          name='phone'
          placeholder='Phone Number*'
          value={formData.phone}
          onChange={handleChange}
          className='mt-2'
          required
        />
      </div>

      {/* Address */}
      <div>
        <h3 className='text-xl font-semibold'>Address</h3>
        <Input
          name='street'
          placeholder='Street Address*'
          value={formData.street}
          onChange={handleChange}
          required
        />
        <Input
          name='city'
          placeholder='City*'
          value={formData.city}
          onChange={handleChange}
          className='mt-2'
          required
        />
        <Input
          name='postcode'
          placeholder='Postcode*'
          value={formData.postcode}
          onChange={handleChange}
          className='mt-2'
          required
        />
        <Select
          name='country'
          value={formData.country}
          onChange={handleChange}
          className='mt-2'
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
      <div>
        <h3 className='text-xl font-semibold'>Employment Details</h3>
        <Select
          name='department'
          value={formData.department}
          onChange={handleChange}
          className='mt-2'
        >
          <option value=''>Select Department*</option>
          {departments.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </Select>
        <Input
          name='position'
          placeholder='Position*'
          value={formData.position}
          onChange={handleChange}
          className='mt-2'
          required
        />
        <Input
          name='startDate'
          type='date'
          placeholder='Start Date*'
          value={formData.startDate}
          onChange={handleChange}
          className='mt-2'
          required
        />
      </div>

      {/* Account Setup */}
      <div>
        <h3 className='text-xl font-semibold'>Account Setup</h3>
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
          className='mt-2'
          required
        />
        <Input
          name='confirmPassword'
          type='password'
          placeholder='Confirm Password*'
          value={formData.confirmPassword}
          onChange={handleChange}
          className='mt-2'
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
      <Button type='submit' className='w-full'>
        Register
      </Button>
    </form>
  )
}
