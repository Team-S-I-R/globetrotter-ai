'use client'

import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { submitFormResponse } from '../actions'
import { useFormState, useFormStatus } from 'react-dom'
import { useToast } from "@/components/ui/use-toast"
import ParticleRing from './3dparticles'
import EarthModel from './3dstuff/earth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

export default function Hero() {

    const { toast } = useToast()
    const router = useRouter()
    
    const SubmitButton = () => {
    
        const status = useFormStatus()
    
        if (status.pending !== true) {
            return (
                <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.9 }}
                className='w-full select-none rounded-md border border-input bg-background hover:bg-foreground hover:text-background transition hover:scale-[103%] transform px-3 py-2 text-sm' type="submit">
                    Submit
                </motion.button>
            )
        }
    
        if (status.pending === true) {
            return (
            <>
             <motion.button className='w-full select-none rounded-md border border-input bg-background hover:bg-foreground hover:text-background transition hover:scale-[103%] transform px-3 py-2 text-sm' type="submit" disabled>
                Submitting...
            </motion.button>
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

    const [pw, setPw] = useState('');

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPw(event.target.value);
    };

    if (pw === 'teamsir') {
        router.push('/find')
    }

    return (
        <>
        <motion.div className="flex flex-col gap-4 w-full h-full place-items-center place-content-center">
            
            <motion.h2
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 1.5}}
            className='bg-white p-1 px-2 rounded-lg'
            >
                Travel the world one conversation at a time
            </motion.h2>

            <motion.h1 
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 1.5}}
            className="text-6xl uppercase font-bold select-none">Globetrotter AI</motion.h1>
            
            <motion.div className="w-1/2  flex flex-col gap-2 place-items-center">
                <motion.form 
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 1.7}}
                action={action} className=' w-full flex flex-col gap-2'>
                    <Input  type='email' name='Email' autoFocus placeholder="Email" />
                    <Input type='text' name='Name' placeholder="Name" />
                    <SubmitButton />
                </motion.form> 
                <motion.p 
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 2.4}}
                className='p-2 select-none'>Join the wait list!</motion.p>
            </motion.div>

            <motion.div className='w-full h-screen top-0 left-0 absolute z-[-1] bg-gradient-to-b from-white to-transparent'>

            </motion.div>
            <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className='w-full h-screen top-0 left-0 absolute z-[-2]'>
                <EarthModel />
            </motion.div>
  
        <motion.div className='w-max place-items-center gap-2 flex flex-col h-max bottom-10 right-10 absolute z-[10]'>
            <div className='scale-[250%] select-none'>
                <p className="font-bold scale-150 animate-bounce">👀</p>
            </div>
            <div className='flex gap-2 place-items-center'>
                <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>                
                        <span className='cursor-pointer text-muted-foreground'>Hint</span>
                    </TooltipTrigger>
                    <TooltipContent>
                    <span>you should try:
                        teamsir
                    </span>
                    </TooltipContent>
                </Tooltip>
                </TooltipProvider>
                <Input name='Password' onChange={handleInput} placeholder='Enter Password' className='w-[200px] h-max p-2'></Input>
            </div>
        </motion.div>
  
        </motion.div>

        <motion.div className='w-full h-full bg-gradient-to-b from-white via-white to-transparent top-0 left-0 absolute z-[-9]'></motion.div>
        
        {/* <img className='w-full h-full absolute z-[-10]' src={sky.src} alt="" />      */}
        </>
    )
}