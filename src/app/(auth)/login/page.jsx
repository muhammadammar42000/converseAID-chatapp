// pages/login.js
import React from "react";
import logo from "../../../../public/converseLogo.png";
import Image from "next/image";
import CustomerSupport from "../../../../public/conserse.png";
import GoogleLogo from "../../../../public/google.png";
import MicrosoftLogo from "../../../../public/microsoft.png";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 bg-white h-[100vh]">
      {/* Left Column */}
      <div className="hidden md:flex flex-col bg-gradient-to-b from-white to-blue-700">
        <div className="logo ml-10 mt-10">
          <Image src={logo} className="w-[300px]" />
        </div>
        <div className="flex justify-center items-center h-full">
          <Image src={CustomerSupport} className="max-w-full" />
        </div>
      </div>
      {/* Right Column */}
      <div className="p-20 flex flex-col justify-center items-center">
        <form className="px-20">
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
                className=" appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="appearance-none border rounded w-full py-3 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
                className="bg-blue-500 hover:bg-blue-700 text-white py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Login
              </button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
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
                className="w-full flex items-center  border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:shadow-outline mb-2"
              >
                <Image src={GoogleLogo} className="max-w-full w-[30px] mr-2" />
                Continue with Google
              </button>
              <button
                type="button"
                className="w-full flex items-center border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:shadow-outline"
              >
                <Image
                  src={MicrosoftLogo}
                  className="max-w-full w-[20px] mr-3"
                />
                Continue with Microsoft Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
