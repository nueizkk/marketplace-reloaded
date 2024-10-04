import { UserIcon } from '@heroicons/react/24/solid';
import db from '@lib/db';
import { getSession } from '@lib/session';
import { formatToWon } from '@lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getIsOwner(userId: number): Promise<boolean> {
  const session = await getSession();
  return session?.id === userId;
}

async function getProduct(id: number) {
  return await db.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);
  return (
    <div>
      <div className='relative aspect-square'>
        <Image
          fill
          src={product.photo}
          alt={product.title}
          className='object-cover'
        />
      </div>
      <div className='p-5 flex items-center gap-3 border-b border-neutral-600'>
        <div className='size-10 rounded-full overflow-hidden'>
          {product.user.avatar ? (
            <Image
              width={40}
              height={40}
              src={product.user.avatar}
              alt={product.user.username}
              className='object-cover'
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className='p-5'>
        <h1 className='text-2xl font-semibold'>{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className='fixed bottom-0 app-w p-5 pb-10 bg-neutral-800 flex justify-between items-center'>
        <span className='font-semibold text-lg'>
          {formatToWon(product.price)}원
        </span>
        <span className='flex gap-2 items-center'>
          {isOwner ? (
            <Link
              href={``}
              className='primary-btn bg-red-500 w-fit px-5 py-2.5 font-semibold'
            >
              삭제하기
            </Link>
          ) : null}
          <Link
            className='primary-btn w-fit px-5 py-2.5 font-semibold'
            href={`/chat/id`}
          >
            채팅하기
          </Link>
        </span>
      </div>
    </div>
  );
}
