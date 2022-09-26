import { initializeApp } from 'firebase/app'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgsSmqdGOPvPOsIUS29asx448ruI_1YEM",
  authDomain: "tpaweb-55827.firebaseapp.com",
  projectId: "tpaweb-55827",
  storageBucket: "tpaweb-55827.appspot.com",
  messagingSenderId: "409531283588",
  appId: "1:409531283588:web:33485f6ae34b5c554b2ad1",
  measurementId: "G-2DCQ0XLJ9R"
};

export const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export { db }


