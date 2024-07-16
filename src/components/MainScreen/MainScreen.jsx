"use client";
import { Box } from "@chakra-ui/react";
import CustomInput from "@/components/CustomInput/CustomInput";
import Image from "next/image";
import logo from "@/../public/logo.png";
import { MdThumbUp, MdThumbDown } from "react-icons/md";
import botImg from "@/../public/bot.png";
import youtubeThumbnail from "@/../public/fifa-Screenshot.png";

function MainScreen() {
  let data = [
    {
      me: "Various versions have evolved",
      bot: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised",
    },
    {
      me: "Various versions have evolved",
      bot: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised",
    },
    {
      me: "Various versions have evolved",
      bot: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised",
      link: "www.youtube.com",
    },
  ];

  return (
    <div className="w-full">
      <div
        className="fixed top-0 w-full h-[200px] z-50 flex justify-center items-center"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      >
        <Image src={botImg} alt="Bot Image" width={150} height={150} />
      </div>

      <div className="propmtArea overflow-y-scroll no-scrollbar p-10">
        <div className="conversation">
          {data?.map((item) => (
            <>
              <div className="me flex justify-end">
                <p className="px-5 bg-[#d9d9d9] py-3 rounded-full inline-block">
                  {item?.me}
                </p>
              </div>

              <div className="bot flex justify-start">
                <div className="bot-logo border w-[50px] h-[50px] rounded-full flex justify-center items-center">
                  <Image src={logo} className="w-[40px]" />
                </div>
                <div className="reply  ml-3">
                  <p className="px-5 py-3 rounded-full inline-block">
                    {item?.link ? (
                      <>
                        <div className="youtube p-3 shadow-md rounded-lg">
                          <Image src={youtubeThumbnail} width={500} />
                        </div>
                      </>
                    ) : (
                      item?.bot
                    )}
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
            </>
          ))}
        </div>
      </div>
      <div className="inputPrompt mt-3 px-32">
        <CustomInput />
      </div>
    </div>
  );
}

export default MainScreen;
