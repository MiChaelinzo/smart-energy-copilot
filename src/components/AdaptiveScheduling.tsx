import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { AdaptiveSchedule, AIScheduleRecommendation, Device } from '@/types'
import { 
  Lightning, 
  Brain, 
  Clock, 
  CloudSun, 
  Users, 
  CurrencyDollar,
  TrendUp,
  Sparkle,
  CheckCircle,
  Plus,
  Trash,
  CalendarBlank
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface AdaptiveSchedulingProps {
  devices: Device[]
  schedules: AdaptiveSchedule[]
  recommendations: AIScheduleRecommendation[]
  onEnableSchedule: (scheduleId: string) => void
  onDisableSchedule: (scheduleId: string) => void
  onDeleteSchedule: (scheduleId: string) => void
  onAcceptRecommendation: (recommendation: AIScheduleRecommendation) => void
  onDismissRecommendation: (recommendationId: string) => void
  onGenerateRecommendations: () => Promise<void>
}

export function AdaptiveScheduling({
  devices,
  schedules,
  recommendations,
  onEnableSchedule,
  onDisableSchedule,
  onDeleteSchedule,
  onAcceptRecommendation,
  onDismissRecommendation,
  onGenerateRecommendations
}: AdaptiveSchedulingProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateRecommendations = async () => {
    setIsGenerating(true)
    try {
      await onGenerateRecommendations()
      toast.success('AI recommendations generated')
    } catch (error) {
      toast.error('Failed to generate recommendations')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAcceptRecommendation = (recommendation: AIScheduleRecommendation) => {
    onAcceptRecommendation(recommendation)
    toast.success(`Adaptive schedule created for ${recommendation.deviceName}`)
  }

  const getScheduleTypeIcon = (type: AdaptiveSchedule['type']) => {
    switch (type) {
      case 'peak-avoidance':
        return <CurrencyDollar className="w-4 h-4" weight="fill" />
      case 'occupancy-based':
        return <Users className="w-4 h-4" weight="fill" />
      case 'weather-based':
        return <CloudSun className="w-4 h-4" weight="fill" />
      case 'cost-optimization':
        return <TrendUp className="w-4 h-4" weight="fill" />
    }
  }

  const getScheduleTypeName = (type: AdaptiveSchedule['type']) => {
    switch (type) {
      case 'peak-avoidance':
        return 'Peak Avoidance'
      case 'occupancy-based':
        return 'Occupancy Based'
      case 'weather-based':
        return 'Weather Based'
      case 'cost-optimization':
        return 'Cost Optimization'
    }
  }

  const getScheduleTypeColor = (type: AdaptiveSchedule['type']) => {
    switch (type) {
      case 'peak-avoidance':
        return 'bg-warning/10 text-warning-foreground border-warning/20'
      case 'occupancy-based':
        return 'bg-primary/10 text-primary-foreground border-primary/20'
      case 'weather-based':
        return 'bg-accent/10 text-accent-foreground border-accent/20'
      case 'cost-optimization':
        return 'bg-success/10 text-success-foreground border-success/20'
    }
  }

  const activeSchedules = schedules.filter(s => s.enabled)
  const totalEstimatedSavings = schedules
    .filter(s => s.enabled)
    .reduce((sum, s) => sum + (s.estimatedSavings || 0), 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="w-6 h-6 text-primary" weight="fill" />
              </div>
              <div>
                <CardTitle>AI Adaptive Scheduling</CardTitle>
                <CardDescription>
                  Intelligent automation that learns and optimizes your energy usage
                </CardDescription>
              </div>
            </div>
            <Button onClick={handleGenerateRecommendations} disabled={isGenerating}>
              <Sparkle className="w-4 h-4 mr-2" weight="fill" />
              {isGenerating ? 'Analyzing...' : 'Generate AI Recommendations'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CheckCircle className="w-5 h-5 text-primary" weight="fill" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{activeSchedules.length}</p>
                    <p className="text-sm text-muted-foreground">Active Schedules</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <CurrencyDollar className="w-5 h-5 text-success" weight="fill" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${totalEstimatedSavings.toFixed(0)}</p>
                    <p className="text-sm text-muted-foreground">Est. Monthly Savings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Sparkle className="w-5 h-5 text-accent" weight="fill" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{recommendations.length}</p>
                    <p className="text-sm text-muted-foreground">AI Recommendations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="recommendations" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recommendations">
                AI Recommendations ({recommendations.length})
              </TabsTrigger>
              <TabsTrigger value="schedules">
                Active Schedules ({schedules.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4 mt-4">
              {recommendations.length === 0 ? (
                <Alert>
                  <Sparkle className="w-4 h-4" />
                  <AlertDescription>
                    No AI recommendations available yet. Click "Generate AI Recommendations" to analyze your usage patterns and get personalized scheduling suggestions.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec) => {
                    const device = devices.find(d => d.id === rec.deviceId)
                    
                    return (
                      <Card key={rec.id} className="border-l-4 border-l-accent">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className={getScheduleTypeColor(rec.type)}>
                                    {getScheduleTypeIcon(rec.type)}
                                    <span className="ml-1">{getScheduleTypeName(rec.type)}</span>
                                  </Badge>
                                  <Badge variant="secondary">
                                    <Brain className="w-3 h-3 mr-1" weight="fill" />
                                    {(rec.confidence * 100).toFixed(0)}% Confidence
                                  </Badge>
                                </div>
                                <h3 className="font-semibold text-lg">{rec.deviceName}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{rec.reason}</p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-2xl font-bold text-success">
                                  ${rec.estimatedSavings.toFixed(0)}
                                </p>
                                <p className="text-xs text-muted-foreground">Est. Monthly</p>
                              </div>
                            </div>

                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-sm font-medium mb-2">Proposed Schedule:</p>
                              <div className="grid grid-cols-7 gap-2 text-xs">
                                {Object.entries(rec.schedule).map(([day, slots]) => (
                                  <div key={day} className="text-center">
                                    <p className="font-semibold mb-1 capitalize">
                                      {day.slice(0, 3)}
                                    </p>
                                    <div className="space-y-1">
                                      {slots && slots.length > 0 ? (
                                        slots.map((slot, idx) => (
                                          <div 
                                            key={idx}
                                            className="bg-background rounded px-1 py-0.5"
                                          >
                                            <p>{slot.startTime}</p>
                                            <p className="text-muted-foreground">
                                              {slot.action === 'on' ? '🟢' : '🔴'}
                                            </p>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-muted-foreground">—</p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {rec.conditions && (
                              <div className="flex flex-wrap gap-2 text-xs">
                                {rec.conditions.peakHours && (
                                  <Badge variant="outline">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Peak Hours Aware
                                  </Badge>
                                )}
                                {rec.conditions.occupancy !== undefined && (
                                  <Badge variant="outline">
                                    <Users className="w-3 h-3 mr-1" />
                                    Occupancy Sensor
                                  </Badge>
                                )}
                                {rec.conditions.weather && (
                                  <Badge variant="outline">
                                    <CloudSun className="w-3 h-3 mr-1" />
                                    Weather Based
                                  </Badge>
                                )}
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleAcceptRecommendation(rec)}
                                className="flex-1"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" weight="fill" />
                                Apply Schedule
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => onDismissRecommendation(rec.id)}
                              >
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="schedules" className="space-y-4 mt-4">
              {schedules.length === 0 ? (
                <Alert>
                  <CalendarBlank className="w-4 h-4" />
                  <AlertDescription>
                    No adaptive schedules created yet. Accept AI recommendations or create custom schedules.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {schedules.map((schedule) => {
                    const device = devices.find(d => d.id === schedule.deviceId)
                    
                    return (
                      <Card key={schedule.id}>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className={getScheduleTypeColor(schedule.type)}>
                                    {getScheduleTypeIcon(schedule.type)}
                                    <span className="ml-1">{getScheduleTypeName(schedule.type)}</span>
                                  </Badge>
                                  {schedule.aiPredicted && (
                                    <Badge variant="secondary">
                                      <Brain className="w-3 h-3 mr-1" weight="fill" />
                                      AI Generated
                                    </Badge>
                                  )}
                                  <Badge 
                                    variant={schedule.enabled ? 'default' : 'secondary'}
                                  >
                                    {schedule.enabled ? 'Active' : 'Paused'}
                                  </Badge>
                                </div>
                                <h3 className="font-semibold">{schedule.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {device?.name || 'Unknown Device'}
                                </p>
                                {schedule.estimatedSavings && (
                                  <p className="text-sm text-success font-medium mt-1">
                                    ~${schedule.estimatedSavings.toFixed(0)}/mo savings
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={schedule.enabled}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      onEnableSchedule(schedule.id)
                                    } else {
                                      onDisableSchedule(schedule.id)
                                    }
                                  }}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDeleteSchedule(schedule.id)}
                                >
                                  <Trash className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </div>

                            {schedule.confidence && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Confidence</span>
                                  <span className="font-medium">
                                    {(schedule.confidence * 100).toFixed(0)}%
                                  </span>
                                </div>
                                <Progress value={schedule.confidence * 100} />
                              </div>
                            )}

                            <div className="text-xs text-muted-foreground">
                              Created {schedule.createdAt.toLocaleDateString()} • 
                              Last modified {schedule.lastModified.toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How AI Adaptive Scheduling Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-warning/10 mt-1">
                  <CurrencyDollar className="w-5 h-5 text-warning" weight="fill" />
                </div>
                <div>
                  <h4 className="font-semibold">Peak Avoidance</h4>
                  <p className="text-sm text-muted-foreground">
                    Shifts energy-intensive tasks away from expensive peak hours to reduce costs
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 mt-1">
                  <Users className="w-5 h-5 text-primary" weight="fill" />
                </div>
                <div>
                  <h4 className="font-semibold">Occupancy Based</h4>
                  <p className="text-sm text-muted-foreground">
                    Learns when you're home and adjusts device schedules based on presence patterns
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-accent/10 mt-1">
                  <CloudSun className="w-5 h-5 text-accent" weight="fill" />
                </div>
                <div>
                  <h4 className="font-semibold">Weather Based</h4>
                  <p className="text-sm text-muted-foreground">
                    Optimizes HVAC and heating based on weather forecasts and temperature trends
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-success/10 mt-1">
                  <TrendUp className="w-5 h-5 text-success" weight="fill" />
                </div>
                <div>
                  <h4 className="font-semibold">Cost Optimization</h4>
                  <p className="text-sm text-muted-foreground">
                    Analyzes time-of-use rates and usage patterns to minimize your energy bill
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
