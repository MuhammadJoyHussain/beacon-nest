const Checkbox = ({ label, name, checked, onChange, className = '' }) => (
  <label
    className={`inline-flex items-center space-x-2 cursor-pointer ${className}`}
  >
    <input
      type='checkbox'
      name={name}
      checked={checked}
      onChange={onChange}
      className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer'
    />
    <span>{label}</span>
  </label>
)

export default Checkbox
