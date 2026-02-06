export interface WeatherData {
  humidity: number
  condition: strin
  visibility: numbe
  timestamp: Date

  date: Date
  tempLow: number
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
    const response = a
    )
    
 

    return {
      h
      condition: data.weather[0].
      visibility: data.visibility
      timestamp: new Date()
  } c
  }
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
      ta
      () => {
    }
      }
  if 
  })
 

  }
  return {
): { targetTemp: number; reason: string; energySavings: number } {
  const currentTemp = current.temperature
  

    return {
): { action: 'open' |
      reason: 'High temperature detected. Cooling to 74°F will optimize comfort and energy use.',
      energySavings: 8.5
    }
  } else if (currentTemp < 65) {
    return {
    }
      reason: 'Low temperature detected. Heating to 68°F balances comfort and efficiency.',
  if (outsideTemp > 85 |
    }
   
  
      condition: ['Clear', 'Pa
    })
  
}

















































































































