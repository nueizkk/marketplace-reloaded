import db from '@lib/db';
import { signIn } from '@lib/session';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';

interface UserProfile {
  id: number;
  avatar_url: string;
  login: string;
}

async function getAccessToken(code: string) {
  const formattedAccessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${formattedAccessTokenParams}`;
  const { access_token } = await (
    await fetch(accessTokenURL, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    })
  ).json();
  return access_token as undefined | string;
}

async function getUserProfile(access_token: string) {
  const { id, avatar_url, login } = await (
    await fetch(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-cache',
    })
  ).json();
  return { id, avatar_url, login } as UserProfile;
}

async function getUserEmail(access_token: string) {
  const userEmail = await (
    await fetch(`https://api.github.com/user/emails`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-cache',
    })
  ).json();
  return userEmail[0].email as string;
}

async function getUniqueUsername(login: string, id: number, attempt = 0) {
  const MAX_ATTEMPTS = 5;
  if (attempt >= MAX_ATTEMPTS) return null;

  const SALT_ROUNDS = 5;
  const hash = await bcrypt.hash(
    `${login}${id}${Date.now()}${Math.random()}`,
    SALT_ROUNDS
  );
  const shortHash = hash.slice(0, 15).padEnd(15, '0');
  const username = `gh-${shortHash}`;

  const user = await db.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (user) {
    return getUniqueUsername(login, id, attempt + 1);
  }
  return username;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return new Response(null, { status: 400 });
  }

  // code -> access_token
  const access_token = await getAccessToken(code);
  if (!access_token) return new Response(null, { status: 400 });

  // access_token -> user profile: { id, avatar_url, login }
  const { id, avatar_url, login } = await getUserProfile(access_token);
  // access_token -> user email
  const email = await getUserEmail(access_token);

  // query
  const user = await db.user.findUnique({
    where: { github_id: id + '' },
    select: { id: true },
  });
  if (user) {
    await signIn(user.id);
    return redirect('/profile');
  }
  const username = await getUniqueUsername(login, id);
  if (!username) return new Response(null, { status: 409 });
  const newUser = await db.user.create({
    data: {
      username,
      github_id: id + '',
      avatar: avatar_url,
      email,
    },
    select: { id: true },
  });
  await signIn(newUser.id);
  return redirect('/profile');
}
