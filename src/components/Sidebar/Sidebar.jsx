"use client";
import {
  Box,
  VStack,
  IconButton,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai"; // Example icon
import { useEffect, useState } from "react";
import logo from "@/../public/converseLogo.png";
import Image from "next/image";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { CgEditBlackPoint } from "react-icons/cg";
import Link from "next/link";
import useStore from "@/lib/zustand";
import { shallow } from "zustand/shallow";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { dataBase } from "@/firebase/firebase";
import { useMutation, useQuery } from "@tanstack/react-query";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useState(null);
  const isDrawer = useBreakpointValue({ base: true, lg: false });
  const [listMessage, setListMessages] = useState([]);
  const router = useRouter();

  const { setUser, user } = useStore(
    (state) => ({
      setUser: state.setUser,
      user: state.user,
    }),
    shallow
  );
  const { data, isLoading } = useQuery({
    queryKey: "UserCoversationChatLogs",
    queryFn: getMessages,
  });

  async function getMessages() {
    try {
      const q = query(
        collection(dataBase, "messagesIds"),
        where("userId", "==", user?.userId)
      );

      // Wrapping in a Promise to return the result after snapshot
      const messages = await new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const messageList = [];
            querySnapshot.forEach((doc) => {
              messageList.push(doc.data());
            });
            resolve(messageList);
            unsubscribe(); // Stop listening after fetching data
          },
          (error) => {
            console.log("Snapshot error: ", error);
            reject(error);
          }
        );
      });

      return messages;
    } catch (error) {
      console.log("Error fetching messages: ", error);
      return { data: [] };
    }
  }

  const bottomMenu = [
    { key: "clear-conversation", value: "Clear Conversation" },
    { key: "privacy-policy", value: "Privacy Policy" },
    { key: "my-account", value: "My Account" },
    { key: "update-faq", value: "Updates & FAQ" },
    {
      key: "logout",
      value: "Logout",
      onPress: () => {
        setUser(null);
        router.push("/");
      },
    },
  ];

  const dummyHistory = [
    { text: "AI Chat Tool Ethics", id: 1 },
    { text: "Al Chat Tool Impact Writing", id: 2 },
    { text: "AI Chat Tool Ethics", id: 3 },
  ];
  if (isDrawer) {
    return (
      <>
        <Button ref={btnRef} colorScheme="blue" onClick={() => setIsOpen(true)}>
          Open Menu
        </Button>
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={() => setIsOpen(false)}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <VStack spacing={4} align="stretch">
                <div className="logo">
                  <Image src={logo} className="w-[200px]" alt={"logo"} />
                </div>
                <IconButton aria-label="Home" icon={<AiFillHome />} />
                <p>More options...</p>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Box
      w={{ base: "100%", lg: "20%" }}
      p={5}
      borderRight="1px"
      borderColor="gray.200"
      minH="100vh"
    >
      <VStack spacing={4} align="stretch">
        <div className="logo py-2">
          <Image src={logo} className="w-[180px]" alt="logo" />
        </div>
        <Link
          href={`/`}
          className="px-5 py-2 bg-blue-600 rounded-lg flex justify-center items-center"
        >
          <p className="font-semibold text-white">New Chat</p>
        </Link>
        <div className="history flex justify-between items-center bg-gray-100 px-5 py-3 rounded">
          <p className="font-semibold">History</p>
          <IoMdArrowDropdown />
        </div>
        <div className="chatHistory overflow-y-scroll no-scrollbar px-4 py-2">
          {isLoading && (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="sm"
            />
          )}
          {data?.map((val, index) => (
            <Link
              key={index}
              href={`?search=${val?.thread_id}`}
              className="hisData flex items-center gap-2 pb-3"
            >
              <span>
                <CgEditBlackPoint />
              </span>
              {val?.message}
            </Link>
          ))}
        </div>
        <hr />
        <div className="bottom">
          {bottomMenu?.map((item, index) => (
            <div
              className="menu flex items-center gap-3 py-2 cursor-pointer"
              onClick={item?.onPress}
              key={index}
            >
              <span className="icon">
                <CgEditBlackPoint />
              </span>
              {item?.value}
            </div>
          ))}
        </div>
      </VStack>
    </Box>
  );
}

export default Sidebar;
