const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  required = false,
  placeholder,
  className = '',
}) => (
  <div className={`flex flex-col space-y-1 ${className}`}>
    {label && <label className='text-sm font-medium'>{label}</label>}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className='border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
    />
  </div>
)

export default Input
