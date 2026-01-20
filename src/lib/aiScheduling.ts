import { Device, AdaptiveSchedule, AIScheduleRecommendation, TimeSlot } from '@/types'

export async function generateAIScheduleRecommendations(
  devices: Device[]
): Promise<AIScheduleRecommendation[]> {
  const recommendations: AIScheduleRecommendation[] = []
  
  const highPowerDevices = devices.filter(d => d.power > 500 && d.type !== 'sensor')
  
  for (const device of highPowerDevices) {
    if (device.type === 'hvac') {
      recommendations.push(generatePeakAvoidanceRecommendation(device))
      recommendations.push(generateOccupancyBasedRecommendation(device))
    } else if (device.type === 'appliance') {
      recommendations.push(generateCostOptimizationRecommendation(device))
    } else if (device.type === 'light') {
      recommendations.push(generateOccupancyBasedRecommendation(device))
    }
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return recommendations
}

function generatePeakAvoidanceRecommendation(device: Device): AIScheduleRecommendation {
  const schedule: AdaptiveSchedule['schedule'] = {
    monday: [
      { startTime: '06:00', endTime: '09:00', action: 'off' },
      { startTime: '17:00', endTime: '21:00', action: 'off' }
    ],
    tuesday: [
      { startTime: '06:00', endTime: '09:00', action: 'off' },
      { startTime: '17:00', endTime: '21:00', action: 'off' }
    ],
    wednesday: [
      { startTime: '06:00', endTime: '09:00', action: 'off' },
      { startTime: '17:00', endTime: '21:00', action: 'off' }
    ],
    thursday: [
      { startTime: '06:00', endTime: '09:00', action: 'off' },
      { startTime: '17:00', endTime: '21:00', action: 'off' }
    ],
    friday: [
      { startTime: '06:00', endTime: '09:00', action: 'off' },
      { startTime: '17:00', endTime: '21:00', action: 'off' }
    ]
  }
  
  const estimatedSavings = (device.power / 1000) * 8 * 30 * 0.25
  
  return {
    id: `rec-${Date.now()}-${device.id}`,
    deviceId: device.id,
    deviceName: device.name,
    type: 'peak-avoidance',
    reason: `Your ${device.name} consumes ${device.power}W during peak hours when electricity costs 2.5x more. Reducing usage during 6-9 AM and 5-9 PM peak periods could save significantly.`,
    estimatedSavings,
    confidence: 0.87,
    schedule,
    conditions: {
      peakHours: true
    },
    createdAt: new Date()
  }
}

function generateOccupancyBasedRecommendation(device: Device): AIScheduleRecommendation {
  const schedule: AdaptiveSchedule['schedule'] = {
    monday: [
      { startTime: '07:00', endTime: '17:00', action: 'off' },
      { startTime: '17:00', endTime: '23:00', action: 'on' }
    ],
    tuesday: [
      { startTime: '07:00', endTime: '17:00', action: 'off' },
      { startTime: '17:00', endTime: '23:00', action: 'on' }
    ],
    wednesday: [
      { startTime: '07:00', endTime: '17:00', action: 'off' },
      { startTime: '17:00', endTime: '23:00', action: 'on' }
    ],
    thursday: [
      { startTime: '07:00', endTime: '17:00', action: 'off' },
      { startTime: '17:00', endTime: '23:00', action: 'on' }
    ],
    friday: [
      { startTime: '07:00', endTime: '17:00', action: 'off' },
      { startTime: '17:00', endTime: '23:00', action: 'on' }
    ],
    saturday: [
      { startTime: '09:00', endTime: '23:00', action: 'on' }
    ],
    sunday: [
      { startTime: '09:00', endTime: '23:00', action: 'on' }
    ]
  }
  
  const estimatedSavings = (device.power / 1000) * 10 * 20 * 0.12
  
  return {
    id: `rec-${Date.now()}-${device.id}-occ`,
    deviceId: device.id,
    deviceName: device.name,
    type: 'occupancy-based',
    reason: `Analysis shows ${device.room} is typically unoccupied weekdays 7 AM-5 PM. Automatically turning off ${device.name} during these hours would eliminate waste.`,
    estimatedSavings,
    confidence: 0.92,
    schedule,
    conditions: {
      occupancy: true
    },
    createdAt: new Date()
  }
}

function generateWeatherBasedRecommendation(device: Device): AIScheduleRecommendation {
  const schedule: AdaptiveSchedule['schedule'] = {
    monday: [
      { startTime: '00:00', endTime: '06:00', action: 'adjust', settings: { temperature: 68 } },
      { startTime: '06:00', endTime: '09:00', action: 'adjust', settings: { temperature: 72 } },
      { startTime: '09:00', endTime: '17:00', action: 'adjust', settings: { temperature: 70 } },
      { startTime: '17:00', endTime: '22:00', action: 'adjust', settings: { temperature: 72 } },
      { startTime: '22:00', endTime: '24:00', action: 'adjust', settings: { temperature: 68 } }
    ]
  }
  
  Object.keys(schedule).forEach(day => {
    if (day !== 'monday') {
      schedule[day as keyof typeof schedule] = schedule.monday
    }
  })
  
  const estimatedSavings = (device.power / 1000) * 6 * 30 * 0.12
  
  return {
    id: `rec-${Date.now()}-${device.id}-weather`,
    deviceId: device.id,
    deviceName: device.name,
    type: 'weather-based',
    reason: `Weather forecasts show mild temperatures this week. Adjusting ${device.name} setpoints based on outdoor conditions could reduce runtime by 25%.`,
    estimatedSavings,
    confidence: 0.78,
    schedule,
    conditions: {
      weather: ['temperature', 'humidity'],
      temperature: { min: 60, max: 85 }
    },
    createdAt: new Date()
  }
}

function generateCostOptimizationRecommendation(device: Device): AIScheduleRecommendation {
  const schedule: AdaptiveSchedule['schedule'] = {
    monday: [
      { startTime: '22:00', endTime: '06:00', action: 'on' }
    ],
    tuesday: [
      { startTime: '22:00', endTime: '06:00', action: 'on' }
    ],
    wednesday: [
      { startTime: '22:00', endTime: '06:00', action: 'on' }
    ],
    thursday: [
      { startTime: '22:00', endTime: '06:00', action: 'on' }
    ],
    friday: [
      { startTime: '22:00', endTime: '06:00', action: 'on' }
    ],
    saturday: [
      { startTime: '00:00', endTime: '24:00', action: 'on' }
    ],
    sunday: [
      { startTime: '00:00', endTime: '24:00', action: 'on' }
    ]
  }
  
  const estimatedSavings = (device.power / 1000) * 8 * 20 * (0.25 - 0.08)
  
  return {
    id: `rec-${Date.now()}-${device.id}-cost`,
    deviceId: device.id,
    deviceName: device.name,
    type: 'cost-optimization',
    reason: `Your ${device.name} can run during super off-peak hours (10 PM-6 AM) when electricity is 70% cheaper. Shifting operation to these times maximizes savings.`,
    estimatedSavings,
    confidence: 0.95,
    schedule,
    conditions: {
      peakHours: true
    },
    createdAt: new Date()
  }
}

export function convertRecommendationToSchedule(
  recommendation: AIScheduleRecommendation
): AdaptiveSchedule {
  return {
    id: `sched-${Date.now()}-${recommendation.deviceId}`,
    name: `AI: ${recommendation.deviceName} - ${getScheduleTypeName(recommendation.type)}`,
    enabled: true,
    deviceId: recommendation.deviceId,
    type: recommendation.type,
    aiPredicted: true,
    confidence: recommendation.confidence,
    schedule: recommendation.schedule,
    conditions: recommendation.conditions,
    createdBy: 'ai',
    createdAt: new Date(),
    lastModified: new Date(),
    estimatedSavings: recommendation.estimatedSavings
  }
}

function getScheduleTypeName(type: AdaptiveSchedule['type']): string {
  switch (type) {
    case 'peak-avoidance':
      return 'Peak Avoidance'
    case 'occupancy-based':
      return 'Occupancy Based'
    case 'weather-based':
      return 'Weather Based'
    case 'cost-optimization':
      return 'Cost Optimization'
  }
}

export async function analyzeUsagePatterns(devices: Device[]): Promise<{
  peakUsageTimes: string[]
  highConsumptionDevices: Device[]
  potentialSavings: number
}> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const highConsumptionDevices = devices
    .filter(d => d.isOn && d.power > 500)
    .sort((a, b) => b.power - a.power)
  
  const peakUsageTimes = ['06:00-09:00', '17:00-21:00']
  
  const potentialSavings = highConsumptionDevices.reduce((sum, device) => {
    return sum + ((device.power / 1000) * 4 * 30 * 0.17)
  }, 0)
  
  return {
    peakUsageTimes,
    highConsumptionDevices,
    potentialSavings
  }
}

export function predictDeviceUsage(device: Device, hour: number): boolean {
  if (device.type === 'hvac') {
    return hour >= 17 && hour <= 23
  } else if (device.type === 'light') {
    return (hour >= 6 && hour <= 8) || (hour >= 17 && hour <= 23)
  } else if (device.type === 'appliance') {
    return hour >= 18 && hour <= 21
  }
  
  return device.isOn
}
