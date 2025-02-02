import * as React from 'react'

export const DropdownMenu = ({ children }) => {
  return <div className='relative'>{children}</div>
}

export const DropdownMenuTrigger = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className='px-4 py-2'>
      {children}
    </button>
  )
}

export const DropdownMenuContent = ({ children, show }) => {
  return show ? (
    <div className='absolute bg-white shadow-md p-2'>{children}</div>
  ) : null
}

export const DropdownMenuItem = ({ children, onClick }) => {
  return (
    <div className='p-2 hover:bg-gray-100 cursor-pointer' onClick={onClick}>
      {children}
    </div>
  )
}
