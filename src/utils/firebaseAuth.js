/**
 * firebaseAuth.js
 * ─────────────────────────────────────────────────────────────────────────
 * Shared Firebase Google Sign-In helper.
 *
 * SETUP (one-time):
 *   1. npm install firebase
 *   2. Create src/firebase.js (see bottom of this file for the config shape)
 *   3. Add your Firebase config values to .env:
 *        VITE_FIREBASE_API_KEY=...
 *        VITE_FIREBASE_AUTH_DOMAIN=...
 *        VITE_FIREBASE_PROJECT_ID=...
 *        VITE_FIREBASE_APP_ID=...
 *
 * Usage:
 *   import { signInWithGoogle } from "../utils/firebaseAuth";
 *
 *   const { idToken, user } = await signInWithGoogle();
 *   // POST { provider:"google", idToken } to /api/user-signup
 * ─────────────────────────────────────────────────────────────────────────
 */

import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";

/* ── Firebase config (reads from .env via Vite) ── */
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

/* ── Init app (guard against double-init in dev hot-reload) ── */
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/* Ask Google to always show the account-picker, even if only one account
   is signed in. Remove this line if you prefer silent re-auth. */
googleProvider.setCustomParameters({ prompt: "select_account" });

/**
 * signInWithGoogle()
 * Opens the Google account-picker popup via Firebase.
 * Returns { idToken, user } on success.
 * Throws an Error on cancellation or failure.
 *
 * idToken  → send to your backend as { provider:"google", idToken }
 * user     → Firebase user object (displayName, email, photoURL, uid)
 */
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);

  /* Firebase gives us a fresh short-lived id_token we can verify server-side */
  const idToken = await result.user.getIdToken();

  return {
    idToken,
    user: {
      uid:         result.user.uid,
      email:       result.user.email,
      displayName: result.user.displayName,
      photoURL:    result.user.photoURL,
    },
  };
}

/**
 * signOutFirebase()
 * Clears the Firebase session. Call this alongside your own app logout.
 */
export async function signOutFirebase() {
  await firebaseSignOut(auth);
}

export { auth };