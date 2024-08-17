'use client'

import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { submitFormResponse } from '../actions'
import { useFormState, useFormStatus } from 'react-dom'
import { useToast } from "@/components/ui/use-toast"


export default function Hero() {

    const { toast } = useToast()
    
    const SubmitButton = () => {
    
        const status = useFormStatus()
    
        if (status.pending !== true) {
            return (
                <button
                className='w-full rounded-md border border-input bg-background hover:bg-foreground hover:text-background transition hover:scale-[103%] transform px-3 py-2 text-sm' type="submit">
                    Submit
                </button>
            )
        }
    
        if (status.pending === true) {
            return (
            <>
             <button className='w-full rounded-md border border-input bg-background hover:bg-foreground hover:text-background transition hover:scale-[103%] transform px-3 py-2 text-sm' type="submit" disabled>
                Submitting...
            </button>
            </>
            )
        }
    
    }
    
    type FormState = {
        message: string;
    };
    
    
    const formAction = async (prevState: FormState, formData: FormData): Promise<FormState> => {
        await submitFormResponse(formData, formState);
        console.log('Form submitted successfully!');
        toast({ title: '✅ Thanks for your Interest!', description: 'You have been added to the waitlist.', itemID: 'success' });
        return { message: 'Submission successful!' };
    };
    
    const [formState, action] = useFormState(formAction, {
        message: '',
    });

    return (
        <>
        <div className="flex flex-col gap-4 w-max">
          <h1 className="text-6xl">Globetrotter AI</h1>
          <div className="w-full flex flex-col gap-2 place-items-center">
            <p>Join the wait list</p>
            <form action={action} className=' w-full flex flex-col gap-2'>
                <Input type='email' name='Email' autoFocus placeholder="Email" />
                <Input type='text' name='Name' placeholder="Name" />
                <SubmitButton />
            </form> 
          </div>
        </div>
        </>
    )
}