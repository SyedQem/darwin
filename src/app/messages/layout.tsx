import ScrollToTopOnNavigate from '@/components/ScrollToTopOnNavigate';

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTopOnNavigate />
      {children}
    </>
  );
}
