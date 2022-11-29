// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// np
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_FIREBASE_KEY,
  authDomain: "todo-86b5f.firebaseapp.com",
  databaseURL: "https://todo-86b5f-default-rtdb.firebaseio.com",
  projectId: "todo-86b5f",
  storageBucket: "todo-86b5f.appspot.com",
  messagingSenderId: "460705203671",
  appId: "1:460705203671:web:35659b9cd4b8c87ecdb792"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage }