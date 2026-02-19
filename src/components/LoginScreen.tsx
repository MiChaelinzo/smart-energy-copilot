import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lightning, UserCircle, SignIn, UserPlus, Sparkle, Eye, EyeSlash } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { registerUser, loginUser, type AuthUser } from '@/lib/auth'

interface LoginScreenProps {
  onLogin: (user: AuthUser) => void
  onDemoMode: () => void
}

export function LoginScreen({ onLogin, onDemoMode }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all required fields')
      return
    }

    if (mode === 'register' && !displayName) {
      toast.error('Please enter a display name')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)
    try {
      let user: AuthUser
      if (mode === 'register') {
        user = await registerUser(email, password, displayName)
        toast.success('Account created successfully!')
      } else {
        user = await loginUser(email, password)
        toast.success(`Welcome back, ${user.displayName}!`)
      }
      setIsExiting(true)
      setTimeout(() => onLogin(user), 300)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoMode = () => {
    setIsExiting(true)
    setTimeout(() => onDemoMode(), 300)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(114,200,200,0.15),transparent_60%),radial-gradient(circle_at_80%_20%,rgba(100,150,255,0.12),transparent_50%)] pointer-events-none" />

      <div className="relative h-full flex flex-col items-center justify-center p-4 overflow-y-auto gap-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <Lightning className="w-10 h-10 text-primary" weight="fill" />
            <div className="absolute inset-0 bg-primary blur-xl opacity-50" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Smart Energy Copilot</h1>
            <p className="text-sm text-muted-foreground">AI-Powered Energy Management</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: isExiting ? 0 : 1,
            scale: isExiting ? 0.95 : 1
          }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 shadow-2xl overflow-hidden relative">
            <motion.div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{ backgroundSize: '200% 100%' }}
            />

            <CardHeader className="text-center space-y-2 pt-8 pb-4">
              <motion.div className="flex justify-center" whileHover={{ scale: 1.05 }}>
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-card to-secondary text-primary">
                  <UserCircle className="w-12 h-12" weight="duotone" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription>
                {mode === 'login'
                  ? 'Sign in to access your personal energy dashboard'
                  : 'Create an account to save your devices and data'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {mode === 'register' && (
                    <motion.div
                      key="displayName"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        placeholder="Enter your name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        autoComplete="name"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    >
                      <Sparkle className="w-4 h-4" />
                    </motion.div>
                  ) : mode === 'login' ? (
                    <SignIn className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {isLoading
                    ? 'Please wait...'
                    : mode === 'login'
                      ? 'Sign In'
                      : 'Create Account'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleDemoMode}
              >
                <Lightning className="w-4 h-4" weight="fill" />
                Continue with Demo Mode
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {mode === 'login' ? (
                  <p>
                    Don&apos;t have an account?{' '}
                    <button
                      onClick={() => setMode('register')}
                      className="text-primary hover:underline font-medium"
                    >
                      Create one
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      onClick={() => setMode('login')}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-muted-foreground text-center max-w-sm"
        >
          Demo mode uses shared sample data. Create an account for your own private devices and data.
        </motion.p>
      </div>
    </motion.div>
  )
}
