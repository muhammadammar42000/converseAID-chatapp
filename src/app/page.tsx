"use client";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar/Sidebar";
import MainScreen from "@/components/MainScreen/MainScreen";
import LoginScreen from "@/app/(auth)/login/page";
import useStore from "@/lib/zustand";
import { shallow } from "zustand/shallow";
import React, { Suspense, useEffect, useState } from "react";
import Notification from "@/components/Notification/notification";

const Home = () => {
  const [loading, isLoading] = useState(true)
  const { user, setNotify, notify } = useStore(
    (state: any) => ({
      user: state.user,
      setNotify: state?.setNotify,
      notify: state.notify
    }),
    shallow
  );



  useEffect(() => {
    setTimeout(() => {
      isLoading(false)
    }, 500)
  }, [])

  return (
    <Suspense fallback={<p>Loading feed...</p>}>
      {loading ?
        <Box style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <div className="loader"></div>
        </Box>
        :
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
      }
    </Suspense>

  );
};

export default Home;
