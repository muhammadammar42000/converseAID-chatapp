import { Flex } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar/Sidebar";
import DefaultHomeScreen from "@/components/DefaultHomeScreen/DefaultHomeScreen";
// import MainScreen from "@/components/MainScreen/MainScreen";


const Home = () => {
  return (
    <div>
      <Flex direction={{ base: "column", lg: "row" }}>
        <Sidebar />
        <DefaultHomeScreen />
      </Flex>
    </div>
  );
};

export default Home;
