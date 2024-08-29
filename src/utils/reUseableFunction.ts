import { dataBase } from "@/firebase/firebase";
import { addDoc, collection } from "firebase/firestore";

const callFunction = async (
  ObjData?: Object | any,
  headerType?: string,
  thread_id?: string,
  user?: any
) => {
  try {
    const response = await fetch("/pages/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-custom-header": headerType || "",
      },
      body: JSON.stringify(ObjData),
    });
    const data = await response.json();
    if (response.ok) {
      if (data?.data?.messages?.length === 2 && headerType === "handler-one") {
        addDoc(collection(dataBase, "messagesIds"), {
          message: ObjData?.prompt ?? thread_id,
          thread_id: thread_id,
          userId: user?.userId,
        })
          .then(() => {})
          .catch((error) => {
            console.log(error);
          });
      }
      return data;
    } else {
      console.log(data?.error);
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return error;
  }
};

export  { callFunction,};
