"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { useRecordVoice } from "@/hooks/recordVoice";
import { useState } from "react";
import { text } from "stream/consumers";
// import { audioInputStreamTransform, recorder, sampleRateHertz, startStream } from "./recorder";

export default function FindPage() {
  const [transcript, setTranscript] = useState("");
  const { startRecording, stopRecording, text } = useRecordVoice();
  const [responseText, setResponseText] = useState<string>("");
  const [responseDetails, setResponseDetails] = useState<any>({});
  


  // debug text
  const dummytext = 'Hi, my name is T, I am looking to travel to Japan. What kind of food can I eat?'

  const pythonDebug = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/travel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: dummytext,
        }),
      });
      const data = await response.json();
      console.log("data", data);
      console.log("response", data.response.responseText);
      console.log("responseText", data.responseText);
      console.log("details", data.details);
      setResponseText(data.response)
    } catch (error) {
      console.error('Error sending request to Python backend:', error);
    }
  }

  const handleClick = async (base64data: any) => {
    // try {
    //   const response = await fetch("/api/stt", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       audio: base64data,
    //     }),
    //   }).then((res) => res.json());
    //   const { text } = response;
    //   setText(text);
    // } catch (error) {
    //   console.log(error);
    // }

    // recorder
    // .record({
    //   sampleRateHertz: sampleRateHertz,
    //   threshold: 0, // Silence threshold
    //   silence: 1000,
    //   keepSilence: true,
    //   recordProgram: 'rec', // Try also "arecord" or "sox"
    // })
    // .stream()
    // .on('error', (err: any) => {
    //   console.error('Audio recording error ' + err);
    // })
    // .pipe(audioInputStreamTransform);

    // console.log('');
    // console.log('Listening, press Ctrl+C to stop.');
    // console.log('');
    // console.log('End (ms)       Transcript Results/Status');
    // console.log('=========================================================');

    // startStream();
  }

  




  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Transcripting</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleClick}>translate!</Button>
          <Button onClick={startRecording}>Start!</Button>
          <Button onClick={stopRecording}>Stop!</Button>
        </CardContent>
      </Card>
          
       <div className="w-full h-max flex flex-col gap-2">
          <Input value={dummytext}/>
          <button onClick={pythonDebug}>Submit</button>
      </div> 

      <div>
        <p>{}</p>
        <div></div>
        <p>{}</p>  
      </div>  
    </div>
  )
}


// steps


// speech to text

// feed to ai

//  get response,

// tts to user

// then fill in data