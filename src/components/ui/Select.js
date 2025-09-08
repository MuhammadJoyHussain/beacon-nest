import { forwardRef } from 'react'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Chevron = () => (
  <svg className='h-4 w-4' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path d='M6 9l6 6 6-6' stroke='currentColor' strokeWidth='2' />
  </svg>
)

const Select = forwardRef(function Select(
  { label, error, className, name, children, ...props },
  ref
) {
  return (
    <div className='w-full'>
      {label && (
        <label
          htmlFor={name}
          className='mb-1 block text-sm font-medium text-[#3D52A0]'
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          'relative rounded-xl border bg-white/70 backdrop-blur',
          'border-[#E0E6FF] focus-within:border-[#9FB3FF] focus-within:ring-2 focus-within:ring-[#7091E6]',
          error && 'border-rose-300 focus-within:ring-rose-300',
          className
        )}
      >
        <select
          ref={ref}
          id={name}
          name={name}
          className='w-full appearance-none bg-transparent px-3 py-3 pr-9 rounded-xl outline-none text-[#1B2559] placeholder:text-[#3D52A0]/50'
          {...props}
        >
          {children}
        </select>
        <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#3D52A0]/60'>
          <Chevron />
        </span>
      </div>
      {error && (
        <p className='mt-1 text-xs text-rose-600'>
          {error.message || 'Required'}
        </p>
      )}
    </div>
  )
})

export default Select
