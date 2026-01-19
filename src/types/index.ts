export type DeviceType = 'light' | 'hvac' | 'appliance' | 'outlet' | 'sensor'
export type DeviceStatus = 'online' | 'offline' | 'error'

export interface Device {
  id: string
  name: string
  type: DeviceType
  status: DeviceStatus
  isOn: boolean
  power: number
  room: string
  lastUpdate: Date
  settings?: {
    temperature?: number
    brightness?: number
    schedule?: string
  }
}

export interface EnergyMetric {
  current: number
  daily: number
  weekly: number
  monthly: number
  cost: number
  savings: number
  carbonReduction: number
}

export interface EnergyDataPoint {
  time: string
  consumption: number
  cost: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface SmartScene {
  id: string
  name: string
  description: string
  icon: string
  devices: string[]
  active: boolean
  schedule?: {
    time: string
    days: string[]
  }
}

export interface Notification {
  id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export interface Prediction {
  type: 'usage' | 'cost' | 'anomaly'
  value: number
  confidence: number
  timeframe: string
  recommendation?: string
}

export interface EnergyGoal {
  id: string
  name: string
  type: 'usage' | 'cost' | 'carbon'
  target: number
  current: number
  period: 'daily' | 'weekly' | 'monthly'
  startDate: Date
  endDate: Date
  achieved: boolean
}

export interface DeviceSchedule {
  id: string
  deviceId: string
  name: string
  action: 'on' | 'off' | 'adjust'
  time: string
  days: string[]
  enabled: boolean
  settings?: {
    temperature?: number
    brightness?: number
  }
}

export interface CostBreakdown {
  deviceCosts: Array<{
    deviceId: string
    deviceName: string
    cost: number
    percentage: number
  }>
  timeOfUseCosts: Array<{
    period: string
    cost: number
    rate: number
  }>
  projectedMonthly: number
  comparisonLastMonth: number
}

export interface EnergyReport {
  id: string
  period: string
  startDate: Date
  endDate: Date
  totalConsumption: number
  totalCost: number
  savings: number
  carbonReduction: number
  topDevices: Array<{
    name: string
    consumption: number
    cost: number
  }>
  recommendations: string[]
  achievements: string[]
}

export interface ElectricityRate {
  id: string
  name: string
  type: 'peak' | 'off-peak' | 'super-off-peak' | 'shoulder'
  rate: number
  startHour: number
  endHour: number
  days: string[]
  color: string
}

export interface MaintenanceAlert {
  id: string
  deviceId: string
  deviceName: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'efficiency' | 'usage-pattern' | 'lifespan' | 'anomaly'
  title: string
  description: string
  prediction: string
  recommendation: string
  estimatedDate?: Date
  confidence: number
  createdAt: Date
  acknowledged: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'savings' | 'efficiency' | 'consistency' | 'milestone' | 'environmental'
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  unlockedAt: Date
  value?: number
  shareable: boolean
  shareUrl?: string
  shareImage?: string
}

export interface ShareableCard {
  id: string
  type: 'achievement' | 'savings' | 'goal' | 'streak'
  title: string
  subtitle: string
  metric: string
  metricLabel: string
  icon: string
  color: string
  timestamp: Date
}
