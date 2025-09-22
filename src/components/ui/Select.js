import React from 'react'

const Select = React.forwardRef(
  ({ label, error, className = '', children, ...props }, ref) => {
    return (
      <div className={className}>
        {label ? (
          <label className='block mb-1 text-sm font-medium text-[#1B2559]'>
            {label}
          </label>
        ) : null}
        <select
          ref={ref}
          {...props}
          className='w-full rounded-xl border border-[#E0E6FF] bg-white/90 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#B8C1EC]'
        >
          {children}
        </select>
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
Select.displayName = 'Select'
export default Select
