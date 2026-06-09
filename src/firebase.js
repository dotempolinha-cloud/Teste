import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGHcJnG8djTUZGNVYieoGCAWPjxGbPPU8",
  authDomain: "armazenamento-fa018.firebaseapp.com",
  projectId: "armazenamento-fa018",
  storageBucket: "armazenamento-fa018.firebasestorage.app",
  messagingSenderId: "841315789028",
  appId: "1:841315789028:web:ec6dee9e831af9e92064f1",
  measurementId: "G-88XL8W7Q6J"
}; 

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);