import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SpeechClient, protos } from "@google-cloud/speech";

const googleCredentialsBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;

if (!googleCredentialsBase64) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS_BASE64 environment variable is not set");
}

const decodedCredentials = Buffer.from(googleCredentialsBase64, "base64").toString("utf-8");

const tmpDir = path.join(process.cwd(), "tmp");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}
const credentialsPath = path.join(tmpDir, "globetrotter-key.json");

fs.writeFileSync(credentialsPath, decodedCredentials);

process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

const client = new SpeechClient();

export async function POST(req: any) {
  const body = await req.json();
  const base64Audio = body.audio;

  if (!base64Audio) {
    return NextResponse.json({ error: "No audio data provided" }, { status: 400 });
  }

  const audio = Buffer.from(base64Audio, "base64");

  const filePath = path.join(tmpDir, "input.wav");
  fs.writeFileSync(filePath, audio);

  const aud = {
    content: fs.readFileSync(filePath).toString("base64"),
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

  fs.unlinkSync(filePath);

  console.log(`Transcription: ${transcription}`);
  return NextResponse.json({ text: transcription });
}
