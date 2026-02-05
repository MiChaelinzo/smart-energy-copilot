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
  humidity: number
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
      throw new Error('Weather API request failed')
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
      uvIndex: 0,
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
      throw new Error('Weather API request failed')
    }
    
    const data = await response.json()
    
    const dailyForecasts: WeatherForecast[] = []
    const processedDates = new Set<string>()
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000)
      const dateString = date.toDateString()
      
      if (!processedDates.has(dateString) && dailyForecasts.length < days) {
        processedDates.add(dateString)
        dailyForecasts.push({
          date,
          tempHigh: item.main.temp_max,
          tempLow: item.main.temp_min,
          condition: item.weather[0].main,
          precipitationChance: item.pop * 100,
          humidity: item.main.humidity
        })
      }
    })
    
    return dailyForecasts
  } catch (error) {
    console.error('Failed to fetch forecast, using mock:', error)
    return getMockForecast(days)
  }
}

export function generateWeatherOptimization(
  current: WeatherData,
  forecast: WeatherForecast[]
): WeatherOptimization {
  const hvacRecommendation = getHVACRecommendation(current, forecast)
  const windowRecommendation = getWindowRecommendation(current, forecast)
  const deviceAdjustments = getDeviceScheduleAdjustments(current, forecast)
  
  return {
    hvacRecommendation,
    windowRecommendation,
    deviceScheduleAdjustments: deviceAdjustments
  }
}

function getHVACRecommendation(
  current: WeatherData,
  forecast: WeatherForecast[]
): WeatherOptimization['hvacRecommendation'] {
  const currentTemp = current.temperature
  const tomorrowHigh = forecast[1]?.tempHigh || currentTemp
  
  if (currentTemp > 78 && tomorrowHigh > 80) {
    return {
      targetTemp: 74,
      reason: 'High temperatures forecast. Pre-cooling during off-peak hours recommended.',
      energySavings: 12.5
    }
  } else if (currentTemp < 65 && forecast[1]?.tempLow < 60) {
    return {
      targetTemp: 68,
      reason: 'Cold weather expected. Efficient heating schedule recommended.',
      energySavings: 8.3
    }
  } else if (Math.abs(currentTemp - current.feelsLike) > 5) {
    return {
      targetTemp: 72,
      reason: `High humidity affecting comfort. Adjust HVAC to maintain comfort while optimizing energy.`,
      energySavings: 5.7
    }
  }
  
  return {
    targetTemp: 72,
    reason: 'Weather conditions are moderate. Standard temperature setting is optimal.',
    energySavings: 0
  }
}

function getWindowRecommendation(
  current: WeatherData,
  forecast: WeatherForecast[]
): WeatherOptimization['windowRecommendation'] {
  const outsideTemp = current.temperature
  const insideTargetTemp = 72
  const tempDiff = Math.abs(outsideTemp - insideTargetTemp)
  
  if (tempDiff < 5 && current.humidity < 70) {
    return {
      action: 'open',
      reason: 'Outside temperature is comfortable. Natural ventilation can reduce HVAC usage.'
    }
  } else if (current.condition === 'Rain' || current.condition === 'Snow') {
    return {
      action: 'close',
      reason: 'Precipitation detected. Keep windows closed to maintain indoor comfort.'
    }
  } else if (tempDiff > 15) {
    return {
      action: 'close',
      reason: 'Large temperature differential. Keep windows closed to maintain efficiency.'
    }
  }
  
  return {
    action: 'neutral',
    reason: 'Weather conditions are variable. Use personal preference for window control.'
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
  
  if (forecast[0]?.condition === 'Clear' && current.temperature > 75) {
    adjustments.push({
      deviceId: 'blinds-1',
      deviceName: 'Smart Blinds',
      suggestion: 'Close blinds during peak sun hours (12pm-4pm) to reduce cooling load',
      estimatedSavings: 6.2
    })
  }
  
  if (forecast.slice(0, 3).every(f => f.tempLow < 55)) {
    adjustments.push({
      deviceId: 'water-heater-1',
      deviceName: 'Water Heater',
      suggestion: 'Schedule pre-heating during off-peak hours due to cold weather',
      estimatedSavings: 4.8
    })
  }
  
  if (current.condition === 'Rain' && forecast[0]?.precipitationChance > 70) {
    adjustments.push({
      deviceId: 'dehumidifier-1',
      deviceName: 'Dehumidifier',
      suggestion: 'Increase dehumidifier schedule due to high humidity from rain',
      estimatedSavings: 3.1
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
    windSpeed: 5.2,
    pressure: 1013,
    visibility: 10,
    uvIndex: 6,
    timestamp: new Date()
  }
}

function getMockForecast(days: number): WeatherForecast[] {
  const forecasts: WeatherForecast[] = []
  const conditions = ['Clear', 'Cloudy', 'Rain', 'Partly Cloudy']
  
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    
    forecasts.push({
      date,
      tempHigh: 75 + Math.floor(Math.random() * 15),
      tempLow: 60 + Math.floor(Math.random() * 10),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      precipitationChance: Math.floor(Math.random() * 60),
      humidity: 50 + Math.floor(Math.random() * 30)
    })
  }
  
  return forecasts
}

export async function getUserLocation(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        })
      },
      () => {
        resolve(null)
      }
    )
  })
}
