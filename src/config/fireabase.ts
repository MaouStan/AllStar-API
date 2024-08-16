import { initializeApp } from 'firebase/app';
import dotenv from 'dotenv';

// App Variables
dotenv.config();

// firebaseConfig
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "anime-allstar.firebaseapp.com",
  projectId: "anime-allstar",
  storageBucket: "anime-allstar.appspot.com",
  messagingSenderId: "217305712714",
  appId: "1:217305712714:web:4cb0c5c53c2a93fc3e7eb3",
  measurementId: "G-8PMXEE8ZYZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
