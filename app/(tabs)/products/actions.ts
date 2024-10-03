'use server';
import { PAGE_SIZE } from '@lib/constants';
import db from '@lib/db';

export async function getMoreProducts(page: number) {
  return await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy: {
      created_at: 'desc',
    },
  });
}
