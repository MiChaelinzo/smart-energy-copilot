import { Device, EnergyDataPoint, SmartScene, Notification, EnergyGoal, DeviceSchedule } from '@/types'

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
