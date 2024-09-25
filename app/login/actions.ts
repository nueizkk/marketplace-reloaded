'use server';
import { type typeToFlattenedError, z } from 'zod';
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '@lib/constants';

const formSchema = z.object({
  email: z
    .string({
      invalid_type_error: '문자로 입력해주세요.',
      required_error: '이메일을 입력해주세요.',
    })
    .email()
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

export async function login(
  prevState:
    | undefined
    | null
    | typeToFlattenedError<{ email: string; password: string }>,
  formData: FormData
) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
