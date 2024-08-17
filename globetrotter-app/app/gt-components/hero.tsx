'use client'

import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { submitFormResponse } from '../actions'
import { useFormState, useFormStatus } from 'react-dom'
import { useToast } from "@/components/ui/use-toast"
import ParticleRing from './3dparticles'

export default function Hero() {

    const { toast } = useToast()
    
    const SubmitButton = () => {
    
        const status = useFormStatus()
    
        if (status.pending !== true) {
            return (
                <button
                className='w-full select-none rounded-md border border-input bg-background hover:bg-foreground hover:text-background transition hover:scale-[103%] transform px-3 py-2 text-sm' type="submit">
                    Submit
                </button>
            )
        }
    
        if (status.pending === true) {
            return (
            <>
             <button className='w-full select-none rounded-md border border-input bg-background hover:bg-foreground hover:text-background transition hover:scale-[103%] transform px-3 py-2 text-sm' type="submit" disabled>
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
        <div className="flex flex-col gap-4 w-full h-full place-items-center place-content-center">

    
            <h1 className="text-6xl uppercase font-bold select-none">Globetrotter AI</h1>
          <div className="w-1/2  flex flex-col gap-2 place-items-center">
            <p className='select-none'>Join the wait list</p>
            <form action={action} className=' w-full flex flex-col gap-2'>
                <Input  type='email' name='Email' autoFocus placeholder="Email" />
                <Input type='text' name='Name' placeholder="Name" />
                <SubmitButton />
            </form> 
          </div>
        </div>

        <div className='w-full h-full bg-gradient-to-b from-white via-white to-transparent top-0 left-0 absolute z-[-9]'></div>
        {/* <img className='w-full h-full absolute z-[-10]' src={sky.src} alt="" />      */}
        </>
    )
}