"use client";
import { Flex } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar/Sidebar";
// import DefaultHomeScreen from "@/components/DefaultHomeScreen/DefaultHomeScreen";
import MainScreen from "@/components/MainScreen/MainScreen";
import LoginScreen from "@/app/(auth)/login/page";
import useStore from "@/lib/zustand";
import { shallow } from "zustand/shallow";
import { useEffect, useState } from "react";

const Home = () => {
  const { user ,notify,setNotify} = useStore(
    (state: any) => ({
      user: state.user,
      notify:state.notify,
      setNotify:state.setNotify
    }),
    shallow
  );

 
  return (
    <div>
      <Flex direction={{ base: "column", lg: "row" }}>
        {user ? (
          <>
            <Sidebar />
            <MainScreen  />
          </>

        ):
        <LoginScreen />
      }

      
      </Flex>
    </div>
  );
};

export default Home;
