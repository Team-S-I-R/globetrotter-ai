import { NextResponse } from "next/server";
import { SpeechClient, protos } from "@google-cloud/speech";

const googleCredentialsBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;

if (!googleCredentialsBase64) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS_BASE64 environment variable is not set");
}

// Decode the credentials JSON from base64
const decodedCredentials = JSON.parse(Buffer.from(googleCredentialsBase64, "base64").toString("utf-8"));

// Initialize the SpeechClient with credentials in memory (no file)
const client = new SpeechClient({
  credentials: {
    client_email: decodedCredentials.client_email,
    private_key: decodedCredentials.private_key,
  },
});

export async function POST(req: any) {
  const body = await req.json();
  const base64Audio = body.audio;

  if (!base64Audio) {
    return NextResponse.json({ error: "No audio data provided" }, { status: 400 });
  }

  // Decode the base64 audio directly from the request body
  const audioBuffer = Buffer.from(base64Audio, "base64");

  const aud = {
    content: audioBuffer.toString("base64"),
  };

  const config: protos.google.cloud.speech.v1.IRecognitionConfig = {
    encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.WEBM_OPUS,
    sampleRateHertz: 48000,
    languageCode: "en-US",
  };

  const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
    audio: aud,
    config: config,
  };

  try {
    const [response] = await client.recognize(request);

    let transcription = "No transcription available";

    if (response.results && response.results.length > 0) {
      transcription = response.results
        .map((result: protos.google.cloud.speech.v1.ISpeechRecognitionResult) => {
          if (result.alternatives && result.alternatives.length > 0) {
            return result.alternatives[0].transcript;
          }
          return "";
        })
        .join("\n");
    }

    console.log(`Transcription: ${transcription}`);
    return NextResponse.json({ text: transcription });
  } catch (error) {
    console.error("Error during transcription:", error);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 400 });
  }
}
