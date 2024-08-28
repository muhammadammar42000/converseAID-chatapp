import CustomInput from "@/components/CustomInput/CustomInput";
import Image from "next/image";
import logo from "@/../public/logo.png";
import botImg from "@/../public/bot.png";
import youtubeThumbnail from "@/../public/fifa-Screenshot.png";
import { useEffect, useRef, useState } from "react";
import DefaultHomeScreen from "../DefaultHomeScreen/DefaultHomeScreen";
import { useSearchParams } from "next/navigation";
import TypingText from "../TypingText/typingText";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function MainScreen() {
  const queryClient = useQueryClient();
  const [thread_id, setThreadId] = useState<string>('');
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const scrollView = useRef<HTMLDivElement>(null);

  const { data, refetch } = useQuery({
    queryKey: ['messageHistory', search],
    queryFn: () => getMessages(search),
    enabled: !!search,
    initialData: { messages: [] },
  });

  useEffect(() => {
    if (search) {
      setThreadId(search);
      refetch();
    } else {
      generateKey();
    }
  }, [search, refetch]);

  const generateKey = async () => {
    try {
      const data = await callFunction({}, 'handler-two');
      setThreadId(data?.data?.thread_id);
    } catch (error) {
      console.log({ error });
    }
  };

  const getMessages = async (thread_id: string | null) => {
    try {
      const response = await fetch(`/pages/api?thread_id=${thread_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const callFunction = async (ObjData?: Object, headerType?: string) => {
    try {
      const response = await fetch("/pages/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-custom-header': headerType || '',
        },
        body: JSON.stringify(ObjData),
      });

      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        console.log(data?.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendMessage = async (text: string) => {
    try {
      // Step 1: Update Local State
      queryClient.setQueryData(['messageHistory', search], (oldData: any) => {
        if (!oldData) {
          return {
            messages: [
              {
                role: 'user',
                content: text,
              },
            ],
          };
        }
        return {
          ...oldData,
          messages: [
            ...oldData.messages,
            {
              role: 'user',
              content: text,
            },
          ],
        };
      });
  
      // Step 2: Call API Function
      const response = await callFunction(
        { prompt: text, thread_id, oldMessages: data.messages },
        'handler-one'
      );
  
      // Step 3: Update Local State with API Response
      if (response) {
        queryClient.setQueryData(['messageHistory', search], (oldData: any) => {
          if (!oldData) {
            return { messages: response.data.messages };
          }
          return {
            ...oldData,
            messages: response.data.messages,
          };
        });
      }
    } catch (error) {
      console.error(error);
    }
  }; 


  return (
    <div className="w-full">
      {data?.messages?.length ? (
        <div>
          <div className="fixed top-0 w-full h-[200px] z-50 flex justify-center items-center">
            <Image src={botImg} alt="Bot Image" width={150} height={150} />
          </div>

          <div className="propmtArea overflow-y-scroll no-scrollbar p-10">
            <div className="conversation">
              {data?.messages?.map((item: any, index: number) => (
                <div key={index}>
                  {item.role === "user" && (
                    <div className="me flex justify-end pb-3">
                      <p className="px-5 bg-[#d9d9d9] py-3 rounded-full inline-block">
                        {item.content}
                      </p>
                    </div>
                  )}

                  {item.role === "assistant" && (
                    <div className="bot flex justify-start">
                      <div className="bot-logo w-[50px] h-[50px] rounded-full flex justify-center items-center">
                        <Image src={logo} className="w-[40px]" alt="logo_thumbnail" />
                      </div>
                      <div className="reply ml-3">
                        <p className="px-5 py-3 rounded-full inline-block w-[90%]">
                          {item.link ? (
                            <div className="youtube p-3 shadow-md rounded-lg">
                              <Image src={youtubeThumbnail} width={500} alt="youtube_thumbnail" />
                            </div>
                          ) : (
                            <TypingText
                              text={item.content}
                              speed={data?.messages?.length === index + 1 && !item.fromHistory ? 40 : 0}
                              ref={scrollView}
                            />
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <DefaultHomeScreen />
      )}
      <div className="inputPrompt mt-3 px-32">
        <CustomInput sendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default MainScreen;
