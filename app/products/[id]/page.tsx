import ProductDetail from '@/components/product-detail';

export default async function ProductDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return <ProductDetail params={params} />;
}
