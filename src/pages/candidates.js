import CandidateCard from '@/components/dashboard/CandidateCard'
import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import api from '@/utils/api'
import { useEffect, useState } from 'react'

const Candidates = () => {
  const [candidates, setCandidates] = useState([])

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await api.get('/candidate')
        setCandidates(data)
      } catch (error) {
        console.error('Error fetching candidates:', error)
      }
    }

    fetchCandidates()
  }, [])

  return (
    <div className='flex overflow-hidden bg-gray-50'>
      <Sidebar />
      <Header />

      <div className='flex-1 flex flex-col pl-16 lg:pl-64 mt-16 lg:mt-24'>
        <div className='p-6 flex flex-wrap gap-6'>
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Candidates
