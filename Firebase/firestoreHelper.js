import { db } from "./FirebaseSetup";
import {
  onSnapshot, collection, addDoc, deleteDoc, setDoc,
  doc, updateDoc, getDocs, getDoc, documentId, query, where, arrayRemove
} from "firebase/firestore";

export const getUser = async (id) => {
  const querySnapshot = await getDocs(collection(db, "users"));
  for (let i = 0; i < querySnapshot.docs.length; i++) {
    if (querySnapshot.docs[i].id === id) {
      return querySnapshot.docs[i].data();
    }
  }
}

export const updateUser = async (id, user) => {
  return await updateDoc(doc(db, "users", id), user);
}

export const addUser = async (uid, user) => {
  try {
    await setDoc(doc(db, "users", uid), user);
    console.log("User added to Firestore:", user);
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
    throw error; // Throw error so it's caught in SignupScreen
  }
};

