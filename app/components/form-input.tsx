import type { HTMLInputTypeAttribute } from 'react';

interface FormInputProps {
  type: HTMLInputTypeAttribute;
  placeholder: string;
  required: boolean;
  errors: string[];
}

export default function FormInput({
  type,
  placeholder,
  required,
  errors,
}: FormInputProps) {
  return (
    <div className='flex flex-col gap-1'>
      <input
        className='transition bg-transparent rounded-md w-full h-10 border-none ring-2 ring-neutral-100 focus:outline-none focus:ring-4 focus:ring-emerald-500 placeholder:text-neutral-400'
        type={type}
        placeholder={placeholder}
        required={required}
      />
      <span className='text-red-500 font-medium'>
        {errors.map((error, index) => (
          <span key={index} className='text-red-500 font-medium text-xs'>
            {error}
          </span>
        ))}
      </span>
    </div>
  );
}
