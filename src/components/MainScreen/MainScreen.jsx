"use client";
import { Box } from "@chakra-ui/react";
import CustomInput from "@/components/CustomInput/CustomInput";
import Image from "next/image";
import logo from "@/../public/logo.png";
import { MdThumbUp, MdThumbDown } from "react-icons/md";

function MainScreen() {
  return (
    <div className="w-full px-10">
      <div className="propmtArea overflow-y-scroll no-scrollbar py-10">
        {/* <div className="text-right">
          <p className="px-5 bg-[#d9d9d9] py-3 rounded-full inline-block ml-auto">
            Various versions have evolved{" "}
          </p>
        </div> */}

        <div className="conversation">
          <div className="me flex justify-end">
            <p className="px-5 bg-[#d9d9d9] py-3 rounded-full inline-block">
              Various versions have evolved
            </p>
          </div>

          <div className="bot flex justify-start">
            <div className="bot-logo border w-[50px] h-[50px] rounded-full flex justify-center items-center">
              <Image src={logo} className="w-[40px]" />
            </div>
            <div className="reply  ml-3">
              <p className="px-5 py-3 rounded-full inline-block">
                It has survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised.
              </p>
              <div className="like-dislike flex gap-2 px-5">
                <div className="like text-blue-500">
                  <MdThumbUp size="20px" />
                </div>
                <div className="dislike text-gray-500">
                  <MdThumbDown size="20px" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="conversation">
          <div className="me flex justify-end">
            <p className="px-5 bg-[#d9d9d9] py-3 rounded-full inline-block">
              Various versions have evolved
            </p>
          </div>

          <div className="bot flex justify-start">
            <div className="bot-logo border w-[50px] h-[50px] rounded-full flex justify-center items-center">
              <Image src={logo} className="w-[40px]" />
            </div>
            <div className="reply  ml-3">
              <p className="px-5 py-3 rounded-full inline-block">
                It has survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>
              <div className="like-dislike flex gap-2 px-5">
                <div className="like text-blue-500">
                  <MdThumbUp size="20px" />
                </div>
                <div className="dislike text-gray-500">
                  <MdThumbDown size="20px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="inputPrompt mt-3 px-32">
        <CustomInput />
      </div>
    </div>
  );
}

export default MainScreen;
