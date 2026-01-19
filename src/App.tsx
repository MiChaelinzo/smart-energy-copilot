import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dashboard } from '@/components/Dashboard'
import { DevicesPanel } from '@/components/DevicesPanel'
import { AnalyticsPanel } from '@/components/AnalyticsPanel'
import { ScenesPanel } from '@/components/ScenesPanel'
import { AIAssistant } from '@/components/AIAssistant'
import { NotificationCenter } from '@/components/NotificationCenter'
import { MOCK_DEVICES, MOCK_SCENES, MOCK_NOTIFICATIONS } from '@/lib/mockData'
import { Device, SmartScene, Notification } from '@/types'
import { Lightning, BellRinging } from '@phosphor-icons/react'

function App() {
  const [devices, setDevices] = useKV<Device[]>('energy-devices', MOCK_DEVICES)
  const [scenes, setScenes] = useKV<SmartScene[]>('energy-scenes', MOCK_SCENES)
  const [notifications, setNotifications] = useKV<Notification[]>('energy-notifications', MOCK_NOTIFICATIONS)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const unreadCount = (notifications || []).filter(n => !n.read).length

  const handleDeviceToggle = (deviceId: string) => {
    setDevices((currentDevices) => {
      if (!currentDevices) return MOCK_DEVICES
      return currentDevices.map(device =>
        device.id === deviceId
          ? {
              ...device,
              isOn: !device.isOn,
              power: !device.isOn ? (device.power || 100) : 0,
              lastUpdate: new Date()
            }
          : device
      )
    })
  }

  const handleSceneToggle = (sceneId: string) => {
    setScenes((currentScenes) => {
      if (!currentScenes) return MOCK_SCENES
      return currentScenes.map(scene =>
        scene.id === sceneId
          ? { ...scene, active: !scene.active }
          : scene
      )
    })
  }

  const handleNotificationRead = (notificationId: string) => {
    setNotifications((currentNotifications) => {
      if (!currentNotifications) return MOCK_NOTIFICATIONS
      return currentNotifications.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    })
  }

  const handleMarkAllRead = () => {
    setNotifications((currentNotifications) => {
      if (!currentNotifications) return MOCK_NOTIFICATIONS
      return currentNotifications.map(notif => ({ ...notif, read: true }))
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((currentDevices) => {
        if (!currentDevices) return MOCK_DEVICES
        return currentDevices.map(device => {
          if (device.isOn && device.type !== 'sensor') {
            const variance = (Math.random() - 0.5) * 20
            return {
              ...device,
              power: Math.max(0, device.power + variance),
              lastUpdate: new Date()
            }
          }
          return device
        })
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [setDevices])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(114,200,200,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(100,150,255,0.08),transparent_50%)] pointer-events-none" />
      
      <div className="relative">
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Lightning className="w-8 h-8 text-primary" weight="fill" />
                  <div className="absolute inset-0 bg-primary blur-xl opacity-50" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Smart Energy Copilot</h1>
                  <p className="text-sm text-muted-foreground">AI-Powered Energy Management</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg hover:bg-accent/10 transition-colors"
                >
                  <BellRinging className="w-6 h-6 text-foreground" weight={unreadCount > 0 ? 'fill' : 'regular'} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="scenes">Scenes</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <Dashboard devices={devices || MOCK_DEVICES} />
            </TabsContent>

            <TabsContent value="devices" className="space-y-6">
              <DevicesPanel
                devices={devices || MOCK_DEVICES}
                onDeviceToggle={handleDeviceToggle}
              />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <AnalyticsPanel devices={devices || MOCK_DEVICES} />
            </TabsContent>

            <TabsContent value="scenes" className="space-y-6">
              <ScenesPanel
                scenes={scenes || MOCK_SCENES}
                devices={devices || MOCK_DEVICES}
                onSceneToggle={handleSceneToggle}
              />
            </TabsContent>
          </Tabs>
        </main>

        <AIAssistant
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          devices={devices || MOCK_DEVICES}
        />

        <NotificationCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifications || MOCK_NOTIFICATIONS}
          onMarkAsRead={handleNotificationRead}
          onMarkAllRead={handleMarkAllRead}
        />

        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-6 right-6 bg-accent hover:bg-accent/90 text-accent-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-40"
        >
          <Lightning className="w-6 h-6" weight="fill" />
        </button>
      </div>
    </div>
  )
}

export default App