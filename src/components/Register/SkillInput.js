// components/form/SkillsInput.js
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const SkillsInput = ({
  skills,
  register,
  handleSkillChange,
  addSkill,
  removeSkill,
}) => (
  <section className='space-y-6'>
    <h3 className='text-xl font-semibold mb-4'>Skills</h3>
    {skills.map((skill, index) => (
      <div key={index} className='flex items-center gap-2 mb-2'>
        <Input
          {...register(`skills.${index}`)}
          value={skill}
          label='Skill'
          onChange={(e) => handleSkillChange(e, index)}
          className='flex-1'
          placeholder='Enter skill'
        />
        {skills.length > 1 && (
          <button
            type='button'
            onClick={() => removeSkill(index)}
            className='text-red-500 font-bold text-lg px-2'
            aria-label='Remove skill'
          >
            ✕
          </button>
        )}
      </div>
    ))}
    <Button type='button' onClick={addSkill}>
      + Add Skill
    </Button>
  </section>
)

export default SkillsInput
