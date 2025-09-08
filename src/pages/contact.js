import React, { useState } from 'react'
import Header from '@/components/dashboard/Header'
import Footer from '@/components/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  User,
  MessageSquare,
  Send,
  Phone,
  MapPin,
  Clock,
} from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!formData.name.trim()) e.name = 'Please enter your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = 'Enter a valid email'
    if (formData.message.trim().length < 10)
      e.message = 'Message must be at least 10 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (ev) => {
    const { name, value } = ev.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      await new Promise((r) => setTimeout(r, 800))
      toast.success('Thanks for reaching out! 🎉')
      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const shell = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 170, damping: 18 },
    },
  }
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 20 },
    },
  }

  return (
    <div className='relative min-h-screen overflow-hidden text-[#3D52A0]'>
      <Toaster />
      <div className='absolute inset-0 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#E9EEFF,transparent_60%),radial-gradient(900px_500px_at_110%_10%,#FFF7F2,transparent_60%),radial-gradient(900px_700px_at_50%_120%,#F2FFFB,transparent_60%)]' />
      <div className='pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#7091E6]/30 blur-3xl animate-blob' />
      <div className='pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#3D52A0]/20 blur-3xl animate-blob animation-delay-2000' />
      <div className='pointer-events-none absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-[#B8C1EC]/20 blur-3xl animate-blob animation-delay-4000' />

      <Header />

      <main className='relative max-w-6xl mx-auto px-4 pt-24 pb-16'>
        <motion.div
          variants={shell}
          initial='hidden'
          animate='show'
          className='grid lg:grid-cols-[1.1fr,0.9fr] gap-6'
        >
          <div className='glass-card p-6 md:p-8'>
            <div className='text-center mb-6'>
              <h1 className='text-3xl md:text-4xl font-extrabold text-[#1B2559]'>
                Get in touch
              </h1>
              <p className='mt-2 text-[#3D52A0]/80'>
                We’d love to hear from you. Tell us a little about your inquiry.
              </p>
            </div>

            <AnimatePresence mode='wait'>
              {!submitted ? (
                <motion.form
                  key='form'
                  variants={item}
                  initial='hidden'
                  animate='show'
                  exit={{ opacity: 0, y: 10 }}
                  onSubmit={handleSubmit}
                  className='space-y-5'
                >
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-semibold mb-1 text-[#1B2559]'
                    >
                      Name
                    </label>
                    <div className='relative'>
                      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-[#3D52A0]/70'>
                        <User className='h-4 w-4' />
                      </span>
                      <input
                        id='name'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full rounded-xl px-9 py-3 bg-white/80 ring-1 ring-black/5 border ${
                          errors.name ? 'border-red-300' : 'border-white/40'
                        } outline-none focus:ring-2 focus:ring-[#7091E6]`}
                        placeholder='Your full name'
                      />
                    </div>
                    {errors.name && (
                      <p className='mt-1 text-xs text-red-500'>{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor='email'
                      className='block text-sm font-semibold mb-1 text-[#1B2559]'
                    >
                      Email
                    </label>
                    <div className='relative'>
                      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-[#3D52A0]/70'>
                        <Mail className='h-4 w-4' />
                      </span>
                      <input
                        id='email'
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full rounded-xl px-9 py-3 bg-white/80 ring-1 ring-black/5 border ${
                          errors.email ? 'border-red-300' : 'border-white/40'
                        } outline-none focus:ring-2 focus:ring-[#7091E6]`}
                        placeholder='you@example.com'
                      />
                    </div>
                    {errors.email && (
                      <p className='mt-1 text-xs text-red-500'>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor='message'
                      className='block text-sm font-semibold mb-1 text-[#1B2559]'
                    >
                      Message
                    </label>
                    <div className='relative'>
                      <span className='absolute left-3 top-3 text-[#3D52A0]/70'>
                        <MessageSquare className='h-4 w-4' />
                      </span>
                      <textarea
                        id='message'
                        name='message'
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full rounded-xl px-9 py-3 bg-white/80 ring-1 ring-black/5 border ${
                          errors.message ? 'border-red-300' : 'border-white/40'
                        } outline-none focus:ring-2 focus:ring-[#7091E6]`}
                        placeholder='How can we help?'
                      />
                    </div>
                    <div className='mt-1 flex items-center justify-between text-xs'>
                      {errors.message ? (
                        <p className='text-red-500'>{errors.message}</p>
                      ) : (
                        <span className='text-[#3D52A0]/70'>
                          Min 10 characters
                        </span>
                      )}
                      <span className='text-[#3D52A0]/60'>
                        {formData.message.length}/1000
                      </span>
                    </div>
                  </div>

                  <button
                    type='submit'
                    disabled={loading}
                    className='w-full inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold text-white shadow hover:shadow-md active:scale-[.99] transition bg-gradient-to-r from-[#3D52A0] via-[#5F79D4] to-[#7091E6] disabled:opacity-70'
                  >
                    {loading ? 'Sending…' : 'Send Message'}{' '}
                    <Send className='h-4 w-4' />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key='success'
                  variants={item}
                  initial='hidden'
                  animate='show'
                  exit={{ opacity: 0, y: 10 }}
                  className='text-center py-10'
                >
                  <div className='mx-auto h-16 w-16 rounded-2xl bg-[#F2FFFB] grid place-items-center ring-1 ring-black/5 border border-white/40'>
                    <Send className='h-7 w-7 text-[#3D52A0]' />
                  </div>
                  <h3 className='mt-4 text-2xl font-extrabold text-[#1B2559]'>
                    Message sent
                  </h3>
                  <p className='mt-1 text-[#3D52A0]/80'>
                    We’ll get back to you within 1–2 business days.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className='mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur px-6 py-3 text-[#3D52A0] font-semibold ring-1 ring-black/5 border border-white/40 hover:bg-white'
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.aside
            variants={item}
            initial='hidden'
            animate='show'
            className='glass-card p-6 md:p-8'
          >
            <h4 className='text-xl font-extrabold text-[#1B2559]'>
              Contact details
            </h4>
            <p className='mt-2 text-sm text-[#3D52A0]/80'>
              We’re available Monday–Friday, 9:00–18:00 (UK time).
            </p>
            <div className='mt-5 space-y-3 text-sm'>
              <div className='flex items-start gap-3 rounded-2xl bg-[#E9EEFF] p-4'>
                <Phone className='h-4 w-4 mt-0.5' />
                <div>
                  <div className='font-semibold text-[#1B2559]'>Call us</div>
                  <a href='tel:+442012345678' className='text-[#3D52A0]'>
                    +44 20 1234 5678
                  </a>
                </div>
              </div>
              <div className='flex items-start gap-3 rounded-2xl bg-[#FFF7F2] p-4'>
                <Mail className='h-4 w-4 mt-0.5' />
                <div>
                  <div className='font-semibold text-[#1B2559]'>Email</div>
                  <a
                    href='mailto:hello@beaconnest.com'
                    className='text-[#3D52A0]'
                  >
                    hello@beaconnest.com
                  </a>
                </div>
              </div>
              <div className='flex items-start gap-3 rounded-2xl bg-[#F2FFFB] p-4'>
                <MapPin className='h-4 w-4 mt-0.5' />
                <div>
                  <div className='font-semibold text-[#1B2559]'>Office</div>
                  <p className='text-[#3D52A0]'>London, United Kingdom</p>
                </div>
              </div>
              <div className='flex items-start gap-3 rounded-2xl bg-white/70 p-4 ring-1 ring-black/5 border border-white/40'>
                <Clock className='h-4 w-4 mt-0.5' />
                <div>
                  <div className='font-semibold text-[#1B2559]'>Hours</div>
                  <p className='text-[#3D52A0]'>Mon–Fri · 9:00–18:00</p>
                </div>
              </div>
            </div>

            <div className='mt-6'>
              <iframe
                title='map'
                className='w-full h-56 rounded-2xl border border-white/40 ring-1 ring-black/5'
                src='https://maps.google.com/maps?q=London&t=&z=12&ie=UTF8&iwloc=&output=embed'
                loading='lazy'
              />
            </div>
          </motion.aside>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
