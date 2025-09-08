import { forwardRef } from 'react'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Checkbox = forwardRef(function Checkbox(
  { label, error, className, name, ...props },
  ref
) {
  return (
    <div className='w-full'>
      <label className='inline-flex items-start gap-3 cursor-pointer select-none'>
        <input
          ref={ref}
          id={name}
          name={name}
          type='checkbox'
          className={cn(
            'h-5 w-5 rounded-md border border-[#ADBBDA] bg-white',
            'checked:bg-[#3D52A0] checked:border-[#3D52A0]',
            'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7091E6]',
            className
          )}
          {...props}
        />
        <span className='text-sm text-[#1B2559]'>{label}</span>
      </label>
      {error && (
        <p className='mt-1 text-xs text-rose-600'>
          {error.message || 'Required'}
        </p>
      )}
    </div>
  )
})

export default Checkbox
