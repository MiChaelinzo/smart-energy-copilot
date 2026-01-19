import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Device, EnergyGoal } from '@/types'
import { 
  Lightning, 
  CurrencyDollar, 
  Leaf, 
  TrendUp, 
  TrendDown,
  ChartPie,
  Calculator,
  Target
} from '@phosphor-icons/react'

interface TotalSummaryPanelProps {
  devices: Device[]
  goals?: EnergyGoal[]
}

export function TotalSummaryPanel({ devices, goals = [] }: TotalSummaryPanelProps) {
  const summary = useMemo(() => {
    const onlineDevices = devices.filter(d => d.status === 'online')
    const activeDevices = devices.filter(d => d.isOn)
    
    const totalPower = devices.reduce((sum, device) => {
      return sum + (device.isOn ? device.power : 0)
    }, 0)
    
    const dailyConsumption = (totalPower / 1000) * 24
    const weeklyConsumption = dailyConsumption * 7
    const monthlyConsumption = dailyConsumption * 30
    
    const costPerKwh = 0.12
    const dailyCost = dailyConsumption * costPerKwh
    const weeklyCost = weeklyConsumption * costPerKwh
    const monthlyCost = monthlyConsumption * costPerKwh
    
    const carbonPerKwh = 0.92
    const dailyCarbon = dailyConsumption * carbonPerKwh
    const weeklyCarbon = weeklyConsumption * carbonPerKwh
    const monthlyCarbon = monthlyConsumption * carbonPerKwh
    
    const baselineMonthly = monthlyConsumption * 1.35
    const baselineMonthlyCost = baselineMonthly * costPerKwh
    const monthlySavings = baselineMonthlyCost - monthlyCost
    const savingsPercentage = ((monthlySavings / baselineMonthlyCost) * 100)
    
    const yearlySavings = monthlySavings * 12
    const yearlyCarbon = monthlyCarbon * 12
    
    const deviceBreakdown = devices
      .filter(d => d.isOn)
      .map(device => ({
        id: device.id,
        name: device.name,
        power: device.power,
        percentage: totalPower > 0 ? (device.power / totalPower) * 100 : 0,
        dailyCost: (device.power / 1000) * 24 * costPerKwh
      }))
      .sort((a, b) => b.power - a.power)
    
    const roomBreakdown = devices.reduce((acc, device) => {
      if (!device.isOn) return acc
      if (!acc[device.room]) {
        acc[device.room] = { power: 0, cost: 0 }
      }
      acc[device.room].power += device.power
      acc[device.room].cost += (device.power / 1000) * 24 * costPerKwh
      return acc
    }, {} as Record<string, { power: number; cost: number }>)
    
    const roomStats = Object.entries(roomBreakdown)
      .map(([room, stats]) => ({
        room,
        power: stats.power,
        cost: stats.cost,
        percentage: totalPower > 0 ? (stats.power / totalPower) * 100 : 0
      }))
      .sort((a, b) => b.power - a.power)
    
    const goalProgress = goals.map(goal => ({
      ...goal,
      percentage: goal.target > 0 ? (goal.current / goal.target) * 100 : 0,
      remaining: Math.max(0, goal.target - goal.current)
    }))
    
    return {
      devices: {
        total: devices.length,
        online: onlineDevices.length,
        active: activeDevices.length,
        offline: devices.filter(d => d.status === 'offline').length
      },
      power: {
        current: totalPower,
        daily: dailyConsumption,
        weekly: weeklyConsumption,
        monthly: monthlyConsumption
      },
      cost: {
        daily: dailyCost,
        weekly: weeklyCost,
        monthly: monthlyCost,
        savings: monthlySavings,
        savingsPercentage,
        yearly: yearlySavings
      },
      carbon: {
        daily: dailyCarbon,
        weekly: weeklyCarbon,
        monthly: monthlyCarbon,
        yearly: yearlyCarbon
      },
      breakdown: {
        devices: deviceBreakdown,
        rooms: roomStats
      },
      goals: goalProgress
    }
  }, [devices, goals])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Total Energy Summary</h2>
        <p className="text-muted-foreground">Complete overview of your energy ecosystem</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Current Power Draw</p>
              <p className="text-4xl font-bold text-primary mb-1">
                {(summary.power.current / 1000).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">kW</p>
            </div>
            <div className="p-3 bg-primary/20 rounded-lg">
              <Lightning className="w-6 h-6 text-primary" weight="fill" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-primary/20">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">24h Projected</span>
              <span className="font-medium">{summary.power.daily.toFixed(1)} kWh</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Monthly Cost</p>
              <p className="text-4xl font-bold text-success mb-1">
                ${summary.cost.monthly.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">Projected</p>
            </div>
            <div className="p-3 bg-success/20 rounded-lg">
              <CurrencyDollar className="w-6 h-6 text-success" weight="fill" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-success/20">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Daily Rate</span>
              <span className="font-medium">${summary.cost.daily.toFixed(2)}/day</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Monthly Savings</p>
              <p className="text-4xl font-bold text-accent mb-1">
                ${summary.cost.savings.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                {summary.cost.savingsPercentage.toFixed(1)}% reduction
              </p>
            </div>
            <div className="p-3 bg-accent/20 rounded-lg">
              <TrendDown className="w-6 h-6 text-accent" weight="fill" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-accent/20">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Yearly Projected</span>
              <span className="font-medium">${summary.cost.yearly.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Carbon Saved</p>
              <p className="text-4xl font-bold text-warning mb-1">
                {summary.carbon.monthly.toFixed(0)}
              </p>
              <p className="text-sm text-muted-foreground">lbs CO₂/month</p>
            </div>
            <div className="p-3 bg-warning/20 rounded-lg">
              <Leaf className="w-6 h-6 text-warning" weight="fill" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-warning/20">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Yearly Impact</span>
              <span className="font-medium">{summary.carbon.yearly.toFixed(0)} lbs</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ChartPie className="w-5 h-5 text-primary" weight="fill" />
            <h3 className="text-lg font-semibold">Device Breakdown</h3>
            <Badge variant="secondary" className="ml-auto">
              {summary.devices.active} Active
            </Badge>
          </div>
          
          <div className="space-y-3">
            {summary.breakdown.devices.slice(0, 5).map((device, idx) => (
              <div key={device.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{device.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {device.power.toFixed(0)}W
                    </span>
                    <span className="text-sm font-medium min-w-[60px] text-right">
                      ${device.dailyCost.toFixed(2)}/day
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={device.percentage} className="flex-1" />
                  <span className="text-xs text-muted-foreground min-w-[40px] text-right">
                    {device.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
            {summary.breakdown.devices.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active devices consuming power
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-primary" weight="fill" />
            <h3 className="text-lg font-semibold">Room Breakdown</h3>
            <Badge variant="secondary" className="ml-auto">
              {summary.breakdown.rooms.length} Rooms
            </Badge>
          </div>
          
          <div className="space-y-3">
            {summary.breakdown.rooms.map((room, idx) => (
              <div key={room.room}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{room.room}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {(room.power / 1000).toFixed(2)}kW
                    </span>
                    <span className="text-sm font-medium min-w-[60px] text-right">
                      ${room.cost.toFixed(2)}/day
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={room.percentage} className="flex-1" />
                  <span className="text-xs text-muted-foreground min-w-[40px] text-right">
                    {room.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
            {summary.breakdown.rooms.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active rooms consuming power
              </p>
            )}
          </div>
        </Card>
      </div>

      {summary.goals.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" weight="fill" />
            <h3 className="text-lg font-semibold">Goal Progress Summary</h3>
            <Badge variant="secondary" className="ml-auto">
              {summary.goals.filter(g => g.achieved).length}/{summary.goals.length} Achieved
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summary.goals.map((goal) => (
              <div key={goal.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">{goal.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {goal.period} · {goal.type}
                    </p>
                  </div>
                  {goal.achieved && (
                    <Badge className="bg-success text-success-foreground">
                      Achieved!
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Progress 
                    value={Math.min(goal.percentage, 100)} 
                    className="h-2"
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      {goal.current.toFixed(1)} / {goal.target.toFixed(0)}
                    </span>
                    <span className={goal.achieved ? 'text-success font-medium' : 'text-foreground'}>
                      {goal.percentage.toFixed(0)}%
                    </span>
                  </div>
                  {!goal.achieved && (
                    <p className="text-xs text-muted-foreground">
                      {goal.remaining.toFixed(1)} remaining
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <h3 className="text-lg font-semibold mb-4">System Status Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-background/50">
            <p className="text-3xl font-bold text-primary mb-1">{summary.devices.total}</p>
            <p className="text-xs text-muted-foreground">Total Devices</p>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-background/50">
            <p className="text-3xl font-bold text-success mb-1">{summary.devices.online}</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-background/50">
            <p className="text-3xl font-bold text-accent mb-1">{summary.devices.active}</p>
            <p className="text-xs text-muted-foreground">Active Now</p>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-background/50">
            <p className="text-3xl font-bold text-destructive mb-1">{summary.devices.offline}</p>
            <p className="text-xs text-muted-foreground">Offline</p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Weekly Consumption</p>
            <p className="text-lg font-semibold">{summary.power.weekly.toFixed(2)} kWh</p>
            <p className="text-xs text-muted-foreground">${summary.cost.weekly.toFixed(2)} cost</p>
          </div>
          
          <div>
            <p className="text-muted-foreground mb-1">Average Power</p>
            <p className="text-lg font-semibold">
              {summary.devices.active > 0 
                ? (summary.power.current / summary.devices.active).toFixed(0) 
                : 0}W
            </p>
            <p className="text-xs text-muted-foreground">per active device</p>
          </div>
          
          <div>
            <p className="text-muted-foreground mb-1">Efficiency Score</p>
            <p className="text-lg font-semibold text-success">
              {(100 - summary.cost.savingsPercentage).toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground">vs baseline usage</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
