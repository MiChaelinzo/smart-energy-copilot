export interface WeatherData {
  feelsLike: number
  feelsLike: number
  humidity: number
  condition: string
  windSpeed: number
  pressure: number
  visibility: number
}
export interface 
 

}
export inter
    targetTemp: nu
    energySavings
  windowRecommendat
    reason: string
 

    estimatedSavings: number
}
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
     
    
    console.error('Fail
  }

  tr
      `https://api.openweathermap.org/
    
      throw 
    
    
    const processedDates = new Set<
    for (const item of data.list) {
      const dateKey = date.toDate
      if (!processedDates.has(dateK
        dailyForecasts.push({
          tempHig
          condition: item.w
     
    }
    return dailyForecasts
    console.error('Failed to fe
  }


): WeatherOptimization {
  const
  
    hvacRecommendation,
    d
}
function getHVACRecomme
  forecast: WeatherForecast[]
  con
  if
      targetTemp: 78,
    
  } else if (currentTemp < 60) {
      targetTemp: 68,
    
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
): 
}

export function generateWeatherOptimization(
    return {
  forecast: WeatherForecast[]
): WeatherOptimization {
  const hvacRecommendation = getHVACRecommendation(current, forecast)
  if (forecast.some(f => f.precipitationChance > 60)) {
  const deviceScheduleAdjustments = getDeviceScheduleAdjustments(current, forecast)
  
  return {
  
    windowRecommendation,
    deviceScheduleAdjustments
  }
 

    action: 'neutral',
  current: WeatherData,
}
): { targetTemp: number; reason: string; energySavings: number } {
  current: WeatherData,
):
  if (currentTemp > 75) {
    return {
      targetTemp: 78,
      reason: 'Warm weather detected. Raising thermostat to 78°F can save energy.',
      energySavings: 8.5
    s
  } else if (currentTemp < 60) {
    return {
      targetTemp: 68,
      reason: 'Cold weather detected. Lowering thermostat to 68°F can save energy.',
      energySavings: 7.2
     
  }
  
  if (current.humidity > 70) {
    adjustme
      targetTemp: 76,
      reason: 'High humidity affects comfort. Optimizing temperature for efficiency.',
      energySavings: 5.0
    }
  }
  
  return {
    targetTemp: 72,
    reason: 'Weather conditions are optimal. Maintaining comfortable temperature.',
  }
  }
}

function getWindowRecommendation(
  current: WeatherData,
  forecast: WeatherForecast[]
): { action: 'open' | 'close' | 'neutral'; reason: string } {
    pressure: 1013,
  const insideTargetTemp = 72
    timestamp: new Date()
  

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
  
  if (tempDiff > 15) {
}
      action: 'close',
      reason: 'Large temperature difference. Keep windows closed for efficiency.'
    }
  }
  
  return {
        })
    reason: 'Weather conditions are neutral. Adjust windows based on preference.'
   
}

function getDeviceScheduleAdjustments(

  forecast: WeatherForecast[]

  deviceId: string

  suggestion: string
  estimatedSavings: number
}> {

    deviceId: string
    deviceName: string
    suggestion: string
    estimatedSavings: number
  }> = []

  if (forecast.some(f => f.tempHigh > 85)) {

      deviceId: 'pool-pump-1',
      deviceName: 'Pool Pump',
      suggestion: 'Schedule during off-peak hours due to high temperature forecast.',

    })

  
  if (forecast.slice(0, 3).every(f => f.tempHigh < 65)) {
    adjustments.push({

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

    })


  return adjustments
}

function getMockWeatherData(): WeatherData {
  return {
    temperature: 72,
    feelsLike: 71,
    humidity: 55,
    condition: 'Clear',
    windSpeed: 5,

    visibility: 10,

    timestamp: new Date()

}

function getMockForecastData(): WeatherForecast[] {
  const forecasts: WeatherForecast[] = []

  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)

    forecasts.push({

      tempHigh: 75 + Math.floor(Math.random() * 15),
      tempLow: 60 + Math.floor(Math.random() * 10),
      condition: ['Clear', 'Cloudy', 'Rain', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      precipitationChance: Math.floor(Math.random() * 100)

  }

  return forecasts


export async function getUserLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return resolve({ lat: 37.7749, lon: -122.4194 })
    }

    navigator.geolocation.getCurrentPosition(

        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude

      },

        resolve({ lat: 37.7749, lon: -122.4194 })
      }
    )

}
