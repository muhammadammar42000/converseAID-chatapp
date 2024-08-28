import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

// Set up OpenAI configuration
const openai = new OpenAI({
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
    await openai.beta.threads.messages.create(thread_id, {
      content: prompt,
      role: "user",
    });
    // Run Bot To Generate the Response in the Thread
    await openai.beta.threads.runs.createAndPoll(thread_id, {
      assistant_id: process.env.NEXT_PUBLIC_API_ASSISTANT_ID ?? "",
    });
    const messages: any = await openai.beta.threads.messages.list(thread_id, {
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
      const OldMessages: any = await openai.beta.threads.messages.list(
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
        { data: {  messages } },
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
    const response = await openai.beta.threads.create();
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
export default async function handler(req: Request, res: NextApiResponse) {
  const customHeader = await req.headers.get("x-custom-header"); // Ensure the header value is cast correctly
  switch (
    customHeader // Use a custom header to differentiate
  ) {
    case "handler-one":
      return postHandler(req, res);
    case "handler-two":
      return postHandlerTwo(req, res);
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
