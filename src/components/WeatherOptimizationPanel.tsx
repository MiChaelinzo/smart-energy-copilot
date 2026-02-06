import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Thermometer, 
  Drop, 
  Wind,
  Lightning,
  ArrowClockwise,
  CheckCircle,
  Info
} from '@phosphor-icons/react'
import { 
  WeatherData, 
  WeatherForecast, 
  WeatherOptimizationRecommendation,
  getCurrentWeather,
  getWeatherForecast,
  generateWeatherOptimization,
  getWeatherWithLocation
} from '@/lib/weatherApi'
import { formatCurrency } from '@/lib/utils'

export function WeatherOptimizationPanel() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<WeatherForecast[]>([])
  const [optimization, setOptimization] = useState<WeatherOptimizationRecommendation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeatherData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const locationData = await getWeatherWithLocation()
      
      if (!locationData) {
        setError('Location access denied. Using mock data.')
        return
      }
      
      const { weather: currentWeather, forecast: weatherForecast } = locationData
      
      setWeather(currentWeather)
      setForecast(weatherForecast)
      
      const optimizationData = generateWeatherOptimization(weatherForecast, currentWeather)
      setOptimization(optimizationData)
    } catch (err) {
      setError('Failed to fetch weather data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeatherData()
  }, [])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-12 h-12 text-warning" weight="fill" />
      case 'rain':
        return <CloudRain className="w-12 h-12 text-primary" weight="fill" />
      case 'clouds':
      case 'cloudy':
        return <Cloud className="w-12 h-12 text-muted-foreground" weight="fill" />
      case 'storm':
        return <Lightning className="w-12 h-12 text-warning" weight="fill" />
      default:
        return <Cloud className="w-12 h-12 text-muted-foreground" />
    }
  }

  if (loading && !weather) {
    return (
      <div className="space-y-6">
        <Card className="p-8 bg-card border-border">
          <div className="flex items-center justify-center">
            <ArrowClockwise className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-muted-foreground">Loading weather data...</span>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Weather Optimization</h2>
          <p className="text-muted-foreground mt-1">AI-powered energy optimization based on weather conditions</p>
        </div>
        <Button onClick={fetchWeatherData} disabled={loading} size="lg">
          <ArrowClockwise className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="p-4 bg-warning/10 border-warning/30">
          <div className="flex items-center gap-2 text-warning-foreground">
            <Info className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {weather && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-card to-secondary border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Current Weather</p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold">{Math.round(weather.temperature)}°F</span>
                  {getWeatherIcon(weather.condition)}
                </div>
                <p className="text-lg text-muted-foreground mt-2">{weather.condition}</p>
                <p className="text-sm text-muted-foreground">Feels like {Math.round(weather.feelsLike)}°F</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Drop className="w-4 h-4 text-primary" weight="fill" />
                <span className="text-muted-foreground">Humidity: {weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Wind: {weather.windSpeed} mph</span>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2 p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-4">5-Day Forecast</p>
            <div className="grid grid-cols-5 gap-3">
              {forecast.map((day, index) => (
                <div key={index} className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">
                    {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <p className="text-sm font-medium">{Math.round(day.tempHigh)}°</p>
                  <p className="text-xs text-muted-foreground">{Math.round(day.tempLow)}°</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {optimization && (
        <>
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-start gap-4">
              <Thermometer className="w-8 h-8 text-primary flex-shrink-0 mt-1" weight="fill" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">HVAC Recommendation</h3>
                  <Badge variant="default" className="bg-success text-success-foreground">
                    Save {formatCurrency(optimization.hvacRecommendation.energySavings)}/month
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-primary mb-2">
                  Target Temperature: {optimization.hvacRecommendation.targetTemp}°F
                </p>
                <p className="text-muted-foreground">{optimization.hvacRecommendation.reason}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-accent" weight="fill" />
              <h3 className="text-xl font-semibold">Window Recommendations</h3>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
              <Badge 
                variant="outline" 
                className={`text-lg px-4 py-2 ${
                  optimization.windowRecommendation.action === 'open' 
                    ? 'bg-success/20 text-success border-success' 
                    : optimization.windowRecommendation.action === 'close'
                    ? 'bg-destructive/20 text-destructive border-destructive'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {optimization.windowRecommendation.action.toUpperCase()}
              </Badge>
              <p className="text-muted-foreground flex-1">
                {optimization.windowRecommendation.reason}
              </p>
            </div>
          </Card>

          {optimization.deviceScheduleAdjustments.length > 0 && (
            <Card className="p-6 bg-card border-border">
              <h3 className="text-xl font-semibold mb-4">Device Schedule Adjustments</h3>
              <div className="space-y-3">
                {optimization.deviceScheduleAdjustments.map((adjustment, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
                  >
                    <Lightning className="w-5 h-5 text-accent mt-1 flex-shrink-0" weight="fill" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{adjustment.deviceName}</p>
                        <Badge variant="secondary" className="bg-success/20 text-success">
                          +{formatCurrency(adjustment.estimatedSavings)}/mo
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{adjustment.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
