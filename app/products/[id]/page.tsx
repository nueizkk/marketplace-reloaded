import ProductDetail, { getCachedProduct } from '@/components/product-detail';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(+params.id);
  return {
    title: product?.title,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return <ProductDetail params={params} />;
}
