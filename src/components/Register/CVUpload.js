// components/form/CVUpload.js
import { FileText } from 'lucide-react'

const CVUpload = ({ onChange, file }) => (
  <section className='space-y-4'>
    <h3 className='text-xl font-semibold text-[#3D52A0]'>Upload CV</h3>

    <label
      htmlFor='cv-upload'
      className='relative w-full cursor-pointer bg-[#F3F4FA] border border-[#ADBBDA] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 hover:shadow-md transition-shadow'
    >
      <div className='flex items-center gap-4'>
        <div className='bg-[#7091E6] p-3 rounded-xl'>
          <FileText className='text-white w-6 h-6 sm:w-7 sm:h-7' />
        </div>
        <div>
          <p className='text-sm font-medium text-[#3D52A0] truncate max-w-xs sm:max-w-md'>
            {file ? file.name : 'Click here or drag and drop a PDF file'}
          </p>
          <p className='text-xs text-gray-500'>
            Upload only PDF format. Max size 5MB.
          </p>
        </div>
      </div>

      <input
        id='cv-upload'
        type='file'
        accept='application/pdf'
        onChange={onChange}
        className='hidden'
      />
    </label>
  </section>
)

export default CVUpload
