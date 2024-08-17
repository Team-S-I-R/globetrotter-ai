"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRecordVoice } from "@/hooks/recordVoice";
import { useState } from "react";
// import { audioInputStreamTransform, recorder, sampleRateHertz, startStream } from "./recorder";

export default function FindPage() {
  const [transcript, setTranscript] = useState("");
  const { startRecording, stopRecording, text } = useRecordVoice();
  // const [text, setText] = useState("");

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
          <p>{text}</p>
        </CardContent>
      </Card>
    </div>
  )
}
