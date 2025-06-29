const CandidateCard = ({ candidate }) => (
  <div className='bg-white p-6 rounded-lg shadow-lg w-full transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl'>
    <div className='flex items-center mb-4'>
      <img
        src={candidate.image}
        alt={candidate.name}
        className='w-16 h-16 rounded-full mr-4 border-2 border-blue-600 transform hover:scale-110 transition duration-200'
      />
      <div>
        <h5 className='text-lg font-semibold'>{candidate.name}</h5>
        <p className='text-sm text-gray-500'>{candidate.position}</p>
      </div>
    </div>
    <div className='mb-4 text-sm text-gray-600'>
      <span className='block font-semibold mb-2'>Key Skills:</span>
      <div className='flex flex-wrap gap-2'>
        {candidate.skills.map((skill, index) => (
          <span
            key={index}
            className='bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full hover:bg-blue-200 transition-all duration-200'
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
    <div className='flex justify-between items-center text-sm'>
      <span className='text-gray-500'>{candidate.location}</span>
      <span className='text-blue-600 font-bold'>{candidate.rate}</span>
    </div>
  </div>
)

export default CandidateCard
