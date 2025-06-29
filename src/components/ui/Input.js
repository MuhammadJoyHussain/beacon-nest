// components/Input.jsx
const Input = ({
  label,
  type = 'text',
  name,
  placeholder,
  required = false,
  className = '',
  register,
}) => (
  <div className={`flex flex-col space-y-1 ${className}`}>
    {label && <label className='text-sm font-medium'>{label}</label>}
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      className='border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
      {...(register ? register(name) : {})}
    />
  </div>
)

export default Input
