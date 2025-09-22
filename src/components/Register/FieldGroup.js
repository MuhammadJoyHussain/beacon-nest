import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

const FieldGroup = ({
  title,
  fields,
  formData,
  register,
  errors,
  setValue,
  selectOptions = {},
}) => (
  <section className='space-y-6'>
    <h3 className='text-xl font-semibold mb-4'>{title}</h3>
    <div className='grid md:grid-cols-2 gap-6'>
      {fields.map(({ name, placeholder, type }) =>
        name === 'gender' || name === 'country' ? (
          <Select
            key={name}
            label={placeholder || name}
            value={formData[name]}
            {...register(name)}
            onChange={(e) => setValue(name, e.target.value)}
          >
            <option value=''>Select {name}</option>
            {(selectOptions[name] || []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            key={name}
            label={placeholder}
            value={formData[name]}
            name={name}
            type={type || 'text'}
            placeholder={placeholder}
            {...register(name, { required: placeholder.endsWith('*') })}
            error={errors[name]}
          />
        )
      )}
    </div>
  </section>
)

export default FieldGroup
