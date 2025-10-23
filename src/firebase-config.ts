// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore"


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMy6D-5nzMbCUavklRVp7gEsiPcNxnfik",
  authDomain: "spelling-blitz.firebaseapp.com",
  projectId: "spelling-blitz",
  storageBucket: "spelling-blitz.firebasestorage.app",
  messagingSenderId: "419625393497",
  appId: "1:419625393497:web:09dad9015f4dfe6dd34048"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)