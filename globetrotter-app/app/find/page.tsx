"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecordVoice } from "@/hooks/recordVoice";
import { useState } from "react";
// import { audioInputStreamTransform, recorder, sampleRateHertz, startStream } from "./recorder";

export default function FindPage() {
  const [transcript, setTranscript] = useState("");
  const { startRecording, stopRecording, text } = useRecordVoice();
  const [audio, setAudio] = useState("");
  // const [text, setText] = useState("");

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
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Transcripting</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => handleClick(text)}>translate!</Button>
          <Button onClick={startRecording}>Start!</Button>
          <Button onClick={stopRecording}>Stop!</Button>
          <p>{text}</p>
          {audio && <audio src={audio} controls />}
        </CardContent>
      </Card>
    </div>
  );
}
