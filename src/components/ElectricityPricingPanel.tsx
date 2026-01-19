import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ElectricityRate } from '@/types'
import { Clock, TrendDown, TrendUp, Lightning, CurrencyDollar } from '@phosphor-icons/react'
import { formatCurrency } from '@/lib/utils'

interface ElectricityPricingPanelProps {
  rates: ElectricityRate[]
  currentUsage: number
}

export function ElectricityPricingPanel({ rates, currentUsage }: ElectricityPricingPanelProps) {
  const getCurrentRate = (): ElectricityRate | undefined => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()]

    return rates.find(rate => {
      const isRightDay = rate.days.includes(currentDay)
      const isRightTime = rate.startHour <= rate.endHour
        ? currentHour >= rate.startHour && currentHour < rate.endHour
        : currentHour >= rate.startHour || currentHour < rate.endHour

      return isRightDay && isRightTime
    })
  }

  const getNextRate = (): { rate: ElectricityRate; hoursUntil: number } | undefined => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()]

    const upcomingRates = rates
      .map(rate => {
        let hoursUntil = rate.startHour - currentHour
        if (hoursUntil <= 0) hoursUntil += 24
        return { rate, hoursUntil }
      })
      .filter(item => item.hoursUntil > 0)
      .sort((a, b) => a.hoursUntil - b.hoursUntil)

    return upcomingRates[0]
  }

  const calculatePotentialSavings = (): number => {
    const currentRate = getCurrentRate()
    if (!currentRate) return 0

    const cheapestRate = rates.reduce((min, rate) => rate.rate < min.rate ? rate : min)
    const currentCost = currentUsage * currentRate.rate
    const cheapestCost = currentUsage * cheapestRate.rate

    return currentCost - cheapestCost
  }

  const currentRate = getCurrentRate()
  const nextRate = getNextRate()
  const potentialSavings = calculatePotentialSavings()
  const currentCost = currentRate ? (currentUsage / 1000) * currentRate.rate : 0

  const getRateIcon = (type: string) => {
    switch (type) {
      case 'peak':
        return <TrendUp className="w-4 h-4" weight="bold" />
      case 'super-off-peak':
        return <TrendDown className="w-4 h-4" weight="bold" />
      default:
        return <Lightning className="w-4 h-4" />
    }
  }

  const getRateBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'peak':
        return 'destructive'
      case 'super-off-peak':
        return 'default'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" weight="fill" />
              Current Rate
            </CardTitle>
            <CardDescription>Real-time electricity pricing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentRate ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={getRateBadgeVariant(currentRate.type)} className="gap-1">
                        {getRateIcon(currentRate.type)}
                        {currentRate.name}
                      </Badge>
                    </div>
                    <p className="text-3xl font-bold">
                      {formatCurrency(currentRate.rate)}/kWh
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Current Cost</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {formatCurrency(currentCost)}/hr
                    </p>
                  </div>
                </div>

                {nextRate && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Next rate change</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{nextRate.rate.name}</p>
                        <p className="text-sm text-muted-foreground">
                          in {nextRate.hoursUntil} hour{nextRate.hoursUntil !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <p className="text-lg font-semibold">
                        {formatCurrency(nextRate.rate.rate)}/kWh
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No rate information available</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-success/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CurrencyDollar className="w-5 h-5 text-success" weight="fill" />
              Optimization Opportunity
            </CardTitle>
            <CardDescription>Potential savings with better timing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Potential hourly savings</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(potentialSavings)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                By shifting high-consumption activities to off-peak hours
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Smart scheduling can help you</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  Run heavy appliances during off-peak hours
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  Avoid peak pricing periods (4-9 PM weekdays)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  Take advantage of super off-peak (12-6 AM)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rate Schedule</CardTitle>
          <CardDescription>Daily electricity pricing breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rates.map((rate, index) => {
              const totalHours = rate.endHour > rate.startHour 
                ? rate.endHour - rate.startHour 
                : (24 - rate.startHour) + rate.endHour
              const percentage = (totalHours / 24) * 100

              return (
                <div key={rate.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={getRateBadgeVariant(rate.type)} className="gap-1">
                        {getRateIcon(rate.type)}
                        {rate.name}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {String(rate.startHour).padStart(2, '0')}:00 - {String(rate.endHour).padStart(2, '0')}:00
                      </p>
                    </div>
                    <p className="font-semibold">{formatCurrency(rate.rate)}/kWh</p>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {rate.days.join(', ')} • {totalHours} hours ({percentage.toFixed(0)}% of day)
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
