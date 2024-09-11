"use client";
import React, { useRef } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button,
  Icon,
  Textarea,
} from "@chakra-ui/react";
import { BsPaperclip } from "react-icons/bs";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import youtubeLogo from "@/../public/youtube.png";
import googleCalender from "@/../public/calender.png";
import gmailLogo from "@/../public/gmail.png";
import spotifyLogo from "@/../public/spotify.png";
import Image from "next/image";
import { GoPaperAirplane } from "react-icons/go";
import { useRecordVoice } from "@/utils/hooks/voiceRecorder";
import { useMutation } from "@tanstack/react-query";
import { callFunction } from "@/utils/reUseableFunction";

type CustomInputProps = {
  sendMessage?: (text: string) => void;
  loading?: boolean
  thread_id?: string
  user?: Object | null
};

const CustomInput: React.FC<CustomInputProps> = ({ sendMessage = () => { }, loading, thread_id, user }) => {
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

  const { startRecording, stopRecording, recording } = useRecordVoice(SendVoiceResponse)
  const inputRef = useRef<HTMLTextAreaElement | null>(null); // Ensure inputRef can be null

  const dropdownMenuIcons = [
    youtubeLogo,
    googleCalender,
    gmailLogo,
    spotifyLogo,
  ];

  const handleSendMessage = () => {
    if (inputRef.current) {
      sendMessage(inputRef.current.value);
      inputRef.current.value = ""; // Clear the textarea after sending the message
    }
  };

  async function SendVoiceResponse(file: any) {
    try {
      const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = (error) => reject(error)
        })

      let value = await toBase64(file)


      // // Send Voice to ChatGpt to convert to Text
      const response = await mutateAsync({
        data: {
          audioFile: value
        },
        handler: 'handler-four',
        thread_id: thread_id,
        user: user,
      })
      if (response?.text) {
        console.log('Ok')
        // Send Text to ChatGpt Assistant To Get The Response
        // handleUserInput(null, response.text)
        // setVoiceoading(false)
        // } else setIs
        // Loading(false)
      }
    }
    catch (error) {
      // Getting Error To Console
      // setIsLoading(false)
      console.log(error, '==============>');

    }
  }
  function startRecord() {
    console.log(recording, '-----Rec---------')
    if (!recording) {
      startRecording()

    }
    else {
      stopRecording()
    }

  }

  return (
    <div className="customInput flex items-center bg-[#f7f9fb] w-full py-1 rounded-lg">
      <div className="select-option-button flex items-center">
        <div className="select-file">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<BsPaperclip size="20px" />}
              variant="ghost"
              zIndex="overlay"
              _hover={{ borderRadius: "50%" }}
              _active={{ borderRadius: "50%" }}
            />
            <MenuList
              minWidth="fit-content"
              maxWidth="120px"
              backgroundColor="#f7f9fb"
            >
              {dropdownMenuIcons.map((logo, index) => (
                <MenuItem minWidth="full" backgroundColor="#f7f9fb" key={index}>
                  <div className="social p-2 bg-white shadow-md rounded-full">
                    <Image src={logo} className="w-6" alt={`Icon ${index}`} />
                  </div>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </div>
        <div className="flex gap-3">

          <div className="upload-image-option">
            <Icon boxSize={6} as={CiImageOn} />
          </div>
        </div>
      </div>
      <div className="search-input w-full ml-2">
        <Textarea
          rows={1}
          placeholder="Type message"
          border="none"
          _focus={{
            border: "none",
            outline: "none",
            boxShadow: "none",
          }}
          dir="auto"
          className="m-0 resize-none border-0 bg-transparent px-0 text-token-text-primary focus:ring-0 focus-visible:ring-0"
          style={{ overflow: "hidden", maxHeight: "200px" }}
          ref={inputRef}
          onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}

        />
      </div>


      <div className="submit mr-2">
        <Button onClick={handleSendMessage} isLoading={loading}>
          <Icon as={GoPaperAirplane} />
        </Button>
      </div>
      <div className="voice-option" >
        <Button onClick={() => startRecord()} isLoading={loading}>

          <Icon boxSize={6} as={MdOutlineKeyboardVoice} />
        </Button>

      </div>
    </div>
  );
};

export default CustomInput;
