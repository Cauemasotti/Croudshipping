// Tipos de dados
export interface User {
  id: string
  name: string
  email: string
  password: string
  phone: string
  location: string
  userType: "sender" | "traveler"
  createdAt: string
}

export interface Package {
  id: string
  userId: string
  name: string
  description: string
  size: string
  weight: string
  origin: string
  destination: string
  deliveryDate: string
  budget: string
  category: string
  specialInstructions?: string
  status: "pending" | "accepted" | "in-transit" | "delivered" | "cancelled"
  createdAt: string
}

export interface PaymentMethod {
  id: string
  userId: string
  cardType: string
  cardholderName: string
  maskedCardNumber: string
  lastFourDigits: string
  expiryMonth: string
  expiryYear: string
  createdAt: string
}

// Funções auxiliares
const generateId = () => Math.random().toString(36).substring(2, 15)

// Inicializar o armazenamento local se não existir
const initializeStorage = () => {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]))
  }
  if (!localStorage.getItem("packages")) {
    localStorage.setItem("packages", JSON.stringify([]))
  }
  if (!localStorage.getItem("paymentMethods")) {
    localStorage.setItem("paymentMethods", JSON.stringify([]))
  }
  if (!localStorage.getItem("currentUser")) {
    localStorage.setItem("currentUser", JSON.stringify(null))
  }
}

// Funções de autenticação
export const registerUser = (
  userData: Omit<User, "id" | "createdAt">,
): { success: boolean; user?: User; error?: string } => {
  try {
    initializeStorage()

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")

    // Verificar se o email já existe
    if (users.some((user) => user.email === userData.email)) {
      return { success: false, error: "Email already exists" }
    }

    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    // Definir usuário atual
    localStorage.setItem("currentUser", JSON.stringify(newUser))

    return { success: true, user: newUser }
  } catch (error) {
    return { success: false, error: "Failed to register user" }
  }
}

export const loginUser = (email: string, password: string): { success: boolean; user?: User; error?: string } => {
  try {
    initializeStorage()

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    // Definir usuário atual
    localStorage.setItem("currentUser", JSON.stringify(user))

    return { success: true, user }
  } catch (error) {
    return { success: false, error: "Failed to login" }
  }
}

export const logoutUser = (): { success: boolean; error?: string } => {
  try {
    localStorage.setItem("currentUser", JSON.stringify(null))
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to logout" }
  }
}

export const getCurrentUser = (): { user: User | null } => {
  try {
    initializeStorage()
    const user = JSON.parse(localStorage.getItem("currentUser") || "null")
    return { user }
  } catch (error) {
    return { user: null }
  }
}

// Funções para pacotes
export const addPackage = (
  packageData: Omit<Package, "id" | "userId" | "status" | "createdAt">,
): { success: boolean; package?: Package; error?: string } => {
  try {
    initializeStorage()

    const { user } = getCurrentUser()
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    const packages: Package[] = JSON.parse(localStorage.getItem("packages") || "[]")

    const newPackage: Package = {
      ...packageData,
      id: generateId(),
      userId: user.id,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    packages.push(newPackage)
    localStorage.setItem("packages", JSON.stringify(packages))

    return { success: true, package: newPackage }
  } catch (error) {
    return { success: false, error: "Failed to add package" }
  }
}

export const getUserPackages = (): { success: boolean; packages?: Package[]; error?: string } => {
  try {
    initializeStorage()

    const { user } = getCurrentUser()
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    const allPackages: Package[] = JSON.parse(localStorage.getItem("packages") || "[]")
    const userPackages = allPackages.filter((p) => p.userId === user.id)

    return { success: true, packages: userPackages }
  } catch (error) {
    return { success: false, error: "Failed to get packages" }
  }
}

// Funções para métodos de pagamento
export const addPaymentMethod = (
  paymentData: Omit<PaymentMethod, "id" | "userId" | "createdAt">,
): { success: boolean; paymentMethod?: PaymentMethod; error?: string } => {
  try {
    initializeStorage()

    const { user } = getCurrentUser()
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    const paymentMethods: PaymentMethod[] = JSON.parse(localStorage.getItem("paymentMethods") || "[]")

    const newPaymentMethod: PaymentMethod = {
      ...paymentData,
      id: generateId(),
      userId: user.id,
      createdAt: new Date().toISOString(),
    }

    paymentMethods.push(newPaymentMethod)
    localStorage.setItem("paymentMethods", JSON.stringify(paymentMethods))

    return { success: true, paymentMethod: newPaymentMethod }
  } catch (error) {
    return { success: false, error: "Failed to add payment method" }
  }
}

export const getUserPaymentMethods = (): { success: boolean; paymentMethods?: PaymentMethod[]; error?: string } => {
  try {
    initializeStorage()

    const { user } = getCurrentUser()
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    const allPaymentMethods: PaymentMethod[] = JSON.parse(localStorage.getItem("paymentMethods") || "[]")
    const userPaymentMethods = allPaymentMethods.filter((p) => p.userId === user.id)

    return { success: true, paymentMethods: userPaymentMethods }
  } catch (error) {
    return { success: false, error: "Failed to get payment methods" }
  }
}

// Inicializar com alguns dados de exemplo
export const initializeWithSampleData = () => {
  // Verificar se já existem dados
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  if (users.length > 0) return

  // Usuário de exemplo
  const sampleUser: User = {
    id: "sample-user-1",
    name: "John Doe",
    email: "demo@example.com",
    password: "password",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    userType: "sender",
    createdAt: new Date().toISOString(),
  }

  // Pacotes de exemplo
  const samplePackages: Package[] = [
    {
      id: "sample-package-1",
      userId: "sample-user-1",
      name: "Small Electronics Package",
      description: "A small package containing electronics",
      size: "Small",
      weight: "1.5",
      origin: "New York",
      destination: "London",
      deliveryDate: "2023-06-15",
      budget: "50",
      category: "electronics",
      status: "in-transit",
      createdAt: new Date().toISOString(),
    },
    {
      id: "sample-package-2",
      userId: "sample-user-1",
      name: "Documents Envelope",
      description: "Important documents that need to be delivered",
      size: "Small",
      weight: "0.5",
      origin: "London",
      destination: "Paris",
      deliveryDate: "2023-05-22",
      budget: "30",
      category: "documents",
      status: "in-transit",
      createdAt: new Date().toISOString(),
    },
  ]

  // Método de pagamento de exemplo
  const samplePaymentMethod: PaymentMethod = {
    id: "sample-payment-1",
    userId: "sample-user-1",
    cardType: "visa",
    cardholderName: "John Doe",
    maskedCardNumber: "**** **** **** 4242",
    lastFourDigits: "4242",
    expiryMonth: "05",
    expiryYear: "25",
    createdAt: new Date().toISOString(),
  }

  // Salvar dados de exemplo
  localStorage.setItem("users", JSON.stringify([sampleUser]))
  localStorage.setItem("packages", JSON.stringify(samplePackages))
  localStorage.setItem("paymentMethods", JSON.stringify([samplePaymentMethod]))
}
