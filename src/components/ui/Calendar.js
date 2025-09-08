import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function atMidnight(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
function startOfMonth(d) {
  const x = new Date(d)
  x.setDate(1)
  x.setHours(0, 0, 0, 0)
  return x
}
function addMonths(d, n) {
  const x = new Date(d)
  x.setMonth(x.getMonth() + n)
  return x
}
function addDays(d, n) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}
function isSameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}
function isSameMonth(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth()
  )
}
function isBefore(a, b) {
  return atMidnight(a) < atMidnight(b)
}
function isAfter(a, b) {
  return atMidnight(a) > atMidnight(b)
}
function formatMonthYear(d) {
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}
function formatWeekday(i) {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]
}

const dayBase =
  'h-9 w-9 rounded-lg inline-flex items-center justify-center text-sm transition-colors select-none'

export default function Calendar({
  selected,
  onSelect,
  month: monthProp,
  minDate,
  maxDate,
  disabled: isDisabledFn,
  className = '',
  weekStartsOn = 1,
}) {
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(monthProp || selected || new Date())
  )
  const today = useMemo(() => atMidnight(new Date()), [])
  const weeks = useMemo(() => {
    const grid = []
    const first = startOfMonth(viewMonth)
    const startWeekday = (first.getDay() + 6) % 7
    const gridStart = addDays(
      first,
      -((startWeekday - (weekStartsOn - 1) + 7) % 7)
    )
    let cur = gridStart
    for (let w = 0; w < 6; w++) {
      const row = []
      for (let d = 0; d < 7; d++) {
        row.push(cur)
        cur = addDays(cur, 1)
      }
      grid.push(row)
    }
    return grid
  }, [viewMonth, weekStartsOn])

  const outOfRange = (d) =>
    (minDate && isBefore(d, minDate)) || (maxDate && isAfter(d, maxDate))
  const isDisabled = (d) =>
    outOfRange(d) || (typeof isDisabledFn === 'function' && isDisabledFn(d))
  const pick = (d) => {
    if (isDisabled(d)) return
    onSelect && onSelect(atMidnight(d))
  }

  return (
    <div
      className={`rounded-2xl bg-white/80 backdrop-blur p-4 shadow-xl ring-1 ring-black/5 border border-white/40 ${className}`}
    >
      <div className='flex items-center justify-between mb-3'>
        <button
          type='button'
          className='h-9 w-9 rounded-lg hover:bg-slate-100 active:scale-[.98] grid place-items-center text-slate-700'
          onClick={() => setViewMonth(addMonths(viewMonth, -1))}
          aria-label='Previous month'
        >
          <ChevronLeft className='h-5 w-5' />
        </button>
        <div className='text-sm font-semibold text-[#1B2559]'>
          {formatMonthYear(viewMonth)}
        </div>
        <button
          type='button'
          className='h-9 w-9 rounded-lg hover:bg-slate-100 active:scale-[.98] grid place-items-center text-slate-700'
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          aria-label='Next month'
        >
          <ChevronRight className='h-5 w-5' />
        </button>
      </div>

      <div className='grid grid-cols-7 gap-1 mb-1'>
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className='h-8 text-xs grid place-items-center text-slate-500'
          >
            {formatWeekday((i + (weekStartsOn - 1)) % 7)}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-7 gap-1'>
        {weeks.map((row, ri) =>
          row.map((d, di) => {
            const outside = !isSameMonth(d, viewMonth)
            const disabled = isDisabled(d)
            const sel = selected && isSameDay(d, selected)
            const isToday = isSameDay(d, today)
            let cls = `${dayBase} `
            if (disabled) cls += 'opacity-35 cursor-not-allowed '
            else cls += 'cursor-pointer hover:bg-slate-100 '
            if (sel) cls += 'bg-[#3D52A0] text-white hover:bg-[#3D52A0] '
            else if (isToday) cls += 'ring-1 ring-[#7091E6] '
            if (outside) cls += 'text-slate-300 '
            return (
              <button
                type='button'
                key={`${ri}-${di}`}
                className={cls}
                onClick={() => pick(d)}
                disabled={disabled}
              >
                {d.getDate()}
              </button>
            )
          })
        )}
      </div>

      <div className='mt-3 flex items-center justify-between'>
        <button
          type='button'
          className='text-xs text-[#3D52A0] underline underline-offset-2 hover:opacity-80'
          onClick={() => setViewMonth(startOfMonth(today))}
        >
          Today
        </button>
        <div className='text-[11px] text-slate-500'>
          {selected ? selected.toLocaleDateString() : 'No date selected'}
        </div>
      </div>
    </div>
  )
}
