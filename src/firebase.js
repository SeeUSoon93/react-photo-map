// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5S7AcPcZxO6REiDdiT5eE_nWUNvNJrkg",
  authDomain: "yugi-421113.firebaseapp.com",
  projectId: "yugi-421113",
  storageBucket: "yugi-421113.appspot.com",
  messagingSenderId: "479221181792",
  appId: "1:479221181792:web:3459cc2b53572584500205",
  measurementId: "G-MZF5CVXWXX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, provider, db, storage };
