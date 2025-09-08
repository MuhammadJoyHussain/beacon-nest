import { forwardRef, useState } from 'react'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Eye = ({ on }) => (
  <svg className='h-4 w-4' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    {on ? (
      <path
        stroke='currentColor'
        strokeWidth='2'
        d='M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z'
      />
    ) : (
      <>
        <path
          stroke='currentColor'
          strokeWidth='2'
          d='M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z'
        />
        <circle cx='12' cy='12' r='3' fill='currentColor' />
      </>
    )}
  </svg>
)

const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    leftIcon,
    rightIcon,
    className,
    type = 'text',
    name,
    ...props
  },
  ref
) {
  const isPassword = type === 'password'
  const [show, setShow] = useState(false)
  const inputType = isPassword ? (show ? 'text' : 'password') : type

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
          'relative rounded-xl border bg-white/70 backdrop-blur transition-all',
          'border-[#E0E6FF] focus-within:border-[#9FB3FF] focus-within:ring-2 focus-within:ring-[#7091E6]',
          error && 'border-rose-300 focus-within:ring-rose-300',
          className
        )}
      >
        {leftIcon && (
          <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3D52A0]/60'>
            {leftIcon}
          </span>
        )}

        <input
          id={name}
          ref={ref}
          name={name}
          type={inputType}
          className={cn(
            'w-full bg-transparent outline-none placeholder:text-[#3D52A0]/50',
            'text-[#1B2559] px-3 py-3 rounded-xl',
            leftIcon ? 'pl-10' : '',
            isPassword || rightIcon ? 'pr-10' : ''
          )}
          {...props}
        />

        {isPassword ? (
          <button
            type='button'
            onClick={() => setShow((s) => !s)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-[#3D52A0]/60 hover:text-[#3D52A0]'
            tabIndex={-1}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            <Eye on={show} />
          </button>
        ) : rightIcon ? (
          <span className='absolute right-3 top-1/2 -translate-y-1/2 text-[#3D52A0]/60'>
            {rightIcon}
          </span>
        ) : null}
      </div>

      {error ? (
        <p className='mt-1 text-xs text-rose-600'>
          {error.message || 'This field is required'}
        </p>
      ) : hint ? (
        <p className='mt-1 text-xs text-[#3D52A0]/70'>{hint}</p>
      ) : null}
    </div>
  )
})

export default Input
