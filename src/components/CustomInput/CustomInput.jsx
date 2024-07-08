"use client";
import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Icon,
} from "@chakra-ui/react";
import { BsPaperclip, BsSearch, BsX } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import youtubeLogo from "@/../public/youtube.png";
import googleCalender from "@/../public/calender.png";
import gmailLogo from "@/../public/gmail.png";
import spotifyLogo from "@/../public/spotify.png";
import Image from "next/image";
import { GoPaperAirplane } from "react-icons/go";

const CustomInput = () => {
  const dropdownMenuIcons = [
    youtubeLogo,
    googleCalender,
    gmailLogo,
    spotifyLogo,
  ];

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
              {dropdownMenuIcons?.map((logo) => (
                <MenuItem minWidth="full" backgroundColor="#f7f9fb">
                  <div className="social p-2 bg-white shadow-md rounded-full">
                    <Image src={logo} className="w-6" />
                  </div>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </div>
        <div className=" flex gap-3">
          <div className="voice-option ">
            <Icon boxSize={6} as={MdOutlineKeyboardVoice} />
          </div>
          <div className="upload-image-option">
            <Icon boxSize={6} as={CiImageOn} />
          </div>
        </div>
      </div>
      <div className="search-input w-full ml-2">
        <Input
          placeholder="Type message"
          border="none"
          _focus={{
            border: "none",
            outline: "none",
            boxShadow: "none",
          }}
        />
      </div>
      <div className="submit mr-2">
        <Button>
          <Icon as={GoPaperAirplane} />
        </Button>
      </div>
    </div>
  );
};

export default CustomInput;
