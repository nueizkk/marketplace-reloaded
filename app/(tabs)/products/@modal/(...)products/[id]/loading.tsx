import ModalContainer from '@/components/modal-container';
import ProductDetailLoading from '@/products/[id]/loading';

export default function Loading() {
  return (
    <ModalContainer>
      <ProductDetailLoading />
    </ModalContainer>
  );
}
