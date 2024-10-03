'use client';
import ProductItem from './product-item';
import type { initialProducts } from '@/(tabs)/products/page';
import { getMoreProducts } from '@/(tabs)/products/actions';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useInfiniteScroll } from '@lib/hooks';

interface ProductListProps {
  initialProducts: initialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const { items, trigger, hasNext } = useInfiniteScroll(
    initialProducts,
    getMoreProducts
  );

  return (
    <div className='p-5 flex flex-col gap-5'>
      {items.map((item) => (
        <ProductItem key={item.id} {...item} />
      ))}
      {hasNext && (
        <div ref={trigger} className='flex justify-center'>
          <ArrowPathIcon width={24} height={24} className='animate-spin' />
        </div>
      )}
    </div>
  );
}
