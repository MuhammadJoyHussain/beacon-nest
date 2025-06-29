const Select = ({
  label,
  name,
  value,
  onChange,
  required = false,
  className = '',
  children,
  register,
}) => (
  <div className={`flex flex-col space-y-1 ${className}`}>
    {label && <label className='text-sm font-medium'>{label}</label>}
    <select
      {...(register ? register(name) : {})}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className='border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
    >
      {children}
    </select>
  </div>
)

export default Select
