// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHXAj4V3z-amaDomYqE3WwhxeJ2fiMr-s",
  authDomain: "frotaapp-5a606.firebaseapp.com",
  projectId: "frotaapp-5a606",
  storageBucket: "frotaapp-5a606.appspot.com",
  messagingSenderId: "897780434318",
  appId: "1:897780434318:web:e241a4e6aca8abdc6850df",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
