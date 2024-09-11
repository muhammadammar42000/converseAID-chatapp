"use client";
import { Flex } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar/Sidebar";
import MainScreen from "@/components/MainScreen/MainScreen";
import LoginScreen from "@/app/(auth)/login/page";
import useStore from "@/lib/zustand";
import { shallow } from "zustand/shallow";
import React from "react";
import Notification from "@/components/Notification/notification";

const Home = () => {
  const { user, setNotify, notify } = useStore(
    (state: any) => ({
      user: state.user,
      setNotify: state?.setNotify,
      notify: state.notify
    }),
    shallow
  );

  return (
    <div>
      <Flex direction={{ base: "column", lg: "row" }}>
        <Notification notify={notify} setNotify={setNotify} />
        {user ? (
          <>
            <Sidebar />
            <MainScreen />
          </>

        ) :
          <LoginScreen />
        }


      </Flex>

    </div>
  );
};

export default Home;
