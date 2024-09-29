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
