// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'

import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { GoogleAuthProvider } from "firebase/auth";

// import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_APP_DATABASE,

  

}
// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const imagesStorage = getStorage(app)
export const dataBase = getFirestore(app)
export const auth = getAuth(app)
// export const provider = new GoogleAuthProvider();
// provider.addScope('profile');
// provider.addScope('https://www.googleapis.com/auth/user.gender.read')
// provider.addScope('https://www.googleapis.com/auth/user.birthday.read')

// const analytics = getAnalytics(app)
