"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "../../../../public/converseLogo.png";
import CustomerSupport from "../../../../public/conserse.png";
import Link from "next/link";
import * as Yup from 'yup'
import { useFormik } from 'formik'
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, dataBase } from "@/firebase/firebase";
import { addDoc, collection } from "firebase/firestore";

import { useRouter } from 'next/navigation';  
import { useToast } from "@chakra-ui/react";


const RegisterPage = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter();  
  const toast= useToast()



  const submitFrom = (values,) => {
  const{email,password}= values
    setLoading(true)
    // Implement your Firebase sign-up logic here
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Handle successful signup, e.g., updating user profile with name and type
delete values.password
delete values.confirmPassword
        const userData = {
          ...values,
          active: true,
          createAt: new Date(),
          updatedAt: new Date(),
          userId: userCredential?.user.uid,
        }
        try {
          addDoc(collection(dataBase, 'users'), userData).then(() => {
            setLoading(false)

            router.push('/') // Redirect to login or another page
          })
        } catch (e) {
          setLoading(false)
          console.error('Error adding document: ', e)
        }
      })
      .catch((error) => {
        const errorCode = error.code
       
        toast({
          position: 'top-right',
          status: 'error',
          title: errorCode,
          duration: 9000,
          isClosable: true
        })
        setLoading(false)

      })
  }
  const initialValues = {
    email: null,
    name: null,
    gender: null,
    dateofbirth: null,
    confirmPassword: null,
    password: null
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(' Full name required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    gender: Yup.string().required('gender is required'),
    dateofbirth: Yup.string().required(),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required(' Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Password is required'),
  })



  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Handle form submission, e.g., send data to a backend API
      submitFrom(values)
    }
  })
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldTouched,
  } = formik;
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
        <form className="px-20" onSubmit={formik.handleSubmit}>
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

                id="name"
                name='name'
                className=" appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleChange}

              />
              <ErrorMessage touched={formik.touched} errors={errors} name="name" />

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
                name="email"
                onChange={handleChange}

                className=" appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage touched={formik.touched} errors={errors} name="email" />

            </div>
            <div className="mb-4 mt-6">
              <label
                className="block text-gray-500 text-sm font-semibold mb-2"
                htmlFor="gender"
              >
                Gender
              </label>
              <select
                onChange={handleChange}
                name="gender"
                id="gender"
                className="appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="selectOption">Select Option</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <ErrorMessage touched={formik.touched} errors={errors} name="gender" />

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
                onChange={handleChange}

                id="dateofbirth"
                name='dateofbirth'
                className=" appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage touched={formik.touched} errors={errors} name="dateofbirth" />

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
                name='password'
                onChange={handleChange}

                className="appearance-none border rounded w-full py-3 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage touched={formik.touched} errors={errors} name="password" />

            </div>
            <div className="mb-6">
              <label
                className="block text-gray-500 text-sm font-semibold mb-2"
                htmlFor="password"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name='confirmPassword'
                onChange={handleChange}
                className="appearance-none border rounded w-full py-3 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage touched={formik.touched} errors={errors} name="confirmPassword" />

            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                {loading ? <div class="text-center">
                  <div role="status">
                    <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-white-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </div>
                </div> : <p>Signup</p>}

              </button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/"
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
