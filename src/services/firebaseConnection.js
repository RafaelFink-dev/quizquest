import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBNVQCc1cEdNFecjk4g81LsIR7HJ2n2j2A",
    authDomain: "quizquest-a34fa.firebaseapp.com",
    projectId: "quizquest-a34fa",
    storageBucket: "quizquest-a34fa.appspot.com",
    messagingSenderId: "720149990613",
    appId: "1:720149990613:web:a26b5c50eec589147be65c"
  };
  
  const firebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  export {auth, db, storage};