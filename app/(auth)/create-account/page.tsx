'use client';

import Input from '@/components/input';
import Button from '@/components/button';
import SocialLogin from '@/components/social-login';
import { useFormState } from 'react-dom';
import { createAccount } from './actions';
import { PASSWORD_MIN_LENGTH } from '@lib/constants';

export default function CreateAccount() {
  const [state, action] = useFormState(createAccount, null);

  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>안녕하세요!</h1>
        <h2 className='text-xl'>Fill in the form below to join!</h2>
      </div>
      <form action={action} className='flex flex-col gap-3'>
        <Input
          type='text'
          name='username'
          placeholder='Username'
          required
          errors={state?.fieldErrors.username}
        />
        <Input
          type='email'
          name='email'
          placeholder='Email'
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          type='password'
          name='password'
          placeholder='Password'
          required
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.password}
        />
        <Input
          type='password'
          name='confirm_password'
          placeholder='Confirm Password'
          required
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.confirm_password}
        />
        <Button text='Create account' />
      </form>
      <SocialLogin />
    </div>
  );
}
