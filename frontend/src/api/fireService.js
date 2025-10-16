import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebase";


export async function createTodo(todoData) {
  const docRef = await addDoc(collection(db, 'todos'), todoData);
  return docRef.id;
}

export async function getAllTodo() {
  const snapshot = await getDocs(collection(db, 'todos'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


export async function updateTodo({ todoId, updates }) {
  const docRef = doc(db, 'todos', todoId);
  await updateDoc(docRef, updates);
  return { id: todoId, ...updates };
}

export async function deleteTodo(todoId) {
  await deleteDoc(doc(db, 'todos', todoId));
}

export async function getTodosByUserId(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const q = query(
    collection(db, 'todos'),
    where('author.id', '==', userId)
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}