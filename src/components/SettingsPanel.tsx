import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { 
  GraduationCap, 
  Bell, 
  Palette, 
  Database, 
  ShieldCheck,
  CircleNotch,
  CheckCircle,
  Warning
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SettingsPanelProps {
  onReplayWelcomeTour: () => void
}

export function SettingsPanel({ onReplayWelcomeTour }: SettingsPanelProps) {
  const [notifications, setNotifications] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [autoOptimize, setAutoOptimize] = useState(true)
  const [isClearing, setIsClearing] = useState(false)

  const handleReplayTour = () => {
    toast.info('Restarting welcome tour...')
    setTimeout(() => {
      onReplayWelcomeTour()
    }, 500)
  }

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to clear all application data? This action cannot be undone.')) {
      return
    }

    setIsClearing(true)
    
    try {
      const keys = await window.spark.kv.keys()
      for (const key of keys) {
        await window.spark.kv.delete(key)
      }
      
      toast.success('All data cleared successfully')
      
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      toast.error('Failed to clear data')
      console.error(error)
    } finally {
      setIsClearing(false)
    }
  }

  const handleExportData = async () => {
    try {
      const keys = await window.spark.kv.keys()
      const data: Record<string, any> = {}
      
      for (const key of keys) {
        data[key] = await window.spark.kv.get(key)
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `energy-copilot-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Data exported successfully')
    } catch (error) {
      toast.error('Failed to export data')
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Settings</h2>
        <p className="text-muted-foreground">
          Manage your application preferences and data
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <GraduationCap className="w-5 h-5 text-primary" weight="duotone" />
            </div>
            <div>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Learn how to use Smart Energy Copilot</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
            <div className="space-y-1">
              <p className="font-medium">Welcome Tour</p>
              <p className="text-sm text-muted-foreground">
                Replay the onboarding experience and setup guide
              </p>
            </div>
            <Button onClick={handleReplayTour} variant="outline" className="gap-2">
              <GraduationCap className="w-4 h-4" />
              Replay Tour
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Bell className="w-5 h-5 text-accent" weight="duotone" />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Control your notification preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts about energy usage and device status
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={(checked) => {
                setNotifications(checked)
                toast.success(checked ? 'Notifications enabled' : 'Notifications disabled')
              }}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="sound">Sound Effects</Label>
              <p className="text-sm text-muted-foreground">
                Play sounds for actions and alerts
              </p>
            </div>
            <Switch
              id="sound"
              checked={soundEffects}
              onCheckedChange={(checked) => {
                setSoundEffects(checked)
                toast.success(checked ? 'Sound effects enabled' : 'Sound effects disabled')
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Palette className="w-5 h-5 text-success" weight="duotone" />
            </div>
            <div>
              <CardTitle>Automation</CardTitle>
              <CardDescription>Configure automatic optimization settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-optimize">Auto Optimization</Label>
              <p className="text-sm text-muted-foreground">
                Let AI automatically optimize device schedules
              </p>
            </div>
            <Switch
              id="auto-optimize"
              checked={autoOptimize}
              onCheckedChange={(checked) => {
                setAutoOptimize(checked)
                toast.success(checked ? 'Auto optimization enabled' : 'Auto optimization disabled')
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Database className="w-5 h-5 text-warning" weight="duotone" />
            </div>
            <div>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export or clear your application data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
            <div className="space-y-1">
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-muted-foreground">
                Download a backup of all your settings and data
              </p>
            </div>
            <Button onClick={handleExportData} variant="outline" className="gap-2">
              <Database className="w-4 h-4" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="space-y-1">
              <p className="font-medium text-destructive">Clear All Data</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete all application data and reset to defaults
              </p>
            </div>
            <Button 
              onClick={handleClearData} 
              variant="destructive" 
              className="gap-2"
              disabled={isClearing}
            >
              {isClearing ? (
                <>
                  <CircleNotch className="w-4 h-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Warning className="w-4 h-4" />
                  Clear Data
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShieldCheck className="w-5 h-5 text-primary" weight="duotone" />
            </div>
            <div>
              <CardTitle>About</CardTitle>
              <CardDescription>Application information and version</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Version</span>
            <span className="text-sm font-mono">3.1.0</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Platform</span>
            <span className="text-sm font-mono">Spark Template</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" weight="fill" />
              <span className="text-sm text-success">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
