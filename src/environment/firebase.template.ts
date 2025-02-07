import { provideFirebaseApp } from "@angular/fire/app";
import { provideAuth } from "@angular/fire/auth";
import { getDatabase, provideDatabase } from "@angular/fire/database";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export const firebaseProviders = [
  provideFirebaseApp(() => initializeApp(firebaseConfig)),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()),
  provideDatabase(() => getDatabase()),
];
