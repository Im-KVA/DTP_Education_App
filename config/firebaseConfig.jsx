// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  browserSessionPersistence,
  setPersistence,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Your web app's Firebase configuration
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
const db = getFirestore(app);

let auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
  setPersistence(auth, browserSessionPersistence);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

export { auth, db };
