import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Guard against re-init in hot reload
let app
if (!globalThis.__FIREBASE_APP__) {
  app = initializeApp(firebaseConfig)
  globalThis.__FIREBASE_APP__ = app
} else {
  app = globalThis.__FIREBASE_APP__
}

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
// Always prompt account selection to avoid silent failures
googleProvider.setCustomParameters({ prompt: 'select_account' })
