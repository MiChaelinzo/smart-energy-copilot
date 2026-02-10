export interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  condition: string
  pressure: number
  visibility: number
  feelsLike: number
  timestamp: Date
}

export interface WeatherForecast {
  date: Date
  tempHigh: number
  tempLow: number
  condition: string
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
    adjustment: string
    reason: string
    suggestion: string
    estimatedSavings: number
  }>
}

function getMockWeatherData(): WeatherData {
  return {
    temperature: 72,
    humidity: 65,
    windSpeed: 8,
    condition: 'Clear',
    pressure: 1013,
    visibility: 10000,
    feelsLike: 71,
    timestamp: new Date()
  }
}

function getMockForecastData(): WeatherForecast[] {
  return Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
    tempHigh: 75 + Math.random() * 10,
    tempLow: 60 + Math.random() * 10,
    condition: ['Clear', 'Partly Cloudy', 'Cloudy', 'Rain'][Math.floor(Math.random() * 4)],
    precipitation: Math.random() * 50
  }))
}

export async function fetchCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    const apiKey = 'DEMO_API_KEY'
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    )
    
    if (!response.ok) {
      throw new Error('Weather API request failed')
    }
    
    const data = await response.json()
    
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      condition: data.weather[0].main,
      pressure: data.main.pressure,
      visibility: data.visibility,
      feelsLike: data.main.feels_like,
      timestamp: new Date()
    }
  } catch (error) {
    console.error('Error fetching weather:', error)
    return getMockWeatherData()
  }
}

export async function fetchWeatherForecast(lat: number, lon: number): Promise<WeatherForecast[]> {
  try {
    const apiKey = 'DEMO_API_KEY'
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    )
    
    if (!response.ok) {
      throw new Error('Weather API request failed')
    }
    
    const data = await response.json()
    const dailyForecasts: WeatherForecast[] = []
    const processedDates = new Set<string>()
    
    for (const item of data.list) {
      const date = new Date(item.dt * 1000)
      const dateKey = date.toDateString()
      
      if (!processedDates.has(dateKey) && dailyForecasts.length < 7) {
        dailyForecasts.push({
          date: new Date(item.dt * 1000),
          tempHigh: item.main.temp_max,
          tempLow: item.main.temp_min,
          condition: item.weather[0].main,
          precipitation: item.pop * 100
        })
        processedDates.add(dateKey)
      }
      
      if (dailyForecasts.length >= 7) {
        break
      }
    }
    
    return dailyForecasts
  } catch (error) {
    console.error('Error fetching forecast:', error)
    return getMockForecastData()
  }
}

export function generateWeatherOptimization(
  current: WeatherData
): WeatherOptimizationRecommendation {
  const hvacRecommendation = getHVACRecommendation(current)
  const windowRecommendation = getWindowRecommendation(current)
  const deviceScheduleAdjustments = getDeviceAdjustments(current)
  
  return {
    hvacRecommendation,
    windowRecommendation,
    deviceScheduleAdjustments
  }
}

export async function getUserLocation(): Promise<{
  lat: number
  lon: number
  weather: WeatherData
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
        const weather = await fetchCurrentWeather(lat, lon)
        
        if (weather) {
          resolve({ lat, lon, weather })
        } else {
          resolve(null)
        }
      },
      () => {
        resolve(null)
      }
    )
  })
}

function getHVACRecommendation(
  current: WeatherData
): { targetTemp: number; reason: string; energySavings: number } {
  const currentTemp = current.temperature
  
  if (currentTemp > 78) {
    return {
      targetTemp: 74,
      reason: 'High temperature detected. Cooling to 74°F will optimize comfort and energy use.',
      energySavings: 8.5
    }
  } else if (currentTemp < 65) {
    return {
      targetTemp: 68,
      reason: 'Low temperature detected. Heating to 68°F balances comfort and efficiency.',
      energySavings: 6.2
    }
  } else {
    return {
      targetTemp: 72,
      reason: 'Current temperature is optimal. Maintain 72°F for comfort.',
      energySavings: 0
    }
  }
}

function getWindowRecommendation(
  current: WeatherData
): { action: 'open' | 'close' | 'neutral'; reason: string } {
  const outsideTemp = current.temperature
  const humidity = current.humidity
  
  if (outsideTemp > 85 || humidity > 80) {
    return {
      action: 'close',
      reason: 'Keep windows closed due to high heat/humidity. Use HVAC for cooling.'
    }
  } else if (outsideTemp >= 65 && outsideTemp <= 75 && humidity < 70) {
    return {
      action: 'open',
      reason: 'Perfect conditions for natural ventilation. Open windows to save energy.'
    }
  } else {
    return {
      action: 'neutral',
      reason: 'Current conditions are acceptable. Window adjustment optional.'
    }
  }
}

function getDeviceAdjustments(
  current: WeatherData
): Array<{ deviceId: string; deviceName: string; adjustment: string; reason: string; suggestion: string; estimatedSavings: number }> {
  const adjustments: Array<{ deviceId: string; deviceName: string; adjustment: string; reason: string; suggestion: string; estimatedSavings: number }> = []
  
  if (current.condition === 'Clear' || current.condition === 'Partly Cloudy') {
    adjustments.push({
      deviceId: 'lighting-system',
      deviceName: 'Indoor Lighting',
      adjustment: 'Reduce brightness by 30%',
      reason: 'Good natural light conditions detected',
      suggestion: 'Reduce brightness by 30% to take advantage of natural light',
      estimatedSavings: 8.5
    })
  }
  
  if (current.temperature < 60) {
    adjustments.push({
      deviceId: 'water-heater',
      deviceName: 'Water Heater',
      adjustment: 'Increase temperature by 5°F',
      reason: 'Cold weather requires warmer water for comfort',
      suggestion: 'Increase temperature by 5°F for optimal comfort in cold weather',
      estimatedSavings: 0
    })
  }
  
  if (current.windSpeed > 15) {
    adjustments.push({
      deviceId: 'hvac-system',
      deviceName: 'HVAC System',
      adjustment: 'Adjust fan speed to compensate for drafts',
      reason: 'High wind speeds may affect indoor temperature',
      suggestion: 'Adjust fan speed to compensate for drafts from high winds',
      estimatedSavings: 12.3
    })
  }
  
  return adjustments
}