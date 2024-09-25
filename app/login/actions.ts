'use server';

export async function handleForm(
  prevState: null | { errors: string[] },
  formData: FormData
) {
  console.log('formdata', formData, 'prevstate', prevState);
  return { errors: ['wrong password'] };
}
