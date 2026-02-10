import { useMemo } from 'react'
import { Device } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CurrencyDollar, TrendUp, TrendDown, Lightning, Clock, Receipt } from '@phosphor-icons/react'

interface CostAnalyticsPanelProps {
  devices: Device[]
}

export function CostAnalyticsPanel({ devices }: CostAnalyticsPanelProps) {
  const costData = useMemo(() => {
    const activeDevices = devices.filter(d => d.isOn)
    const totalCurrentPower = activeDevices.reduce((sum, d) => sum + d.power, 0)
    
    const RATE_PER_KWH = 0.12
    const currentCostPerHour = (totalCurrentPower / 1000) * RATE_PER_KWH
    const estimatedDailyCost = currentCostPerHour * 24
    const estimatedMonthlyCost = estimatedDailyCost * 30
    
    const deviceCosts = devices.map(device => {
      const dailyCost = ((device.power / 1000) * 24 * RATE_PER_KWH) * (device.isOn ? 1 : 0.3)
      return {
        deviceId: device.id,
        deviceName: device.name,
        cost: dailyCost,
        power: device.power,
        isOn: device.isOn
      }
    }).sort((a, b) => b.cost - a.cost)

    const totalDailyCost = deviceCosts.reduce((sum, d) => sum + d.cost, 0)
    
    const deviceCostsWithPercentage = deviceCosts.map(d => ({
      ...d,
      percentage: totalDailyCost > 0 ? (d.cost / totalDailyCost) * 100 : 0
    }))

    const peakHourRate = 0.18
    const offPeakRate = 0.08
    const midPeakRate = 0.12

    const timeOfUseCosts = [
      { period: 'Peak (4PM - 9PM)', hours: 5, rate: peakHourRate },
      { period: 'Off-Peak (9PM - 8AM)', hours: 11, rate: offPeakRate },
      { period: 'Mid-Peak (8AM - 4PM)', hours: 8, rate: midPeakRate }
    ].map(period => ({
      ...period,
      cost: (totalCurrentPower / 1000) * period.hours * period.rate
    }))

    const lastMonthCost = estimatedMonthlyCost * 1.15
    const savingsPercentage = ((lastMonthCost - estimatedMonthlyCost) / lastMonthCost) * 100

    return {
      currentCostPerHour,
      estimatedDailyCost,
      estimatedMonthlyCost,
      deviceCosts: deviceCostsWithPercentage,
      timeOfUseCosts,
      totalCurrentPower,
      lastMonthCost,
      savingsPercentage,
      totalDailyCost
    }
  }, [devices])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Cost Analytics</h2>
        <p className="text-muted-foreground">Detailed breakdown of your energy costs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Current Cost</CardDescription>
            <CardTitle className="text-3xl font-bold">
              ¥{costData.currentCostPerHour.toFixed(2)}/hr
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {costData.totalCurrentPower.toFixed(0)}W currently in use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Estimated Daily Cost</CardDescription>
            <CardTitle className="text-3xl font-bold">
              ¥{costData.estimatedDailyCost.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Based on current usage patterns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Projected Monthly</CardDescription>
            <CardTitle className="text-3xl font-bold">
              ¥{costData.estimatedMonthlyCost.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              {costData.savingsPercentage > 0 ? (
                <>
                  <TrendDown className="w-4 h-4 text-success" weight="bold" />
                  <span className="text-success font-medium">
                    {costData.savingsPercentage.toFixed(1)}% vs last month
                  </span>
                </>
              ) : (
                <>
                  <TrendUp className="w-4 h-4 text-destructive" weight="bold" />
                  <span className="text-destructive font-medium">
                    {Math.abs(costData.savingsPercentage).toFixed(1)}% vs last month
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightning className="w-5 h-5 text-primary" weight="fill" />
              <CardTitle>Cost by Device</CardTitle>
            </div>
            <CardDescription>Daily cost breakdown per device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {costData.deviceCosts.slice(0, 8).map((device) => (
              <div key={device.deviceId} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{device.deviceName}</span>
                    {device.isOn && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">ON</Badge>
                    )}
                  </div>
                  <span className="font-semibold">¥{device.cost.toFixed(2)}/day</span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={device.percentage} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {device.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
            
            {costData.deviceCosts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No device cost data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" weight="fill" />
              <CardTitle>Time-of-Use Rates</CardTitle>
            </div>
            <CardDescription>Optimize usage during off-peak hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {costData.timeOfUseCosts.map((period, index) => (
              <div key={period.period}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{period.period}</p>
                    <p className="text-sm text-muted-foreground">
                      ¥{period.rate}/kWh · {period.hours} hours
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">¥{period.cost.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">daily</p>
                  </div>
                </div>
                {index < costData.timeOfUseCosts.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Total Daily Cost</p>
                <p className="text-xl font-bold text-primary">
                  ¥{costData.timeOfUseCosts.reduce((sum, p) => sum + p.cost, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" weight="fill" />
            <CardTitle>Cost Saving Tips</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">Shift water heater usage to off-peak hours</p>
                <p className="text-sm text-muted-foreground">Save ~¥15/month by heating during 9PM-8AM</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">Reduce HVAC usage during peak hours</p>
                <p className="text-sm text-muted-foreground">Pre-cool/heat before 4PM to save on peak rates</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">Turn off idle appliances</p>
                <p className="text-sm text-muted-foreground">Phantom loads can add ¥10-20 to monthly bills</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
