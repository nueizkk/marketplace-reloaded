export default async function Modal({ params }: { params: { id: string } }) {
  return <div>모달 {params.id}</div>;
}
