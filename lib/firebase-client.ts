// CLIENT-SIDE FIREBASE CONFIGURATION
// This file is for client-side Firebase usage only (auth, firestore, etc.)

import { initializeApp, getApps } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Updated Firebase config with the correct credentials
const firebaseConfig = {
  apiKey: "AIzaSyD0g9XkaGWdLHpYXUWfayAWGztS70Lr0S8",
  authDomain: "ahlms-ddef5.firebaseapp.com",
  projectId: "ahlms-ddef5",
  storageBucket: "ahlms-ddef5.firebasestorage.app",
  messagingSenderId: "591009406199",
  appId: "1:591009406199:web:6c1f05e2096d7a2780c7f2",
}

// Initialize Firebase client only if it hasn't been initialized
const apps = getApps()
const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0]

// Export Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Auth helpers
export const signInWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const signUpWithEmail = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const signOut = async () => {
  return firebaseSignOut(auth)
}

export const resetPassword = async (email: string) => {
  return sendPasswordResetEmail(auth, email)
}

export const updatePassword = async (newPassword: string) => {
  const user = auth.currentUser
  if (user) {
    return firebaseUpdatePassword(user, newPassword)
  }
  throw new Error("No user is signed in")
}

// Firestore helpers
export const getUserProfile = async (userId: string) => {
  const { doc, getDoc } = await import("firebase/firestore")
  const userRef = doc(db, "users", userId)
  const userSnap = await getDoc(userRef)
  return userSnap.exists() ? userSnap.data() : null
}

export const getUserEnrollments = async (userId: string) => {
  const { collection, query, where, getDocs } = await import("firebase/firestore")
  const enrollmentsRef = collection(db, "enrollments")
  const q = query(enrollmentsRef, where("userId", "==", userId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => doc.data().courseId)
}
