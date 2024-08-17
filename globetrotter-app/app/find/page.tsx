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
  const { startRecording, stopRecording, text } = useRecordVoice();
  const [audio, setAudio] = useState("");
  // const [text, setText] = useState("");
  const dummytext = "This is a test message";

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
     
          
      <div className="w-full">
          <Input value={dummytext}/>
      </div>  

      <Card className="w-full h-max flex flex-col place-items-center place-content-center">
        <CardHeader>
          <CardTitle>Transcripting</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button onClick={() => handleClick(text)}>translate!</Button>
          <Button onClick={startRecording}>Start!</Button>
          <Button onClick={stopRecording}>Stop!</Button>
          <p>{text}</p>
          {audio && <audio src={audio} controls />}
        </CardContent>
      </Card>

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