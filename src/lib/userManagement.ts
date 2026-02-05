export type UserRole = 'owner' | 'admin' | 'member' | 'guest'

export interface User {
  id: string
  username: string
  email: string
  avatar: string
  role: UserRole
  createdAt: Date
  lastLogin: Date
  permissions: Permission[]
}

export interface Permission {
  resource: string
  actions: ('read' | 'write' | 'delete' | 'control')[]
}

export interface RolePermissions {
  role: UserRole
  permissions: Permission[]
  description: string
}

export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'owner',
    description: 'Full system access including user management and billing',
    permissions: [
      { resource: 'devices', actions: ['read', 'write', 'delete', 'control'] },
      { resource: 'scenes', actions: ['read', 'write', 'delete', 'control'] },
      { resource: 'schedules', actions: ['read', 'write', 'delete', 'control'] },
      { resource: 'users', actions: ['read', 'write', 'delete'] },
      { resource: 'analytics', actions: ['read'] },
      { resource: 'settings', actions: ['read', 'write'] },
      { resource: 'integrations', actions: ['read', 'write', 'delete'] },
      { resource: 'goals', actions: ['read', 'write', 'delete'] },
      { resource: 'reports', actions: ['read', 'write'] }
    ]
  },
  {
    role: 'admin',
    description: 'Manage devices, scenes, and schedules but not users or billing',
    permissions: [
      { resource: 'devices', actions: ['read', 'write', 'control'] },
      { resource: 'scenes', actions: ['read', 'write', 'control'] },
      { resource: 'schedules', actions: ['read', 'write', 'control'] },
      { resource: 'analytics', actions: ['read'] },
      { resource: 'settings', actions: ['read', 'write'] },
      { resource: 'integrations', actions: ['read'] },
      { resource: 'goals', actions: ['read', 'write'] },
      { resource: 'reports', actions: ['read'] }
    ]
  },
  {
    role: 'member',
    description: 'Control devices and view analytics but cannot modify settings',
    permissions: [
      { resource: 'devices', actions: ['read', 'control'] },
      { resource: 'scenes', actions: ['read', 'control'] },
      { resource: 'schedules', actions: ['read'] },
      { resource: 'analytics', actions: ['read'] },
      { resource: 'settings', actions: ['read'] },
      { resource: 'goals', actions: ['read'] },
      { resource: 'reports', actions: ['read'] }
    ]
  },
  {
    role: 'guest',
    description: 'View-only access to devices and basic analytics',
    permissions: [
      { resource: 'devices', actions: ['read'] },
      { resource: 'scenes', actions: ['read'] },
      { resource: 'analytics', actions: ['read'] }
    ]
  }
]

export function hasPermission(
  user: User,
  resource: string,
  action: 'read' | 'write' | 'delete' | 'control'
): boolean {
  const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === user.role)
  if (!rolePermissions) return false
  
  const resourcePermission = rolePermissions.permissions.find(p => p.resource === resource)
  if (!resourcePermission) return false
  
  return resourcePermission.actions.includes(action)
}

export function getRolePermissions(role: UserRole): Permission[] {
  const rolePerms = ROLE_PERMISSIONS.find(rp => rp.role === role)
  return rolePerms?.permissions || []
}

export function getRoleDescription(role: UserRole): string {
  const rolePerms = ROLE_PERMISSIONS.find(rp => rp.role === role)
  return rolePerms?.description || ''
}

export function canManageUsers(user: User): boolean {
  return hasPermission(user, 'users', 'write')
}

export function canManageIntegrations(user: User): boolean {
  return hasPermission(user, 'integrations', 'write')
}

export function canControlDevices(user: User): boolean {
  return hasPermission(user, 'devices', 'control')
}

export function canModifySchedules(user: User): boolean {
  return hasPermission(user, 'schedules', 'write')
}

export function canViewAnalytics(user: User): boolean {
  return hasPermission(user, 'analytics', 'read')
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const sparkUser = await window.spark.user()
    
    if (!sparkUser) {
      return null
    }
    
    return {
      id: sparkUser.id.toString(),
      username: sparkUser.login,
      email: sparkUser.email || '',
      avatar: sparkUser.avatarUrl,
      role: sparkUser.isOwner ? 'owner' : 'member',
      createdAt: new Date(),
      lastLogin: new Date(),
      permissions: getRolePermissions(sparkUser.isOwner ? 'owner' : 'member')
    }
  } catch (error) {
    console.error('Failed to get current user:', error)
    return null
  }
}

export function getMockUsers(): User[] {
  return [
    {
      id: 'user-1',
      username: 'john_owner',
      email: 'john@example.com',
      avatar: 'https://i.pravatar.cc/150?img=12',
      role: 'owner',
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date(),
      permissions: getRolePermissions('owner')
    },
    {
      id: 'user-2',
      username: 'sarah_admin',
      email: 'sarah@example.com',
      avatar: 'https://i.pravatar.cc/150?img=45',
      role: 'admin',
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date(Date.now() - 3600000),
      permissions: getRolePermissions('admin')
    },
    {
      id: 'user-3',
      username: 'mike_member',
      email: 'mike@example.com',
      avatar: 'https://i.pravatar.cc/150?img=33',
      role: 'member',
      createdAt: new Date('2024-02-01'),
      lastLogin: new Date(Date.now() - 86400000),
      permissions: getRolePermissions('member')
    },
    {
      id: 'user-4',
      username: 'guest_user',
      email: 'guest@example.com',
      avatar: 'https://i.pravatar.cc/150?img=68',
      role: 'guest',
      createdAt: new Date('2024-02-15'),
      lastLogin: new Date(Date.now() - 172800000),
      permissions: getRolePermissions('guest')
    }
  ]
}

export interface UserInvitation {
  id: string
  email: string
  role: UserRole
  invitedBy: string
  invitedAt: Date
  expiresAt: Date
  status: 'pending' | 'accepted' | 'expired'
  token: string
}

export async function inviteUser(
  email: string,
  role: UserRole,
  invitedBy: string
): Promise<UserInvitation> {
  const invitation: UserInvitation = {
    id: `invite-${Date.now()}`,
    email,
    role,
    invitedBy,
    invitedAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'pending',
    token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
  
  return invitation
}

export function validateRoleHierarchy(currentUserRole: UserRole, targetRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    'owner': 4,
    'admin': 3,
    'member': 2,
    'guest': 1
  }
  
  return roleHierarchy[currentUserRole] > roleHierarchy[targetRole]
}
