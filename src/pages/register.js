import Header from '@/components/dashboard/Header'
import Footer from '@/components/Footer'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import DatePickerInput from '@/components/ui/DatePickerInput'
import api from '@/utils/api'
import authApi from '@/utils/authApi'
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Hash,
  Lock,
  Building2,
  Briefcase,
  Globe,
  Home,
  Landmark,
  ChevronRight,
} from 'lucide-react'
import { useMemo, useState } from 'react'

const DUMMY = {
  firstName: 'Alex',
  lastName: 'Johnson',
  dob: '1994-03-15',
  gender: 'Male',
  shareCode: 'SC-ABC1234',

  email: 'alex.johnson@example.com',
  phone: '+44 7700 900123',

  street: '221B Baker Street',
  city: 'London',
  postcode: 'NW1 6XE',
  country: 'United Kingdom',

  experience: [
    {
      position: 'Frontend Developer',
      company: 'Acme Ltd',
      startDate: '2021-05-01',
      endDate: '2023-10-01',
      city: 'London',
      country: 'United Kingdom',
    },
  ],
  skills: ['React', 'Next.js', 'TypeScript'],
  startDate: '2025-10-01',

  username: 'alex_johnson',
  password: 'P@ssw0rd123!',
  confirmPassword: 'P@ssw0rd123!',
  role: 'user',

  terms: true,
  gdpr: true,
}

export default function Register() {
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [shake, setShake] = useState(false)
  const [step, setStep] = useState(0)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: DUMMY,
  })

  const formData = watch()
  const pw = watch('password')

  const steps = useMemo(
    () => [
      { key: 'profile', title: 'Profile' },
      { key: 'contact', title: 'Contact & Address' },
      { key: 'experience', title: 'Experience & Skills' },
      { key: 'account', title: 'Account & Policies' },
    ],
    []
  )
  const genders = ['Male', 'Female', 'Other']
  const countries = [
    'United Kingdom',
    'United States',
    'Canada',
    'Australia',
    'Germany',
  ]
  const progress = ((step + 1) / steps.length) * 100

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0]
    setFile(selectedFile)
    if (!selectedFile) {
      toast.error('Please select a PDF file first')
      return
    }
    const fd = new FormData()
    fd.append('pdf', selectedFile)
    try {
      const res = await api.post('/upload', fd)
      toast.success('PDF uploaded, form data extracted!')
      const data = res.data || {}
      if (Array.isArray(data.experience) && data.experience.length) {
        setValue('experience', [
          {
            position: data.experience[0].position || '',
            company: data.experience[0].company || '',
            startDate: data.experience[0].startDate || '',
            endDate: data.experience[0].endDate || '',
            city: data.experience[0].city || '',
            country: data.experience[0].country || '',
          },
        ])
      }
      reset({ ...watch(), ...data })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error uploading PDF')
    }
  }

  const addExperience = () => {
    setValue('experience', [
      ...formData.experience,
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
    const updated = [...formData.experience]
    updated.splice(index, 1)
    setValue('experience', updated)
  }

  const addSkill = () => setValue('skills', [...formData.skills, ''])
  const removeSkill = (index) => {
    if (formData.skills.length <= 1) return
    const updated = [...formData.skills]
    updated.splice(index, 1)
    setValue('skills', updated)
  }

  const onSubmit = async (data) => {
    try {
      const { data: resData } = await authApi.post('/auth/register', data)
      localStorage.setItem('token', resData.token)
      toast.success('Registration successful! Redirecting...')
      setTimeout(() => router.push('/applicant/profile'), 900)
    } catch (err) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
      toast.error(err?.response?.data?.message || 'Registration failed')
    }
  }

  const stepFields = [
    ['firstName', 'lastName', 'dob', 'gender', 'shareCode'],
    ['email', 'phone', 'street', 'city', 'postcode', 'country'],
    [],
    ['username', 'password', 'confirmPassword', 'terms', 'gdpr', 'startDate'],
  ]

  const nextStep = async () => {
    const fields = stepFields[step]
    if (fields.length) {
      const ok = await trigger(fields)
      if (!ok) {
        setShake(true)
        setTimeout(() => setShake(false), 400)
        return
      }
    }
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }
  const prevStep = () => setStep((s) => Math.max(s - 1, 0))

  const shellIn = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 140, damping: 16 },
    },
  }
  const slide = {
    hidden: { opacity: 0, x: 20 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 180, damping: 20 },
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
  }

  return (
    <div className='min-h-screen relative overflow-hidden text-[#3D52A0]'>
      <div className='absolute inset-0 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#E9EEFF,transparent_60%),radial-gradient(900px_500px_at_110%_10%,#FFF7F2,transparent_60%),radial-gradient(900px_700px_at_50%_120%,#F2FFFB,transparent_60%)]' />
      <div className='pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#7091E6]/30 blur-3xl animate-blob' />
      <div className='pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#3D52A0]/20 blur-3xl animate-blob animation-delay-2000' />
      <div className='pointer-events-none absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-[#B8C1EC]/20 blur-3xl animate-blob animation-delay-4000' />

      <Header />
      <Toaster position='top-right' />

      <main className='relative pt-20 pb-16 px-4'>
        <motion.div
          variants={shellIn}
          initial='hidden'
          animate='show'
          className={`max-w-6xl mx-auto rounded-3xl shadow-xl ring-1 ring-black/5 overflow-hidden backdrop-blur-xl border border-white/40 bg-white/70 ${
            shake ? 'animate-shake' : ''
          }`}
        >
          <div className='h-1 w-full bg-slate-200/60'>
            <div
              className='h-full bg-gradient-to-r from-[#3D52A0] to-[#7091E6]'
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className='grid lg:grid-cols-[280px,1fr]'>
            <aside className='hidden lg:flex flex-col gap-3 p-8 border-r border-white/50 bg-white/60'>
              {steps.map((s, i) => {
                const done = i < step
                const active = i === step
                return (
                  <div
                    key={s.key}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                      active
                        ? 'bg-[#E9EEFF]'
                        : done
                        ? 'bg-[#F3F4FA]'
                        : 'bg-transparent'
                    }`}
                  >
                    <div
                      className={`h-8 w-8 grid place-items-center rounded-xl text-sm font-semibold ${
                        active
                          ? 'bg-[#3D52A0] text-white'
                          : done
                          ? 'bg-[#7091E6] text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        active ? 'text-[#1B2559]' : 'text-[#3D52A0]/80'
                      }`}
                    >
                      {s.title}
                    </div>
                  </div>
                )
              })}
            </aside>

            <section className='p-6 md:p-10'>
              <div className='flex items-center justify-between mb-6'>
                <div />
                <Button
                  type='button'
                  variant='soft'
                  onClick={() => reset(DUMMY)}
                  className='border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                >
                  Reset Dummy Data
                </Button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
                <AnimatePresence mode='wait'>
                  {step === 0 && (
                    <motion.div
                      key='step-0'
                      variants={slide}
                      initial='hidden'
                      animate='show'
                      exit='exit'
                      className='space-y-8'
                    >
                      <div className='space-y-4'>
                        <div className='text-2xl font-extrabold'>Profile</div>
                        <div className='text-sm text-[#3D52A0]/70'>
                          Upload your CV and fill in your basic details.
                        </div>
                        <label
                          htmlFor='cv-upload'
                          className='relative w-full cursor-pointer bg-[#F3F4FA] border border-[#ADBBDA] rounded-2xl p-6 flex items-center justify-between gap-4 hover:shadow-md transition-all'
                        >
                          <div className='flex items-center gap-4'>
                            <div className='bg-[#7091E6] p-3 rounded-xl'>
                              <FileText className='text-white w-7 h-7' />
                            </div>
                            <div>
                              <div className='text-sm font-medium text-[#3D52A0] truncate max-w-md'>
                                {file ? file.name : 'Click to upload a PDF'}
                              </div>
                              <div className='text-xs text-gray-500'>
                                PDF only, max 5MB
                              </div>
                            </div>
                          </div>
                          <ChevronRight className='h-5 w-5 text-[#3D52A0]/60' />
                          <input
                            id='cv-upload'
                            type='file'
                            accept='application/pdf'
                            onChange={handleFileChange}
                            className='hidden'
                          />
                        </label>
                      </div>

                      <div className='grid md:grid-cols-2 gap-6'>
                        <Input
                          label='First Name*'
                          leftIcon={<User className='h-4 w-4' />}
                          {...register('firstName', {
                            required: 'First name is required',
                          })}
                          error={errors.firstName}
                        />
                        <Input
                          label='Last Name*'
                          leftIcon={<User className='h-4 w-4' />}
                          {...register('lastName', {
                            required: 'Last name is required',
                          })}
                          error={errors.lastName}
                        />

                        <DatePickerInput
                          label='Date of Birth*'
                          name='dob'
                          value={formData.dob}
                          onChange={(iso) =>
                            setValue('dob', iso, { shouldValidate: true })
                          }
                          maxDate={new Date()}
                        />

                        <Select
                          label='Gender*'
                          {...register('gender', {
                            required: 'Gender is required',
                          })}
                          error={errors.gender}
                        >
                          <option value=''>Select Gender</option>
                          {genders.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </Select>

                        <Input
                          label='Share Code*'
                          leftIcon={<Hash className='h-4 w-4' />}
                          {...register('shareCode', {
                            required: 'Share code is required',
                          })}
                          error={errors.shareCode}
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div
                      key='step-1'
                      variants={slide}
                      initial='hidden'
                      animate='show'
                      exit='exit'
                      className='space-y-8'
                    >
                      <div className='space-y-2'>
                        <div className='text-2xl font-extrabold'>
                          Contact & Address
                        </div>
                        <div className='text-sm text-[#3D52A0]/70'>
                          How we can reach you.
                        </div>
                      </div>
                      <div className='grid md:grid-cols-2 gap-6'>
                        <Input
                          label='Email*'
                          type='email'
                          leftIcon={<Mail className='h-4 w-4' />}
                          {...register('email', {
                            required: 'Email is required',
                          })}
                          error={errors.email}
                        />
                        <Input
                          label='Phone*'
                          leftIcon={<Phone className='h-4 w-4' />}
                          {...register('phone', {
                            required: 'Phone is required',
                          })}
                          error={errors.phone}
                        />
                        <Input
                          label='Street Address*'
                          leftIcon={<Home className='h-4 w-4' />}
                          {...register('street', {
                            required: 'Street is required',
                          })}
                          error={errors.street}
                        />
                        <Input
                          label='City*'
                          leftIcon={<MapPin className='h-4 w-4' />}
                          {...register('city', {
                            required: 'City is required',
                          })}
                          error={errors.city}
                        />
                        <Input
                          label='Postcode*'
                          leftIcon={<Landmark className='h-4 w-4' />}
                          {...register('postcode', {
                            required: 'Postcode is required',
                          })}
                          error={errors.postcode}
                        />
                        <Select
                          label='Country*'
                          {...register('country', {
                            required: 'Country is required',
                          })}
                          error={errors.country}
                        >
                          <option value=''>Select Country</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key='step-2'
                      variants={slide}
                      initial='hidden'
                      animate='show'
                      exit='exit'
                      className='space-y-10'
                    >
                      <div className='space-y-2'>
                        <div className='text-2xl font-extrabold'>
                          Experience & Skills
                        </div>
                        <div className='text-sm text-[#3D52A0]/70'>
                          Tell us what you’ve done and what you know.
                        </div>
                      </div>

                      <div className='space-y-6'>
                        {formData.experience.map((exp, index) => (
                          <div
                            key={index}
                            className='grid md:grid-cols-2 gap-6 p-4 rounded-2xl bg-[#F7F8FF] border border-[#E0E6FF]'
                          >
                            <Input
                              label='Position*'
                              leftIcon={<Briefcase className='h-4 w-4' />}
                              {...register(`experience.${index}.position`, {
                                required: 'Position is required',
                              })}
                              error={errors?.experience?.[index]?.position}
                            />
                            <Input
                              label='Company'
                              leftIcon={<Building2 className='h-4 w-4' />}
                              {...register(`experience.${index}.company`)}
                            />

                            <DatePickerInput
                              label='Start Date'
                              name={`experience.${index}.startDate`}
                              value={exp.startDate}
                              onChange={(iso) => {
                                const u = [...formData.experience]
                                u[index].startDate = iso
                                setValue('experience', u, {
                                  shouldValidate: true,
                                })
                              }}
                            />
                            <DatePickerInput
                              label='End Date'
                              name={`experience.${index}.endDate`}
                              value={exp.endDate}
                              onChange={(iso) => {
                                const u = [...formData.experience]
                                u[index].endDate = iso
                                setValue('experience', u, {
                                  shouldValidate: true,
                                })
                              }}
                            />
                            <Input
                              label='City'
                              leftIcon={<MapPin className='h-4 w-4' />}
                              {...register(`experience.${index}.city`)}
                            />
                            <Input
                              label='Country'
                              leftIcon={<Globe className='h-4 w-4' />}
                              {...register(`experience.${index}.country`)}
                            />
                            {formData.experience.length > 1 && (
                              <div className='md:col-span-2 text-right'>
                                <button
                                  type='button'
                                  onClick={() => removeExperience(index)}
                                  className='text-red-500 hover:underline'
                                >
                                  ✕ Remove Experience
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        <Button
                          type='button'
                          variant='soft'
                          onClick={addExperience}
                        >
                          + Add Experience
                        </Button>
                      </div>

                      <div className='space-y-4'>
                        <div className='text-xl font-semibold'>Skills</div>
                        {formData.skills.map((skill, index) => (
                          <div key={index} className='flex items-center gap-2'>
                            <Input
                              label='eg. React, HTML, JavaScript'
                              {...register(`skills.${index}`, {
                                required: 'Skill is required',
                              })}
                              error={errors?.skills?.[index]}
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
                        <Button type='button' variant='soft' onClick={addSkill}>
                          + Add Skill
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key='step-3'
                      variants={slide}
                      initial='hidden'
                      animate='show'
                      exit='exit'
                      className='space-y-8'
                    >
                      <div className='space-y-2'>
                        <div className='text-2xl font-extrabold'>
                          Account & Policies
                        </div>
                        <div className='text-sm text-[#3D52A0]/70'>
                          Secure your account and accept the policies.
                        </div>
                      </div>
                      <div className='grid md:grid-cols-2 gap-6'>
                        <Input
                          label='Username*'
                          leftIcon={<User className='h-4 w-4' />}
                          autoComplete='username'
                          {...register('username', {
                            required: 'Username is required',
                          })}
                          error={errors.username}
                        />
                        <Input
                          label='Password*'
                          type='password'
                          leftIcon={<Lock className='h-4 w-4' />}
                          autoComplete='new-password'
                          {...register('password', {
                            required: 'Password is required',
                          })}
                          error={errors.password}
                        />
                        <Input
                          label='Confirm Password*'
                          type='password'
                          leftIcon={<Lock className='h-4 w-4' />}
                          autoComplete='new-password'
                          {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: (v) =>
                              v === pw || 'Passwords do not match',
                          })}
                          error={errors.confirmPassword}
                        />
                        <DatePickerInput
                          label='Available Start Date*'
                          name='startDate'
                          value={formData.startDate}
                          onChange={(iso) =>
                            setValue('startDate', iso, { shouldValidate: true })
                          }
                        />
                      </div>

                      <div className='space-y-3'>
                        <Checkbox
                          label={
                            <>
                              I agree to{' '}
                              <a
                                href='/terms'
                                className='text-blue-600 underline'
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                Terms &amp; Conditions*
                              </a>
                            </>
                          }
                          {...register('terms', {
                            required:
                              'You must agree to the Terms & Conditions',
                          })}
                          error={errors.terms}
                        />
                        <Checkbox
                          label={
                            <>
                              I agree to{' '}
                              <a
                                href='/gdpr'
                                className='text-blue-600 underline'
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                GDPR*
                              </a>
                            </>
                          }
                          {...register('gdpr', {
                            required: 'You must agree to GDPR',
                          })}
                          error={errors.gdpr}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className='flex items-center justify-between pt-2'>
                  <Button
                    type='button'
                    variant='soft'
                    size='md'
                    onClick={prevStep}
                    disabled={step === 0}
                  >
                    Back
                  </Button>
                  {step < steps.length - 1 ? (
                    <Button
                      type='button'
                      size='md'
                      onClick={nextStep}
                      rightIcon={<ChevronRight className='h-4 w-4' />}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button type='submit' size='md' loading={isSubmitting}>
                      Create Account
                    </Button>
                  )}
                </div>
              </form>
            </section>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
