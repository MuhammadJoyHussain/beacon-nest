import React from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'

const Joblist = () => {
  const tasks = [
    {
      title: 'Full Stack Engineer',
      start: '1 day ago',
      progress: 80,
      priority: 'High',
    },
    {
      title: 'Frontend Developer',
      start: '3 days ago',
      progress: 68,
      priority: 'Medium',
    },
    {
      title: 'Backend Developer',
      start: '4 days ago',
      progress: 20,
      priority: 'Low',
    },
    {
      title: 'UI/UX Designer',
      start: '5 days ago',
      progress: 100,
      priority: 'Completed',
    },
  ]

  return (
    <div className='flex flex-col h-screen'>
      {/* Header and Sidebar */}
      <Header />
      <Sidebar />

      {/* Main Content */}
      <div className='ml-64 p-6 pt-24 bg-gray-50 h-screen overflow-y-auto'>
        <h1 className='text-2xl font-bold'>My Tasks</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6'>
          {tasks.map((task, index) => (
            <div key={index} className='bg-white shadow-md p-4 rounded-lg'>
              <h3 className='font-semibold text-lg'>{task.title}</h3>
              <p className='text-gray-500 text-sm'>Start: {task.start}</p>
              <p className='text-gray-700'>Complete: {task.progress}%</p>
              <span
                className={`inline-block mt-2 px-3 py-1 text-sm rounded bg-${
                  task.priority === 'High'
                    ? 'red'
                    : task.priority === 'Medium'
                    ? 'yellow'
                    : 'green'
                }-500 text-white`}
              >
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Joblist
