"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { useRecordVoice } from "@/hooks/recordVoice";
import { useState } from "react";
import Header from "../gt-components/header";
// import { audioInputStreamTransform, recorder, sampleRateHertz, startStream } from "./recorder";

export default function FindPage() {
  const [transcript, setTranscript] = useState("");
  const { startRecording, stopRecording, text, recording } = useRecordVoice();
  const [audio, setAudio] = useState("");
  // const [text, setText] = useState("");
  const dummytext = "This is a test message";

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

  return (
    <>
    <div className="absolute top-0 left-0">
        <Header/>  
    </div>

      <div className="w-screen h-screen py-[80px]">
      <div className="w-full h-full flex flex-col justify-between mx-auto p-4">
     
     {/* beautiful content will go here */}
      <div className="w-full h-max flex flex-col place-items-center place-content-center">
         <p>{text}</p>
      </div>

      <div className="w-full h-max flex flex-col place-items-center gap-2">
      <Card className="w-full border-none outline-none h-max flex flex-col place-items-center place-content-center">
        <CardHeader>
          {recording === true && <CardTitle>Recording</CardTitle>}
          {recording === false && <CardTitle>Press Start</CardTitle>}
        </CardHeader>
        <CardContent className="flex gap-4">
          {/* <Button onClick={() => handleClick(text)}>translate!</Button> */}
          <Button onClick={startRecording}>Start!</Button>
          <Button onClick={stopRecording}>Stop!</Button>
          {/* {audio && <audio src={audio} controls />} */}
        </CardContent>
      </Card>
      <p>{text}</p>
      </div>

    </div>
      
    </div> 
     
    </>
  );
}


// steps


// speech to text

// feed to ai

//  get response,

// tts to user

// then fill in data