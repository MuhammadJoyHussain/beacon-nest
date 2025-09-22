import React from 'react'

const Checkbox = React.forwardRef(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={['flex items-start gap-3', className].join(' ')}>
        <input
          ref={ref}
          type='checkbox'
          {...props}
          className='mt-1 h-4 w-4 rounded border-[#E0E6FF] text-[#3D52A0] focus:ring-[#B8C1EC]'
        />
        <div className='text-sm'>
          <div className='text-[#1B2559]'>{label}</div>
          {error ? (
            <p className='text-red-600 text-xs mt-1'>
              {typeof error === 'object' && error.message
                ? error.message
                : 'This field is required'}
            </p>
          ) : null}
        </div>
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'
export default Checkbox
