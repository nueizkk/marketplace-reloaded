import FormInput from '@/components/form-input';
import FormButton from '@/components/form-btn';

export default function SMSLogin() {
  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>SMS Login</h1>
        <h2 className='text-xl'>Verify your phone number.</h2>
      </div>
      <form className='flex flex-col gap-3'>
        <FormInput
          type='number'
          placeholder='Phone number'
          required
          errors={[]}
        />
        <FormInput
          type='number'
          placeholder='Verification code'
          required
          errors={[]}
        />
        <FormButton loading={false} text='Verify' />
      </form>
    </div>
  );
}
