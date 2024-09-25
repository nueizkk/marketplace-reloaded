'use client';

import Input from '@/components/input';
import Button from '@/components/button';
import SocialLogin from '@/components/social-login';
import { useFormState } from 'react-dom';
import { login } from './actions';

export default function Login() {
  const [state, action] = useFormState(login, null);

  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>안녕하세요!</h1>
        <h2 className='text-xl'>Log in with email and password.</h2>
      </div>
      <form action={action} className='flex flex-col gap-3'>
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
          errors={state?.fieldErrors.password}
        />
        <Button text='Log in' />
      </form>
      <SocialLogin />
    </div>
  );
}
