import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface SessionContent {
  id?: number;
}

export function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: 'session',
    password: process.env.COOKIE_PASSWORD!,
  });
}

export async function signIn(id: SessionContent['id']) {
  const session = await getSession();
  session.id = id;
  await session.save();
}

export async function signOut() {
  const session = await getSession();
  session.destroy();
}
