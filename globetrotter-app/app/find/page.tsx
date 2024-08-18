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
import clouods from '../assets/cloud.gif'
import singlecloud from '../assets/singlecloud.png'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { LightbulbIcon } from "lucide-react";
import { X } from "lucide-react";

export default function FindPage() {
  const [transcript, setTranscript] = useState("");
  const { startRecording, stopRecording, text, recording, textIsDone, setTextIsDone } = useRecordVoice();
  const [audio, setAudio] = useState("");
  const [conversationText, setConversationText] = useState("");
  // const [details, setDetails] = useState<Array<{parameter: string; value: string}>>([
  //   { parameter: "Default Parameter", value: "Default Value" },
  //   { parameter: "Default Parameter", value: "Default Value" },
  //   { parameter: "Default Parameter", value: "Default Value" },
  //   { parameter: "Default Parameter", value: "Default Value" },
  // ]);
  const [details, setDetails] = useState<Array<{parameter: string; value: string}>>([
    { parameter: "Arriving To", value: "Los Angeles" },
    { parameter: "Number of People", value: "2" },
    { parameter: "Budget", value: "$500" },
    { parameter: "Airline", value: "Delta" },
  ]);
  const { toast } = useToast()
  const [scope, animate] = useAnimate();
  const [debugInput, setDebugInput] = useState("");
  const [searchedFlights, setSearchedFlights] = useState<{flights: Array<any>}>({flights: [
    // {id: 1, departure: "New York", arrival: "Los Angeles", date: "2023-03-01", price: 200}, 
    // {id: 2, departure: "Chicago", arrival: "San Francisco", date: "2023-03-05", price: 250},
    // {id: 3, departure: "Boston", arrival: "Las Vegas", date: "2023-03-05", price: 550},
    // {id: 4, departure: "Seattle", arrival: "Miami", date: "2023-03-05", price: 1050},
  ]});
  const [startGame, setStartGame] = useState(false);
  // const [searchedFlights, setSearchedFlights] = useState<{flights: Array<any>}>({flights: [
  //   {id: 1, departure: "New York", arrival: "Los Angeles", date: "2023-03-01", price: 200}, 
  //   {id: 2, departure: "Chicago", arrival: "San Francisco", date: "2023-03-05", price: 250},
  //   {id: 3, departure: "Boston", arrival: "Las Vegas", date: "2023-03-05", price: 550},
  //   {id: 4, departure: "Seattle", arrival: "Miami", date: "2023-03-05", price: 1050},
  // ]});
// 
const [showTip, setShowTip] = useState(false);

  // this should make the ai talk and it should say the responsetext
  const handleAiTalking = async (msg: String) => {
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

  useEffect(() => {
    if (text?.length > 1) {
      toast({ title: 'Sending your message off!', description: '', itemID: 'success' });
      setTimeout(() => pythonMessage(text), 1000);
    }
  }, [text]);

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

  const pythonMessage = async (message: string) => {

      try {        
        const response = await fetch(`${process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5000' : 'https://vercel-globetrotters-be-deployment.vercel.app'}/travel`, {
        // const response = await fetch(`http://127.0.0.1:5000/travel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_input: message
          }),
        });

        const data = await response.json();

        setConversationText(data.responseText);
        setDetails(data.details); // Assuming the response contains a 'details' field
        console.log(data)
        setDebugInput(data.the_user_input);
        handleAiTalking(data.responseText);
        // setSearchedFlights(data.searched_flights);
        setTimeout(() => {
          toast({ title: '✅ Success!', description: 'Response received...Responding to user now.', itemID: 'success' });
        }, 1000);
      } catch (error) {
        console.log(error);
        toast({ title: '❌ Error!', description: 'There was an error processing your request. Please press the start button to start a conversation.', itemID: 'error' });
      }
    
  }


  return (
    <>
    {/* mobile */}
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 2.5 }}
    className="w-full bg-white h-full flex flex-col  absolute z-[100] sm:hidden">
        <Header/>
        <div className="w-2/3 p-2 rounded-lg bg-white text-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <p className="">Hi!, Thanks for your interest in <strong>Globetrotter!</strong></p>
          <p className="">We recommend using a larger screen for a better experience</p>
        </div>
        <img className="w-full h-full" src={clouods.src} alt="" />
    </motion.div>
    
    {/*header */}
    <div className="absolute top-0 left-0">
        <Header/>  
    </div>

{/* images */}
    <div className="opacity-30 w-full h-full absolute flex place-items-center place-content-center z-[-1]">
      {/* <div className="w-[3px] h-full bg-black"></div> */}
      <img className="w-full h-full" src={clouods.src} alt="" />
    </div>

{/* images */}
    <div className=" w-full h-full absolute flex place-items-center place-content-center z-[-1]">
      <div className="w-full h-full absolute bg-gradient-to-b from-white via-white to-transparent"></div>
    </div>

{/* main div */}
    <div className="w-screen h-screen">
      
      <div className="w-full h-full flex flex-col mx-auto p-4">
      
        {/* mapped content will go here */}
        <div className="w-full relative h-max flex flex-col place-items-center place-content-start">
        
            <div  className="w-full h-full grid gap-1 grid-cols-2 grid-rows-2 place-items-center pr-1  no-scrollbar overflow-y-scroll">
              
              <motion.div 
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 1.5 } }}              
              className="flex flex-col w-full">
                {/* <motion.p 
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 1.5 } }}
                className="absolute top-0 left-0 z-[1000] select-none w-full">
                  {conversationText}
                  {text}
                </motion.p> */}
                       
              {details?.length > 0 && (
                <>
                <div className="w-[200px] max-w-[300px] p-2 h-max bg-white rounded-xl absolute top-[20vh] left-10">
                <motion.div
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 1.5, staggerChildren: 0.2 } }}                    
                className="flex place-items-center gap-4 w-full m-[1px] p-2">
                  <img className="w-[20px]" src={quote.src} alt="" />
                  <p className="font-bold">Checklist!</p>
                </motion.div>

                <motion.div 
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 1.5, staggerChildren: 0.2 } }}          
                className="flex flex-col w-full h-full m-[1px] p-2 ">
                  {/* {details?.filter(detail => detail.value).slice(0, 4).map((detail, index) => ( */}
                  {details?.map((detail, index) => ( 
                    <motion.div 
                    initial={{ opacity: 0, x: -200 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 1.5, staggerChildren: 0.2 } }}                    
                    key={index} className="detail relative h-max select-none w-full h-max p-2 text-black">
                      <motion.p  
                      initial={{ opacity: 0, x: -200 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 0.3 + index } }}
                      className="select-none text-sm text-left"><span className="font-bold">{detail.parameter}</span>: {detail.value}</motion.p>
                      {/* <img className=" top-0 w-[100px] h-[100px]" src={singlecloud.src} alt="" /> */}
                    </motion.div>
                  ))}
                </motion.div>                 
                </div>
                  </>
              )}

              </motion.div>

              <div className="w-full h-full "></div>
              
              {searchedFlights.flights?.length > 0 && (
                <>
                <div className="w-[200px] max-w-[300px] p-2 h-max bg-white rounded-xl absolute top-[30vh] right-10">
                  <motion.div
                      initial={{ opacity: 0, x: 1000 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 1.5 } }}                 
                      className="flex flex-col w-full h-full">
                          {searchedFlights.flights?.length > 0 && ( // {{ edit_1 }}
                            <>
                            <motion.div
                            initial={{ opacity: 0, x: -200 }}
                            animate={{ opacity: 1, x: 0, transition: { duration: 1.5, staggerChildren: 0.2 } }}                    
                            className="flex place-items-center gap-4 w-full m-[1px] p-2">
                              <img className="w-[20px]" src={quote.src} alt="" />
                              <p className="font-bold">Flights!</p>
                            </motion.div>

                            <motion.div 
                            initial={{ opacity: 0, x: -200 }}
                            animate={{ opacity: 1, x: 0, transition: { duration: 1.5, staggerChildren: 0.2 } }}          
                            className="flex flex-col w-full h-full m-[1px] p-2 ">
                              {/* {details?.filter(detail => detail.value).slice(0, 4).map((detail, index) => ( */}
                              {searchedFlights.flights.map((flight, index) => ( // {{ edit_1 }}
                                <motion.div 
                                initial={{ opacity: 0, x: 1000 }}
                                animate={{ opacity: 1, x: 0, transition: { duration: 1.5, staggerChildren: 0.2 } }}                        
                                key={index} className=" detail select-none w-full p-2 text-orange-400">
                                  <motion.p 
                                  initial={{ opacity: 0, x: 1000 }}
                                  animate={{ opacity: 1, x: 0, transition: { duration: 0.3 + index } }}

                                  className="select-none text-sm text-left">
                                    <span className="font-bold">{flight.departure_airport}</span>
                                    <span className="font-bold">${flight.price}</span>
                                  </motion.p>
                                </motion.div>
                              ))}
                            </motion.div>  
                            
                            </>
                          )}
                      
                  </motion.div>
                </div>
                </>
              )}
               
              <div className="w-full h-full "></div>
            </div>


        </div>

        {showTip === true && (
          <>
        <motion.div 
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1.5, staggerChildren: 0.2 } }}                    
          className="flex flex-col  absolute overflow-hidden bottom-10 left-10 z-[100] bg-white place-content-start gap-8  w-[300px] h-[250px] rounded-lg m-[1px] p-6">      
            <div onClick={() => setShowTip(false)} className="w-max bg-white h-max m-4 absolute  top-0 right-0 z-[100]">
               <X/> 
            </div>
            <div className="w-full text-xs h-full overflow-y-scroll no-scrollbar">
            <p className="text-3xl font-bold">You made it to the Globetrotter Demo!</p>
            <p><strong>Now what? </strong>Here are some keys to success!</p>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>How to Start!?</AccordionTrigger>
                <AccordionContent>
                <li>Press the start button to get started</li>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How to Stop!?</AccordionTrigger>
                <AccordionContent>
                <li>When you press Stop!, your audio will be captured and the conversation will start!</li>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Then what?</AccordionTrigger>
                <AccordionContent>
                <li>The goal is for the checklist to fill based on your conversation, and maybe Globetrotter will find you some good deals on flights (will show on the right side!)</li>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Easter Eggs :o</AccordionTrigger>
                <AccordionContent>
                <li>If you are here then you found the first one! What if we told you there is one more! Have you pressed the arrow keys yet?</li>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            </div>
        </motion.div>
          </>
        )}

          {showTip === false && (
             <motion.div 
             onClick={() => setShowTip(true)}
             initial={{ opacity: 0, x: -200 }}
             animate={{ opacity: 1, x: 0, transition: { duration: 1.5, staggerChildren: 0.2 } }}                    
             className="flex hover:scale-[110%] hover:text-orange-400 cursor-pointer flex-col place-items-center place-content-center absolute overflow-hidden bottom-10 left-10 z-[100] bg-white   w-[30px] h-[30px] rounded-full m-[1px] p-6">      
                <span className="text-3xl  "><LightbulbIcon/></span> 
           </motion.div> 
          )}

        


        {/* plane */}
        <motion.div 
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0, transition: { duration: 2.5 } }}
        className="absolute top-0 left-0 w-full h-full z-[1]">
            <PlaneModel />
        </motion.div>


        {text?.length > 0 && (
          <>
        <motion.div 
        initial={{ opacity: 0, y: -200 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1.5 } }}
        className="absolute flex place-items-center top-[10%] bg-white rounded-lg outline left-1/2 transform -translate-x-1/2 max-w-[500px] p-4 w-max h-[100px] z-[100]">
            <p className="text-sm">{conversationText}</p>
        </motion.div>
          </>
          )}

        



        {/* button */}
        <motion.div 
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1.5 } }}
        className="select-none bg-white flex place-self-center rounded-xl w-max h-max flex absolute bottom-10 z-[1] flex-col place-items-center gap-2">
          <Card className="w-full bg-transparent border-none outline-none h-max flex flex-col place-items-center place-content-center">
            <CardHeader className="text-md">
              {recording === true && <CardTitle>Recording...</CardTitle>}
              {recording === false && <CardTitle><span className="text-orange-500 font-bold">Press Start!</span></CardTitle>}
            </CardHeader>
            <CardContent className="flex gap-4">
              {recording === true && (
                <>
                <Button className="bg-red-600 animate-pulse" disabled>Recording...</Button>
                </>
              )}

              {recording === false && (
                <>
               <Button className="hover:scale-[110%] hover:bg-orange-500" onClick={startRecording}>Start!</Button>
                </>
              )}

              <Button 
                className="hover:scale-[110%]" 
                onClick={() => {
                  stopRecording();
                }}
              >
                Stop!
              </Button>

              {audio && <audio className="hidden" src={audio} autoPlay controls />}
            </CardContent>
          </Card>
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