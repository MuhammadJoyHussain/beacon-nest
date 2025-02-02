import * as React from 'react'

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`border p-2 rounded-md ${className}`}
      {...props}
    />
  )
})
Input.displayName = 'Input'
