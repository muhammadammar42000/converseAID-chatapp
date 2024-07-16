import Sidebar from "@/components/Sidebar/Sidebar";
import MainScreen from "@/components/MainScreen/MainScreen";

const SinglePostPage = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      <Sidebar />
      <MainScreen />
    </div>
  );
};

export default SinglePostPage;
