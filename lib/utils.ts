import crypto from 'crypto';
import db from './db';

export async function getUniqueUsername(
  userInfo: string,
  authType: 'sms' | 'gh'
) {
  const hash = crypto
    .createHash('sha256')
    .update(`${userInfo}${Date.now()}${Math.random()}`)
    .digest('hex');
  const shortHash = hash.slice(0, 15).padEnd(15, '0');
  const username = `${authType}-${shortHash}`;

  const user = await db.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (user) {
    return getUniqueUsername(userInfo, authType);
  }
  return username;
}

export function formatToWon(price: number): string {
  return price.toLocaleString('ko-KR');
}

export function formatToTimeAgo(date: string): string {
  const DAY_IN_MS = 1000 * 60 * 60 * 24;

  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / DAY_IN_MS);

  const formatter = new Intl.RelativeTimeFormat('ko');

  return formatter.format(diff, 'day');
}
