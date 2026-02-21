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
  salt: string
  createdAt: string
}

const USERS_STORE_KEY = 'auth-users'
const SESSION_KEY = 'auth-session'

async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  )
  const hashArray = Array.from(new Uint8Array(derivedBits))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function generateSalt(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')
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

  const salt = generateSalt()
  const passwordHash = await hashPassword(password, salt)
  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    email,
    displayName,
    passwordHash,
    salt,
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

  const user = users.find(u => u.email === email)
  if (!user) {
    throw new Error('Invalid email or password')
  }

  const passwordHash = await hashPassword(password, user.salt)
  if (passwordHash !== user.passwordHash) {
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
    const timeout = new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 5000))
    const session = await Promise.race([window.spark.kv.get(SESSION_KEY), timeout])
    if (
      session &&
      typeof session === 'object' &&
      typeof (session as AuthUser).id === 'string' &&
      typeof (session as AuthUser).email === 'string' &&
      typeof (session as AuthUser).displayName === 'string'
    ) {
      return session as AuthUser
    }
    return null
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
