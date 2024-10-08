import { PageProps } from '.next/types/app/layout';
import ModalContainer from '@/components/modal-container';
import ProductDetail from '@/components/product-detail';

export default function Modal({ params }: PageProps) {
  return (
    <ModalContainer>
      <ProductDetail params={params} isModal />
    </ModalContainer>
  );
}
