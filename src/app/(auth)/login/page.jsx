// pages/login.js
"use client";
import React, { useState } from "react";
import logo from "../../../../public/converseLogo.png";
import Image from "next/image";
import CustomerSupport from "../../../../public/conserse.png";
import GoogleLogo from "../../../../public/google.png";
import MicrosoftLogo from "../../../../public/microsoft.png";
import Link from "next/link";
import {
  fetchSignInMethodsForEmail,
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import * as Yup from "yup";
import { useFormik } from "formik";
import useStore from "@/lib/zustand";
import { shallow } from "zustand/shallow";
import { auth, dataBase } from "@/firebase/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Spinner, useToast } from "@chakra-ui/react";

const LoginPage = () => {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [microsoftLoading, setMicrosoftLoading] = useState(false);

  const { setUser, setNotify } = useStore(
    (state) => ({
      setUser: state.setUser,
      setNotify: state.setNotify,
    }),
    shallow
  );
  const handleSubmit = async (values) => {
    const { email, password } = values;
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const usersRef = collection(dataBase, "users");

        const q = query(usersRef, where("userId", "==", user.uid));

        // Adjust "users" to your specific collection name
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setLoading(false);
          const userDataOne = querySnapshot.docs[0].data();
          // Combine user auth data with Firestore data
          console.log(userDataOne, "----");
          const userData = { uid: user.uid, email: user.email, ...userDataOne };
          console.log(userData);
          setUser(userData); // Assuming you have a setUser function to set user state
          // setSnackbarMessage('Sign in successful!')
          // setSnackbarSeverity('success')
          // setOpenSnackbar(true)
        } else {
          setLoading(false);

          // Handle case where user data does not exist in Firestore
          console.error("No user data found in Firestore");
          // setSnackbarMessage('No user data found.')
          // setSnackbarSeverity('error')
          // setOpenSnackbar(true)
        }
        // You can redirect the user to another page or update the UI accordingly
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // setErrors({ email: errorMessage })
        // setSnackbarMessage(errorMessage)
        // setSnackbarSeverity('error')
        // setOpenSnackbar(true)
        toast({
          position: "top-right",
          status: "error",
          title: errorCode ?? "Invalid Credential",
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);

        console.error(errorCode, errorMessage);
      });
  };

  const microsoftLogin = async () => {
    const auth = getAuth();
    setMicrosoftLoading(true);
    const provider = new OAuthProvider("microsoft.com");

    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Microsoft Access Token.
      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      const usersRef = collection(dataBase, "users");
      const q = query(usersRef, where("userId", "==", result?.user?.uid));
      // Adjust "users" to your specific collection name
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setMicrosoftLoading(false);
        const userDataOne = querySnapshot.docs[0].data();
        // Combine user auth data with Firestore data
        const userData = {
          uid: userDataOne?.userId,
          email: userDataOne.email,
          ...userDataOne,
        };
        setUser(userData); // Assuming you have a setUser function to set user state
        toast({
          position: "top-right",
          status: "success",
          title: "Login Successfully",
          duration: 9000,
          isClosable: true,
        });
      } else {
        const userData = {
          active: true,
          accessToken: accessToken,
          createAt: new Date(),
          updatedAt: new Date(),
          email: result?.user?.email,
          name: result?.user?.displayName,
          userId: result?.user?.uid,
        };
        try {
          addDoc(collection(dataBase, "users"), userData).then(() => {
            setMicrosoftLoading(false);

            setUser(userData); // Assuming you have a setUser function to set user state'
            toast({
              position: "top-right",
              status: "success",
              title: "Login Successfully",
              duration: 9000,
              isClosable: true,
            });
          });
        } catch (e) {
          setLoading(false);
          console.error("Error adding document: ", e);
        }
      }
      // This gives you a Google Access Token. You can use it to access the Google API.
    } catch (error) {
      setMicrosoftLoading(false);

      setNotify({
        open: true,
        type: "error",
        message: `Error during Microsoft login`,
      });

      console.error("Error during Microsoft login:", error);
    }
  };

  const initialValues = {
    email: null,
    password: null,
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6).required("Required"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission, e.g., send data to a backend API
      handleSubmit(values);
    },
  });

  const googleLogin = () => {
    setGoogleLoading(true);
    const auth = getAuth();

    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/user.birthday.read");
    provider.addScope("https://www.googleapis.com/auth/user.gender.read");

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const usersRef = collection(dataBase, "users");
        const q = query(usersRef, where("userId", "==", result?.user?.uid));
        // Adjust "users" to your specific collection name
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setGoogleLoading(false);
          const userDataOne = querySnapshot.docs[0].data();
          // Combine user auth data with Firestore data
          const userData = {
            uid: userDataOne?.userId,
            email: userDataOne.email,
            ...userDataOne,
          };
          setUser(userData); // Assuming you have a setUser function to set user state
          toast({
            position: "top-right",
            status: "success",
            title: "Login Successfully",
            duration: 9000,
            isClosable: true,
          });
        } else {
          const userData = {
            active: true,
            createAt: new Date(),
            updatedAt: new Date(),
            email: result?.user?.email,
            name: result?.user?.displayName,
            userId: result?.user?.uid,
          };
          try {
            addDoc(collection(dataBase, "users"), userData).then(() => {
              setGoogleLoading(false);

              setUser(userData); // Assuming you have a setUser function to set user state'
              toast({
                position: "top-right",
                status: "success",
                title: "Login Successfully",
                duration: 9000,
                isClosable: true,
              });
            });
          } catch (e) {
            setLoading(false);
            console.error("Error adding document: ", e);
          }
        }
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
      })
      .catch(async (error) => {
        setGoogleLoading(false);

        if (error.code === "auth/account-exists-with-different-credential") {
          // The email is already associated with another provider
          const email = error.customData.email;
          const methods = await fetchSignInMethodsForEmail(auth, email);

          if (methods.length > 0) {
            alert(
              `This email is already associated with ${methods[0]}. Please use that method to log in.`
            );
          } else {
            alert(
              "This email is already associated with another account. Please try a different login method."
            );
          }
        } else {
          // Handle other errors
          console.error("Error during sign-in:", error);
        }
      });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 bg-white h-[100vh]">
      {/* Left Column */}
      <div className="hidden md:flex flex-col bg-gradient-to-b from-white to-blue-700">
        <div className="logo ml-10 mt-10">
          <Image src={logo} className="w-[300px]" alt="logo" />
        </div>
        <div className="flex justify-center items-center h-full">
          <Image
            src={CustomerSupport}
            className="max-w-full"
            alt="CustomerSupport"
          />
        </div>
      </div>
      {/* Right Column */}
      <div className="p-20 flex flex-col justify-center items-center">
        <form className="px-20" onSubmit={formik.handleSubmit}>
          <div className="text-left mb-6">
            <h2 className="text-2xl font-bold mb-2">Account Login</h2>
            <p className="text-gray-500">
              If you are already a member you can login with your email address
              and password.
            </p>
          </div>
          <hr />

          <div className="loginForm no-scrollbar overflow-y-scroll">
            <div className="mb-4 mt-6">
              <label
                className="block text-gray-500 text-sm font-semibold mb-2"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className=" appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={formik.handleChange}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-500 text-sm font-semibold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="appearance-none border rounded w-full py-3 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                onChange={formik.handleChange}
              />
            </div>
            <div className="mb-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-600"
                />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                {loading ? (
                  <div class="text-center">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        class="inline w-8 h-8 text-gray-200 animate-spin dark:text-white-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <p>Login</p>
                )}
              </button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don t have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-500 hover:text-blue-800 font-semibold"
                >
                  Sign up here
                </Link>
              </p>
            </div>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => googleLogin()}
                className="w-full flex items-center  border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:shadow-outline mb-2"
              >
                <Image
                  src={GoogleLogo}
                  className="max-w-full w-[30px] mr-2"
                  alt="GoogleLogo"
                />
                Continue with Google
          
                {googleLoading && (
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="sm"
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => microsoftLogin()}
                className="w-full flex items-center border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:shadow-outline"
              >
                <Image
                  src={MicrosoftLogo}
                  className="max-w-full w-[20px] mr-3"
                />
                Continue with Microsoft Account
                {microsoftLoading && (
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="sm"
                  />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
