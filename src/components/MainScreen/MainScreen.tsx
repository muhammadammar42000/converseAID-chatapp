'use client'
import CustomInput from "@/components/CustomInput/CustomInput";
import Image from "next/image";
import logo from "@/../public/logo.png";
import botImg from "@/../public/bot.png";
import youtubeThumbnail from "@/../public/fifa-Screenshot.png";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import talkingChatBox from "@/../public/talkingChatBot.gif";
import talkingWithoutChatBox from "@/../public/without_talking_chat_bot.gif";
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

  const [count, setCount] = useState(0)
  // const [isPlaying, setIsPlaying] = useState(false)
  const router = useRouter()
  const [voiceLoading, setVoiceLoading] = useState<any>({
    voiceMessageIndex: null,
    loading: false,
    isPlaying: false,
  })
  const search: any = searchParams.get('search');

  const { mutateAsync, isPending, isSuccess, variables } = useMutation({
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

  useEffect(() => {


  }, [])


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



  async function playSound(text: any, index: any) {
    const audioPlayer: any = document.getElementById('audioPlayer')
    setVoiceLoading({ voiceMessageIndex: index, loading: true, isPlaying: false })
    try {

      let response = await mutateAsync({
        data: { text, thread_id, oldMessages: data.messages },
        handler: 'handler-three',
        thread_id: thread_id,
        user: user,
      })

      const bufferData = response.data.audio.data; // Access the array part of the buffer object

      // Convert the buffer data array into an ArrayBuffer
      const arrayBuffer = new Uint8Array(bufferData).buffer;

      // Create a Blob from the ArrayBuffer, assuming the audio type is 'audio/wav'
      const blob = new Blob([arrayBuffer], { type: 'audio/wav' });

      // Generate a URL from the Blob
      const url = URL.createObjectURL(blob);

      // Set the audio player's source to the blob URL and play
      audioPlayer.src = url;
      setVoiceLoading({ voiceMessageIndex: index, loading: false, isPlaying: true })
      audioPlayer.play();
    }
    catch (err) {
      console.log('Error ====>', err)
    }
  }
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
        playSound(response.data?.messages[response.data?.messages?.length - 1].content, response.data?.messages.length - 1)
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


  const sendVoice = (audioFile: AudioBuffer) => {


  }
  function stopVoice() {
    const audioPlayer: any = document.getElementById('audioPlayer')
    audioPlayer?.pause()
    setVoiceLoading({
      voiceMessageIndex: null,
      loading: false,
      isPlaying: false,

    })


  }
  let hasData = data?.messages?.length
  return (
    <div className="w-full">
      <audio id="audioPlayer" className="hidden" controls onEnded={() => stopVoice()}></audio>

      {hasData ? (
        <div>
          <div className="fixed top-0 w-full h-[200px] z-50 flex justify-center items-center" style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            marginTop: "calc(10vh - 10px)"
          }}>
            <Image src={voiceLoading?.isPlaying ? talkingChatBox : talkingWithoutChatBox} alt="Bot Image" width={380} height={380} />

          </div>

          <div ref={scrollView} className="p-10 mt-40">
            <div className="propmtArea conversation overflow-y-scroll no-scrollbar" >
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
                            <div>
                              <TypingText
                                text={item.content}
                                speed={data?.messages?.length === index + 1 && !item.fromHistory ? 40 : 0}
                                ref={scrollView}
                              />
                              <div className="flex flex-row mt-3 space-x-2 rounded-b-lg">
                                <button
                                  onClick={() => {
                                    if (voiceLoading.voiceMessageIndex === index && voiceLoading?.isPlaying) {
                                      stopVoice()
                                    } else if (
                                      voiceLoading.voiceMessageIndex == null &&
                                      !voiceLoading?.isPlaying &&
                                      !voiceLoading?.loading
                                    ) {
                                      playSound(item.content, index)
                                    }
                                  }}
                                >
                                  {voiceLoading?.loading && voiceLoading.voiceMessageIndex === index ? (
                                    <svg
                                      aria-hidden="true"
                                      className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-light-green"
                                      viewBox="0 0 100 101"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.5"
                                      stroke="currentColor"
                                      className="w-6 h-6"
                                    >
                                      {voiceLoading?.isPlaying && voiceLoading.voiceMessageIndex === index ? (
                                        <>
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
                                          />
                                        </>
                                      ) : (
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                                        />
                                      )}
                                    </svg>
                                  )}
                                </button>

                              </div>

                            </div>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isPending && variables.handler !== "handler-three" && (
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

        <CustomInput sendMessage={sendMessage}
          thread_id={thread_id}
          user={user} />
      </div>
    </div >
  );
}

export default MainScreen;
