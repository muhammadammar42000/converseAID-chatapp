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

type CustomInputProps = {
  sendMessage?: (text: string) => void;
  loading?: boolean
};

const CustomInput: React.FC<CustomInputProps> = ({ sendMessage = () => { }, loading }) => {
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
          <div className="voice-option">
            <Icon boxSize={6} as={MdOutlineKeyboardVoice} />
          </div>
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
        // onKeyPress={(e) => e.key === 'Enter' && !loading && handleUserInput()}

        />
      </div>
      <div className="submit mr-2">
        <Button onClick={handleSendMessage} isLoading={loading}>
          <Icon as={GoPaperAirplane} />
        </Button>
      </div>
    </div>
  );
};

export default CustomInput;
