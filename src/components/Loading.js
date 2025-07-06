export default function LoadingScreen() {
  return (
    <div className='h-screen w-screen flex flex-col items-center justify-center bg-white text-green-900'>
      <h1 className='text-4xl font-bold mb-6 drop-shadow-sm'>Beacon Nest</h1>

      {/* Logo style: inner + outer pulse ring in green */}
      <div className='w-16 h-16 rounded-full border-4 border-green-600 flex items-center justify-center animate-spin-slow'>
        <div className='w-8 h-8 rounded-full bg-green-600' />
      </div>

      <p className='mt-6 text-base text-green-700 opacity-80'>
        Loading, please wait...
      </p>
    </div>
  )
}
