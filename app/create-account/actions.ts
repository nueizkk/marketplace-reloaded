'use server';

import { type typeToFlattenedError, z } from 'zod';
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '@lib/constants';
import db from '@lib/db';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { signIn } from '@lib/session';

const checkUsername = (username: string) => !username.startsWith('gh-');

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: '문자로 입력해주세요.',
        required_error: '이름을 입력해주세요.',
      })
      .trim()
      .toLowerCase()
      .refine(checkUsername, `이름은 'gh-'으로 시작할 수 없습니다.`),
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
    confirm_password: z
      .string({
        required_error: '비밀번호를 한 번 더 입력해주세요.',
      })
      .min(PASSWORD_MIN_LENGTH, `${PASSWORD_MIN_LENGTH}자 이상 입력해주세요.`)
      .trim()
      .regex(
        PASSWORD_REGEX,
        '비밀번호는 소문자, 대문자, 숫자, 특수문자(#?!@$%^&*-)를 포함해야 합니다.'
      ),
  })
  .refine(checkPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirm_password'],
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (user) {
      ctx.addIssue({
        code: 'custom',
        message: '이미 등록된 이름입니다.',
        path: ['username'],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (user) {
      ctx.addIssue({
        code: 'custom',
        message: '이미 등록된 이메일입니다.',
        path: ['email'],
        fatal: true,
      });
      return z.NEVER;
    }
  });

export async function createAccount(
  prevState:
    | undefined
    | null
    | typeToFlattenedError<{
        username: string;
        email: string;
        password: string;
        confirm_password: string;
      }>,
  formData: FormData
) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    // hash password: npm i bcrypt @types/bcrypt
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    console.log(hashedPassword);

    // save the user to db
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: { id: true },
    });

    // log the user in: npm i iron-session (암호화, 복호화)
    await signIn(user.id);
    redirect('/profile');
  }
}
