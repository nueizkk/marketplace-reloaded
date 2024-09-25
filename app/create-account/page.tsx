'use client';
import FormInput from '@/components/form-input';
import FormButton from '@/components/form-btn';
import SocialLogin from '@/components/social-login';
import { useFormState } from 'react-dom';
import { createAccount } from './actions';

export default function CreateAccount() {
  const [state, action] = useFormState(createAccount, null);

  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>안녕하세요!</h1>
        <h2 className='text-xl'>Fill in the form below to join!</h2>
      </div>
      <form action={action} className='flex flex-col gap-3'>
        <FormInput
          type='text'
          name='username'
          placeholder='Username'
          required
          errors={state?.fieldErrors.username}
        />
        <FormInput
          type='email'
          name='email'
          placeholder='Email'
          required
          errors={state?.fieldErrors.email}
        />
        <FormInput
          type='password'
          name='password'
          placeholder='Password'
          required
          errors={state?.fieldErrors.password}
        />
        <FormInput
          type='password'
          name='confirm_password'
          placeholder='Confirm Password'
          required
          errors={state?.fieldErrors.confirm_password}
        />
        <FormButton text='Create account' />
      </form>
      <SocialLogin />
    </div>
  );
}
