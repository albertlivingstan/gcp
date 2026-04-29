import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBgtk6vFDLpBlbj0j3hJ9jw81IihJS6HLM",
  authDomain: "studio-1203603784-3ff3a.firebaseapp.com",
  projectId: "studio-1203603784-3ff3a",
  storageBucket: "studio-1203603784-3ff3a.firebasestorage.app",
  messagingSenderId: "563438947070",
  appId: "1:563438947070:web:50295afce2b23a3c3433af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
