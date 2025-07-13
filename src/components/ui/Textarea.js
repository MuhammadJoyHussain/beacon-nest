export default function Textarea({
  label,
  name,
  value,
  onChange,
  className = '',
  ...props
}) {
  return (
    <div className='mb-4'>
      {label && (
        <label
          htmlFor={name}
          className='block font-semibold mb-2 text-foundation-primary'
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className={`w-full p-3 border rounded-md border-foundation-pale focus:outline-none focus:ring-2 focus:ring-foundation-blue bg-white text-foundation-primary ${className}`}
        {...props}
      />
    </div>
  )
}
