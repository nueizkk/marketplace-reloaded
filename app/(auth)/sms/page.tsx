'use client';
import Input from '@/components/input';
import Button from '@/components/button';
import { useFormState } from 'react-dom';
import { smsLogin } from './actions';

const initialState = {
  token: false,
  phone: '',
  error: undefined,
};

export default function SMSLogin() {
  const [state, action] = useFormState(smsLogin, initialState);
  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>SMS Login</h1>
        <h2 className='text-xl'>Verify your phone number.</h2>
      </div>
      <form action={action} className='flex flex-col gap-3'>
        {state?.token ? (
          <Input
            key='token'
            name='token'
            type='number'
            inputMode='numeric'
            placeholder='Verification code'
            required
            errors={state?.error?.formErrors}
          />
        ) : (
          <Input
            key='phone'
            name='phone'
            type='tel'
            inputMode='numeric'
            placeholder='Phone number'
            required
            errors={state?.error?.formErrors}
          />
        )}

        <Button
          text={state?.token ? 'Verify Token' : 'Send Verification SMS'}
        />
      </form>
    </div>
  );
}
