import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Device } from '@/types'
import { 
  Lightbulb, 
  TrendUp, 
  Clock, 
  ArrowRight,
  Lightning,
  Sparkle,
  CurrencyDollar
} from '@phosphor-icons/react'
import { calculateTotalPower, calculateDailyConsumption, calculateCost, formatPower, formatCurrency } from '@/lib/utils'

interface EnergyInsight {
  id: string
  type: 'savings' | 'efficiency' | 'peak' | 'automation'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  impact: string
  action?: string
  icon: typeof Lightbulb
  color: string
}

interface EnergyInsightsHubProps {
  devices: Device[]
  onApplyRecommendation: (insightId: string) => void
  onNavigate?: (tab: string) => void
}

export function EnergyInsightsHub({ devices, onApplyRecommendation, onNavigate }: EnergyInsightsHubProps) {
  const generateInsights = (): EnergyInsight[] => {
    const insights: EnergyInsight[] = []
    const totalPower = calculateTotalPower(devices)
    const currentHour = new Date().getHours()

    if (currentHour >= 17 && currentHour <= 21) {
      const peakDevices = devices.filter(d => d.isOn && d.power > 1000)
      if (peakDevices.length > 0) {
        insights.push({
          id: 'peak-hvac',
          type: 'peak',
          priority: 'high',
          title: 'Peak Hour Usage Alert',
          description: `Your HVAC is running during peak hours when rates are highest. Consider pre-cooling before 5 PM.`,
          impact: `Save ${formatCurrency(25)}/month`,
          action: 'Create Schedule',
          icon: Clock,
          color: 'text-warning'
        })
      }
    }

    const alwaysOnDevices = devices.filter(d => d.isOn && d.type === 'appliance')
    if (alwaysOnDevices.length > 3) {
      const vampirePower = alwaysOnDevices.reduce((sum, d) => sum + d.power * 0.1, 0)
      const monthlyCost = calculateCost(calculateDailyConsumption(vampirePower) * 30)
      insights.push({
        id: 'vampire-power',
        type: 'savings',
        priority: 'medium',
        title: 'Standby Power Consumption',
        description: `${alwaysOnDevices.length} devices are consuming power even when not in active use.`,
        impact: `Save ${formatCurrency(monthlyCost)}/month`,
        action: 'View Devices',
        icon: Lightning,
        color: 'text-accent'
      })
    }

    const highPowerDevices = devices.filter(d => d.isOn && d.power > 1000)
    if (highPowerDevices.length > 0 && currentHour < 7) {
      insights.push({
        id: 'off-peak-opportunity',
        type: 'automation',
        priority: 'high',
        title: 'Off-Peak Opportunity Available',
        description: `You're using ${formatPower(totalPower)} right now during cheapest rates. Great time for energy-intensive tasks!`,
        impact: `Saving 60% on energy costs`,
        icon: TrendUp,
        color: 'text-success'
      })
    }

    const inefficientDevices = devices.filter(d => {
      if (d.type === 'light') return d.power > 60 && d.isOn
      if (d.type === 'hvac') return d.power > 2500 && d.isOn
      return false
    })
    
    if (inefficientDevices.length > 0) {
      const potentialSavings = inefficientDevices.reduce((sum, d) => {
        const savings = d.type === 'light' ? d.power * 0.7 : d.power * 0.2
        return sum + savings
      }, 0)
      const monthlySavings = calculateCost(calculateDailyConsumption(potentialSavings) * 30)
      
      insights.push({
        id: 'upgrade-efficiency',
        type: 'efficiency',
        priority: 'medium',
        title: 'Efficiency Upgrade Recommended',
        description: `${inefficientDevices.length} devices could be replaced with more efficient models.`,
        impact: `Potential savings: ${formatCurrency(monthlySavings)}/month`,
        action: 'View Details',
        icon: Sparkle,
        color: 'text-primary'
      })
    }

    if (currentHour >= 22 || currentHour <= 6) {
      const nightDevices = devices.filter(d => d.isOn && d.type !== 'sensor')
      if (nightDevices.length > 2) {
        insights.push({
          id: 'night-mode',
          type: 'automation',
          priority: 'low',
          title: 'Nighttime Energy Optimization',
          description: `${nightDevices.length} non-essential devices are on. Consider creating a "Sleep Mode" scene.`,
          impact: `Reduce nighttime consumption by 40%`,
          action: 'Create Scene',
          icon: Lightbulb,
          color: 'text-accent'
        })
      }
    }

    return insights.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  const insights = generateInsights()

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    const styles = {
      high: 'bg-destructive/10 text-destructive border-destructive/20',
      medium: 'bg-warning/10 text-warning border-warning/20',
      low: 'bg-muted text-muted-foreground border-border'
    }
    return styles[priority]
  }

  const handleActionClick = (insight: EnergyInsight) => {
    onApplyRecommendation(insight.id)
    if (insight.action === 'Create Schedule' && onNavigate) {
      onNavigate('scheduler')
    } else if (insight.action === 'View Devices' && onNavigate) {
      onNavigate('devices')
    } else if (insight.action === 'Create Scene' && onNavigate) {
      onNavigate('scenes')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <Sparkle className="w-6 h-6 text-primary" weight="fill" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Energy Insights</h2>
            <p className="text-sm text-muted-foreground">AI-powered recommendations to optimize your energy usage</p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-2">
          <Lightning className="w-3 h-3" weight="fill" />
          {insights.length} Active Insights
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight) => {
          const Icon = insight.icon
          return (
            <Card key={insight.id} className="p-6 hover:shadow-lg transition-all group">
              <div className="flex gap-4">
                <div className={`p-3 rounded-xl bg-card group-hover:scale-110 transition-transform ${insight.color}`}>
                  <Icon className="w-6 h-6" weight="duotone" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{insight.title}</h3>
                    <Badge variant="outline" className={getPriorityBadge(insight.priority)}>
                      {insight.priority}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {insight.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium text-accent">
                    <CurrencyDollar className="w-4 h-4" weight="bold" />
                    {insight.impact}
                  </div>
                  {insight.action && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full group/btn"
                      onClick={() => handleActionClick(insight)}
                    >
                      {insight.action}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {insights.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-success/10">
              <Sparkle className="w-8 h-8 text-success" weight="fill" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">All Systems Optimized</h3>
              <p className="text-muted-foreground">
                Your energy usage is well optimized. Keep up the great work!
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
