import { NextResponse } from "next/server";
import fs from "fs";

// Imports the Google Cloud client library
const speech = require("@google-cloud/speech");

// Creates a client
const client = new speech.SpeechClient();

export async function POST(req: any) {
  // The path to the remote LINEAR16 file
  //   const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';
  const body = await req.json();
  const base64Audio = body.audio;

  // Convert the base64 audio data to a Buffer
  const audio = Buffer.from(base64Audio, "base64");

  // Define the file path for storing the temporary WAV file
  const filePath = "tmp/input.wav";

  // Write the audio data to a temporary WAV file synchronously
  fs.writeFileSync(filePath, audio);

  // Create a readable stream from the temporary WAV file
  const readStream = fs.createReadStream(filePath);

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const aud = {
    content: fs.readFileSync(filePath).toString("base64"),
  };
  const config = {
    encoding: "WEBM_OPUS",
    sampleRateHertz: 48000,
    languageCode: "en-US",
  };
  const request = {
    audio: aud,
    config: config,
    //  interimResults: false,
  };

  // Stream the audio to the Google Cloud Speech API
//   let text = '';
  // const recognizeStream = client
  //   .streamingRecognize(request)
  //   .on('error', console.error)
  //   .on('data', (data: any) => {
  //     console.log(
  //       `Transcription: ${data.results[0].alternatives[0].transcript}`
  //     );
  //     text = data.results[0].alternatives[0].transcript;
  //   })

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map((result: any) => result.alternatives[0].transcript)
    .join("\n");

  //   fs.createReadStream(filePath).pipe(recognizeStream);

  // Remove the temporary file after successful processing
  //   fs.unlinkSync(filePath);

  console.log(`Transcription: ${transcription}`);
  return NextResponse.json({text:transcription});
}
