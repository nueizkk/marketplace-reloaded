import ProductList from '@/components/product-list';
import { PAGE_SIZE, REVALIDATE_TIME } from '@lib/constants';
import db from '@lib/db';
import { Prisma } from '@prisma/client';
import { PlusIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { unstable_cache as nextCache } from 'next/cache';

export const metadata = {
  title: 'Products',
};

export const dynamic = 'force-dynamic';

async function getInitialProducts() {
  return await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: PAGE_SIZE,
    orderBy: {
      created_at: 'desc',
    },
  });
}

const getCachedProducts = nextCache(getInitialProducts, ['products-list'], {
  revalidate: REVALIDATE_TIME,
  tags: ['products-list'],
});

export type initialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function Products() {
  const initialProducts = await getCachedProducts();
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <div className='fixed left-auto bottom-28 app-w flex justify-end pointer-events-none'>
        <Link
          href={`/products/add`}
          className='primary-btn size-14 rounded-full flex justify-center items-center pointer-events-auto'
        >
          <PlusIcon className='size-10' />
        </Link>
      </div>
    </div>
  );
}
