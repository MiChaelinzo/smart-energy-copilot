export interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: numbe
  visibility: numbe
  timestamp: Date

  date: Date
  tempLow: number
  precipitationCh
}

    targetTemp: number
    energySa
  windowRecommenda
    reason: strin
  deviceScheduleAdj
    deviceName: string
    estimatedSavin
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
    
  }

  current: WeatherData,
): Wea
  const windowRecommendation = getWindowRecommendation(current, forecast)
  
    hvacRecommendation,
    deviceSched
}
function getHVACRecommendation(
  forecast: WeatherForecast[]
  const currentTemp = current.temperature
  
    return
      r
    }
    
      reason: 'Cold weath
    }
    return {
      reason: `High humidity aff
   
 

    energySavings: 0
}
function getWindowRecommendat
  forecast: WeatherForec
  const outsideTemp = current.temperature
  const tempDiff = Math.abs(outsideTemp - insideTargetTemp)
  if (tempDiff < 5 && current.humidity < 70) {
  
    }
    return {
      reason: 'Precipitat
  } else if (tempDiff > 15) {
   
 

    action: 'neutral',
  }

  current: WeatherData,
): Array<{
  deviceName: string
  
  const adjustments: Array<{
    deviceNa
    estimatedSavings:
  
    adjustments.push({
     
      estimatedSavings: 6.2
  }
  if (forecast.slice(
      deviceId: 'water-heater-1',
      suggestion: 'Sched
    }
  
    adjustme
      deviceName: 'De
      estimatedSavings: 3.1
  }
  ret

  
    feelsL
    condition: 'Cle
    pressure: 1013,
    uvIndex: 6,
  }


  
    const date = new Da
    
      date,
      tempLow: 60 + Math.floor(Math.rando
      precipitationChance: Ma
    })
  
}
export async
    if (!navigator.ge
      return
    
      (position) => {
          la
        })
      () => {
     
  })












































































































