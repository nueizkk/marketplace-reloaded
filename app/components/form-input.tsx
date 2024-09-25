import type { HTMLInputTypeAttribute } from 'react';

interface FormInputProps {
  type: HTMLInputTypeAttribute;
  name: string;
  placeholder: string;
  required: boolean;
  errors?: string[];
}

export default function FormInput({
  type,
  name,
  placeholder,
  required,
  errors = [],
}: FormInputProps) {
  return (
    <div className='flex flex-col gap-2'>
      <input
        className='transition bg-transparent rounded-md w-full h-10 border-none ring-2 ring-neutral-100 focus:outline-none focus:ring-4 focus:ring-emerald-500 placeholder:text-neutral-400'
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
      />
      {errors.map((error, index) => (
        <span key={index} className='text-red-500 font-medium text-xs'>
          {error}
        </span>
      ))}
    </div>
  );
}
