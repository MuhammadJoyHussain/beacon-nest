const Button = ({
  children,
  onClick,
  type = 'button',
  disabled,
  className = '',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`bg-[#3D52A0] w-full hover:bg-[#7091E6] text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7091E6] ${className}`}
  >
    {children}
  </button>
)

export default Button
