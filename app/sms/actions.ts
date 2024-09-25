'use server';
import { type typeToFlattenedError, z } from 'zod';
import validator from 'validator';
import { redirect } from 'next/navigation';

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, 'ko-KR'),
    'Wrong phone format.'
  );
const tokenSchema = z.coerce.number().min(100000).max(999999);

interface StateType1 {
  token: boolean;
  error: typeToFlattenedError<string, string>;
}
interface StateType2 {
  token: boolean;
  error?: undefined;
}
interface StateType3 {
  token: boolean;
  error: typeToFlattenedError<number, string>;
}
type ActionState = StateType1 | StateType2 | StateType3;

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get('phone');
  const token = formData.get('token');

  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      return { token: true };
    }
  } else {
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      redirect('/');
    }
  }
}
