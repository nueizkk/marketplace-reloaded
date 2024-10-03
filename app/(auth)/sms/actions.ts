'use server';
import { type typeToFlattenedError, z } from 'zod';
import validator from 'validator';
import { redirect } from 'next/navigation';
import db from '@lib/db';
import crypto from 'crypto';
import { signIn } from '@lib/session';
import twilio from 'twilio';
import { getUniqueUsername } from '@lib/utils';

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, 'ko-KR'),
    '유효하지 않은 전화번호 형식입니다.'
  );

const tokenSchema = z.coerce.number().min(100000).max(999999);

async function createToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: { token },
    select: { id: true },
  });
  if (exists) {
    return createToken();
  }
  return token;
}

export async function smsLogin(
  prevState: {
    token: boolean;
    phone: string;
    error:
      | typeToFlattenedError<typeof phoneSchema>
      | typeToFlattenedError<typeof tokenSchema>
      | { formErrors: string[] }
      | undefined;
  },
  formData: FormData
) {
  const phone = formData.get('phone');
  const token = formData.get('token');

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        phone: '',
        error: result.error.flatten(),
      };
    } else {
      // delete previous token
      await db.sMSToken.deleteMany({ where: { user: { phone: result.data } } });
      // create token
      const token = await createToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: { phone: result.data },
              create: {
                username: await getUniqueUsername(result.data + token, 'sms'),
                phone: result.data,
              },
            },
          },
        },
      });
      // send the token using twilio
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        body: `[Blah Marketplace] ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.MY_PHONE_NUMBER!, // trial account
      });

      return { token: true, phone: result.data as string, error: undefined };
    }
  } else {
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        token: true,
        phone: prevState.phone as string,
        error: result.error.flatten(),
      };
    } else {
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data + '',
          user: { phone: prevState.phone },
        },
        select: {
          id: true,
          userId: true,
        },
      });
      if (!token) {
        return {
          token: true,
          phone: prevState.phone as string,
          error: { formErrors: ['인증번호가 일치하지 않습니다.'] },
        };
      }
      await signIn(token.userId);
      await db.sMSToken.delete({
        where: { id: token.id },
      });
      redirect('/profile');
    }
  }
}
