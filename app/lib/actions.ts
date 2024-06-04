'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function getAvailableRoots(
  root1?: string | null,
  root2?: string | null,
  root3?: string | null,
) {
  if (!root1) {
    return [
      { id: 1, value: 'alef', text: '\u05d0' },
      { id: 2, value: 'bet', text: '\u05d1' },
      { id: 3, value: 'gimel', text: '\u05d2' },
      { id: 4, value: 'dalet', text: '\u05d3' },
      { id: 5, value: 'he', text: '\u05d4' },
      { id: 6, value: 'vav', text: '\u05d5' },
      { id: 7, value: 'zayin', text: '\u05d6' },
      { id: 8, value: 'het', text: '\u05d7' },
      { id: 9, value: 'tet', text: '\u05d8' },
      { id: 10, value: 'yost', text: '\u05d9' },
    ];
  }
  if (!root2) {
    if (root1 === 'alef') {
      return [
        { id: 1, value: 'alef', text: '\u05d0' },
        { id: 2, value: 'bet', text: '\u05d1' },
        { id: 3, value: 'gimel', text: '\u05d2' },
        { id: 4, value: 'dalet', text: '\u05d3' },
        { id: 5, value: 'he', text: '\u05d4' },
      ];
    }
  } else if (root1 === 'bet') {
    return [
      { id: 5, value: 'he', text: '\u05d4' },
      { id: 6, value: 'vav', text: '\u05d5' },
      { id: 7, value: 'zayin', text: '\u05d6' },
      { id: 8, value: 'het', text: '\u05d7' },
      { id: 9, value: 'tet', text: '\u05d8' },
    ];
  } else {
    return [];
  }
  if (!root3) {
    if (root2 === 'alef') {
      return [
        { id: 7, value: 'zayin', text: '\u05d6' },
        { id: 8, value: 'het', text: '\u05d7' },
        { id: 9, value: 'tet', text: '\u05d8' },
      ];
    } else if (root2 === 'he') {
      [
        { id: 2, value: 'bet', text: '\u05d1' },
        { id: 3, value: 'gimel', text: '\u05d2' },
        { id: 4, value: 'dalet', text: '\u05d3' },
      ];
    } else {
      return [];
    }
  }
  return [];
}
