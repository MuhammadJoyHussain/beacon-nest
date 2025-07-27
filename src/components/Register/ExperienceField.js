// components/form/ExperienceFields.js
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const formatToUKDate = (dateStr) => {
  const date = new Date(dateStr)
  return !isNaN(date) ? date.toISOString().split('T')[0] : ''
}

const ExperienceFields = ({
  experiences,
  register,
  handleExperienceChange,
  addExperience,
  removeExperience,
}) => (
  <section className='space-y-6'>
    <h3 className='text-xl font-semibold mb-4'>Experience</h3>
    {experiences.map((exp, index) => (
      <div
        key={index}
        className='grid md:grid-cols-2 gap-6 mb-4 p-4 rounded-xl'
      >
        {['position', 'company', 'city', 'country'].map((field) => (
          <Input
            key={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            value={exp[field]}
            onChange={(e) => handleExperienceChange(e, index, field)}
            {...register(`employeeExperience.${index}.${field}`)}
          />
        ))}

        <Input
          label='Start Date'
          type='date'
          value={formatToUKDate(exp.startDate)}
          onChange={(e) => handleExperienceChange(e, index, 'startDate')}
          {...register(`employeeExperience.${index}.startDate`)}
        />
        {isNaN(new Date(exp.endDate)) ? (
          <Input
            label='End Date'
            type='text'
            value={exp.endDate}
            onChange={(e) => handleExperienceChange(e, index, 'endDate')}
            {...register(`employeeExperience.${index}.endDate`)}
          />
        ) : (
          <Input
            label='End Date'
            type='date'
            value={formatToUKDate(exp.endDate)}
            onChange={(e) => handleExperienceChange(e, index, 'endDate')}
            {...register(`employeeExperience.${index}.endDate`)}
          />
        )}

        {experiences.length > 1 && (
          <div className='md:col-span-2 text-right'>
            <button
              type='button'
              onClick={() => removeExperience(index)}
              className='text-red-500'
            >
              ✕ Remove Experience
            </button>
          </div>
        )}
      </div>
    ))}
    <Button type='button' onClick={addExperience}>
      + Add Experience
    </Button>
  </section>
)

export default ExperienceFields
