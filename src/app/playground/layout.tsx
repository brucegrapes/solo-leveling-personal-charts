import { redirect } from 'next/navigation';
import { isSystemDesigner } from '@/lib/auth-helpers';

export default async function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasAccess = await isSystemDesigner();

  if (!hasAccess) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
