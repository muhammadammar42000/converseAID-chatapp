import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import path from "path";
import fs from 'fs';
// Set up OpenAI configuration
const speechFile = path.resolve("./speech.mp3");

const openAI = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_GPT as string, // Ensure API key is typed correctly
});

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

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}




export async function generateAudio(req: Request, res: NextApiResponse) {
  const { text } = await req.json();
  if (text) {
    try {
      let response: any = await openAI.audio.speech.create({
        response_format: 'wav',
        input: text,
        model: 'tts-1',
        voice: 'echo',
      })
      // Convert to Buffer to send to api and FrontEnd will covert that audio in wav file
      const buffer = Buffer.from(await response.arrayBuffer());
      return NextResponse.json({
        data: {
          audio: buffer,
          response,
          text: text,
        }
      })

    } catch (error) {
      console.log(error, 'ppppp');

      return NextResponse.json(
        { errorL: "Internal Error", error },
        { status: 400 }
      );
    }
  }
  else {
    return NextResponse.json(
      { error: "Text is required to convert into audio" },
      { status: 400 }
    );
  }
}

export async function postHandler(req: any, res: any) {
  // Manually parse the request body
  const body = await req.json();

  const {
    prompt,
    thread_id,
    oldMessages = [],
  }: { prompt: string; thread_id?: any; oldMessages?: Message[] } = body;

  if (!prompt || !thread_id) {
    return NextResponse.json(
      { error: "Prompt &  ThreadId is required" },
      { status: 400 }
    );
  }

  try {
    await openAI.beta.threads.messages.create(thread_id, {
      content: prompt,
      role: "user",
    });
    // Run Bot To Generate the Response in the Thread
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
            ...[
              {
                role: 'user',
                content: prompt,
              },
            ],
            ...[

              {
                role: "assistant",
                content:
                  messages.body?.data?.[messages?.body?.data.length - 1]
                    ?.content?.[0]?.text?.value,
              },
            ],
          ],
          thread_id: thread_id, // Return the thread_id to be reused
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

// GET handler (example)
export async function getHandler(req: Request, res: Response) {
  const { searchParams } = new URL(req.url);
  const thread_id = searchParams.get("thread_id");
  try {
    if (thread_id) {
      const OldMessages: any = await openAI.beta.threads.messages.list(
        thread_id,
        {
          order: "desc",
        }
      );

      let messages: any = [];
      OldMessages?.data?.reverse().forEach((message: any, index: any) => {
        messages.push({
          role: message.role,
          content: message.content?.[0]?.text?.value,
          courses: [],
          fromHistory: true,
        });
      });

      return NextResponse.json(
        { data: { messages } },
        { status: 200, statusText: "Ok Hai Jna da" }
      );
    } else {
      return NextResponse.json(
        {
          data: {
            status: false,
            Error: "Thread Id is Required to retrieve the History",
          },
        },
        {
          status: 400,
          statusText: "Thread Id is Required",
        }
      );
    }
  } catch (err) {
    return NextResponse.json(
      {
        data: {
          status: false,
          Error: "Thread Id is Required to retrieve the History",
          err,
        },
      },
      {
        status: 400,
        statusText: "Thread Id is Required",
      }
    );
  }
}

// PUT handler (example)
export async function putHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  res.status(405).json({ error: "Method not allowed" });
}

// DELETE handler (example)
export async function deleteHandler(
  req: Request,
  res: NextApiResponse<Data>
) {
  // Manually parse the request body
  const body = await req.json()
  const { thread_id, }: { prompt: string; thread_id?: any; oldMessages?: Message[] } = body;
  try {
    if (thread_id) {
      const response = await openAI.beta.threads.del(thread_id)
      if (response)
        return NextResponse.json({
          data: [],
          message: 'Thread Deleted Successfully'
        }, {
          status: 200,
          statusText: 'Thread Deleted Successfully'
        })
    }
    else {
      NextResponse.json({
        data: [],
        message: 'Thread Id is Required'
      }, {
        status: 400,
        statusText: 'Thread Id is Required'
      })

    }

  }
  catch (err) {

  }
}

export async function postHandlerTwo(req: any, res: any) {
  // You can await here
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

const base64ToAudioFile = (base64Audio: string, outputPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Remove metadata from base64 string (e.g., "data:audio/wav;base64,")
    const base64Data = base64Audio.replace(/^data:audio\/\w+;base64,/, '');

    // Convert the base64 string to binary buffer
    const audioBuffer: any = Buffer.from(base64Data, 'base64');

    // Write buffer to a file
    fs.writeFile(outputPath, audioBuffer, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(outputPath); // Return the file path if successful
    });
  });
};

export async function voiceCovertIntoText(req: Request, res: NextApiResponse) {
  try {
    // Assume the body is sent as a JSON object with a base64-encoded audio file
    const body = await req.json();
    const { audioFile } = body;

    if (!audioFile) {
      throw new Error("Audio file (base64) is missing from the request body");
    }

    const outputPath = path.join(process.cwd(), 'output-audio-file.wav'); // Save the file in a writable directory

    // Convert the base64 string to an audio file
    await base64ToAudioFile(audioFile, outputPath);

    // Create a readable stream for the file
    const fileStream = fs.createReadStream(outputPath);

    // Send the file to OpenAI for transcription
    const transcription = await openAI.audio.transcriptions.create({
      file: fileStream, // Send the file stream
      model: 'whisper-1',
      response_format: 'text',
    });

    // Return the transcription result

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
export default async function handler(req: Request, res: NextApiResponse) {
  const customHeader = await req.headers.get("x-custom-header"); // Ensure the header value is cast correctly
  switch (
  customHeader // Use a custom header to differentiate
  ) {
    case "handler-one":
      return postHandler(req, res);
    case "handler-two":
      return postHandlerTwo(req, res);
    case "handler-three":
      return generateAudio(req, res);
    case "handler-four":
      return voiceCovertIntoText(req, res);
    default:
      return NextResponse.json(
        {},
        { status: 405, statusText: `Method ${req.method} Not Allowed` }
      );
  }
}

// Default export to delegate to named handlers
export {
  handler as POST,
  getHandler as GET,

  putHandler as PUT,
  deleteHandler as DELETE,
};

