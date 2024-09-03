import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
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
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(405).json({ error: "Method not allowed" });
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

export async function voiceCovertIntoText(req: Request, res: any) {
  const body = await req.json();
  const { audioFile } = body
  try {
    // Send Voice to ChatGpt to convert to Text
    const response = await openAI.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    })
    if (response?.text) {
      NextResponse.json({
        data: {
          audio: audioFile,
          response,
          text: response.text,
        }
      }, { status: 200, statusText: 'Success' })
      // Send Text to ChatGpt Assistant To Get The Response

    }
  } catch (error) {
    NextResponse.json({
      error,

    }, { status: 404 })
    // Getting Error To Console
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
