export interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: numbe
  condition: string
  windSpeed: number
  pressure: number
  visibility: number

  date: Date
 


  hvacRecomm
    reason: string
  }
    action: 'open' 
  }
 

export interface WeatherRecommendation {
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
    suggestion: string
    estimatedSavings: number
  }>
}

const OPENWEATHER_API_KEY = 'YOUR_API_KEY_HERE'

      humidity: data.main.humidity,
      w
      visibility: data.visibility
      timestamp: new Date()
  } c
    
}
export async function getWeatherForecast(lat: number,
    c
    
    if (!response.ok) {
    
    const da
    const processedDates = new Set
    for (const item of data.list) {
      const dateKey = date.toDateSt
      if (!processedDates.has(dateKey)
        dailyForecasts.push({
          tempHigh: item.main.temp_
          condition: item.weather[0].main
        })
      
    }
    return dailyFor
    console.error('Error fetching forecast:', error
  }

 

  const windowRecommendation = getWindowRecommendation(current)
  
    hvacRecommendation,
    deviceScheduleAdjustments
}
expo
  forecast: WeatherFore
  return new Promise((resolve) => {
     
    
    navigator.geolocation.getCurrentPo
    const dailyForecasts: WeatherForecast[] = []
    const processedDates = new Set<string>()
    
    for (const item of data.list) {
      const date = new Date(item.dt * 1000)
      const dateKey = date.toDateString()
      
      if (!processedDates.has(dateKey)) {
        processedDates.add(dateKey)
        dailyForecasts.push({
          date,
          tempHigh: item.main.temp_max,
          tempLow: item.main.temp_min,
          condition: item.weather[0].main,
          precipitation: item.pop * 100
        })
      }
      
      if (dailyForecasts.length >= 7) break
    }
    
    return dailyForecasts
  } catch (error) {
    console.error('Error fetching forecast:', error)
    return getMockForecastData()
  }
}

export function generateWeatherRecommendations(
  current: WeatherData,
  forecast: WeatherForecast[]
): WeatherRecommendation {
  const hvacRecommendation = getHVACRecommendation(forecast, current)
  const windowRecommendation = getWindowRecommendation(current)
  const deviceScheduleAdjustments = getDeviceAdjustments(current)
  
  return {
    hvacRecommendation,
    windowRecommendation,
    deviceScheduleAdjustments
  }
}

export async function getWeatherByLocation(): Promise<{
  weather: WeatherData
  forecast: WeatherForecast[]
} | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        const weather = await getCurrentWeather(lat, lon)
        const forecast = await getWeatherForecast(lat, lon)
        resolve({ weather, forecast })
      },
      () => {
        resolve(null)
      }
    )
  })
}

function getHVACRecommendation(
  forecast: WeatherForecast[],
  current: WeatherData
): { targetTemp: number; reason: string; energySavings: number } {
  const currentTemp = current.temperature
  
  if (currentTemp > 78) {
    return {
      targetTemp: 74,
      reason: 'Current temperature is high. Setting to 74°F for comfort while saving energy.',
      energySavings: 8.5
    }
  } else if (currentTemp < 65) {
    return {
      targetTemp: 68,
      reason: 'Temperature is low. Setting to 68°F for comfort with minimal energy use.',
      energySavings: 7.2
    }
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
      reason: 'Outside conditions are ideal. Open windows for natural ventilation and energy savings.'
    }
  }
  
  if (tempDiff > 10) {
    return {
      action: 'close',
      reason: 'Outside temperature differs significantly. Keep windows closed to maintain HVAC efficiency.'
    }
  }
  
  return {
    action: 'neutral',
    reason: 'Outdoor conditions are moderate. Window position is at your discretion.'
  }
}

function getDeviceAdjustments(
  current: WeatherData
): Array<{
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
  
  if (current.temperature > 75) {
    adjustments.push({
      deviceId: 'hvac-1',
      deviceName: 'HVAC System',
      suggestion: 'Increase cooling efficiency by 2°F to compensate for warm weather.',
      estimatedSavings: 6.2
    })
  }
  
  if (current.condition === 'Rain' || current.condition === 'Snow') {
    adjustments.push({
      deviceId: 'water-heater-1',
      deviceName: 'Water Heater',








































