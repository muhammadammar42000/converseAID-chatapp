"use client";
import CustomInput from "@/components/CustomInput/CustomInput";
import { Icon } from "@chakra-ui/react";
import Image from "next/image";
import { IoChatbubblesOutline } from "react-icons/io5";
import { GiFallingStar } from "react-icons/gi";
import { GoAlert } from "react-icons/go";
import { useEffect } from "react";
// import SendMessage from "@/app/pages/api/chat";


function DefaultHomeScreen() {

 

  return (
    <div className="w-full px-10">
      <div className="promptAreaDefault overflow-y-scroll no-scrollbar py-10">
        <div className="defaultScreen flex justify-center items-center flex-col gap-4">
          <div className="logo">
            <Image src={"/conserse.png"} alt="logo" width={250} height={250} />
          </div>
          <div className="starter-template flex gap-6 mx-24">
            <div className="example-area">
              <div className="heading flex flex-col justify-center items-center gap-2">
                <div className="chat-logo">
                  <Icon boxSize={6} as={IoChatbubblesOutline} />
                </div>
                <p className="font-semibold">Examples</p>
              </div>
              <div className="start-message gap-3 flex flex-col mt-3">
                <p className="p-2 bg-gray-100 rounded-full text-sm inline-block">
                  "Explain quantum computing insimple terms"
                </p>
                <p className="p-2 bg-gray-100 rounded-full text-sm inline-block">
                  "Got any creative ideas for a 10year old's birthday?"
                </p>
                <p className="p-2 bg-gray-100 rounded-full text-sm inline-block">
                  "How do I make an HTTP requestin Javascript?"
                </p>
              </div>
            </div>
            <div className="capabilities-area">
              <div className="heading flex flex-col justify-center items-center gap-2">
                <div className="chat-logo">
                  <Icon boxSize={6} as={GiFallingStar} />
                </div>
                <p className="font-semibold">Capabilities</p>
              </div>
              <div className="start-message gap-3 flex flex-col mt-3">
                <p className="p-2 bg-gray-100 rounded-full text-sm inline-block">
                  "Remembers what user saidearlier in the conversation."
                </p>
                <p className="p-2 bg-gray-100 rounded-full text-sm inline-block">
                  "Allows user to provide follow-up corrections."
                </p>
                <p className="p-2 bg-gray-100 rounded-full text-sm inline-block">
                  "Trained to decline inappropriate requests."
                </p>
              </div>
            </div>
            <div className="limitations-area">
              <div className="heading flex flex-col justify-center items-center gap-2">
                <div className="chat-logo">
                  <Icon boxSize={6} as={GoAlert} />
                </div>
                <p className="font-semibold">Limitations</p>
              </div>
              <div className="start-message gap-3 flex flex-col mt-3">
                <p className="p-2 bg-gray-100 rounded-full text-sm inline-block">
                  "May occasionally generate incorrect information."
                </p>
                <p className="p-2 bg-gray-100 rounded-full text-sm inline-block">
                  "May occasionally produce harmful instructions or biased
                  content."
                </p>
                <p className="p-2 bg-gray-100 rounded-full text-sm inline-block">
                  "Limited knowledge of world andevents after 2021."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="inputPrompt mt-3 px-32">
        <CustomInput sendMessage={(text: String) => callFunction(text)} />
      </div> */}
    </div>
  );
}

export default DefaultHomeScreen;
