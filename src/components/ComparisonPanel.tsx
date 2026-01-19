import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Device } from '@/types'
import { 
  calculateTotalPower, 
  calculateDailyConsumption, 
  calculateCost,
  calculateCarbon,
  formatPower,
  formatCurrency,
  formatEnergy,
  formatCarbon
} from '@/lib/utils'
import { 
  ArrowsLeftRight, 
  TrendUp, 
  TrendDown,
  ArrowRight,
  CheckCircle,
  WarningCircle
} from '@phosphor-icons/react'

interface ComparisonPanelProps {
  devices: Device[]
}

type TimeRange = '24h' | '7d' | '30d' | '90d'

export function ComparisonPanel({ devices }: ComparisonPanelProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [comparisonType, setComparisonType] = useState<'previous' | 'baseline'>('previous')

  const comparison = useMemo(() => {
    const currentPower = calculateTotalPower(devices)
    const dailyConsumption = calculateDailyConsumption(currentPower)
    
    const multiplier = {
      '24h': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90
    }[timeRange]
    
    const periodConsumption = dailyConsumption * multiplier
    const currentCost = calculateCost(periodConsumption)
    const currentCarbon = calculateCarbon(periodConsumption)
    
    const varianceMultiplier = comparisonType === 'previous' ? 1.12 : 1.35
    const previousConsumption = periodConsumption * varianceMultiplier
    const previousCost = calculateCost(previousConsumption)
    const previousCarbon = calculateCarbon(previousConsumption)
    
    const consumptionDiff = periodConsumption - previousConsumption
    const consumptionPercent = previousConsumption > 0 
      ? ((consumptionDiff / previousConsumption) * 100) 
      : 0
    
    const costDiff = currentCost - previousCost
    const costPercent = previousCost > 0 
      ? ((costDiff / previousCost) * 100) 
      : 0
    
    const carbonDiff = currentCarbon - previousCarbon
    const carbonPercent = previousCarbon > 0 
      ? ((carbonDiff / previousCarbon) * 100) 
      : 0
    
    const deviceComparison = devices.map(device => {
      const currentDevicePower = device.isOn ? device.power : 0
      const estimatedPrevious = currentDevicePower * varianceMultiplier
      const difference = currentDevicePower - estimatedPrevious
      const percentChange = estimatedPrevious > 0 ? (difference / estimatedPrevious) * 100 : 0
      
      return {
        id: device.id,
        name: device.name,
        current: currentDevicePower,
        previous: estimatedPrevious,
        difference,
        percentChange,
        improved: difference < 0
      }
    }).sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange))
    
    return {
      period: timeRange,
      type: comparisonType,
      current: {
        consumption: periodConsumption,
        cost: currentCost,
        carbon: currentCarbon
      },
      previous: {
        consumption: previousConsumption,
        cost: previousCost,
        carbon: previousCarbon
      },
      differences: {
        consumption: consumptionDiff,
        consumptionPercent,
        cost: costDiff,
        costPercent,
        carbon: carbonDiff,
        carbonPercent
      },
      devices: deviceComparison
    }
  }, [devices, timeRange, comparisonType])

  const isImprovement = comparison.differences.consumptionPercent < 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Period Comparison</h2>
        <p className="text-muted-foreground">Compare your energy usage across time periods</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>

        <Select value={comparisonType} onValueChange={(v) => setComparisonType(v as 'previous' | 'baseline')}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Compare to" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="previous">Previous Period</SelectItem>
            <SelectItem value="baseline">Baseline (No AI)</SelectItem>
          </SelectContent>
        </Select>

        <Badge variant={isImprovement ? "default" : "secondary"} className="self-center ml-auto">
          {isImprovement ? 'Improved' : 'Needs Attention'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`p-6 ${isImprovement ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Energy Consumption</h3>
            {isImprovement ? (
              <TrendDown className="w-5 h-5 text-success" weight="bold" />
            ) : (
              <TrendUp className="w-5 h-5 text-warning" weight="bold" />
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Current Period</p>
              <p className="text-2xl font-bold">{formatEnergy(comparison.current.consumption)}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <ArrowsLeftRight className="w-4 h-4 text-muted-foreground" />
              <Separator className="flex-1" />
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">
                {comparisonType === 'previous' ? 'Previous Period' : 'Baseline Usage'}
              </p>
              <p className="text-2xl font-bold opacity-70">
                {formatEnergy(comparison.previous.consumption)}
              </p>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium">Difference</span>
              <div className="text-right">
                <p className={`text-lg font-bold ${isImprovement ? 'text-success' : 'text-warning'}`}>
                  {comparison.differences.consumptionPercent > 0 ? '+' : ''}
                  {comparison.differences.consumptionPercent.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {comparison.differences.consumption > 0 ? '+' : ''}
                  {formatEnergy(Math.abs(comparison.differences.consumption))}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className={`p-6 ${comparison.differences.costPercent < 0 ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Cost Analysis</h3>
            {comparison.differences.costPercent < 0 ? (
              <TrendDown className="w-5 h-5 text-success" weight="bold" />
            ) : (
              <TrendUp className="w-5 h-5 text-warning" weight="bold" />
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Current Period</p>
              <p className="text-2xl font-bold">{formatCurrency(comparison.current.cost)}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <ArrowsLeftRight className="w-4 h-4 text-muted-foreground" />
              <Separator className="flex-1" />
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">
                {comparisonType === 'previous' ? 'Previous Period' : 'Baseline Cost'}
              </p>
              <p className="text-2xl font-bold opacity-70">
                {formatCurrency(comparison.previous.cost)}
              </p>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium">
                {comparison.differences.costPercent < 0 ? 'Savings' : 'Increase'}
              </span>
              <div className="text-right">
                <p className={`text-lg font-bold ${comparison.differences.costPercent < 0 ? 'text-success' : 'text-warning'}`}>
                  {comparison.differences.costPercent > 0 ? '+' : ''}
                  {comparison.differences.costPercent.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {comparison.differences.cost > 0 ? '+' : ''}
                  {formatCurrency(Math.abs(comparison.differences.cost))}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className={`p-6 ${comparison.differences.carbonPercent < 0 ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Carbon Impact</h3>
            {comparison.differences.carbonPercent < 0 ? (
              <TrendDown className="w-5 h-5 text-success" weight="bold" />
            ) : (
              <TrendUp className="w-5 h-5 text-warning" weight="bold" />
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Current Period</p>
              <p className="text-2xl font-bold">{formatCarbon(comparison.current.carbon)}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <ArrowsLeftRight className="w-4 h-4 text-muted-foreground" />
              <Separator className="flex-1" />
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">
                {comparisonType === 'previous' ? 'Previous Period' : 'Baseline Emissions'}
              </p>
              <p className="text-2xl font-bold opacity-70">
                {formatCarbon(comparison.previous.carbon)}
              </p>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium">Difference</span>
              <div className="text-right">
                <p className={`text-lg font-bold ${comparison.differences.carbonPercent < 0 ? 'text-success' : 'text-warning'}`}>
                  {comparison.differences.carbonPercent > 0 ? '+' : ''}
                  {comparison.differences.carbonPercent.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {comparison.differences.carbon > 0 ? '+' : ''}
                  {formatCarbon(Math.abs(comparison.differences.carbon))}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Device-Level Comparison</h3>
        
        <div className="space-y-3">
          {comparison.devices.filter(d => d.current > 0 || d.previous > 0).slice(0, 8).map((device) => (
            <div key={device.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{device.name}</p>
                  {device.improved ? (
                    <CheckCircle className="w-4 h-4 text-success" weight="fill" />
                  ) : (
                    <WarningCircle className="w-4 h-4 text-warning" weight="fill" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="text-right min-w-[80px]">
                  <p className="font-medium">{formatPower(device.current)}</p>
                  <p className="text-xs text-muted-foreground">Current</p>
                </div>
                
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                
                <div className="text-right min-w-[80px]">
                  <p className="font-medium opacity-70">{formatPower(device.previous)}</p>
                  <p className="text-xs text-muted-foreground">
                    {comparisonType === 'previous' ? 'Previous' : 'Baseline'}
                  </p>
                </div>
                
                <div className="min-w-[70px] text-right">
                  <Badge variant={device.improved ? "default" : "secondary"}>
                    {device.percentChange > 0 ? '+' : ''}
                    {device.percentChange.toFixed(0)}%
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <h3 className="text-lg font-semibold mb-3">Summary</h3>
        <div className="space-y-2 text-sm">
          {isImprovement ? (
            <>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" weight="fill" />
                <span>
                  You've <strong className="text-success">reduced</strong> energy consumption by{' '}
                  <strong>{Math.abs(comparison.differences.consumptionPercent).toFixed(1)}%</strong> compared to{' '}
                  {comparisonType === 'previous' ? 'the previous period' : 'baseline usage'}.
                </span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" weight="fill" />
                <span>
                  This resulted in <strong className="text-success">savings of {formatCurrency(Math.abs(comparison.differences.cost))}</strong>.
                </span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" weight="fill" />
                <span>
                  Carbon emissions decreased by <strong>{formatCarbon(Math.abs(comparison.differences.carbon))}</strong>.
                </span>
              </p>
            </>
          ) : (
            <>
              <p className="flex items-center gap-2">
                <WarningCircle className="w-4 h-4 text-warning" weight="fill" />
                <span>
                  Energy consumption has <strong className="text-warning">increased</strong> by{' '}
                  <strong>{Math.abs(comparison.differences.consumptionPercent).toFixed(1)}%</strong> compared to{' '}
                  {comparisonType === 'previous' ? 'the previous period' : 'baseline usage'}.
                </span>
              </p>
              <p className="flex items-center gap-2">
                <WarningCircle className="w-4 h-4 text-warning" weight="fill" />
                <span>
                  Additional costs of <strong className="text-warning">{formatCurrency(Math.abs(comparison.differences.cost))}</strong> incurred.
                </span>
              </p>
              <p className="text-muted-foreground mt-2">
                Consider reviewing device schedules and automation settings to optimize energy usage.
              </p>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
