import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Device } from '@/types'
import { 
  Lightbulb, 
  TrendUp, 
  Clock, 
  CurrencyDollar,
  Lightning,
  ArrowRight,
  Sparkle
} from '@phosphor-icons/react'
import { formatCurrency, formatPower, calculateDailyConsumption, calculateCost } from '@/lib/utils'

interface Insight {
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
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = []
    const currentHour = new Date().getHours()
    const totalPower = devices.reduce((sum, d) => sum + (d.isOn ? d.power : 0), 0)
    
    const hvacDevices = devices.filter(d => d.type === 'hvac' && d.isOn)
    if (hvacDevices.length > 0 && currentHour >= 14 && currentHour <= 19) {
      const hvacPower = hvacDevices.reduce((sum, d) => sum + d.power, 0)
      const dailySavings = calculateCost((hvacPower * 0.3 / 1000) * 5, 0.15)
      insights.push({
        id: 'peak-hvac',
        type: 'peak',
        priority: 'high',
        title: 'Peak Hour HVAC Usage Detected',
        description: `Your HVAC is running during peak electricity rates (2PM-7PM). Consider pre-cooling during off-peak hours.`,
        impact: `Save up to ${formatCurrency(dailySavings * 30)}/month`,
        action: 'Create Schedule',
        icon: Clock,
        color: 'text-warning'
      })
    }

    const alwaysOnDevices = devices.filter(d => d.isOn && d.type === 'appliance')
    if (alwaysOnDevices.length >= 3) {
      const vampirePower = alwaysOnDevices.reduce((sum, d) => sum + d.power * 0.1, 0)
      const monthlyCost = calculateCost(calculateDailyConsumption(vampirePower) * 30)
      insights.push({
        id: 'vampire-power',
        type: 'savings',
        priority: 'medium',
        title: 'Standby Power Waste Detected',
        description: `${alwaysOnDevices.length} devices are consuming standby power. Smart plugs can eliminate this waste.`,
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">High Priority</Badge>
      case 'medium':
        return <Badge className="bg-warning/20 text-warning border-warning/30">Medium</Badge>
      case 'low':
        return <Badge className="bg-muted text-muted-foreground border-border">Low</Badge>
      default:
        return null
    }
  }

  const handleAction = (insight: Insight) => {
    if (insight.action === 'Create Schedule' && onNavigate) {
      onNavigate('scheduler')
    } else if (insight.action === 'View Devices' && onNavigate) {
      onNavigate('devices')
    } else if (insight.action === 'Create Scene' && onNavigate) {
      onNavigate('scenes')
    }
    onApplyRecommendation(insight.id)
  }

  if (insights.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-success/10 via-card to-card border-success/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-success/20">
            <Sparkle className="w-6 h-6 text-success" weight="fill" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">System Optimized</h3>
            <p className="text-muted-foreground text-sm">
              No urgent recommendations right now. Your energy usage is efficient and well-managed!
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkle className="w-5 h-5 text-primary" weight="fill" />
          <h2 className="text-xl font-semibold">Energy Insights</h2>
        </div>
        <Badge variant="outline" className="gap-1">
          <Lightning className="w-3 h-3" weight="fill" />
          {insights.length} Active
        </Badge>
      </div>

      <div className="grid gap-4">
        {insights.map((insight) => {
          const Icon = insight.icon
          return (
            <Card 
              key={insight.id} 
              className="p-5 bg-gradient-to-br from-card via-card to-accent/5 border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-card group-hover:scale-110 transition-transform duration-300 ${insight.color}`}>
                  <Icon className="w-6 h-6" weight="duotone" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{insight.title}</h3>
                      {getPriorityBadge(insight.priority)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {insight.description}
                  </p>
                  
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <CurrencyDollar className="w-4 h-4" weight="fill" />
                      {insight.impact}
                    </div>
                    
                    {insight.action && (
                      <Button 
                        size="sm" 
                        onClick={() => handleAction(insight)}
                        className="gap-2 group/btn"
                      >
                        {insight.action}
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
