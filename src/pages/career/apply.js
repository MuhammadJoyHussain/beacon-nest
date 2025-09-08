import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import api from '@/utils/api'
import Header from '@/components/dashboard/Header'
import Footer from '@/components/Footer'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import Checkbox from '@/components/ui/Checkbox'
import DatePickerInput from '@/components/ui/DatePickerInput'
import { toast, Toaster } from 'react-hot-toast'
import authApi from '@/utils/authApi'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Upload,
  LinkIcon,
  DollarSign,
  Briefcase,
  ArrowRight,
  Building2,
  MapPin,
  Banknote,
  X,
} from 'lucide-react'

export default function ApplyJob() {
  const router = useRouter()
  const { id } = router.query

  const [user, setUser] = useState(null)
  const [job, setJob] = useState(null)

  const [coverLetter, setCoverLetter] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [expectedSalary, setExpectedSalary] = useState('')
  const [currency, setCurrency] = useState('GBP')
  const [startDate, setStartDate] = useState('')
  const [linkedIn, setLinkedIn] = useState('')
  const [links, setLinks] = useState([''])
  const [experienceYears, setExperienceYears] = useState('')
  const [authorized, setAuthorized] = useState(false)

  const [cvFile, setCvFile] = useState(null)
  const [dragging, setDragging] = useState(false)

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [shake, setShake] = useState(false)
  const [review, setReview] = useState(false)

  const COVER_LIMIT = 1000
  const WHY_LIMIT = 400

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push(`/login?redirect=/career/apply?id=${id}`)
        return
      }
      try {
        const [{ data: profile }] = await Promise.all([
          authApi.get('/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        setUser(profile)
      } catch {
        toast.error('Unauthorized. Please login again.')
        localStorage.removeItem('token')
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    if (id) init()
  }, [id])

  useEffect(() => {
    if (!id) return
    api
      .get(`/vacancy/${id}`)
      .then(({ data }) => setJob(data))
      .catch(() => {})
  }, [id])

  useEffect(() => {
    if (!id) return
    const saved = localStorage.getItem(`applyDraft:${id}`)
    if (saved) {
      const d = JSON.parse(saved)
      setCoverLetter(d.coverLetter || '')
      setAdditionalInfo(d.additionalInfo || '')
      setExpectedSalary(d.expectedSalary || '')
      setCurrency(d.currency || 'GBP')
      setStartDate(d.startDate || '')
      setLinkedIn(d.linkedIn || '')
      setExperienceYears(d.experienceYears || '')
      setAuthorized(!!d.authorized)
      setLinks(Array.isArray(d.links) && d.links.length ? d.links : [''])
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    const d = {
      coverLetter,
      additionalInfo,
      expectedSalary,
      currency,
      startDate,
      linkedIn,
      links,
      experienceYears,
      authorized,
    }
    localStorage.setItem(`applyDraft:${id}`, JSON.stringify(d))
  }, [
    id,
    coverLetter,
    additionalInfo,
    expectedSalary,
    currency,
    startDate,
    linkedIn,
    links,
    experienceYears,
    authorized,
  ])

  const changeLink = (i, val) =>
    setLinks(links.map((v, idx) => (idx === i ? val : v)))
  const addLink = () => setLinks([...links, ''])
  const removeLink = (i) => setLinks(links.filter((_, idx) => idx !== i))

  const submitApplication = async () => {
    if (!cvFile) {
      setShake(true)
      setTimeout(() => setShake(false), 350)
      toast.error('Please upload your CV')
      return
    }
    const token = localStorage.getItem('token')

    const formData = new FormData()
    formData.append('cv', cvFile)
    formData.append('jobId', id)
    formData.append('coverLetter', coverLetter)
    formData.append('additionalInfo', additionalInfo)
    formData.append('expectedSalary', expectedSalary)
    formData.append('currency', currency)
    formData.append('startDate', startDate)
    formData.append('linkedIn', linkedIn || links[0] || '')
    formData.append('links', JSON.stringify(links.filter(Boolean)))
    formData.append('experienceYears', experienceYears)
    formData.append('authorized', authorized)
    try {
      setSubmitting(true)
      await api.post('/application', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Application submitted successfully!')
      localStorage.removeItem(`applyDraft:${id}`)
      router.push('/applicant/myjobs')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Submission failed')
    } finally {
      setSubmitting(false)
      setReview(false)
    }
  }

  if (!user) return null

  const shellIn = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 160, damping: 18 },
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

      <main className='relative max-w-4xl mx-auto px-4 pt-24 pb-14'>
        {job && (
          <motion.div
            variants={shellIn}
            initial='hidden'
            animate='show'
            className='glass-panel p-5 mb-6'
          >
            <div className='text-sm text-[#3D52A0]/70'>Applying to</div>
            <div className='mt-1 text-xl font-bold text-[#1B2559]'>
              {job.title}
            </div>
            <div className='mt-2 flex flex-wrap items-center gap-4 text-sm text-[#3D52A0]/80'>
              <span className='inline-flex items-center gap-1'>
                <Building2 className='h-4 w-4' />
                {job.company}
              </span>
              <span className='inline-flex items-center gap-1'>
                <MapPin className='h-4 w-4' />
                {job.location}
              </span>
              {job.salary ? (
                <span className='inline-flex items-center gap-1'>
                  <Banknote className='h-4 w-4' />
                  {job.salary}
                </span>
              ) : null}
            </div>
          </motion.div>
        )}

        <motion.div
          variants={shellIn}
          initial='hidden'
          animate='show'
          className={`glass-card p-6 md:p-8 ${shake ? 'animate-shake' : ''}`}
        >
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
            <h1 className='text-3xl font-extrabold text-[#1B2559]'>
              Apply for Job
            </h1>
            <div className='rounded-xl bg-white/70 backdrop-blur px-4 py-2 ring-1 ring-black/5 border border-white/40 text-sm'>
              Signed in as{' '}
              <span className='font-semibold'>
                {user?.firstName} {user?.lastName}
              </span>
            </div>
          </div>

          <div className='mt-8 space-y-8'>
            <motion.section
              variants={item}
              initial='hidden'
              animate='show'
              className='space-y-2'
            >
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragging(false)
                  const f = e.dataTransfer.files?.[0]
                  if (f) setCvFile(f)
                }}
                className={`cursor-pointer rounded-2xl border p-6 bg-[#F3F4FA] transition ${
                  dragging ? 'border-[#3D52A0] bg-white' : 'border-[#ADBBDA]'
                }`}
                onClick={() => document.getElementById('cv-upload')?.click()}
              >
                <div className='flex items-center gap-4'>
                  <div className='bg-[#7091E6] p-3 rounded-xl text-white'>
                    <FileText className='h-6 w-6' />
                  </div>
                  <div>
                    <div className='text-sm font-medium text-[#1B2559]'>
                      {cvFile
                        ? cvFile.name
                        : 'Drop your CV here or click to upload'}
                    </div>
                    <div className='text-xs text-[#3D52A0]/70'>
                      .pdf .doc .docx • Max 5MB
                    </div>
                  </div>
                </div>
                <input
                  id='cv-upload'
                  type='file'
                  accept='.pdf,.doc,.docx'
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  className='hidden'
                />
              </div>
            </motion.section>

            <motion.section
              variants={item}
              initial='hidden'
              animate='show'
              className='grid md:grid-cols-2 gap-6'
            >
              <div className='grid grid-cols-[120px,1fr] gap-3'>
                <select
                  className='rounded-xl border border-[#E0E6FF] bg-white/70 px-3 py-3'
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option>GBP</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
                <Input
                  label='Expected Salary'
                  type='number'
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  leftIcon={<DollarSign className='h-4 w-4' />}
                />
              </div>
              <DatePickerInput
                label='Available Start Date'
                name='startDate'
                value={startDate}
                onChange={(iso) => setStartDate(iso)}
                minDate={new Date()}
              />
              <Input
                label='LinkedIn'
                type='url'
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
                leftIcon={<LinkIcon className='h-4 w-4' />}
                className='md:col-span-2'
              />
              <Input
                label='Years of Experience'
                type='number'
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                leftIcon={<Briefcase className='h-4 w-4' />}
              />
            </motion.section>

            <motion.section
              variants={item}
              initial='hidden'
              animate='show'
              className='space-y-3'
            >
              <div className='text-sm font-semibold'>Portfolio Links</div>
              {links.map((l, i) => (
                <div key={i} className='flex gap-2'>
                  <Input
                    className='flex-1'
                    placeholder='https://…'
                    value={l}
                    onChange={(e) => changeLink(i, e.target.value)}
                    leftIcon={<LinkIcon className='h-4 w-4' />}
                  />
                  {links.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeLink(i)}
                      className='h-11 px-3 rounded-xl border border-[#E0E6FF]'
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <Button type='button' variant='soft' size='md' onClick={addLink}>
                + Add Link
              </Button>
            </motion.section>

            <motion.section
              variants={item}
              initial='hidden'
              animate='show'
              className='space-y-2'
            >
              <Textarea
                label='Cover Letter'
                name='coverLetter'
                value={coverLetter}
                onChange={(e) =>
                  setCoverLetter(e.target.value.slice(0, COVER_LIMIT))
                }
                rows={6}
              />
              <div className='text-xs text-[#3D52A0]/70 text-right'>
                {coverLetter.length}/{COVER_LIMIT}
              </div>
            </motion.section>

            <motion.section
              variants={item}
              initial='hidden'
              animate='show'
              className='space-y-2'
            >
              <Textarea
                label='Why do you want this job?'
                name='additionalInfo'
                value={additionalInfo}
                onChange={(e) =>
                  setAdditionalInfo(e.target.value.slice(0, WHY_LIMIT))
                }
                rows={4}
              />
              <div className='text-xs text-[#3D52A0]/70 text-right'>
                {additionalInfo.length}/{WHY_LIMIT}
              </div>
            </motion.section>

            <motion.section
              variants={item}
              initial='hidden'
              animate='show'
              className='space-y-2'
            >
              <Checkbox
                name='authorized'
                label='I am authorized to work in this country'
                checked={authorized}
                onChange={() => setAuthorized(!authorized)}
              />
            </motion.section>

            <motion.div variants={item} initial='hidden' animate='show'>
              <Button
                type='button'
                className='w-full'
                onClick={() => setReview(true)}
                rightIcon={<ArrowRight className='h-4 w-4' />}
              >
                Review & Submit
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <AnimatePresence>
        {review && (
          <motion.div
            className='fixed inset-0 z-50 grid place-items-center bg-black/40 p-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='glass-card w-full max-w-2xl p-6'
              initial={{ y: 16, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 16, scale: 0.98, opacity: 0 }}
            >
              <div className='flex items-center justify-between'>
                <div className='text-xl font-bold text-[#1B2559]'>
                  Review Application
                </div>
                <button
                  onClick={() => setReview(false)}
                  className='h-9 w-9 grid place-items-center rounded-xl hover:bg-slate-100'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>
              <div className='mt-4 space-y-3 text-sm'>
                <div>
                  <span className='font-semibold'>Position:</span>{' '}
                  {job?.title || '—'}
                </div>
                <div>
                  <span className='font-semibold'>Company:</span>{' '}
                  {job?.company || '—'}
                </div>
                <div>
                  <span className='font-semibold'>Expected Salary:</span>{' '}
                  {currency} {expectedSalary || '—'}
                </div>
                <div>
                  <span className='font-semibold'>Start Date:</span>{' '}
                  {startDate || '—'}
                </div>
                <div>
                  <span className='font-semibold'>Authorized:</span>{' '}
                  {authorized ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className='font-semibold'>LinkedIn:</span>{' '}
                  {linkedIn || '—'}
                </div>
                <div>
                  <span className='font-semibold'>Links:</span>{' '}
                  {links.filter(Boolean).join(', ') || '—'}
                </div>
                <div>
                  <span className='font-semibold'>Experience (years):</span>{' '}
                  {experienceYears || '—'}
                </div>
                <div className='mt-2'>
                  <span className='font-semibold'>Cover Letter</span>
                </div>
                <div className='rounded-xl bg-white/70 p-3 ring-1 ring-black/5 border border-white/40 whitespace-pre-wrap min-h-[80px]'>
                  {coverLetter || '—'}
                </div>
                <div className='mt-2'>
                  <span className='font-semibold'>Why this role</span>
                </div>
                <div className='rounded-xl bg-white/70 p-3 ring-1 ring-black/5 border border-white/40 whitespace-pre-wrap min-h-[60px]'>
                  {additionalInfo || '—'}
                </div>
                <div className='mt-2 text-xs text-[#3D52A0]/70'>
                  CV: {cvFile ? cvFile.name : 'None'}
                </div>
              </div>
              <div className='mt-6 grid grid-cols-2 gap-3'>
                <Button variant='soft' onClick={() => setReview(false)}>
                  Back
                </Button>
                <Button onClick={submitApplication} loading={submitting}>
                  Submit Application
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
