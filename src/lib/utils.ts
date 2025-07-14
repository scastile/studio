import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwQk3r_VwT4uR8f5Y2yN9xZ1mG7jO_kCg",
  authDomain: "librarylaunchpad-148a0.firebaseapp.com",
  projectId: "librarylaunchpad-148a0",
  storageBucket: "librarylaunchpad-148a0.appspot.com",
  messagingSenderId: "67252277484",
  appId: "1:67252277484:web:e3a24a355651c65f4c4a4c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
