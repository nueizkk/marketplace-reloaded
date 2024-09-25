'use server';

import { typeToFlattenedError, z } from 'zod';

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);

// const usernameSchema = z.string().min(2).max(15);
const checkUsername = (username: string) => !username.startsWith('admin');
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
      .min(2, '2자 이상을 입력해주세요.')
      .max(10, '10자 이하로 입력해주세요.')
      .trim()
      .toLowerCase()
      .refine(checkUsername, '이름은 admin으로 시작할 수 없습니다.'),
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
      .min(8, '8자 이상 입력해주세요.')
      .trim()
      .regex(
        passwordRegex,
        '비밀번호는 소문자, 대문자, 숫자, 특수문자(#?!@$%^&*-)를 포함해야 합니다.'
      ),
    confirm_password: z
      .string({
        required_error: '비밀번호를 한 번 더 입력해주세요.',
      })
      .min(8, '8자 이상 입력해주세요.')
      .trim()
      .regex(
        passwordRegex,
        '비밀번호는 소문자, 대문자, 숫자, 특수문자(#?!@$%^&*-)를 포함해야 합니다.'
      ),
  })
  .refine(checkPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirm_password'],
  });

export async function createAccount(
  prevState:
    | undefined
    | null
    | typeToFlattenedError<
        {
          username: string;
          email: string;
          password: string;
          confirm_password: string;
        },
        string
      >,
  formData: FormData
) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  };
  //   usernameSchema.parse(data.username);
  //   try {
  //     formSchema.parse(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log('result', result);
    console.log(result.data);
  }
}
