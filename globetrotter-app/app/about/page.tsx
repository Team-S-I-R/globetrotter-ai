'use client'

import Header from "../gt-components/header"
import { motion } from "framer-motion"
export default function About() {
    return (
        <>
        <div className="absolute top-0 w-full">
        <Header/>
        </div>
        <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.3 }}
        className="select-none w-full p-4 text-center h-screen gap-4 flex flex-col place-items-center place-content-center">
            <h1 className="text-3xl font-bold">About Us</h1>
            <p>We are a passionate team dedicated to creating the best software solutions for all people, from students to professionals. This project started development in mid-August 2024.</p>
            <p>We are thrilled to share that we've entered this project into a hackathon with Headstarter! Wish us luck :D</p>
            <div className="flex flex-col place-content-center place-items-center w-md gap-4">
                <div className="w-max flex gap-4">
                    <h2>Shaurya Bisht</h2>
                    {/* <p>Position Here</p>
                    <p>Shaurya!</p> */}
                </div>
                <div className="w-max flex gap-4">
                    <h2>Itwela Ibomu</h2>
                    {/* <p>Position Here</p>
                    <p>Itwela!</p> */}
                </div>
                <div className="w-max flex gap-4">
                    <h2>Rehan Mohideen</h2>
                    {/* <p>Position Here</p>
                    <p>Rehan!</p> */}
                </div>
                <div>or</div>
                <div className="font-bold hover:underline">
                    <a href="https://github.com/Team-S-I-R">
                    Team S.I.R!
                    </a>
                </div>
            </div>
        </motion.div>
        </>
    )
}