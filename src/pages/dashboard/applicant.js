import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Briefcase, FileText, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  // Mock user data
  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    resumeUploaded: true,
    resumeUrl: '/resume.pdf',
  }

  // Mock applied jobs
  const appliedJobs = [
    {
      title: 'Frontend Developer',
      company: 'TechNova',
      status: 'Under Review',
    },
    {
      title: 'UI/UX Designer',
      company: 'DesignCo',
      status: 'Interview Scheduled',
    },
  ]

  // Mock recommended jobs
  const recommendedJobs = [
    {
      title: 'Full Stack Engineer',
      company: 'CodeWorks',
      location: 'Remote',
    },
    {
      title: 'Product Designer',
      company: 'BrightLabs',
      location: 'London',
    },
  ]

  return (
    <div className='min-h-screen bg-green-50 text-gray-800'>
      <Header />
      <main className='pt-24 pb-16 px-6 max-w-6xl mx-auto space-y-10'>
        {/* Welcome Banner */}
        <section className='bg-white shadow-md rounded-2xl p-6'>
          <h1 className='text-2xl font-bold text-green-800 mb-1'>
            Welcome back, {user.name}!
          </h1>
          <p className='text-gray-600'>
            Check your application status and explore new opportunities.
          </p>
        </section>

        {/* Profile Overview */}
        <section className='grid md:grid-cols-3 gap-6'>
          <div className='bg-white p-5 rounded-2xl shadow-md'>
            <h2 className='text-lg font-semibold text-green-700 mb-2 flex items-center gap-2'>
              <FileText size={20} />
              Resume
            </h2>
            {user.resumeUploaded ? (
              <div>
                <p className='text-gray-700'>You have uploaded your resume.</p>
                <a
                  href={user.resumeUrl}
                  target='_blank'
                  rel='noreferrer'
                  className='text-green-600 underline mt-2 inline-block'
                >
                  View Resume
                </a>
              </div>
            ) : (
              <p className='text-red-600'>No resume uploaded yet.</p>
            )}
          </div>

          <div className='bg-white p-5 rounded-2xl shadow-md col-span-2'>
            <h2 className='text-lg font-semibold text-green-700 mb-2 flex items-center gap-2'>
              <Briefcase size={20} />
              Recently Applied Jobs
            </h2>
            {appliedJobs.length === 0 ? (
              <p className='text-gray-500'>
                You haven't applied to any jobs yet.
              </p>
            ) : (
              <ul className='space-y-3'>
                {appliedJobs.map((job, i) => (
                  <li key={i} className='border-b pb-2'>
                    <h3 className='font-medium'>{job.title}</h3>
                    <p className='text-sm text-gray-600'>
                      {job.company} – Status:{' '}
                      <span className='font-semibold text-green-700'>
                        {job.status}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Recommended Jobs */}
        <section className='bg-white p-6 rounded-2xl shadow-md'>
          <h2 className='text-lg font-semibold text-green-700 mb-4 flex items-center gap-2'>
            <Sparkles size={20} />
            Recommended for You
          </h2>
          <div className='grid md:grid-cols-2 gap-4'>
            {recommendedJobs.map((job, i) => (
              <div
                key={i}
                className='border border-green-200 rounded-xl p-4 hover:shadow-sm transition'
              >
                <h3 className='text-lg font-bold text-green-800'>
                  {job.title}
                </h3>
                <p className='text-gray-700'>{job.company}</p>
                <p className='text-sm text-gray-500'>{job.location}</p>
                <Link
                  href='/jobs'
                  className='mt-2 inline-block text-green-600 font-medium hover:underline'
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
