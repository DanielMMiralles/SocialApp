import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBMkZyAjxwpIDcIfBm54xLTXL2eMm5L4xg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "prefab-clover-408416.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "prefab-clover-408416",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "prefab-clover-408416.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "965045026265",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:965045026265:web:c0d13d075223e64c332dc8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app