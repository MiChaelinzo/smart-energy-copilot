import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dashboard } from '@/components/Dashboard'
import { DevicesPanel } from '@/components/DevicesPanel'
import { AnalyticsPanel } from '@/components/AnalyticsPanel'
import { ScenesPanel } from '@/components/ScenesPanel'
import { AIAssistant } from '@/components/AIAssistant'
import { NotificationCenter } from '@/components/NotificationCenter'
import { VoiceControlPanel } from '@/components/VoiceControlPanel'
import { VoiceButton } from '@/components/VoiceButton'
import { EnergyGoalsPanel } from '@/components/EnergyGoalsPanel'
import { DeviceScheduler } from '@/components/DeviceScheduler'
import { CostAnalyticsPanel } from '@/components/CostAnalyticsPanel'
import { EnergyReports } from '@/components/EnergyReports'
import { TotalSummaryPanel } from '@/components/TotalSummaryPanel'
import { QuickStatsBar } from '@/components/QuickStatsBar'
import { ComparisonPanel } from '@/components/ComparisonPanel'
import { ElectricityPricingPanel } from '@/components/ElectricityPricingPanel'
import { MaintenanceAlertsPanel } from '@/components/MaintenanceAlertsPanel'
import { AchievementsPanel } from '@/components/AchievementsPanel'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { TuyaIntegration } from '@/components/TuyaIntegration'
import { AdaptiveScheduling } from '@/components/AdaptiveScheduling'
import { TabSearch } from '@/components/TabSearch'
import { TabFilter } from '@/components/TabFilter'
import { 
  MOCK_DEVICES, 
  MOCK_SCENES, 
  MOCK_NOTIFICATIONS, 
  MOCK_GOALS, 
  MOCK_SCHEDULES,
  MOCK_ELECTRICITY_RATES,
  MOCK_MAINTENANCE_ALERTS,
  MOCK_ACHIEVEMENTS
} from '@/lib/mockData'
import { Device, SmartScene, Notification, EnergyGoal, DeviceSchedule, ElectricityRate, MaintenanceAlert, Achievement, TuyaCredentials, TuyaDevice, AdaptiveSchedule, AIScheduleRecommendation } from '@/types'
import { mockTuyaDeviceDiscovery } from '@/lib/tuyaApi'
import { generateAIScheduleRecommendations, convertRecommendationToSchedule } from '@/lib/aiScheduling'
import { 
  Lightning, 
  BellRinging, 
  ChartBar, 
  Devices as DevicesIcon,
  Lightbulb,
  Target,
  Calendar,
  Brain,
  Plug,
  CurrencyDollar,
  ChartLine,
  Wrench,
  Trophy,
  FileText,
  ArrowsClockwise,
  Stack
} from '@phosphor-icons/react'
import { toast } from 'sonner'

function App() {
  const [devices, setDevices] = useKV<Device[]>('energy-devices', MOCK_DEVICES)
  const [scenes, setScenes] = useKV<SmartScene[]>('energy-scenes', MOCK_SCENES)
  const [notifications, setNotifications] = useKV<Notification[]>('energy-notifications', MOCK_NOTIFICATIONS)
  const [goals, setGoals] = useKV<EnergyGoal[]>('energy-goals', MOCK_GOALS)
  const [schedules, setSchedules] = useKV<DeviceSchedule[]>('device-schedules', MOCK_SCHEDULES)
  const [electricityRates] = useKV<ElectricityRate[]>('electricity-rates', MOCK_ELECTRICITY_RATES)
  const [maintenanceAlerts, setMaintenanceAlerts] = useKV<MaintenanceAlert[]>('maintenance-alerts', MOCK_MAINTENANCE_ALERTS)
  const [achievements] = useKV<Achievement[]>('achievements', MOCK_ACHIEVEMENTS)
  const [hasCompletedWelcome, setHasCompletedWelcome] = useKV<boolean>('has-completed-welcome', false)
  const [tuyaCredentials, setTuyaCredentials] = useKV<TuyaCredentials | null>('tuya-credentials', null)
  const [adaptiveSchedules, setAdaptiveSchedules] = useKV<AdaptiveSchedule[]>('adaptive-schedules', [])
  const [aiRecommendations, setAiRecommendations] = useKV<AIScheduleRecommendation[]>('ai-recommendations', [])
  const [activeTab, setActiveTab] = useState('summary')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showVoiceControl, setShowVoiceControl] = useState(false)

  const unreadCount = (notifications || []).filter(n => !n.read).length

  const handleWelcomeComplete = () => {
    setHasCompletedWelcome(true)
  }

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

  const handleAddGoal = (goal: Omit<EnergyGoal, 'id' | 'current' | 'achieved'>) => {
    const newGoal: EnergyGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      current: 0,
      achieved: false
    }
    setGoals((currentGoals) => [...(currentGoals || []), newGoal])
  }

  const handleDeleteGoal = (goalId: string) => {
    setGoals((currentGoals) => (currentGoals || []).filter(g => g.id !== goalId))
  }

  const handleAddSchedule = (schedule: Omit<DeviceSchedule, 'id'>) => {
    const newSchedule: DeviceSchedule = {
      ...schedule,
      id: `sched-${Date.now()}`
    }
    setSchedules((currentSchedules) => [...(currentSchedules || []), newSchedule])
  }

  const handleToggleSchedule = (scheduleId: string) => {
    setSchedules((currentSchedules) => {
      if (!currentSchedules) return MOCK_SCHEDULES
      return currentSchedules.map(sched =>
        sched.id === scheduleId
          ? { ...sched, enabled: !sched.enabled }
          : sched
      )
    })
  }

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules((currentSchedules) => (currentSchedules || []).filter(s => s.id !== scheduleId))
  }

  const handleAcknowledgeAlert = (alertId: string) => {
    setMaintenanceAlerts((currentAlerts) => {
      if (!currentAlerts) return MOCK_MAINTENANCE_ALERTS
      return currentAlerts.map(alert =>
        alert.id === alertId
          ? { ...alert, acknowledged: true }
          : alert
      )
    })
  }

  const handleDismissAlert = (alertId: string) => {
    setMaintenanceAlerts((currentAlerts) => (currentAlerts || []).filter(a => a.id !== alertId))
  }

  const calculateCurrentPower = (): number => {
    return (devices || MOCK_DEVICES).reduce((sum, device) => sum + (device.isOn ? device.power : 0), 0)
  }

  const handleTuyaCredentialsSave = (credentials: TuyaCredentials) => {
    setTuyaCredentials(credentials)
    toast.success('Tuya credentials saved successfully')
  }

  const handleTuyaDiscoverDevices = async (): Promise<TuyaDevice[]> => {
    if (!tuyaCredentials) {
      throw new Error('No Tuya credentials configured')
    }
    
    const discoveredDevices = await mockTuyaDeviceDiscovery(tuyaCredentials)
    return discoveredDevices
  }

  const handleTuyaAddDevice = (device: TuyaDevice) => {
    setDevices((currentDevices) => [...(currentDevices || []), device])
  }

  const handleTuyaRemoveDevice = (deviceId: string) => {
    setDevices((currentDevices) => (currentDevices || []).filter(d => d.id !== deviceId))
  }

  const handleGenerateAIRecommendations = async () => {
    const recommendations = await generateAIScheduleRecommendations(devices || MOCK_DEVICES)
    setAiRecommendations(recommendations)
  }

  const handleAcceptRecommendation = (recommendation: AIScheduleRecommendation) => {
    const newSchedule = convertRecommendationToSchedule(recommendation)
    setAdaptiveSchedules((currentSchedules) => [...(currentSchedules || []), newSchedule])
    setAiRecommendations((currentRecs) => 
      (currentRecs || []).filter(r => r.id !== recommendation.id)
    )
  }

  const handleDismissRecommendation = (recommendationId: string) => {
    setAiRecommendations((currentRecs) => 
      (currentRecs || []).filter(r => r.id !== recommendationId)
    )
  }

  const handleEnableAdaptiveSchedule = (scheduleId: string) => {
    setAdaptiveSchedules((currentSchedules) => {
      if (!currentSchedules) return []
      return currentSchedules.map(s =>
        s.id === scheduleId
          ? { ...s, enabled: true, lastModified: new Date() }
          : s
      )
    })
    toast.success('Adaptive schedule enabled')
  }

  const handleDisableAdaptiveSchedule = (scheduleId: string) => {
    setAdaptiveSchedules((currentSchedules) => {
      if (!currentSchedules) return []
      return currentSchedules.map(s =>
        s.id === scheduleId
          ? { ...s, enabled: false, lastModified: new Date() }
          : s
      )
    })
    toast.info('Adaptive schedule paused')
  }

  const handleDeleteAdaptiveSchedule = (scheduleId: string) => {
    setAdaptiveSchedules((currentSchedules) => 
      (currentSchedules || []).filter(s => s.id !== scheduleId)
    )
    toast.success('Adaptive schedule deleted')
  }

  const tuyaDevices = (devices || []).filter((d): d is TuyaDevice => 'tuyaId' in d)


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

  useEffect(() => {
    setGoals((currentGoals) => {
      if (!currentGoals) return MOCK_GOALS
      const totalPower = (devices || []).reduce((sum, d) => sum + (d.isOn ? d.power : 0), 0)
      const dailyUsage = (totalPower / 1000) * 24
      const monthlyCost = dailyUsage * 30 * 0.12
      const carbonReduction = dailyUsage * 30 * 0.92

      return currentGoals.map(goal => {
        let newCurrent = goal.current

        if (goal.type === 'usage' && goal.period === 'daily') {
          newCurrent = dailyUsage * 0.85
        } else if (goal.type === 'cost' && goal.period === 'monthly') {
          newCurrent = monthlyCost * 0.82
        } else if (goal.type === 'carbon' && goal.period === 'monthly') {
          newCurrent = carbonReduction * 0.95
        }

        return {
          ...goal,
          current: newCurrent,
          achieved: newCurrent >= goal.target
        }
      })
    })
  }, [devices, setGoals])

  return (
    <>
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

        <QuickStatsBar devices={devices || MOCK_DEVICES} />

        <main className="container mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="hidden md:block">
                    <TabSearch currentTab={activeTab} onTabChange={setActiveTab} />
                  </div>
                  <div className="md:hidden w-full">
                    <TabFilter currentTab={activeTab} onTabChange={setActiveTab} />
                  </div>
                  <div className="text-xs text-muted-foreground hidden lg:block">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">⌘K</kbd> to search
                  </div>
                </div>
              </div>
              <div className="hidden md:flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'summary'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground'
                  }`}
                >
                  <Stack className="w-4 h-4" />
                  Summary
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground'
                  }`}
                >
                  <ChartBar className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('devices')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'devices'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground'
                  }`}
                >
                  <DevicesIcon className="w-4 h-4" />
                  Devices
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'analytics'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground'
                  }`}
                >
                  <ChartLine className="w-4 h-4" />
                  Analytics
                </button>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'comparison'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground'
                  }`}
                >
                  <ArrowsClockwise className="w-4 h-4" />
                  Compare
                </button>
                <button
                  onClick={() => setActiveTab('scenes')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'scenes'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground'
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  Scenes
                </button>
                <button
                  onClick={() => setActiveTab('goals')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'goals'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  Goals
                </button>
                <button
                  onClick={() => setActiveTab('scheduler')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'scheduler'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Scheduler
                </button>
                <button
                  onClick={() => setActiveTab('adaptive')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'adaptive'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  AI Scheduling
                </button>
                <button
                  onClick={() => setActiveTab('tuya')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'tuya'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground'
                  }`}
                >
                  <Plug className="w-4 h-4" />
                  Tuya Devices
                </button>
                <button
                  onClick={() => setActiveTab('costs')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'costs'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground'
                  }`}
                >
                  <CurrencyDollar className="w-4 h-4" />
                  Costs
                </button>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'pricing'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground'
                  }`}
                >
                  <CurrencyDollar className="w-4 h-4" weight="fill" />
                  Pricing
                </button>
                <button
                  onClick={() => setActiveTab('maintenance')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'maintenance'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  Maintenance
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'achievements'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  Achievements
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'reports'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Reports
                </button>
              </div>
            </div>

            <TabsContent value="summary" className="space-y-6">
              <TotalSummaryPanel 
                devices={devices || MOCK_DEVICES}
                goals={goals || MOCK_GOALS}
              />
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-6">
              <Dashboard devices={devices || MOCK_DEVICES} onNavigate={setActiveTab} />
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

            <TabsContent value="comparison" className="space-y-6">
              <ComparisonPanel devices={devices || MOCK_DEVICES} />
            </TabsContent>

            <TabsContent value="scenes" className="space-y-6">
              <ScenesPanel
                scenes={scenes || MOCK_SCENES}
                devices={devices || MOCK_DEVICES}
                onSceneToggle={handleSceneToggle}
              />
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <EnergyGoalsPanel
                goals={goals || MOCK_GOALS}
                onAddGoal={handleAddGoal}
                onDeleteGoal={handleDeleteGoal}
              />
            </TabsContent>

            <TabsContent value="scheduler" className="space-y-6">
              <DeviceScheduler
                schedules={schedules || MOCK_SCHEDULES}
                devices={devices || MOCK_DEVICES}
                onAddSchedule={handleAddSchedule}
                onToggleSchedule={handleToggleSchedule}
                onDeleteSchedule={handleDeleteSchedule}
              />
            </TabsContent>

            <TabsContent value="adaptive" className="space-y-6">
              <AdaptiveScheduling
                devices={devices || MOCK_DEVICES}
                schedules={adaptiveSchedules || []}
                recommendations={aiRecommendations || []}
                onEnableSchedule={handleEnableAdaptiveSchedule}
                onDisableSchedule={handleDisableAdaptiveSchedule}
                onDeleteSchedule={handleDeleteAdaptiveSchedule}
                onAcceptRecommendation={handleAcceptRecommendation}
                onDismissRecommendation={handleDismissRecommendation}
                onGenerateRecommendations={handleGenerateAIRecommendations}
              />
            </TabsContent>

            <TabsContent value="tuya" className="space-y-6">
              <TuyaIntegration
                credentials={tuyaCredentials || null}
                onCredentialsSave={handleTuyaCredentialsSave}
                onDiscoverDevices={handleTuyaDiscoverDevices}
                onAddDevice={handleTuyaAddDevice}
                onRemoveDevice={handleTuyaRemoveDevice}
                connectedDevices={tuyaDevices}
              />
            </TabsContent>

            <TabsContent value="costs" className="space-y-6">
              <CostAnalyticsPanel devices={devices || MOCK_DEVICES} />
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <ElectricityPricingPanel 
                rates={electricityRates || MOCK_ELECTRICITY_RATES}
                currentUsage={calculateCurrentPower()}
              />
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-6">
              <MaintenanceAlertsPanel
                alerts={maintenanceAlerts || MOCK_MAINTENANCE_ALERTS}
                onAcknowledge={handleAcknowledgeAlert}
                onDismiss={handleDismissAlert}
              />
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <AchievementsPanel achievements={achievements || MOCK_ACHIEVEMENTS} />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <EnergyReports
                devices={devices || MOCK_DEVICES}
                goals={goals || MOCK_GOALS}
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

        <VoiceControlPanel
          isOpen={showVoiceControl}
          onClose={() => setShowVoiceControl(false)}
          devices={devices || MOCK_DEVICES}
          scenes={scenes || MOCK_SCENES}
          onDeviceToggle={handleDeviceToggle}
          onSceneToggle={handleSceneToggle}
        />

        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
          <VoiceButton
            onClick={() => setShowVoiceControl(!showVoiceControl)}
          />
          <button
            onClick={() => setShowChat(!showChat)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Lightning className="w-6 h-6" weight="fill" />
          </button>
        </div>
        </div>
      </div>

      {!hasCompletedWelcome && (
        <WelcomeScreen 
          onComplete={handleWelcomeComplete}
          onCredentialsSave={handleTuyaCredentialsSave}
        />
      )}
    </>
  )
}

export default App