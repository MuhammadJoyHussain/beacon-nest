import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import api from '@/utils/api'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import CandidateCard from '@/components/dashboard/CandidateCard'

const Candidates = () => {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCandidates = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const { data } = await api.get('/candidate', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCandidates(data)
      } catch (error) {
        console.error('Error fetching candidates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [])

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />

      <div className='flex flex-col flex-grow'>
        <Header />

        <main className='flex-grow px-4 sm:px-6 lg:px-8 py-6 overflow-auto'>
          <h1 className='text-xl sm:text-2xl font-semibold text-gray-800 mb-6'>
            Candidate List
          </h1>
          {loading ? (
            <p className='text-center text-gray-600 mt-12'>
              Loading candidates...
            </p>
          ) : candidates.length === 0 ? (
            <div className='text-center text-gray-500 mt-20'>
              <p className='text-lg'>No candidates found.</p>
            </div>
          ) : (
            <div className='grid  sm:grid-cols-2 md:grid-cols-3  gap-6 w-full'>
              {candidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Candidates
