import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjeLKkCPhSTMP7u4xEE-Wt6J6KqcKYfbU",
  authDomain: "sga-upanema.firebaseapp.com",
  projectId: "sga-upanema",
  storageBucket: "sga-upanema.firebasestorage.app",
  messagingSenderId: "706064247719",
  appId: "1:706064247719:web:b798154ea80b62d983a482",
  measurementId: "G-CCPERFVNPV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);