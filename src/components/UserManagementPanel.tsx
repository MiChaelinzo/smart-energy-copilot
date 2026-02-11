import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { 
  User as UserIcon, 
  UserPlus, 
  Crown, 
  ShieldCheck,
  Users as UsersIcon,
  Eye,
  PencilSimple,
  Trash,
  Check,
  X,
  EnvelopeSimple
} from '@phosphor-icons/react'
import { 
  User, 
  UserRole, 
  getCurrentUser, 
  getMockUsers, 
  hasPermission,
  canManageUsers,
  getRoleDescription,
  inviteUser,
  UserInvitation,
  validateRoleHierarchy
} from '@/lib/userManagement'
import { ensureDate } from '@/lib/utils'
import { toast } from 'sonner'

export function UserManagementPanel() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useKV<User[]>('system-users', getMockUsers())
  const [invitations, setInvitations] = useKV<UserInvitation[]>('user-invitations', [])
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<UserRole>('member')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  useEffect(() => {
    loadCurrentUser()
  }, [])

  const loadCurrentUser = async () => {
    const user = await getCurrentUser()
    setCurrentUser(user)
  }

  const handleInviteUser = async () => {
    if (!currentUser || !canManageUsers(currentUser)) {
      toast.error('You do not have permission to invite users')
      return
    }

    if (!inviteEmail || !inviteRole) {
      toast.error('Please enter an email and select a role')
      return
    }

    if (!validateRoleHierarchy(currentUser.role, inviteRole)) {
      toast.error('You cannot invite users with a role equal to or higher than yours')
      return
    }

    try {
      const invitation = await inviteUser(inviteEmail, inviteRole, currentUser.id)
      setInvitations(current => [...(current || []), invitation])
      
      toast.success(`Invitation sent to ${inviteEmail}`)
      setInviteEmail('')
      setInviteRole('member')
      setShowInviteDialog(false)
    } catch (error) {
      toast.error('Failed to send invitation')
    }
  }

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    if (!currentUser || !canManageUsers(currentUser)) {
      toast.error('You do not have permission to modify user roles')
      return
    }

    if (!validateRoleHierarchy(currentUser.role, newRole)) {
      toast.error('You cannot assign a role equal to or higher than yours')
      return
    }

    setUsers(current => 
      (current || []).map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    )
    toast.success('User role updated')
    setShowEditDialog(false)
    setEditingUser(null)
  }

  const handleRemoveUser = (userId: string) => {
    if (!currentUser || !canManageUsers(currentUser)) {
      toast.error('You do not have permission to remove users')
      return
    }

    const userToRemove = users?.find(u => u.id === userId)
    if (userToRemove && !validateRoleHierarchy(currentUser.role, userToRemove.role)) {
      toast.error('You cannot remove users with a role equal to or higher than yours')
      return
    }

    setUsers(current => (current || []).filter(u => u.id !== userId))
    toast.success('User removed')
  }

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return <Badge className="bg-warning text-warning-foreground"><Crown className="w-3 h-3 mr-1" weight="fill" />Owner</Badge>
      case 'admin':
        return <Badge className="bg-primary text-primary-foreground"><ShieldCheck className="w-3 h-3 mr-1" weight="fill" />Admin</Badge>
      case 'member':
        return <Badge variant="secondary"><UserIcon className="w-3 h-3 mr-1" />Member</Badge>
      case 'guest':
        return <Badge variant="outline"><Eye className="w-3 h-3 mr-1" />Guest</Badge>
    }
  }

  const canModifyUser = (targetUser: User): boolean => {
    if (!currentUser || !canManageUsers(currentUser)) return false
    return validateRoleHierarchy(currentUser.role, targetUser.role)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground mt-1">Manage users and their access permissions</p>
        </div>
        
        {currentUser && canManageUsers(currentUser) && (
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button size="lg">
                <UserPlus className="w-5 h-5 mr-2" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite New User</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your Smart Energy Copilot system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as UserRole)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentUser.role === 'owner' && <SelectItem value="admin">Admin</SelectItem>}
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    {getRoleDescription(inviteRole)}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowInviteDialog(false)}>Cancel</Button>
                <Button onClick={handleInviteUser}>Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {currentUser && (
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary">
              <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
              <AvatarFallback>{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xl font-bold">{currentUser.username}</p>
                {getRoleBadge(currentUser.role)}
              </div>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {getRoleDescription(currentUser.role)}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-3 mb-4">
          <UsersIcon className="w-6 h-6 text-primary" weight="fill" />
          <h3 className="text-xl font-semibold">System Users ({users?.length || 0})</h3>
        </div>

        <div className="space-y-3">
          {users?.map((user) => (
            <div 
              key={user.id} 
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{user.username}</p>
                  {getRoleBadge(user.role)}
                  {user.id === currentUser?.id && (
                    <Badge variant="outline" className="text-xs">You</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {/* FIX: Use ensureDate to handle date strings from useKV */}
                <p className="text-xs text-muted-foreground">
                  Last login: {ensureDate(user.lastLogin).toLocaleDateString()} {ensureDate(user.lastLogin).toLocaleTimeString()}
                </p>
              </div>

              {currentUser && canModifyUser(user) && user.id !== currentUser.id && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditingUser(user)
                      setShowEditDialog(true)
                    }}
                  >
                    <PencilSimple className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemoveUser(user.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {invitations && invitations.length > 0 && currentUser && canManageUsers(currentUser) && (
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-4">
            <EnvelopeSimple className="w-6 h-6 text-accent" weight="fill" />
            <h3 className="text-xl font-semibold">Pending Invitations ({invitations.filter(i => i.status === 'pending').length})</h3>
          </div>

          <div className="space-y-3">
            {invitations.filter(i => i.status === 'pending').map((invitation) => (
              <div 
                key={invitation.id} 
                className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border"
              >
                <EnvelopeSimple className="w-8 h-8 text-accent" />
                <div className="flex-1">
                  <p className="font-medium">{invitation.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getRoleBadge(invitation.role)}
                    {/* FIX: Use ensureDate for invitation dates as well */}
                    <span className="text-xs text-muted-foreground">
                      Invited {ensureDate(invitation.invitedAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Expires {ensureDate(invitation.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setInvitations(current => 
                      (current || []).filter(i => i.id !== invitation.id)
                    )
                    toast.success('Invitation cancelled')
                  }}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role and permissions for {editingUser?.username}
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={editingUser.avatar} alt={editingUser.username} />
                  <AvatarFallback>{editingUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{editingUser.username}</p>
                  <p className="text-sm text-muted-foreground">{editingUser.email}</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-role">New Role</Label>
                <Select 
                  value={editingUser.role} 
                  onValueChange={(value) => setEditingUser({ ...editingUser, role: value as UserRole })}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentUser?.role === 'owner' && <SelectItem value="admin">Admin</SelectItem>}
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  {getRoleDescription(editingUser.role)}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditDialog(false)
              setEditingUser(null)
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (editingUser) {
                handleUpdateUserRole(editingUser.id, editingUser.role)
              }
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

