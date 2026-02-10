import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Device } from '@/types'
import {
  Lightning,
  TrendUp,
  TrendDown,
  CurrencyDollar,
  Leaf,
  ArrowRight,
  Clock,
  Fire,
  Drop,
  Sun
} from '@phosphor-icons/react'
import {
  calculateDailyConsumption,
  calculateCost,
  calculateCarbon,
  formatCurrency,
  formatEnergy,
  formatCarbon,
  formatPower
} from '@/lib/utils'

interface EnhancedDashboardProps {
  devices: Device[]
  onNavigate: (tab: string) => void
}

export function EnhancedDashboard({ devices, onNavigate }: EnhancedDashboardProps) {
  const currentPower = devices.reduce((sum, d) => sum + (d.isOn ? d.power : 0), 0)
  const dailyKwh = calculateDailyConsumption(currentPower)
  const monthlyCost = calculateCost(dailyKwh * 30)
  const monthlyCarbon = calculateCarbon(dailyKwh * 30)
  
  const baselinePower = currentPower * 1.35
  const baselineCost = calculateCost(calculateDailyConsumption(baselinePower) * 30)
  const savingsPercent = baselineCost > 0 ? ((baselineCost - monthlyCost) / baselineCost) * 100 : 0
  
  const devicesOn = devices.filter(d => d.isOn).length
  const topConsumers = [...devices]
    .filter(d => d.isOn)
    .sort((a, b) => b.power - a.power)
    .slice(0, 3)
  
  const currentHour = new Date().getHours()
  const isPeakHour = currentHour >= 14 && currentHour <= 19
  
  const roomBreakdown = devices.reduce((acc, device) => {
    if (!device.isOn) return acc
    if (!acc[device.room]) {
      acc[device.room] = { power: 0, devices: 0 }
    }
    acc[device.room].power += device.power
    acc[device.room].devices += 1
    return acc
  }, {} as Record<string, { power: number; devices: number }>)
  
  const topRooms = Object.entries(roomBreakdown)
    .sort(([, a], [, b]) => b.power - a.power)
    .slice(0, 3)

  const getEfficiencyScore = () => {
    const avgPowerPerDevice = devicesOn > 0 ? currentPower / devicesOn : 0
    if (avgPowerPerDevice < 100) return { score: 95, label: 'Excellent', color: 'text-success' }
    if (avgPowerPerDevice < 200) return { score: 75, label: 'Good', color: 'text-primary' }
    if (avgPowerPerDevice < 300) return { score: 50, label: 'Fair', color: 'text-warning' }
    return { score: 30, label: 'Poor', color: 'text-destructive' }
  }

  const efficiency = getEfficiencyScore()

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-gradient-to-br from-primary/10 via-card to-card border-primary/30 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Lightning className="w-5 h-5 text-primary" weight="fill" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Current Power</span>
            </div>
            {isPeakHour && (
              <Badge variant="destructive" className="text-xs">Peak</Badge>
            )}
          </div>
          <div className="text-3xl font-bold mb-1">{formatPower(currentPower)}</div>
          <p className="text-xs text-muted-foreground">{devicesOn} devices active</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-accent/10 via-card to-card border-accent/30 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <CurrencyDollar className="w-5 h-5 text-accent" weight="fill" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Monthly Cost</span>
          </div>
          <div className="text-3xl font-bold mb-1">{formatCurrency(monthlyCost)}</div>
          <div className="flex items-center gap-1 text-xs">
            <TrendDown className="w-3 h-3 text-success" />
            <span className="text-success font-medium">{savingsPercent.toFixed(0)}% below baseline</span>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-success/10 via-card to-card border-success/30 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-success/20">
              <Leaf className="w-5 h-5 text-success" weight="fill" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Carbon Impact</span>
          </div>
          <div className="text-2xl font-bold mb-1">{formatCarbon(monthlyCarbon)}</div>
          <p className="text-xs text-muted-foreground">per month</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-warning/10 via-card to-card border-warning/30 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-warning/20">
              <TrendUp className="w-5 h-5 text-warning" weight="fill" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Efficiency</span>
          </div>
          <div className="mb-2">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${efficiency.color}`}>{efficiency.score}</span>
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
          </div>
          <Progress value={efficiency.score} className="h-2" />
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Top Energy Consumers</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('devices')}>
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {topConsumers.length > 0 ? (
              topConsumers.map((device, index) => {
                const percentage = (device.power / currentPower) * 100
                return (
                  <div key={device.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          index === 0 ? 'bg-destructive/20 text-destructive' :
                          index === 1 ? 'bg-warning/20 text-warning' :
                          'bg-primary/20 text-primary'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-xs text-muted-foreground">{device.room}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPower(device.power)}</p>
                        <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Lightning className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No active devices</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Room Breakdown</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('analytics')}>
              Details
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {topRooms.length > 0 ? (
              topRooms.map(([room, data]) => {
                const percentage = (data.power / currentPower) * 100
                const getIcon = (roomName: string) => {
                  const lower = roomName.toLowerCase()
                  if (lower.includes('kitchen')) return Fire
                  if (lower.includes('bathroom') || lower.includes('bath')) return Drop
                  if (lower.includes('living') || lower.includes('bedroom')) return Sun
                  return Lightning
                }
                const Icon = getIcon(room)
                
                return (
                  <div key={room} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent/20">
                          <Icon className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">{room}</p>
                          <p className="text-xs text-muted-foreground">{data.devices} device{data.devices !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPower(data.power)}</p>
                        <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Sun className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No room data available</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary/5 via-card to-accent/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Optimize your energy usage</p>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            className="justify-start gap-3 h-auto py-4"
            onClick={() => onNavigate('scheduler')}
          >
            <div className="p-2 rounded-lg bg-primary/20">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">Schedule Devices</p>
              <p className="text-xs text-muted-foreground">Automate routines</p>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="justify-start gap-3 h-auto py-4"
            onClick={() => onNavigate('goals')}
          >
            <div className="p-2 rounded-lg bg-success/20">
              <Leaf className="w-5 h-5 text-success" />
            </div>
            <div className="text-left">
              <p className="font-medium">Set Goals</p>
              <p className="text-xs text-muted-foreground">Track savings</p>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="justify-start gap-3 h-auto py-4"
            onClick={() => onNavigate('adaptive')}
          >
            <div className="p-2 rounded-lg bg-accent/20">
              <TrendUp className="w-5 h-5 text-accent" />
            </div>
            <div className="text-left">
              <p className="font-medium">AI Optimize</p>
              <p className="text-xs text-muted-foreground">Smart scheduling</p>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="justify-start gap-3 h-auto py-4"
            onClick={() => onNavigate('reports')}
          >
            <div className="p-2 rounded-lg bg-warning/20">
              <CurrencyDollar className="w-5 h-5 text-warning" />
            </div>
            <div className="text-left">
              <p className="font-medium">View Reports</p>
              <p className="text-xs text-muted-foreground">Download insights</p>
            </div>
          </Button>
        </div>
      </Card>
    </div>
  )
}
