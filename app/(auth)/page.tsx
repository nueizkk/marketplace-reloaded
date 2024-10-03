import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-between min-h-screen'>
      <div className='my-auto *:font-medium flex flex-col items-center gap-2'>
        <Image src={`/neogul.png`} width={150} height={100} alt='welcome' />
        <h1 className='text-4xl'>Blah Marketplace</h1>
        <h2 className='text-2xl'>어서오세요!</h2>
      </div>
      <div className='flex flex-col items-center gap-3 w-full p-6'>
        <Link href='/create-account' className='primary-btn py-2.5 text-lg'>
          시작하기
        </Link>
        <div className='flex gap-2'>
          <span>이미 계정이 있나요?</span>
          <Link href='/login' className='hover:underline underline-offset-2'>
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
