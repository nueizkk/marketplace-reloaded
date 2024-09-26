'use server';
import { type typeToFlattenedError, z } from 'zod';
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '@lib/constants';
import db from '@lib/db';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import getSession from '@lib/session';

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string({
      invalid_type_error: '문자로 입력해주세요.',
      required_error: '이메일을 입력해주세요.',
    })
    .email('이메일 형식이 올바르지 않습니다.')
    .toLowerCase(),
  password: z
    .string({
      required_error: '비밀번호를 입력해주세요.',
    })
    .min(PASSWORD_MIN_LENGTH, `${PASSWORD_MIN_LENGTH}자 이상 입력해주세요.`)
    .trim()
    .regex(
      PASSWORD_REGEX,
      '비밀번호는 소문자, 대문자, 숫자, 특수문자(#?!@$%^&*-)를 포함해야 합니다.'
    ),
});

const formSchema2 = z.object({
  email: z.string().refine(checkEmailExists, '등록되지 않은 이메일입니다.'),
  password: z.string(),
});

export async function login(
  prevState:
    | undefined
    | null
    | typeToFlattenedError<{ email: string; password: string }>
    | {
        fieldErrors: {
          email: string[];
          password: string[];
        };
      },
  formData: FormData
) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const result = await formSchema.spa(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // check if the email exists
    const result2 = await formSchema2.spa(result.data);
    if (!result2.success) {
      return result2.error.flatten();
    } else {
      // // check if the email matches the password
      const user = await db.user.findUnique({
        where: { email: result2.data.email },
        select: { id: true, password: true },
      });

      const ok = await bcrypt.compare(
        result2.data.password,
        user!.password ?? ''
      );

      if (!ok) {
        return {
          fieldErrors: {
            email: [],
            password: ['이메일과 비밀번호가 일치하지 않습니다.'],
          },
        };
      } else {
        const session = await getSession();
        session.id = user!.id;
        session.save();

        redirect('/profile');
      }
    }
  }
}
