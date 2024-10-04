'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { ExclamationCircleIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { uploadProduct } from './actions';
import { useFormState } from 'react-dom';

export default function AddProduct() {
  const [preview, setPreview] = useState('');
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
  };
  const [state, action] = useFormState(uploadProduct, null);

  return (
    <div>
      <form action={action} className='p-5 flex flex-col gap-5'>
        <div>
          <label
            htmlFor='photo'
            className='border-2 border-neutral-300 border-dashed aspect-square flex flex-col justify-center items-center text-neutral-300 rounded-md cursor-pointer bg-center bg-cover'
            style={{ backgroundImage: `url(${preview})` }}
          >
            {!preview && (
              <>
                <PhotoIcon className='w-20' />
                <div className='text-neutral-400 text-sm'>
                  사진을 추가해주세요.
                </div>
              </>
            )}
          </label>
          {state?.fieldErrors.photo && (
            <span className='text-red-500 font-medium text-xs flex gap-1 mt-2'>
              <ExclamationCircleIcon width={14} height={14} />
              {state?.fieldErrors.photo}
            </span>
          )}
          <input
            onChange={onImageChange}
            id='photo'
            type='file'
            name='photo'
            className='hidden'
            accept='image/*'
          />
        </div>
        <Input
          name='title'
          placeholder='제목'
          type='text'
          errors={state?.fieldErrors.title}
        />
        <Input
          name='price'
          type='number'
          placeholder='가격'
          errors={state?.fieldErrors.price}
        />
        <Input
          name='description'
          type='text'
          placeholder='설명'
          errors={state?.fieldErrors.description}
        />
        <Button text='작성 완료' />
      </form>
    </div>
  );
}
