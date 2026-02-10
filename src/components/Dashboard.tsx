import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Device } from '@/types'
import { Lightning, CurrencyDollar, Leaf, TrendUp, TrendDown, Sparkle } from '@phosphor-icons/react'
import { EnergyChart } from './EnergyChart'
import { VoiceCommandsGuide } from './VoiceCommandsGuide'
import { QuickActions } from './QuickActions'
import { generateEnergyData } from '@/lib/mockData'
import { useEffect, useState } from 'react'

interface DashboardProps {
  devices: Device[]
  onNavigate?: (tab: string) => void
}

export function Dashboard({ devices, onNavigate }: DashboardProps) {
  const [energyData] = useState(generateEnergyData(24))
  const [metrics, setMetrics] = useState({
    currentPower: 0,
    dailyConsumption: 0,
    monthlyCost: 0,
    savings: 0,
    carbonReduction: 0
  })

  useEffect(() => {
    const currentPower = devices
      .filter(d => d.isOn)
      .reduce((sum, d) => sum + d.power, 0)

    const dailyConsumption = energyData
      .slice(-24)
      .reduce((sum, d) => sum + d.consumption, 0)

    const monthlyCost = dailyConsumption * 30 * 0.12
    const savings = monthlyCost * 0.22
    const carbonReduction = dailyConsumption * 0.92 * 30

    setMetrics({
      currentPower,
      dailyConsumption,
      monthlyCost,
      savings,
      carbonReduction
    })
  }, [devices, energyData])

  const savingsGoal = 100
  const savingsProgress = (metrics.savings / savingsGoal) * 100

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Energy Dashboard</h2>
        <p className="text-muted-foreground">Real-time monitoring and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Current Power"
          value={`${(metrics.currentPower / 1000).toFixed(2)} kW`}
          subtitle="Live consumption"
          icon={Lightning}
          trend={metrics.currentPower > 3000 ? 'up' : 'down'}
          trendValue="Real-time"
          color="primary"
        />

        <MetricCard
          title="Daily Usage"
          value={`${metrics.dailyConsumption.toFixed(1)} kWh`}
          subtitle="Last 24 hours"
          icon={TrendUp}
          trend="down"
          trendValue="12% vs yesterday"
          color="accent"
        />

        <MetricCard
          title="Monthly Cost"
          value={`¥${metrics.monthlyCost.toFixed(2)}`}
          subtitle="Projected estimate"
          icon={CurrencyDollar}
          trend="down"
          trendValue="¥24 saved"
          color="success"
        />

        <MetricCard
          title="Carbon Saved"
          value={`${(metrics.carbonReduction / 1000).toFixed(1)} kg`}
          subtitle="CO₂ reduction"
          icon={Leaf}
          trend="up"
          trendValue="22% improvement"
          color="success"
        />
      </div>

      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">Energy Consumption</h3>
            <p className="text-sm text-muted-foreground">24-hour usage pattern</p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Live Updates
          </Badge>
        </div>
        <EnergyChart data={energyData} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Savings Goal</h3>
              <p className="text-sm text-muted-foreground">Monthly target: ${savingsGoal}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-success">${metrics.savings.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">saved</div>
            </div>
          </div>
          <Progress value={savingsProgress} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">{savingsProgress.toFixed(0)}% of monthly goal</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent/20 to-primary/20 border-accent/30">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/20 rounded-lg">
              <Sparkle className="w-8 h-8 text-accent" weight="fill" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">AI Insight</h3>
              <p className="text-sm text-foreground/90 leading-relaxed">
                Your water heater is consuming 15% more energy than usual. Consider scheduling maintenance 
                or adjusting the temperature setting to 120°F for optimal efficiency.
              </p>
              <button className="mt-4 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                View Recommendations →
              </button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
          <h3 className="text-xl font-semibold mb-4">Active Devices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.filter(d => d.isOn).slice(0, 4).map(device => (
              <div
                key={device.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50"
              >
                <div className="relative">
                  <div className="w-2 h-2 bg-success rounded-full pulse-glow" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{device.name}</div>
                  <div className="text-xs text-muted-foreground">{device.power.toFixed(0)} W</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <VoiceCommandsGuide />
      </div>

      {onNavigate && (
        <QuickActions onNavigate={onNavigate} />
      )}
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  subtitle: string
  icon: React.ElementType
  trend?: 'up' | 'down'
  trendValue: string
  color?: 'primary' | 'accent' | 'success' | 'warning'
}

function MetricCard({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'primary' }: MetricCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning'
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" weight="fill" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs">
            {trend === 'down' ? (
              <TrendDown className="w-4 h-4 text-success" weight="bold" />
            ) : (
              <TrendUp className="w-4 h-4 text-destructive" weight="bold" />
            )}
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="text-sm text-muted-foreground mb-2">{title}</div>
        <div className="text-xs text-muted-foreground">{trendValue}</div>
      </div>
    </Card>
  )
}
