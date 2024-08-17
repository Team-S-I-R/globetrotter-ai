import { NextResponse } from "next/server";
import fs from "fs";

export async function POST(req: any) {
  try {
    const body = await req.json();
    const msg = body.message;

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audioConfig: {
            audioEncoding: "MP3",
            pitch: 0,
            speakingRate: 1,
          },
          input: {
            text: msg,
          },
          voice: {
            languageCode: "en-US",
            name: "en-US-Studio-Q",
          },
        }),
      }
    ).then((res) => res.json());
   //  console.log("res", response)

   //  if (!response.ok) {
   //    throw new Error("Network response was not ok");
   //  }
    const audio = response.audioContent;
    return NextResponse.json({ audio: audio });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ audio: "error" });
  }
}
