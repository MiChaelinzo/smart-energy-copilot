export interface WeatherData {
  humidity: number
  condition: strin
  visibility: numbe
  timestamp: Date

  date: Date
  tempLow: number
  precipitation: 


    reason: string
  }
    action: 'open'
  }
    deviceId: strin
  precipitation: number
}

export interface WeatherOptimizationRecommendation {
  hvacRecommendation: {
    targetTemp: number
    reason: string
    energySavings: number
  }
  windowRecommendation: {
    action: 'open' | 'close' | 'neutral'
    reason: string
  }
  deviceScheduleAdjustments: Array<{
    deviceId: string
    deviceName: string
    
    
    
 

      feelsLike: data.main.feels_like,

    console.error('Error fetching weather:', error)
  }

  try {
     
    
      throw new Error('
    
    c
    
      const date = new Date(item.dt * 
    
        
          date: new Date(item.dt *
          tempLow: item.main.temp_m
          precipitation: item.pop
      }
      if (dailyForecasts.length >= 
    
  } catch (error) {
    return getMockForecastD
}
export function gen
  current: WeatherData
  const hvacRecommendation = ge
  c
 

  }

  weather: WeatherData
} | null> {
    i
    

      async (position) => {
     
    
      },
        resolve(null)
    )
}
function getHVACRecommendation(
  current: WeatherData
  cons
  if (currentTemp > 78) {
      targetTemp: 74,
      en
  } else if (currentTemp < 65
      targetTemp: 68,
      energySavings: 7.2
  }
  if (current.humidity > 70) {
      targetTemp: 76,
      ener
  }
  retu
    reason: 'Weather conditions are optimal
  }

  current: WeatherData
  const insideTarge
  const tempDiff = Math.abs(outsideTemp - insideTarg
  if (tempDiff < 5 && current.hu
   
 

    return {
      reason: 'Outside tempera
  }
  return {
    reason: 'Current conditions are moderate. Window position is at y
}
function getDeviceAdjustments(current: WeatherData): Array<{
  
  estimate
  const adjustments: Ar
    deviceName: string
    estimatedSavings: number
  
 

      estimatedSavings: 2.3
  }
  if (current.condition.toLow
      devic
      suggestion: 'Reduce water hea
    })
  
    adjustme
     

  }
  return adjustments

  return {
    humidity: 55,
    condition: 'Clear',
    visibility: 10000,
    time
}
function getMockForec
  const
  for
    
 

      condition: ['Clear', 'Par
    })
  
}
















  if (current.humidity > 70) {
    return {
      targetTemp: 76,
      reason: 'High humidity detected. Slightly lower temperature recommended for comfort.',
      energySavings: 5.5
    }
  }
  
  return {
    targetTemp: 72,
    reason: 'Weather conditions are optimal. Maintaining comfortable temperature.',
    energySavings: 6.0
  }
}

function getWindowRecommendation(
  current: WeatherData
): { action: 'open' | 'close' | 'neutral'; reason: string } {
  const insideTargetTemp = 72
  const outsideTemp = current.temperature
  const tempDiff = Math.abs(outsideTemp - insideTargetTemp)
  
  if (tempDiff < 5 && current.humidity < 60) {
    return {
      action: 'open',
      reason: 'Outside temperature is ideal. Open windows to save on HVAC costs.'
    }
  }
  
  if (outsideTemp > 85 || outsideTemp < 55) {
    return {
      action: 'close',
      reason: 'Outside temperature is extreme. Keep windows closed and use HVAC.'
    }
  }
  
  return {
    action: 'neutral',
    reason: 'Current conditions are moderate. Window position is at your discretion.'
  }
}

function getDeviceAdjustments(current: WeatherData): Array<{
  deviceId: string
  deviceName: string
  suggestion: string
  estimatedSavings: number
}> {
  const adjustments: Array<{
    deviceId: string
    deviceName: string
    suggestion: string
    estimatedSavings: number
  }> = []
  
  if (current.condition.toLowerCase().includes('rain') || current.condition.toLowerCase().includes('cloud')) {
    adjustments.push({
      deviceId: 'lights-1',
      deviceName: 'Indoor Lighting',
      suggestion: 'Cloudy conditions detected. Consider reducing artificial lighting near windows.',
      estimatedSavings: 2.3
    })
  }
  
  if (current.condition.toLowerCase().includes('rain')) {
    adjustments.push({
      deviceId: 'water-heater-1',
      deviceName: 'Water Heater',
      suggestion: 'Reduce water heater temperature during precipitation to save energy.',
      estimatedSavings: 4.5
    })
  }
  
  if (current.windSpeed > 15) {
    adjustments.push({
      deviceId: 'outdoor-lights-1',
      deviceName: 'Outdoor Lighting',
      suggestion: 'High winds detected. Consider motion-sensor only mode for outdoor lights.',
      estimatedSavings: 3.2
    })
  }
  
  return adjustments
}

function getMockWeatherData(): WeatherData {
  return {
    temperature: 72,
    humidity: 55,
    windSpeed: 8,
    condition: 'Clear',
    pressure: 1013,
    visibility: 10000,
    feelsLike: 70,
    timestamp: new Date()
  }
}

function getMockForecastData(): WeatherForecast[] {
  const forecasts: WeatherForecast[] = []
  const today = new Date()
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    
    forecasts.push({
      date,
      tempHigh: 75 + Math.random() * 10,
      tempLow: 60 + Math.random() * 10,
      condition: ['Clear', 'Partly Cloudy', 'Cloudy', 'Rain'][Math.floor(Math.random() * 4)],
      precipitation: Math.random() * 30
    })
  }
  
  return forecasts
}
