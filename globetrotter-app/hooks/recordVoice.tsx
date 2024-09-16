import { blobToBase64 } from "@/app/find/blobtobase64";
import { useEffect, useState, useRef } from "react";

export const useRecordVoice = () => {
  // State to hold the media recorder instance
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // State to track whether recording is currently in progress
  const [recording, setRecording] = useState<boolean>(false);
  const [recordingStart, setRecordingStart] = useState<boolean>(false);
  const isRecording = useRef<boolean>(false);
  // Ref to store audio chunks during recording
  const chunks = useRef<Blob[]>([]);
  const [text, setText] = useState("");
  const [textIsDone, setTextIsDone] = useState<boolean>(false);

  // Function to start the recording
  const startRecording = () => {
    if (mediaRecorder) {
      isRecording.current = true;
      mediaRecorder.start();
      setRecording(true);
    }
  };

  // Function to stop the recording
  const stopRecording = () => {
    if (mediaRecorder) {
      isRecording.current = false;
      mediaRecorder.stop(); 
      setRecording(false);
    }
  };

  const getText = (base64data: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/stt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audio: base64data,
          }),
        }).then((res) => res.json());

        const { text } = response;
        setText(text);
        setTextIsDone(true); // Mark text retrieval as done
        resolve();
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  // Function to initialize the media recorder with the provided stream
  const initialMediaRecorder = (stream: MediaStream) => {
    const mediaRecorder = new (window.MediaRecorder as typeof MediaRecorder)(stream);

    // Event handler when recording starts
    mediaRecorder.onstart = () => {
      chunks.current = []; // Resetting chunks array
    };

    // Event handler when data becomes available during recording
    mediaRecorder.ondataavailable = (ev: BlobEvent) => {
      chunks.current.push(ev.data); // Storing data chunks
    };

    // Event handler when recording stops
    mediaRecorder.onstop = async () => {
      // Creating a blob from accumulated audio chunks with WAV format
      const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
      await blobToBase64(audioBlob, getText); // No need for await here
      // console.log(audioBlob, 'audioBlob')

      // You can do something with the audioBlob, like sending it to a server or processing it further
    };

    setMediaRecorder(mediaRecorder);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(initialMediaRecorder);
    }
  }, []); 

  return { recording, startRecording, stopRecording, text, textIsDone, setTextIsDone };
};