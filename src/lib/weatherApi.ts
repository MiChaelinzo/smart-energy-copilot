export interface WeatherData {
  temperature: number
  feelsLike: number
  humidity: number
  condition: string
  windSpeed: number
  pressure: number
  visibility: number
  uvIndex: number
  timestamp: Date
}

export interface WeatherForecast {
  date: Date
  tempHigh: number
  tempLow: number
  condition: string
  precipitation: number
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

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=imperial`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }
    
    const data = await response.json()
    
    return {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000,
      uvIndex: data.uvi || 5,
      timestamp: new Date()
    }
  } catch (error) {
    console.error('Error fetching weather:', error)
    return getMockWeatherData()
  }
}

export async function getWeatherForecast(lat: number, lon: number): Promise<WeatherForecast[]> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=imperial`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data')
    }
    
    const data = await response.json()
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
      suggestion: 'Reduce runtime during precipitation to save energy.',
      estimatedSavings: 3.8
    })
  }
  
  return adjustments
}

function getMockWeatherData(): WeatherData {
  return {
    temperature: 72,
    feelsLike: 70,
    humidity: 55,
    condition: 'Clear',
    windSpeed: 5,
    pressure: 1013,
    visibility: 10,
    uvIndex: 5,
    timestamp: new Date()
  }
}

function getMockForecastData(): WeatherForecast[] {
  const forecasts: WeatherForecast[] = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    
    forecasts.push({
      date,
      tempHigh: 75 + Math.random() * 10,
      tempLow: 55 + Math.random() * 10,
      condition: ['Clear', 'Cloudy', 'Rain'][Math.floor(Math.random() * 3)],
      precipitation: Math.random() * 50
    })
  }
  
  return forecasts
}
