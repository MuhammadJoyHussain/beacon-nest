const SelectItem = ({ value, children, ...props }) => {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  )
}

export default SelectItem
