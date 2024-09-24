import FormInput from '@/components/form-input';
import FormButton from '@/components/form-btn';
import SocialLogin from '@/components/social-login';

export default function CreateAccount() {
  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>안녕하세요!</h1>
        <h2 className='text-xl'>Fill in the form below to join!</h2>
      </div>
      <form className='flex flex-col gap-3'>
        <FormInput
          type='text'
          name='username'
          placeholder='Username'
          required
          errors={[]}
        />
        <FormInput
          type='email'
          name='email'
          placeholder='Email'
          required
          errors={[]}
        />
        <FormInput
          type='password'
          name='password'
          placeholder='Password'
          required
          errors={[]}
        />
        <FormInput
          type='password'
          name='confirm-password'
          placeholder='Confirm Password'
          required
          errors={[]}
        />
        <FormButton text='Create account' />
      </form>
      <SocialLogin />
    </div>
  );
}
