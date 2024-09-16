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
import { ArrowLeft } from "lucide-react";
import { ArrowRight } from "lucide-react";

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
    // {id: 1, departure_airport: "NYC", arrival_airport: "LAX", departure_time: "March 1, 2023", price: 200, flight_number: "A1", airline: "American"}, 
    // {id: 2, departure_airport: "CHI", arrival_airport: "SFO", departure_time: "March 5, 2023", price: 250, flight_number: "U2", airline: "United"},
    // {id: 3, departure_airport: "BOS", arrival_airport: "LAS", departure_time: "March 5, 2023", price: 550, flight_number: "D0", airline: "Delta"},
    // {id: 4, departure_airport: "SEA", arrival_airport: "MIA", departure_time: "March 5, 2023", price: 1050, flight_number: "A4", airline: "Alaska"},
    // {id: 5, departure_airport: "SJC", arrival_airport: "ATL", departure_time: "September 6, 2023", price: 450, flight_number: "S0", airline: "Southwest"},
    // {id: 6, departure_airport: "IAH", arrival_airport: "DEN", departure_time: "April 10, 2023", price: 300, flight_number: "F6", airline: "Frontier"},
    // {id: 7, departure_airport: "PHX", arrival_airport: "DFW", departure_time: "May 15, 2023", price: 350, flight_number: "W7", airline: "Southwest"},
    // {id: 8, departure_airport: "PHL", arrival_airport: "MCO", departure_time: "June 20, 2023", price: 400, flight_number: "N0", airline: "Spirit"},
    // {id: 9, departure_airport: "SAN", arrival_airport: "JFK", departure_time: "July 25, 2023", price: 500, flight_number: "B0", airline: "JetBlue"},
    // {id: 10, departure_airport: "AUS", arrival_airport: "ORD", departure_time: "August 30, 2023", price: 600, flight_number: "A9", airline: "American"},
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
const [debugText, setDebugText] = useState(`
  I need a 1-way direct flight from San Jose California to Atlanta Georgia 
  on september the 6th that arrives by or before 3:00 p.m. SInce 
  this is a one way there is no end date, my budget is $500 and i will be the 
  only one traveling. please give me some options`);

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
    const handleTextChange = async () => {
      if (text?.length > 1) {
        toast({ title: 'Sending your message off!', description: '', itemID: 'success' });
        await new Promise(resolve => setTimeout(resolve, 100));
        // pythonMessage(text).then(() => 
        pythonMessage(text).then(() => 
            toast({ title: '✅ Success!', description: 'Response received...Responding to user now.', itemID: 'success' }));
      }
    };
    handleTextChange();
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
            // "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            user_input: message
          }),
        });

        const data = await response.json();

        handleAiTalking(data.responseText);
        setConversationText(data.responseText);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDetails(data.details); // Assuming the response contains a 'details' field
        setSearchedFlights(data.searched_flights);
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
                <div className="w-[200px] max-w-[300px] p-2 h-max bg-white rounded-xl absolute z-[1000] top-[20vh] left-10">
                <motion.div
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 1.5, staggerChildren: 0.2 } }}                    
                className="flex  place-items-center gap-4 w-full m-[1px] p-2">
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
                    key={index} className="detail hover:bg-gray-100/50 relative h-max select-none w-full h-max p-2 text-black">
                      <motion.p  
                      initial={{ opacity: 0, x: -200 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 0.1 + index } }}
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
              
              {searchedFlights?.flights?.length > 0 && (
                <>
                <div className="w-[300px] max-w-[400px] p-2 h-max bg-white rounded-xl absolute z-[1000] top-[30vh] right-10">
                  <motion.div
                      initial={{ opacity: 0, x: 1000 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 1.5 } }}                 
                      className="flex flex-col w-full h-full">
                          {searchedFlights?.flights?.length > 0 && ( // {{ edit_1 }}
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
                            className="flex flex-col w-full h-[300px] overflow-hidden m-[1px] p-2 ">
                              {/* {details?.filter(detail => detail.value).slice(0, 4).map((detail, index) => ( */}
                              <div className="w-full h-full overflow-y-scroll no-scrollbar">
                                {searchedFlights?.flights?.map((flight, index) => ( // {{ edit_1 }}
                                  <motion.div 
                                  initial={{ opacity: 0, x: 1000 }}
                                  animate={{ opacity: 1, x: 0, transition: { duration: 1.5, staggerChildren: 0.2 } }}                        
                                  key={index} className="detail hover:bg-slate-100/50 select-none w-full p-2">
                                    <motion.p 
                                    initial={{ opacity: 0, x: 1000 }}
                                    animate={{ opacity: 1, x: 0, transition: { duration: 0.3 + index } }}

                                    className="select-none text-sm text-left flex place-items-center justify-between">
                                      <span className="flex flex-col gap-2">
                                        
                                        {/* departure */}
                                        <span className="flex gap-2 place-items-center">
                                          <span className="font-bold">{flight.departure_airport}</span>
                                          <span className="scale-[75%]"><ArrowRight/></span>
                                        </span>

                                        {/* arrival */}
                                        <span className="flex gap-2 place-items-center">
                                          <span className="font-bold">{flight.arrival_airport}</span>
                                          <span className="scale-[75%] text-orange-400"><ArrowLeft/></span>
                                        </span>

                                      </span>

                                      <span className="flex flex-col gap-2">
                                        <span>{flight.flight_number}</span>
                                        <span>{flight.airline}</span>
                                      </span>

                                      {/* price and dates */}
                                      <span className="flex flex-col gap-2 place-items-end">
                                        <span className="font-bold text-muted-foreground ">{new Date(flight.departure_time).toLocaleDateString()}</span>
                                        <span className="font-bold text-orange-400">${flight.price}</span>
                                      </span>


                                    </motion.p>
                                  </motion.div>
                                ))}
                              </div>
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
          className="flex flex-col  absolute overflow-hidden bottom-10 left-10 z-[100] bg-white place-content-start gap-8  w-[300px] h-[350px] rounded-lg m-[1px] p-6">      
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
                <AccordionTrigger><span className="text-orange-400">Easter Eggs :o</span></AccordionTrigger>
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


        {text?.length > 10 && (
          <>
        <motion.div 
        initial={{ opacity: 0, y: -200 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1.5 } }}
        className="absolute flex place-items-start place-content-center text-center  overflow-y-scroll no-scrollbar top-[10%] bg-white rounded-lg outline left-1/2 transform -translate-x-1/2 w-[300px] px-5 py-3 pb-4  h-[100px] z-[100]">
            <p className="text-sm">{conversationText || "Thinking...."}</p>
        </motion.div>
          </>
          )}

        



        {/* button */}
        <motion.div 
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1.5 } }}
        className="select-none bg-white flex place-self-center rounded-xl w-max h-max flex absolute bottom-10 z-[1] flex-col place-items-center gap-2">

          <Card className="w-full bg-transparent gap-4 border-none outline-none h-max flex flex-col place-items-center place-content-center">
            <CardHeader className="text-md">
              {recording === true && <CardTitle>Recording...</CardTitle>}
              {recording === false && <CardTitle><span className="text-orange-500 font-bold">Press Talk!</span></CardTitle>}
            </CardHeader>
            <CardContent className="flex gap-4">
              {recording === true && (
                <>
                <Button className="bg-red-600 animate-pulse" disabled>Talking...</Button>
                </>
              )}

              {recording === false && (
                <>
                <div className="flex flex-col gap-2">
               <Button className="hover:scale-[110%] hover:bg-orange-500" onClick={startRecording}>Talk!</Button>
                {/* <span className="text-xs">or "T" 2 times</span> */}
                </div>
                </>
              )}

              <div className="flex flex-col gap-2">
              <Button 
                className="hover:scale-[110%]" 
                onClick={() => {
                  stopRecording();
                }}
              >
                Stop!
              </Button>
                {/* <span className="text-xs">or "S" 2 times</span> */}
              </div>

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