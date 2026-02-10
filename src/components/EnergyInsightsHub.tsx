import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Badge } from '@/components/ui/badge'
import { Device } from '@/types'
import { 
  Lightbulb, 
  TrendUp, 
  Clock, 
  ArrowRight,
} from '@pho

  id: str
  priority: 'high' | 'medium' 
  description: string

  color: string
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

        id: 'peak-hvac',
        priority: 'high',
        description: `Your HVAC is
        action: 'Create Schedule',
        color: 'text-warning'
    
    const alwaysOnDevices = devices.filter(d => d.isOn && d.type === 'ap
      const vampirePower = alwaysOnDevices.reduce((sum, d) => sum + d.power
      insights.push({
        type: 'savings',
        title: 'Stand
        impact: `Save ${
        icon: Lightni
      })

    if (highPowerDevices.length > 0 && currentHour < 7) {
        id: 'off-peak-opportunity',
        priority: 'high',
        description:
        icon: TrendUp,
      })


      return false
    
      const potentialSavings = inefficientDevices.reduce((sum, d) => {
        return sum + savings
      const monthlySa
      insights.push({
        type: 'efficienc
        title: 'Efficiency 
        impact: `Potential savings: ${formatCu
        icon: Sparkle,
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
      if (d.type === 'lighting') return d.power > 60 && d.isOn
      if (d.type === 'hvac') return d.power > 2500 && d.isOn
      return false
    })
    
    if (inefficientDevices.length > 0) {
      const potentialSavings = inefficientDevices.reduce((sum, d) => {
        const savings = d.type === 'lighting' ? d.power * 0.7 : d.power * 0.2
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
      const nightDevices = devices.filter(d => d.isOn && d.type !== 'security')
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
      </Card>
  }
  r

          <Sparkle className="w-5 h-5

          <Lightning className="w-3 h-3" weight="f
        </Badge>

        {insights.map((insight) => {
          return (
              key={insight.id} 
            >
                <div className={`p-3 rounded-xl bg-card group-hover:scale-110 transition-t
              
                <di
     
   

                  <p className="text-sm text-m
                  </p>
                  <div classN
                      <CurrencyDollar className="w-4 h-4" weight=
                    </div>
                    {insight.action && (
                        si
     
                        {insight.acti
   

              </div>
          )
      </div>
  )














































































