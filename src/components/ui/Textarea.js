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
          className='block font-semibold mb-2 text-green-800'
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
        className={`w-full p-3 border rounded-md border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-green-900 ${className}`}
        {...props}
      />
    </div>
  )
}
