import { forwardRef } from 'react'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-[#3D52A0] via-[#5F79D4] to-[#7091E6] text-white shadow hover:shadow-md active:scale-[.99]',
  outline: 'bg-white/70 border border-[#ADBBDA] text-[#3D52A0] hover:bg-white',
  soft: 'bg-[#F3F4FA] text-[#3D52A0] hover:bg-[#E9EEFF] border border-[#E0E6FF]',
  ghost: 'text-[#3D52A0] hover:bg-[#F3F4FA]',
}

const SIZES = {
  lg: 'h-12 px-5 rounded-2xl text-base',
  md: 'h-11 px-4 rounded-xl text-sm',
  sm: 'h-9 px-3 rounded-lg text-sm',
  icon: 'h-10 w-10 rounded-xl',
}

const Spinner = () => (
  <svg
    className='h-4 w-4 animate-spin'
    viewBox='0 0 24 24'
    fill='none'
    aria-hidden='true'
  >
    <circle
      className='opacity-25'
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      strokeWidth='4'
    />
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
    />
  </svg>
)

const Button = forwardRef(function Button(
  {
    as: Comp = 'button',
    variant = 'primary',
    size = 'lg',
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    className,
    children,
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading
  return (
    <Comp
      ref={ref}
      aria-busy={loading ? 'true' : undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7091E6] focus-visible:ring-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed select-none',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? <Spinner /> : leftIcon}
      <span className='truncate'>{children}</span>
      {!loading && rightIcon}
    </Comp>
  )
})

export default Button
