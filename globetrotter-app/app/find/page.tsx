"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { useRecordVoice } from "@/hooks/recordVoice";
import { useEffect, useState } from "react";
import Header from "../gt-components/header";
import { motion, useAnimate, stagger } from "framer-motion";
import staticgif from '../assets/static.gif'
import axios from 'axios';
import { Canvas, useLoader } from '@react-three/fiber';
import PlaneModel from "../gt-components/3dstuff/plane";
import { useToast } from "@/components/ui/use-toast";
// import { audioInputStreamTransform, recorder, sampleRateHertz, startStream } from "./recorder";
import quote from '../assets/quote.png'


export default function FindPage() {
  const [transcript, setTranscript] = useState("");
  const { startRecording, stopRecording, text, recording } = useRecordVoice();
  const [audio, setAudio] = useState("");
  const [conversationText, setConversationText] = useState("");
  const [details, setDetails] = useState<Array<{parameter: string; value: string}>>([
  ]);
  const { toast } = useToast()
  const [scope, animate] = useAnimate();

  // this should make the ai talk and it should say the responsetext
  const handleClick = async (msg: String) => {
    try {
      const response = await fetch(`./api/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: msg
        }),
      }).then((res) => res.json());

      setAudio(`data:audio/mp3;base64,${response.audio}`);
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchTravelData = async () => {
  //   try {
  //     const response = await axios.post('http://127.0.0.1:5000/travel', {
  //       user_input: 'Your user input here'
  //     }, {
  //       withCredentials: true // Ensure cookies are sent with the request
  //     });
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error('Error fetching travel data:', error);
  //   }
  // };
  
  // fetchTravelData();

  const pythonMessage = async () => {

    // if (text === "") {
    //   console.error("No text provided for processing.");
    //   toast({ title: '❌ Error, Please Try Again!', description: 'Please press the start button to start a conversation.', itemID: 'error' });
    //   return;
    // }

    try {
      const response = await fetch(`http://127.0.0.1:5000/travel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_input: text
        }),
      });

      const data = await response.json();

      console.log(data);
      setConversationText(data.responseText);
      setDetails(data.details); // Assuming the response contains a 'details' field
      toast({ title: '✅ Success!', description: conversationText, itemID: 'success' });
    } catch (error) {
      console.log(error);
      toast({ title: '❌ Error!', description: 'There was an error processing your request. Please press the start button to start a conversation.', itemID: 'error' });
    }
  }

  return (
    <>
    <div className="absolute top-0 left-0">
        <Header/>  
    </div>

    <div className="opacity-30 w-full h-full absolute flex place-items-center place-content-center z-[1]">
      <div className="w-[2px] h-full bg-black"></div>
    </div>

    <div className="w-screen h-screen py-[40px]">
      
      <div className="w-full h-full flex flex-col justify-between mx-auto p-4">
      


        {/* beautiful content will go here */}
        <div className="w-full relative h-screen flex flex-col place-items-center place-content-start py-8">
          
          

            <div  className="w-full h-full grid gap-1 grid-cols-2 place-items-center  px-4 justify-between no-scrollbar overflow-y-scroll">
            
                <div className="flex flex-col w-full">
                <motion.p 
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 1.5 } }}
                className="select-none w-full">
                  {conversationText}
                </motion.p>
              
              
              {details?.length > 0 && (

                <>

                <motion.div
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 1.5, staggerChildren: 0.2 } }}                    
                className="flex flex-col w-full m-[1px] p-2 outline outline-[2px]">
                  <img className="w-[20px]" src={quote.src} alt="" />
                </motion.div>


                <motion.div 
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 1.5, staggerChildren: 0.2 } }}          
                className="flex flex-col w-full m-[1px] p-2 outline outline-[2px]">
                  {/* {details?.filter(detail => detail.value).slice(0, 4).map((detail, index) => ( */}
                  {details?.map((detail, index) => ( 
                    <div key={index} className="detail select-none w-full p-2 text-black">
                      <p className="select-none text-lg text-left"><span className="font-bold">{detail.parameter}</span>: {detail.value}</p>
                    </div>
                  ))}
                </motion.div>
                  
                  </>
              )}

                </div>


                <div className="flex flex-col w-full">
                </div>

            </div>


            {/* <img className="w-full h-full absolute opacity-80 top-0 left-0 z-[-1]" src={staticgif.src}></img> */}
            {/* <div className="w-full h-full absolute bg-black opacity-70 top-0 left-0 z-[-1]"></div> */}
        </div>

        <motion.div 
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0, transition: { duration: 2.5 } }}
        className="absolute top-0 left-0 w-full h-full z-[1]">
            <PlaneModel />
        </motion.div>

        

        <motion.div 
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1.5 } }}
        className="select-none w-full h-max flex relative z-10 flex-col place-items-center gap-2">
          <Card className="w-full bg-transparent border-none outline-none h-max flex flex-col place-items-center place-content-center">
            <CardHeader>
              {recording === true && <CardTitle>Recording...</CardTitle>}
              {recording === false && <CardTitle><span className="text-orange-500 font-bold">Press Start</span></CardTitle>}
            </CardHeader>
            <CardContent className="flex gap-4">
              {/* <Button onClick={() => handleClick(text)}>translate!</Button> */}
              {recording === true && (
                <>
                <Button className="bg-red-600 animate-pulse" onClick={startRecording}>Start!</Button>
                </>
              )}

              {recording === false && (
                <>
               <Button className="hover:scale-[110%] hover:bg-orange-500" onClick={startRecording}>Start!</Button>
                </>
              )}

              <Button className="hover:scale-[110%]" onClick={() => {
                stopRecording(); 
                pythonMessage();
              }}>Stop!</Button>

              {/* <Button onClick={pythonMessage}>test</Button> */}
              {/* {audio && <audio src={audio} controls />} */}
            </CardContent>
            {/* <p>debug: {text}</p> */}
          </Card>
          {/* <p>{text}</p> */}
        </motion.div>

      </div>
      
    </div> 
     
    </>
  );
}


// user talks about japan
// use gemini to get one word response

// every 5 seconds, call the pexals api 
// images[0]
// images[1]

// call the function for pexals every 10 seconds
// every 10 seconds we increease the []