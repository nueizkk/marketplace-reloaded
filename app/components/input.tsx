import type { InputHTMLAttributes } from 'react';

interface InputProps {
  name: string;
  errors?: string[];
}

export default function Input({
  name,
  errors = [],
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className='flex flex-col gap-2'>
      <input
        className='transition bg-transparent rounded-md w-full h-10 border-none ring-2 ring-neutral-100 focus:outline-none focus:ring-4 focus:ring-emerald-500 placeholder:text-neutral-400'
        name={name}
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className='text-red-500 font-medium text-xs'>
          {error}
        </span>
      ))}
    </div>
  );
}
