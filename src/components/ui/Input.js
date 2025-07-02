// components/Input.jsx
const Input = ({
  label,
  type = 'text',
  name,
  placeholder,
  onChange,
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
      onChange={onChange}
      className='border text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
      {...(register ? register(name) : {})}
    />
  </div>
)

export default Input
