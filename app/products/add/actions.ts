'use server';
import { type typeToFlattenedError, z } from 'zod';
import fs from 'fs/promises';
import db from '@lib/db';
import { getSession } from '@lib/session';
import { redirect } from 'next/navigation';
import { File } from 'buffer';
import { revalidatePath } from 'next/cache';

const productSchema = z.object({
  photo: z
    .string({ required_error: '이미지를 입력해주세요.' })
    .min(1, '이미지를 입력해주세요.'),
  title: z
    .string({ required_error: '제목을 입력해주세요.' })
    .min(1, '제목을 입력해주세요.'),
  description: z
    .string({ required_error: '설명을 입력해주세요.' })
    .min(1, '설명을 입력해주세요.'),
  price: z.coerce
    .number({ required_error: '가격을 입력해주세요.' })
    .min(1, '가격을 입력해주세요.'),
});

export async function uploadProduct(
  _prevState: null | undefined | typeToFlattenedError<typeof productSchema>,
  formData: FormData
) {
  const data = {
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
  };

  if (data.photo instanceof File && data.photo.size > 0) {
    const photoData = await data.photo.arrayBuffer();
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    data.photo = `/${data.photo.name}`;
  } else {
    data.photo = '';
  }

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          photo: result.data.photo,
          price: result.data.price,
          title: result.data.title,
          description: result.data.description,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: { id: true },
      });
      revalidatePath('/products');
      redirect(`/products/${product.id}`);
    }
  }
}
