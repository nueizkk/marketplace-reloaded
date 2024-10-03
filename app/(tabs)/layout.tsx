import TabBar from '@/components/tab-bar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <TabBar />
    </div>
  );
}
