"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { useRecordVoice } from "@/hooks/recordVoice";
import { useState } from "react";
import Header from "../gt-components/header";
import { motion } from "framer-motion";
import staticgif from '../assets/static.gif'
import axios from 'axios';
import { Canvas, useLoader } from '@react-three/fiber';
import PlaneModel from "../gt-components/3dstuff/plane";
import { useToast } from "@/components/ui/use-toast";
// import { audioInputStreamTransform, recorder, sampleRateHertz, startStream } from "./recorder";



export default function FindPage() {
  const [transcript, setTranscript] = useState("");
  const { startRecording, stopRecording, text, recording } = useRecordVoice();
  const [audio, setAudio] = useState("");
  const [conversationText, setConversationText] = useState("");
  const [details, setDetails] = useState<Array<{parameter: string; value: string}>>([]);
  // const [text, setText] = useState("");
  const { toast } = useToast()
  const dummytext = "Hi my name is T, I am looking to go to depart from Atlanta soon to Arrive in Japan and I don't know what food to eat.";
  // const dummytext = "So im looking to travel from January the first of 2025 to january the 7th of 2025. I want to go with my mother.";
  // const dummytext = "I would actually be more interested in Tokyo or Kyoto!"

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
    stopRecording();
    
    if (text === "") {
      console.error("No text provided for processing.");
      toast({ title: '❌ Error, Please Try Again!', description: 'Please press the start button to start a conversation.', itemID: 'error' });
      return;
    }

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
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
    <div className="absolute top-0 left-0">
        <Header/>  
    </div>

    <div className="w-screen h-screen py-[80px]">
      
      <div className="w-full h-full flex flex-col justify-between mx-auto p-4">
      
        {/* beautiful content will go here */}
        <div className="w-full relative overflow-hidden h-[70%] flex flex-col place-items-center place-content-start py-8">
          
          <div className="w-full h-full flex flex-col place-items-start no-scrollbar overflow-y-scroll">
          <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1.5 } }}
          className="select-none w-[70%]">
            {conversationText}
          </motion.p>
          <div className="flex flex-col">
            {details?.filter(detail => detail.value).slice(0, 4).map((detail, index) => (
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1.5 } }}
            className="select-none w-max p-2 bg-white text-black"
            >
              <p className="select-none" key={index}><span className="font-bold">{detail.parameter}</span>: {detail.value}</p>
            </motion.div>
            ))}
          </div>
          </div>


          {/* <img className="w-full h-full absolute opacity-80 top-0 left-0 z-[-1]" src={staticgif.src}></img> */}
          {/* <div className="w-full h-full absolute bg-black opacity-70 top-0 left-0 z-[-1]"></div> */}
        </div>

        <div className="absolute top-0 left-0 w-full h-full z-[-1]">
            <PlaneModel />
        </div>

        <div className="w-full h-max flex flex-col place-items-center gap-2">
          <Card className="w-full border-none outline-none h-max flex flex-col place-items-center place-content-center">
            <CardHeader>
              {recording === true && <CardTitle>Recording</CardTitle>}
              {recording === false && <CardTitle>Press Start</CardTitle>}
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
               <Button className="hover:scale-[110%]" onClick={startRecording}>Start!</Button>
                </>
              )}

              <Button className="hover:scale-[110%]" onClick={pythonMessage}>Stop!</Button>

              {/* <Button onClick={pythonMessage}>test</Button> */}
              {/* {audio && <audio src={audio} controls />} */}
            </CardContent>
          </Card>
          {/* <p>{text}</p> */}
        </div>

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