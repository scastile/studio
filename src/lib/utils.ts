
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const firebaseConfig = {
  apiKey: "your-firebase-api-key",
  authDomain: "your-firebase-auth-domain",
  projectId: "your-firebase-project-id",
  storageBucket: "your-firebase-storage-bucket",
  messagingSenderId: "your-firebase-messaging-sender-id",
  appId: "1:789012345678:web:abcdef1234567890abcdef",
  databaseURL: "https://librarylaunchpad-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
