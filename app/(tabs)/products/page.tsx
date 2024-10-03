import ProductList from '@/components/product-list';
import { PAGE_SIZE } from '@lib/constants';
import db from '@lib/db';
import { Prisma } from '@prisma/client';

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

export type initialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function Products() {
  const initialProducts = await getInitialProducts();

  return <ProductList initialProducts={initialProducts} />;
}
