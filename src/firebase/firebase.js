import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDDADXfS0YDxLqCMghOvHIKMf5oyodm12s",
    authDomain: "king-burger-15159.firebaseapp.com",
    projectId: "king-burger-15159",
    storageBucket: "king-burger-15159.appspot.com",
    messagingSenderId: "141598057118",
    appId: "1:141598057118:web:70857ecc50d0cfe81a518f",
    measurementId: "G-TKCRY71NLF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const firestorage = getStorage(app);
const auth = getAuth(app)

export { firestore, firestorage, auth }