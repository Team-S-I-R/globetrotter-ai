'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import  prisma  from '@/lib/db';

const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 10);
  };
  
  const createFormSchema = z.object({
    name: z.string().min(1).max(191),
    email: z.string().email(),
  });
  
  type FormState = {
    message: string;
  };
  
  export async function submitFormResponse(formData: FormData, formState: FormState) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    console.log('starting form submission...');
    const globetrotter_id = generateRandomId();
    const globetrotter_name = formData.get("Name") as string;
    const globetrotter_email = formData.get("Email") as string;
  
    // Validate and parse the form data
    const { name, email } = createFormSchema.parse({
      name: globetrotter_name,
      email: globetrotter_email,
    });
  
    try {

    console.log('Form submitting......');
      await prisma.user.create({
        data: {
          id: globetrotter_id,
          name: globetrotter_name,
          email: globetrotter_email,
        },
      });
  
      revalidatePath('/');
  
      return {
        message: 'Message created',
      };
  
    } catch (error) {
      // Handle the error
      return {
        message: 'Something went wrong',
      };
    }
  }
  