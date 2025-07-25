
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const firebaseConfig = {
  apiKey: "AIzaSyA_...SAMPLE...",
  authDomain: "librarylaunchpad-default-rtdb.firebaseapp.com",
  projectId: "librarylaunchpad-default-rtdb",
  storageBucket: "librarylaunchpad-default-rtdb.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890abcdef",
  databaseURL: "https://librarylaunchpad-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
