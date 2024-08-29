'use client'
import CustomInput from "@/components/CustomInput/CustomInput";
import Image from "next/image";
import logo from "@/../public/logo.png";
import botImg from "@/../public/bot.png";
import youtubeThumbnail from "@/../public/fifa-Screenshot.png";
import { useEffect, useRef, useState } from "react";
import DefaultHomeScreen from "../DefaultHomeScreen/DefaultHomeScreen";
import { useSearchParams } from "next/navigation";
import TypingText from "../TypingText/typingText";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useStore from "@/lib/zustand";
import { shallow } from "zustand/shallow";
import { callFunction } from "@/utils/reUseableFunction";
import { useRouter } from "next/navigation";

function MainScreen() {
  const queryClient = useQueryClient();
  const [thread_id, setThreadId] = useState<string>('');
  const searchParams = useSearchParams();
  const router = useRouter()
  const search: any = searchParams.get('search');
  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: ({ data, handler, thread_id, user }: any) => {
      return callFunction(data, handler, thread_id, user)
    },
    onSuccess: () => {

    },
    onError: (error) => {
      console.log(error)
    }
  })
  const scrollView = useRef<HTMLDivElement>(null);



  const { data, refetch } = useQuery({
    queryKey: ['messageHistory', search || thread_id],
    queryFn: () => getMessages(search ?? thread_id),
    enabled: false,
    initialData: { messages: [] },
  });

  useEffect(() => {
    if (search && search.includes('thread_')) {
      setThreadId(search);
      refetch();
    }
    else {
      if (search == null) {
        generateKey(true)
      }
    }
    return () => setThreadId('')
  }, [search]);


  const generateKey = async (type = false) => {
    try {
      let response = await mutateAsync({
        data: null,
        handler: 'handler-two',
        thread_id: thread_id,
        user: user
      });
      setThreadId(response?.data?.thread_id)
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

  const { user } = useStore(
    (state: any) => ({
      setUser: state.setUser,
      user: state.user,
    }),
    shallow
  );

  const sendMessage = async (text: string) => {
    try {
      // Step 1: Update Local State
      queryClient.setQueryData(['messageHistory', thread_id], (oldData: any) => {
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
            ...oldData?.messages ?? [],
            {
              role: 'user',
              content: text,
            },
          ],
        };
      });
      if (scrollView?.current) {
        scrollView.current.scrollTop = scrollView.current.scrollHeight
      }

      // Step 2: Call API Function
      let response = await mutateAsync({
        data: { prompt: text, thread_id, oldMessages: data.messages },
        handler: 'handler-one',
        thread_id: thread_id,
        user: user,
      })


      // Step 3: Update Local State with API Response
      if (isSuccess) {
        if (response.data.messages.length === 2) {
          router?.push(
            `/?search=${thread_id}`,
          );
        }
        queryClient.setQueryData(['messageHistory', thread_id], (oldData: any) => {
          if (!oldData) {
            return { messages: response?.data?.messages };
          }
          return {
            ...oldData,
            messages: response?.data?.messages,
          };
        });
      }

    } catch (error) {
      console.error(error);
    }
  };

  let hasData = data?.messages?.length
  return (
    <div className="w-full">
      {hasData ? (
        <div>
          <div className="fixed top-0 w-full h-[200px] z-50 flex justify-center items-center">
            <Image src={botImg} alt="Bot Image" width={150} height={150} />
          </div>

          <div ref={scrollView} className="propmtArea overflow-y-scroll no-scrollbar p-10">
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
                        <p className="px-4 py-2 rounded-full inline-block w-[90%]">
                          {item.link ? (
                            <div className="youtube p-1 shadow-md rounded-lg">
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
              {isPending && (
                <div className="bot flex justify-start">
                  <div className="bot-logo w-[50px] h-[50px] rounded-full flex justify-center items-center">
                    <Image src={logo} className="w-[40px]" alt="logo_thumbnail" />
                  </div>
                  <div className="reply ml-3">
                    <div className="mb-2 flex flex-row space-x-2 bg bg-blue text-gray-700 rounded-t-lg py-4 px-4 inline-block w-20 float-right">
                      <div className="h-2 w-2 bg-blue-load rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 bg-blue-load rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 bg-blue-load rounded-full animate-bounce"></div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <DefaultHomeScreen />
      )
      }



      <div className="inputPrompt mt-3 px-32">
        <CustomInput sendMessage={sendMessage} />
      </div>
    </div >
  );
}

export default MainScreen;
