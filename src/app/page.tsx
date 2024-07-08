import { Flex } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar/Sidebar";
import MainScreen from "@/components/MainScreen/MainScreen";

const Home = () => {
  return (
    <div>
      <Flex direction={{ base: "column", lg: "row" }}>
        <Sidebar />
        <MainScreen />
      </Flex>
    </div>
  );
};

export default Home;
