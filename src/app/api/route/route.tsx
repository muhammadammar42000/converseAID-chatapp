import OpenAI from "openai";
import { NextResponse } from "next/server";
import path from "path";
import fs from 'fs';

// Set up OpenAI configuration
const speechFile = path.resolve("./speech.mp3");

const openAI = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_GPT as string, // Ensure API key is typed correctly
});

// Types
type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

type Data = {
  completion?: string;
  thread_id?: string;
  error?: string;
  oldMessages?: Message[];
  prompt?: string;
};

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const customHeader = req.headers.get("x-custom-header");

  switch (customHeader) {
    case "handler-one":
      return postHandler(req);
    case "handler-two":
      return postHandlerTwo(req);
    case "handler-three":
      return generateAudio(req);
    case "handler-four":
      return voiceCovertIntoText(req);
    default:
      return NextResponse.json(
        {},
        { status: 405, statusText: `Method Not Allowed` }
      );
  }
}

async function generateAudio(req: Request) {
  const { text } = await req.json();
  if (text) {
    try {
      const response: any = await openAI.audio.speech.create({
        response_format: 'wav',
        input: text,
        model: 'tts-1',
        voice: 'shimmer',
      });

      const buffer = Buffer.from(await response.arrayBuffer());
      return NextResponse.json({
        data: {
          audio: buffer,
          response,
          text: text,
        }
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Internal Error" },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Text is required to convert into audio" },
      { status: 400 }
    );
  }
}

async function postHandler(req: Request) {
  const body = await req.json();
  const { prompt, thread_id, oldMessages = [] }: { prompt: string; thread_id?: any; oldMessages?: Message[] } = body;

  if (!prompt || !thread_id) {
    return NextResponse.json(
      { error: "Prompt & ThreadId is required" },
      { status: 400 }
    );
  }

  try {
    await openAI.beta.threads.messages.create(thread_id, {
      content: prompt,
      role: "user",
    });
    await openAI.beta.threads.runs.createAndPoll(thread_id, {
      assistant_id: process.env.NEXT_PUBLIC_API_ASSISTANT_ID ?? "",
    });
    const messages: any = await openAI.beta.threads.messages.list(thread_id, {
      order: "asc",
    });

    return NextResponse.json(
      {
        data: {
          messages: [
            ...oldMessages,
            { role: 'user', content: prompt },
            { role: "assistant", content: messages.body?.data?.[messages?.body?.data.length - 1]?.content?.[0]?.text?.value },
          ],
          thread_id: thread_id,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

async function postHandlerTwo(req: Request) {
  try {
    const response = await openAI.beta.threads.create();
    return NextResponse.json(
      { data: { thread_id: response?.id } },
      { status: 200, statusText: "Created new Thread Id" }
    );
  } catch (error) {
    return NextResponse.json(
      {},
      { status: 404, statusText: "Can't create a thread Id " }
    );
  }
}

async function voiceCovertIntoText(req: Request) {
  try {
    const body = await req.json();
    const { audioFile } = body;

    if (!audioFile) {
      throw new Error("Audio file (base64) is missing from the request body");
    }

    const outputPath = path.join(process.cwd(), 'output-audio-file.wav');

    // Convert the base64 string to an audio file
    await base64ToAudioFile(audioFile, outputPath);

    const fileStream = fs.createReadStream(outputPath);

    const transcription = await openAI.audio.transcriptions.create({
      file: fileStream,
      model: 'whisper-1',
      response_format: 'text',
    });

    fs.unlink(outputPath, (err) => {
      if (err) {
        console.error(`Error removing file: ${err}`);
        return;
      }
      console.log(`File ${outputPath} has been successfully removed.`);
    });

    return NextResponse.json({
      success: true,
      transcription: transcription,
    }, { status: 200 });
  } catch (err: any) {
    console.error('Error during transcription:', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'An error occurred',
    }, { status: 500 });
  }
}

const base64ToAudioFile = (base64Audio: string, outputPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const base64Data = base64Audio.replace(/^data:audio\/\w+;base64,/, '');
    const audioBuffer: any = Buffer.from(base64Data, 'base64');

    fs.writeFile(outputPath, audioBuffer, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(outputPath);
    });
  });
};
