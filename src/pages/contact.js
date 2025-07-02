import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React, { useState } from 'react'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate API call
    console.log('Submitted data:', formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div>
      <Header />
      <div className='py-20'>
        <div className='max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            Contact Us
          </h2>
          {submitted && (
            <p className='mb-4 text-green-600'>Thanks for reaching out! 🎉</p>
          )}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'
              >
                Name
              </label>
              <input
                type='text'
                id='name'
                name='name'
                required
                value={formData.name}
                onChange={handleChange}
                className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                required
                value={formData.email}
                onChange={handleChange}
                className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div>
              <label
                htmlFor='message'
                className='block text-sm font-medium text-gray-700'
              >
                Message
              </label>
              <textarea
                id='message'
                name='message'
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
              ></textarea>
            </div>

            <button
              type='submit'
              className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition'
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ContactForm
