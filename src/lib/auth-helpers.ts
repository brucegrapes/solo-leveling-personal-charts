import { auth } from '@/lib/auth';
import { UserRole } from '@/models/User';

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session.user;
}

export async function isSystemDesigner() {
  const session = await auth();
  if (!session?.user) {
    return false;
  }
  return session.user.role === UserRole.SYSTEM_DESIGNER;
}

export async function requireSystemDesigner() {
  const isDesigner = await isSystemDesigner();
  if (!isDesigner) {
    throw new Error('Unauthorized: System Designer role required');
  }
  return true;
}
