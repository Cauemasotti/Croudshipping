import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc } from "firebase/firestore"

// Sua configuração do Firebase
// Você precisará substituir isso com suas próprias credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "crowdshipping-xxxxx.firebaseapp.com",
  projectId: "crowdshipping-xxxxx",
  storageBucket: "crowdshipping-xxxxx.appspot.com",
  messagingSenderId: "xxxxxxxxxxxx",
  appId: "1:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxx",
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Funções de autenticação
export const registerUser = async (email: string, password: string, userData: any) => {
  try {
    // Criar usuário com email e senha
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Salvar dados adicionais do usuário no Firestore
    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      email,
      createdAt: new Date().toISOString(),
    })

    return { success: true, user }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Funções para pacotes
export const addPackage = async (packageData: any, userId: string) => {
  try {
    const docRef = await addDoc(collection(db, "packages"), {
      ...packageData,
      userId,
      createdAt: new Date().toISOString(),
      status: "pending",
    })
    return { success: true, id: docRef.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const getUserPackages = async (userId: string) => {
  try {
    const q = query(collection(db, "packages"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    const packages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return { success: true, packages }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Funções para viagens
export const addTrip = async (tripData: any, userId: string) => {
  try {
    const docRef = await addDoc(collection(db, "trips"), {
      ...tripData,
      userId,
      createdAt: new Date().toISOString(),
      status: "active",
    })
    return { success: true, id: docRef.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const getUserTrips = async (userId: string) => {
  try {
    const q = query(collection(db, "trips"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    const trips = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return { success: true, trips }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Funções para métodos de pagamento
export const addPaymentMethod = async (paymentData: any, userId: string) => {
  try {
    const docRef = await addDoc(collection(db, "paymentMethods"), {
      ...paymentData,
      userId,
      createdAt: new Date().toISOString(),
    })
    return { success: true, id: docRef.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const getUserPaymentMethods = async (userId: string) => {
  try {
    const q = query(collection(db, "paymentMethods"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    const paymentMethods = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return { success: true, paymentMethods }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export { auth, db }
