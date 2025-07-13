// components/ui/Input.js
const Input = ({
  label,
  type = 'text',
  name,
  placeholder,
  onChange,
  required = false,
  className = '',
  register,
  value,
  disabled = false,
}) => (
  <div className={`flex flex-col space-y-1 ${className}`}>
    {label && (
      <label
        htmlFor={name}
        className='text-sm font-medium text-[#3D52A0] capitalize'
      >
        {label}
      </label>
    )}
    <input
      id={name}
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      onChange={onChange}
      value={value}
      disabled={disabled}
      className={`border border-[#3D52A0]/50 text-[#3D52A0] rounded-lg px-3 py-2 placeholder:text-[#8697C4] focus:outline-none focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6] transition disabled:opacity-50 disabled:cursor-not-allowed`}
      {...(register ? register(name) : {})}
    />
  </div>
)

export default Input
