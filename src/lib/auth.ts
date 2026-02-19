export interface AuthUser {
  id: string
  email: string
  displayName: string
  createdAt: string
}

export interface StoredUser {
  id: string
  email: string
  displayName: string
  passwordHash: string
  createdAt: string
}

const USERS_STORE_KEY = 'auth-users'
const SESSION_KEY = 'auth-session'

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function getStoredUsers(): Promise<StoredUser[]> {
  try {
    const data = await window.spark.kv.get(USERS_STORE_KEY)
    return data ? (data as StoredUser[]) : []
  } catch {
    return []
  }
}

async function saveStoredUsers(users: StoredUser[]): Promise<void> {
  await window.spark.kv.set(USERS_STORE_KEY, users)
}

export async function registerUser(
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> {
  const users = await getStoredUsers()

  if (users.some(u => u.email === email)) {
    throw new Error('An account with this email already exists')
  }

  const passwordHash = await hashPassword(password)
  const newUser: StoredUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    email,
    displayName,
    passwordHash,
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  await saveStoredUsers(users)

  const authUser: AuthUser = {
    id: newUser.id,
    email: newUser.email,
    displayName: newUser.displayName,
    createdAt: newUser.createdAt
  }

  await window.spark.kv.set(SESSION_KEY, authUser)
  return authUser
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthUser> {
  const users = await getStoredUsers()
  const passwordHash = await hashPassword(password)

  const user = users.find(u => u.email === email && u.passwordHash === passwordHash)
  if (!user) {
    throw new Error('Invalid email or password')
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt
  }

  await window.spark.kv.set(SESSION_KEY, authUser)
  return authUser
}

export async function logoutUser(): Promise<void> {
  await window.spark.kv.delete(SESSION_KEY)
}

export async function getSession(): Promise<AuthUser | null> {
  try {
    const session = await window.spark.kv.get(SESSION_KEY)
    return session ? (session as AuthUser) : null
  } catch {
    return null
  }
}

/**
 * Returns a KV key prefix for the current user.
 * Demo mode (no user) returns empty string for backwards compatibility.
 * Logged-in users get a unique prefix so their data is isolated.
 */
export function getUserKVPrefix(userId: string | null): string {
  if (!userId) return ''
  return `user-${userId}-`
}
