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
  precipitationChance: number
}

export interface WeatherOptimization {
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
    console.error('Failed to fetch weather data, using mock:', error)
    return getMockWeatherData()
  }
}

export async function getWeatherForecast(lat: number, lon: number, days: number = 7): Promise<WeatherForecast[]> {
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
      
      if (!processedDates.has(dateKey) && dailyForecasts.length < days) {
        processedDates.add(dateKey)
        dailyForecasts.push({
          date,
          tempHigh: item.main.temp_max,
          tempLow: item.main.temp_min,
          condition: item.weather[0].main,
          precipitationChance: item.pop * 100
        })
      }
    }
    
    return dailyForecasts
  } catch (error) {
    console.error('Failed to fetch forecast data, using mock:', error)
    return getMockForecastData()
  }
}

export function generateWeatherOptimization(
  current: WeatherData,
  forecast: WeatherForecast[]
): WeatherOptimization {
  const hvacRecommendation = getHVACRecommendation(current, forecast)
  const windowRecommendation = getWindowRecommendation(current, forecast)
  const deviceScheduleAdjustments = getDeviceScheduleAdjustments(current, forecast)
  
  return {
    hvacRecommendation,
    windowRecommendation,
    deviceScheduleAdjustments
  }
}

function getHVACRecommendation(
  current: WeatherData,
  forecast: WeatherForecast[]
): { targetTemp: number; reason: string; energySavings: number } {
  const currentTemp = current.temperature
  
  if (currentTemp > 75) {
    return {
      targetTemp: 78,
      reason: 'Warm weather detected. Raising thermostat to 78°F can save energy.',
      energySavings: 8.5
    }
  } else if (currentTemp < 60) {
    return {
      targetTemp: 68,
      reason: 'Cold weather detected. Lowering thermostat to 68°F can save energy.',
      energySavings: 7.2
    }
  }
  
  if (current.humidity > 70) {
    return {
      targetTemp: 76,
      reason: 'High humidity affects comfort. Optimizing temperature for efficiency.',
      energySavings: 5.0
    }
  }
  
  return {
    targetTemp: 72,
    reason: 'Weather conditions are optimal. Maintaining comfortable temperature.',
    energySavings: 3.0
  }
}

function getWindowRecommendation(
  current: WeatherData,
  forecast: WeatherForecast[]
): { action: 'open' | 'close' | 'neutral'; reason: string } {
  const outsideTemp = current.temperature
  const insideTargetTemp = 72
  const tempDiff = Math.abs(outsideTemp - insideTargetTemp)
  
  if (tempDiff < 5 && current.humidity < 60) {
    return {
      action: 'open',
      reason: 'Outside temperature is comfortable. Open windows to save on HVAC.'
    }
  }
  
  if (forecast.some(f => f.precipitationChance > 60)) {
    return {
      action: 'close',
      reason: 'Precipitation expected. Keep windows closed.'
    }
  }
  
  if (tempDiff > 15) {
    return {
      action: 'close',
      reason: 'Large temperature difference. Keep windows closed for efficiency.'
    }
  }
  
  return {
    action: 'neutral',
    reason: 'Weather conditions are neutral. Adjust windows based on preference.'
  }
}

function getDeviceScheduleAdjustments(
  current: WeatherData,
  forecast: WeatherForecast[]
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

  if (forecast.some(f => f.tempHigh > 85)) {
    adjustments.push({
      deviceId: 'pool-pump-1',
      deviceName: 'Pool Pump',
      suggestion: 'Schedule during off-peak hours due to high temperature forecast.',
      estimatedSavings: 6.2
    })
  }
  
  if (forecast.slice(0, 3).every(f => f.tempHigh < 65)) {
    adjustments.push({
      deviceId: 'water-heater-1',
      deviceName: 'Water Heater',
      suggestion: 'Schedule heating during warmest part of day for efficiency.',
      estimatedSavings: 4.5
    })
  }

  if (current.condition === 'Clear' && current.uvIndex > 6) {
    adjustments.push({
      deviceId: 'dehumidifier-1',
      deviceName: 'Dehumidifier',
      suggestion: 'Reduce runtime due to favorable outdoor conditions.',
      estimatedSavings: 3.8
    })
  }

  return adjustments
}

function getMockWeatherData(): WeatherData {
  return {
    temperature: 72,
    feelsLike: 71,
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
      tempHigh: 75 + Math.floor(Math.random() * 15),
      tempLow: 60 + Math.floor(Math.random() * 10),
      condition: ['Clear', 'Cloudy', 'Rain', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      precipitationChance: Math.floor(Math.random() * 100)
    })
  }
  
  return forecasts
}

export async function getUserLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return resolve({ lat: 37.7749, lon: -122.4194 })
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        })
      },
      () => {
        resolve({ lat: 37.7749, lon: -122.4194 })
      }
    )
  })
}
