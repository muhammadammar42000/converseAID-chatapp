"use client";
import { Flex } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar/Sidebar";
import MainScreen from "@/components/MainScreen/MainScreen";
import LoginScreen from "@/app/(auth)/login/page";
import useStore from "@/lib/zustand";
import { shallow } from "zustand/shallow";
import React from "react";

const Home = () => {
  const { user, n } = useStore(
    (state: any) => ({
      user: state.user,
    }),
    shallow
  );

  return (
    <div>
      <Flex direction={{ base: "column", lg: "row" }}>
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
