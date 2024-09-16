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
import { useRouter, useSearchParams } from "next/navigation";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { dataBase } from "@/firebase/firebase";

function Sidebar() {

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const btnRef = useState(null);
  const router = useRouter();

  const isDrawer = useBreakpointValue({ base: true, lg: false });
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState([]);

  const search = searchParams.get("search");
  const { setUser, user } = useStore(
    (state) => ({
      setUser: state.setUser,
      user: state.user,
    }),
    shallow
  );
  useEffect(() => {
    if (user?.userId) {
      const q = query(
        collection(dataBase, "messagesIds"),
        where("userId", "==", user?.userId)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messageList = [];
        querySnapshot.forEach((doc) => {
          messageList.push(doc.data());
        });
        setMessages(messageList); // Update the UI immediately
      });

      // Clean up listener when component unmounts
      return () => unsubscribe();
    }
  }, [user?.userId]);

  // const { data, isLoading } = useQuery({
  //   queryKey: ["UserCoversationChatLogs"],
  //   queryFn: getMessages,
  // });
  async function deleteThread() {
    setLoading(true);
    try {
      let ObjData = {
        data: { text: null, thread_id: search, oldMessages: [] },
        handler: "handler-three",
        thread_id: search,
        user: user,
      };
      const response = await fetch("/pages/api", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ObjData),
      });
      if (response) {
        // Query the collection where the unique field matches the value
        const q = query(
          collection(dataBase, "messagesIds"),
          where("thread_id", "==", search)
        );

        // Execute the query
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // Since the field is unique, we expect only one document
          const documentSnapshot = querySnapshot.docs[0]; // Get the first and only document
          const docRef = doc(dataBase, "messagesIds", documentSnapshot.id); // get document ID
          await deleteDoc(docRef); // delete the document
          router.push("/");
          setLoading(false);
        } else {
          console.log("No document found with the given unique field value.");
        }
      }
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  }
  // async function getMessages() {
  //   const q = query(
  //     collection(dataBase, "messagesIds"),
  //     where("userId", "==", user?.userId)
  //   );

  //   return new Promise((resolve, reject) => {
  //     const unsubscribe = onSnapshot(
  //       q,
  //       (querySnapshot) => {
  //         const messageList = [];
  //         querySnapshot.forEach((doc) => {
  //           messageList.push(doc.data());
  //         });
  //         resolve(messageList);
  //       },
  //       (error) => {
  //         console.log("Snapshot error: ", error);
  //         reject(error);
  //       }
  //     );

  //     // Optional: You can return unsubscribe if you want to manually unsubscribe later
  //     return () => unsubscribe();
  //   });
  // }
  const bottomMenu = [
    {
      key: "clear-conversation",
      value: "Clear Conversation",
      onPress: () => {
        if (!loading) deleteThread();
      },
    },
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
          {false && (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="sm"
            />
          )}
          {messages?.map((val, index) => (
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
              className="menu flex items-center gap-3 py-2 cursor-pointer row center"
              onClick={item?.onPress}
              key={index}
            >
              <span className="icon">
                <CgEditBlackPoint />
              </span>
              {item?.value}

              {item.value == "Clear Conversation" && loading && (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="sm"
                />
              )}
            </div>
          ))}
        </div>
      </VStack>
    </Box>
  );
}

export default Sidebar;
