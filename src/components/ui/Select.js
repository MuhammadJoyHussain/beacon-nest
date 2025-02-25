const Select = ({
  label,
  name,
  value,
  onChange,
  required = false,
  className = '',
  children, // Accept children
}) => (
  <div className={`flex flex-col space-y-1 ${className}`}>
    {label && <label className='text-sm font-medium'>{label}</label>}
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className='border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
    >
      {children} {/* Render children instead of mapping options */}
    </select>
  </div>
)

export default Select
