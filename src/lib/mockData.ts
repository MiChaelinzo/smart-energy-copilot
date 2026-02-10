import { Device, EnergyDataPoint, SmartScene, Notification, EnergyGoal, DeviceSchedule, ElectricityRate, MaintenanceAlert, Achievement } from '@/types'

export const MOCK_DEVICES: Device[] = [
  {
    id: 'dev-001',
    name: 'Living Room Lights',
    type: 'light',
    status: 'online',
    isOn: true,
    power: 45,
    room: 'Living Room',
    lastUpdate: new Date(),
    settings: { brightness: 80 }
  },
  {
    id: 'dev-002',
    name: 'Main HVAC',
    type: 'hvac',
    status: 'online',
    isOn: true,
    power: 2400,
    room: 'Whole Home',
    lastUpdate: new Date(),
    settings: { temperature: 72 }
  },
  {
    id: 'dev-003',
    name: 'Kitchen Appliances',
    type: 'appliance',
    status: 'online',
    isOn: false,
    power: 0,
    room: 'Kitchen',
    lastUpdate: new Date()
  },
  {
    id: 'dev-004',
    name: 'Bedroom Lights',
    type: 'light',
    status: 'online',
    isOn: false,
    power: 0,
    room: 'Bedroom',
    lastUpdate: new Date(),
    settings: { brightness: 60 }
  },
  {
    id: 'dev-005',
    name: 'Office Outlet',
    type: 'outlet',
    status: 'online',
    isOn: true,
    power: 150,
    room: 'Office',
    lastUpdate: new Date()
  },
  {
    id: 'dev-006',
    name: 'Water Heater',
    type: 'appliance',
    status: 'online',
    isOn: true,
    power: 3800,
    room: 'Utility',
    lastUpdate: new Date()
  },
  {
    id: 'dev-007',
    name: 'Garage Door Sensor',
    type: 'sensor',
    status: 'online',
    isOn: true,
    power: 2,
    room: 'Garage',
    lastUpdate: new Date()
  },
  {
    id: 'dev-008',
    name: 'Patio Lights',
    type: 'light',
    status: 'offline',
    isOn: false,
    power: 0,
    room: 'Outdoor',
    lastUpdate: new Date()
  }
]

export const generateEnergyData = (hours: number = 24): EnergyDataPoint[] => {
  const data: EnergyDataPoint[] = []
  const now = new Date()
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hour = time.getHours()
    
    let baseConsumption = 2.5
    if (hour >= 6 && hour < 9) baseConsumption = 4.5
    else if (hour >= 17 && hour < 22) baseConsumption = 5.5
    else if (hour >= 22 || hour < 6) baseConsumption = 1.8
    
    const variance = (Math.random() - 0.5) * 0.8
    const consumption = baseConsumption + variance
    
    data.push({
      time: time.toISOString(),
      consumption: Math.max(0.5, consumption),
      cost: consumption * 0.12
    })
  }
  
  return data
}

export const MOCK_SCENES: SmartScene[] = [
  {
    id: 'scene-001',
    name: 'Away Mode',
    description: 'Minimize energy when nobody is home',
    icon: 'House',
    devices: ['dev-001', 'dev-002', 'dev-004', 'dev-005'],
    active: false
  },
  {
    id: 'scene-002',
    name: 'Sleep Mode',
    description: 'Optimize for nighttime energy savings',
    icon: 'Moon',
    devices: ['dev-001', 'dev-002', 'dev-004'],
    active: true,
    schedule: { time: '22:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Sun'] }
  },
  {
    id: 'scene-003',
    name: 'Morning Routine',
    description: 'Gentle wake-up with efficient energy use',
    icon: 'Sun',
    devices: ['dev-001', 'dev-002', 'dev-004'],
    active: true,
    schedule: { time: '06:30', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }
  },
  {
    id: 'scene-004',
    name: 'Work From Home',
    description: 'Optimize office area during work hours',
    icon: 'Desktop',
    devices: ['dev-005', 'dev-002'],
    active: false
  }
]

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    type: 'warning',
    title: 'Unusual Energy Spike',
    message: 'Water heater consuming 15% more than usual',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false
  },
  {
    id: 'notif-002',
    type: 'success',
    title: 'Monthly Goal Achieved',
    message: 'You saved 22% on energy this month!',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: false
  },
  {
    id: 'notif-003',
    type: 'info',
    title: 'Sleep Mode Activated',
    message: 'Evening routine started at 10:00 PM',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    read: true
  }
]

export const MOCK_GOALS: EnergyGoal[] = [
  {
    id: 'goal-001',
    name: 'Reduce Monthly Energy Cost',
    type: 'cost',
    target: 150,
    current: 123.45,
    period: 'monthly',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    achieved: false
  },
  {
    id: 'goal-002',
    name: 'Daily Usage Target',
    type: 'usage',
    target: 80,
    current: 67.8,
    period: 'daily',
    startDate: new Date(),
    endDate: new Date(),
    achieved: false
  },
  {
    id: 'goal-003',
    name: 'Carbon Reduction',
    type: 'carbon',
    target: 500,
    current: 487,
    period: 'monthly',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    achieved: false
  }
]

export const MOCK_SCHEDULES: DeviceSchedule[] = [
  {
    id: 'sched-001',
    deviceId: 'dev-001',
    name: 'Living Room Lights - Evening',
    action: 'on',
    time: '18:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    enabled: true,
    settings: { brightness: 70 }
  },
  {
    id: 'sched-002',
    deviceId: 'dev-001',
    name: 'Living Room Lights - Bedtime',
    action: 'off',
    time: '22:30',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Sun'],
    enabled: true
  },
  {
    id: 'sched-003',
    deviceId: 'dev-002',
    name: 'HVAC - Night Mode',
    action: 'adjust',
    time: '22:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    enabled: true,
    settings: { temperature: 68 }
  },
  {
    id: 'sched-004',
    deviceId: 'dev-006',
    name: 'Water Heater - Off Peak',
    action: 'off',
    time: '10:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    enabled: false
  }
]

export const MOCK_ELECTRICITY_RATES: ElectricityRate[] = [
  {
    id: 'rate-001',
    name: 'Peak Hours',
    type: 'peak',
    rate: 0.28,
    startHour: 16,
    endHour: 21,
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    color: 'oklch(0.60 0.22 25)'
  },
  {
    id: 'rate-002',
    name: 'Super Off-Peak',
    type: 'super-off-peak',
    rate: 0.08,
    startHour: 0,
    endHour: 6,
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    color: 'oklch(0.65 0.18 150)'
  },
  {
    id: 'rate-003',
    name: 'Off-Peak',
    type: 'off-peak',
    rate: 0.12,
    startHour: 21,
    endHour: 16,
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    color: 'oklch(0.72 0.15 200)'
  },
  {
    id: 'rate-004',
    name: 'Weekend Rate',
    type: 'off-peak',
    rate: 0.10,
    startHour: 6,
    endHour: 24,
    days: ['Sat', 'Sun'],
    color: 'oklch(0.72 0.15 200)'
  }
]

export const MOCK_MAINTENANCE_ALERTS: MaintenanceAlert[] = [
  {
    id: 'maint-001',
    deviceId: 'dev-006',
    deviceName: 'Water Heater',
    severity: 'high',
    type: 'efficiency',
    title: 'Efficiency Degradation Detected',
    description: 'Water heater is consuming 23% more energy than baseline for similar heating cycles.',
    prediction: 'Without maintenance, energy consumption may increase by an additional 15% over the next 3 months.',
    recommendation: 'Schedule sediment flush and heating element inspection within 2 weeks to restore efficiency.',
    estimatedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    confidence: 87,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    acknowledged: false
  },
  {
    id: 'maint-002',
    deviceId: 'dev-002',
    deviceName: 'Main HVAC',
    severity: 'medium',
    type: 'usage-pattern',
    title: 'Filter Replacement Due Soon',
    description: 'HVAC runtime has increased by 18% while maintaining same temperature, indicating restricted airflow.',
    prediction: 'Filter replacement typically needed every 90 days. Current filter at 85 days of use.',
    recommendation: 'Replace air filter within next week. Estimated cost: ¥25. Potential monthly savings: ¥15-20.',
    estimatedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    confidence: 92,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    acknowledged: false
  },
  {
    id: 'maint-003',
    deviceId: 'dev-008',
    deviceName: 'Patio Lights',
    severity: 'critical',
    type: 'anomaly',
    title: 'Device Offline - Connection Issue',
    description: 'Device has been offline for 48 hours. Last known status showed no error conditions.',
    prediction: 'Possible causes: Power supply failure, network connectivity loss, or hardware malfunction.',
    recommendation: 'Check power connection and circuit breaker. Reset device. If issue persists, contact support.',
    confidence: 95,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    acknowledged: false
  },
  {
    id: 'maint-004',
    deviceId: 'dev-005',
    deviceName: 'Office Outlet',
    severity: 'low',
    type: 'lifespan',
    title: 'Optimal Performance Maintained',
    description: 'Device is operating efficiently with no anomalies detected over the past 6 months.',
    prediction: 'Expected remaining lifespan: 3-5 years with current usage patterns.',
    recommendation: 'Continue monitoring. No action required at this time.',
    confidence: 78,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    acknowledged: true
  }
]

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-001',
    title: 'Energy Saver',
    description: 'Reduced energy consumption by 25% compared to previous month',
    icon: 'Trophy',
    category: 'savings',
    tier: 'gold',
    unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    value: 25,
    shareable: true
  },
  {
    id: 'ach-002',
    title: 'Peak Avoider',
    description: 'Shifted 80% of high-consumption activities to off-peak hours',
    icon: 'Clock',
    category: 'efficiency',
    tier: 'silver',
    unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    value: 80,
    shareable: true
  },
  {
    id: 'ach-003',
    title: '30-Day Streak',
    description: 'Met daily energy goals for 30 consecutive days',
    icon: 'Fire',
    category: 'consistency',
    tier: 'platinum',
    unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    value: 30,
    shareable: true
  },
  {
    id: 'ach-004',
    title: 'Carbon Warrior',
    description: 'Prevented 500 lbs of CO₂ emissions this month',
    icon: 'Leaf',
    category: 'environmental',
    tier: 'gold',
    unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    value: 500,
    shareable: true
  },
  {
    id: 'ach-005',
    title: 'Smart Automator',
    description: 'Created 5 smart scenes to optimize energy usage',
    icon: 'Sparkle',
    category: 'milestone',
    tier: 'bronze',
    unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    value: 5,
    shareable: true
  },
  {
    id: 'ach-006',
    title: 'Cost Cutter',
    description: 'Saved over ¥50 on energy bills this month',
    icon: 'CurrencyDollar',
    category: 'savings',
    tier: 'gold',
    unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    value: 52.3,
    shareable: true
  }
]
