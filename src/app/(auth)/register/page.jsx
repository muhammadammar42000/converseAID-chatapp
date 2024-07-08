"use client";
import React from "react";
import Image from "next/image";
import logo from "../../../../public/converseLogo.png";
import CustomerSupport from "../../../../public/conserse.png";
import Link from "next/link";

const RegisterPage = () => {
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
            <h2 className="text-2xl font-bold mb-2">Account Signup</h2>
            <p className="text-gray-500">
              Become a member and enjoy exclusive promotions.
            </p>
          </div>
          <hr />
          <div className="registerForm no-scrollbar overflow-y-scroll">
            <div className="mb-4 mt-6">
              <label
                className="block text-gray-500 text-sm font-semibold mb-2"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                className=" appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
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
            <div className="mb-4 mt-6">
              <label
                className="block text-gray-500 text-sm font-semibold mb-2"
                htmlFor="gender"
              >
                Gender
              </label>
              <select
                name=""
                id="gender"
                className="appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="selectOption">Select Option</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4 mt-6">
              <label
                className="block text-gray-500 text-sm font-semibold mb-2"
                htmlFor="email"
              >
                Data Of Birth
              </label>
              <input
                type="date"
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

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Signup
              </button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-500 hover:text-blue-800 font-semibold"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
