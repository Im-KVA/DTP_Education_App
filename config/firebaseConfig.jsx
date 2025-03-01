// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfMnz9jD0pZsRgOK5kb-cHp_3xzizYLUI",
  authDomain: "education-app-neu.firebaseapp.com",
  projectId: "education-app-neu",
  storageBucket: "education-app-neu.firebasestorage.app",
  messagingSenderId: "764347997741",
  appId: "1:764347997741:web:f0202bc0ac0eb342e622a4",
  measurementId: "G-05VPKK3F02",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
const analytics = getAnalytics(app);
