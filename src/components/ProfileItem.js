const ProfileItem = ({ label, value }) => {
  return (
    <div className='bg-foundation-pale p-4 rounded-xl shadow-sm'>
      <p className='text-base text-white'>{label}</p>
      <p className='font-lg font-bold text-foundation-primary'>{value}</p>
    </div>
  )
}

export default ProfileItem
