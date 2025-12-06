import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBYwOGZLQhjVg5zISA8NkjwA24I03BjzR4",
    authDomain: "officeinventory-7b63a.firebaseapp.com",
    projectId: "officeinventory-7b63a",
    storageBucket: "officeinventory-7b63a.firebasestorage.app",
    messagingSenderId: "855044612500",
    appId: "1:855044612500:web:f6bbe910a3e7eefd002f81"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);