import { useMemo } from 'react'
import { Device } from '@/types'
import { 
  calculateTotalPower, 
  calculateDailyConsumption, 
  calculateCost,
  formatPower,
  formatCurrency,
  formatEnergy
} from '@/lib/utils'
import { Lightning, CurrencyDollar, ChartLine, DeviceMobile } from '@phosphor-icons/react'

interface QuickStatsBarProps {
  devices: Device[]
}

export function QuickStatsBar({ devices }: QuickStatsBarProps) {
  const stats = useMemo(() => {
    const totalPower = calculateTotalPower(devices)
    const dailyConsumption = calculateDailyConsumption(totalPower)
    const dailyCost = calculateCost(dailyConsumption)
    const monthlyCost = dailyCost * 30
    const activeDevices = devices.filter(d => d.isOn).length
    
    return {
      power: totalPower,
      daily: dailyConsumption,
      cost: monthlyCost,
      active: activeDevices
    }
  }, [devices])

  return (
    <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-[73px] z-40">
      <div className="container mx-auto px-6 py-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Lightning className="w-4 h-4 text-primary" weight="fill" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Power Draw</p>
              <p className="text-sm font-bold">{formatPower(stats.power)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <ChartLine className="w-4 h-4 text-accent" weight="fill" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Daily Usage</p>
              <p className="text-sm font-bold">{formatEnergy(stats.daily)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <CurrencyDollar className="w-4 h-4 text-success" weight="fill" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Monthly Cost</p>
              <p className="text-sm font-bold">{formatCurrency(stats.cost)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <DeviceMobile className="w-4 h-4 text-warning" weight="fill" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Devices</p>
              <p className="text-sm font-bold">{stats.active}/{devices.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
