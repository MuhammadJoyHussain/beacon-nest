import React from 'react'

const Input = React.forwardRef(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      className = '',
      type = 'text',
      ...props
    },
    ref
  ) => {
    return (
      <div className={className}>
        {label ? (
          <label className='block mb-1 text-sm font-medium text-[#1B2559]'>
            {label}
          </label>
        ) : null}
        <div className='relative'>
          {leftIcon ? (
            <span className='absolute left-3 top-1/2 -translate-y-1/2'>
              {leftIcon}
            </span>
          ) : null}
          <input
            ref={ref}
            type={type}
            {...props}
            className={[
              'w-full rounded-xl border border-[#E0E6FF] bg-white/90 px-3 py-2.5 text-sm',
              leftIcon ? 'pl-9' : '',
              rightIcon ? 'pr-9' : '',
              'outline-none focus:ring-2 focus:ring-[#B8C1EC]',
            ].join(' ')}
          />
          {rightIcon ? (
            <span className='absolute right-3 top-1/2 -translate-y-1/2'>
              {rightIcon}
            </span>
          ) : null}
        </div>
        {error ? (
          <p className='text-red-600 text-xs mt-1'>
            {typeof error === 'object' && error.message
              ? error.message
              : 'This field is required'}
          </p>
        ) : null}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input
