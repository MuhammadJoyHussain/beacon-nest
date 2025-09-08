import { useEffect, useRef, useState } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Calendar from './Calendar'

function formatISO(d) {
  if (!d) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function parseISO(s) {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  const dt = new Date(y, (m || 1) - 1, d || 1)
  return isNaN(dt) ? null : dt
}

export default function DatePickerInput({
  label,
  name,
  value,
  onChange,
  placeholder = 'YYYY-MM-DD',
  error,
  minDate,
  maxDate,
  disabledDays,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selectedDate = parseISO(value)

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div className={`relative ${className}`} ref={ref}>
      {label && (
        <label
          htmlFor={name}
          className='mb-1 block text-sm font-medium text-[#3D52A0]'
        >
          {label}
        </label>
      )}
      <button
        type='button'
        id={name}
        onClick={() => setOpen((s) => !s)}
        className={[
          'w-full text-left rounded-xl border bg-white/70 backdrop-blur transition-all',
          'border-[#E0E6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7091E6]',
          error ? 'border-rose-300 ring-rose-300' : '',
          'px-3 py-3 flex items-center gap-2',
        ].join(' ')}
      >
        <CalendarIcon className='h-4 w-4 text-[#3D52A0]/60' />
        <span className={value ? 'text-[#1B2559]' : 'text-[#3D52A0]/50'}>
          {value || placeholder}
        </span>
      </button>
      {error && (
        <p className='mt-1 text-xs text-rose-600'>
          {error.message || 'This field is required'}
        </p>
      )}
      <input type='hidden' name={name} value={value || ''} readOnly />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className='absolute z-50 mt-1'
          >
            <Calendar
              selected={selectedDate}
              onSelect={(d) => {
                const iso = formatISO(d)
                onChange && onChange(iso)
                setOpen(false)
              }}
              minDate={minDate || null}
              maxDate={maxDate || null}
              disabled={disabledDays}
              className='w-[19.5rem]'
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
