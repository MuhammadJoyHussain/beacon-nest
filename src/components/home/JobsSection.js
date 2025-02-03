'use client'
import { useState } from 'react'

const jobCategories = [
  {
    id: 'tab-job-1',
    name: 'Management',
    icon: '/assets/imgs/page/homepage1/management.svg',
  },
  {
    id: 'tab-job-2',
    name: 'Marketing & Sale',
    icon: '/assets/imgs/page/homepage1/marketing.svg',
  },
  {
    id: 'tab-job-3',
    name: 'Finance',
    icon: '/assets/imgs/page/homepage1/finance.svg',
  },
  {
    id: 'tab-job-4',
    name: 'Human Resource',
    icon: '/assets/imgs/page/homepage1/human.svg',
  },
  {
    id: 'tab-job-5',
    name: 'Retail & Products',
    icon: '/assets/imgs/page/homepage1/retail.svg',
  },
  {
    id: 'tab-job-6',
    name: 'Content Writer',
    icon: '/assets/imgs/page/homepage1/content.svg',
  },
]

const jobs = {
  'tab-job-1': [
    {
      companyLogo: '/assets/imgs/brands/brand-1.png',
      companyName: 'LinkedIn',
      location: 'New York, US',
      position: 'UI / UX Designer',
      type: 'Fulltime',
      salary: '$500',
      skills: ['Adobe XD', 'Figma', 'Photoshop'],
    },
    {
      companyLogo: '/assets/imgs/brands/brand-2.png',
      companyName: 'Adobe Illustrator',
      location: 'New York, US',
      position: 'Full Stack Engineer',
      type: 'Part-time',
      salary: '$800',
      skills: ['React', 'NodeJS'],
    },
  ],
  'tab-job-2': [
    {
      companyLogo: '/assets/imgs/brands/brand-3.png',
      companyName: 'Bing Search',
      location: 'New York, US',
      position: 'Java Software Engineer',
      type: 'Full-time',
      salary: '$250',
      skills: ['Python', 'AWS', 'Photoshop'],
    },
  ],
}

export default function JobsSection() {
  const [activeTab, setActiveTab] = useState('tab-job-1')

  return (
    <section className='mt-12'>
      <div className='container mx-auto text-center'>
        <h2 className='text-3xl font-bold mb-4'>Jobs of the Day</h2>
        <p className='text-lg text-gray-500'>
          Search and connect with the right candidates faster.
        </p>
        <div className='mt-8 flex flex-wrap justify-center gap-4'>
          {jobCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
                activeTab === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <img
                src={category.icon}
                alt={category.name}
                className='h-6 w-6'
              />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className='container mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {jobs[activeTab]?.map((job, index) => (
          <div key={index} className='p-6 border rounded-lg shadow-lg bg-white'>
            <div className='flex items-center gap-4 mb-4'>
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className='h-12 w-12'
              />
              <div>
                <h3 className='text-xl font-semibold'>{job.position}</h3>
                <p className='text-gray-500'>
                  {job.companyName} - {job.location}
                </p>
              </div>
            </div>
            <p className='mb-2'>
              <strong>Type:</strong> {job.type}
            </p>
            <p className='mb-2'>
              <strong>Salary:</strong> {job.salary}
            </p>
            <div className='mt-4 flex flex-wrap gap-2'>
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className='px-3 py-1 bg-gray-200 rounded-full text-sm'
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
