'use client';
import CloseButton from './close-button';
// import { useEffect } from 'react';

export default function ModalContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  // useEffect(() => {
  //   document.body.classList.add('overflow-hidden');
  //   return () => {
  //     document.body.classList.remove('overflow-hidden');
  //   };
  // }, []);
  return (
    <div className='z-50 fixed left-0 top-0 w-full h-full backdrop-blur-sm backdrop-brightness-50 flex justify-center items-center'>
      <CloseButton />
      <div className='app-w bg-neutral-900 rounded-md max-h-[90%] overflow-y-scroll shadow-sm border border-neutral-800'>
        {children}
      </div>
    </div>
  );
}
