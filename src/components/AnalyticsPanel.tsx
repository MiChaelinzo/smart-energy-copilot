import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Device } from '@/types'
import { ChartLine, CurrencyDollar, TrendUp, Calendar } from '@phosphor-icons/react'
import { EnergyChart } from './EnergyChart'
import { generateEnergyData } from '@/lib/mockData'
import { useState } from 'react'

interface AnalyticsPanelProps {
  devices: Device[]
}

export function AnalyticsPanel({ devices }: AnalyticsPanelProps) {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day')
  const [energyData] = useState({
    day: generateEnergyData(24),
    week: generateEnergyData(168),
    month: generateEnergyData(720)
  })

  const currentData = energyData[timeRange]
  const totalConsumption = currentData.reduce((sum, d) => sum + d.consumption, 0)
  const totalCost = totalConsumption * 0.12
  const avgConsumption = totalConsumption / currentData.length
  const peakConsumption = Math.max(...currentData.map(d => d.consumption))

  const topDevices = [...devices]
    .filter(d => d.isOn)
    .sort((a, b) => b.power - a.power)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Energy Analytics</h2>
        <p className="text-muted-foreground">Detailed insights and historical data</p>
      </div>

      <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as 'day' | 'week' | 'month')}>
        <TabsList>
          <TabsTrigger value="day">24 Hours</TabsTrigger>
          <TabsTrigger value="week">7 Days</TabsTrigger>
          <TabsTrigger value="month">30 Days</TabsTrigger>
        </TabsList>

        <TabsContent value={timeRange} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <ChartLine className="w-5 h-5" weight="fill" />
                </div>
                <span className="text-sm font-medium">Total Usage</span>
              </div>
              <div className="text-2xl font-bold">{totalConsumption.toFixed(1)} kWh</div>
              <div className="text-xs text-muted-foreground mt-1">
                {timeRange === 'day' ? 'Last 24 hours' : timeRange === 'week' ? 'Last 7 days' : 'Last 30 days'}
              </div>
            </Card>

            <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-success/10 text-success">
                  <CurrencyDollar className="w-5 h-5" weight="fill" />
                </div>
                <span className="text-sm font-medium">Total Cost</span>
              </div>
              <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground mt-1">$0.12 per kWh</div>
            </Card>

            <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <TrendUp className="w-5 h-5" weight="fill" />
                </div>
                <span className="text-sm font-medium">Peak Usage</span>
              </div>
              <div className="text-2xl font-bold">{peakConsumption.toFixed(1)} kWh</div>
              <div className="text-xs text-muted-foreground mt-1">Maximum consumption</div>
            </Card>

            <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-warning/10 text-warning">
                  <Calendar className="w-5 h-5" weight="fill" />
                </div>
                <span className="text-sm font-medium">Average</span>
              </div>
              <div className="text-2xl font-bold">{avgConsumption.toFixed(2)} kWh</div>
              <div className="text-xs text-muted-foreground mt-1">Per {timeRange === 'day' ? 'hour' : 'day'}</div>
            </Card>
          </div>

          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Consumption Timeline</h3>
                <p className="text-sm text-muted-foreground">Energy usage over time</p>
              </div>
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                {timeRange === 'day' ? '24h' : timeRange === 'week' ? '7d' : '30d'}
              </Badge>
            </div>
            <EnergyChart data={currentData} />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <h3 className="text-xl font-semibold mb-4">Top Energy Consumers</h3>
              <div className="space-y-3">
                {topDevices.map((device, index) => (
                  <div key={device.id} className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{device.name}</div>
                      <div className="text-sm text-muted-foreground">{device.room}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {device.power > 1000 ? `${(device.power / 1000).toFixed(2)} kW` : `${device.power.toFixed(0)} W`}
                      </div>
                      <div className="text-xs text-muted-foreground">current</div>
                    </div>
                  </div>
                ))}
                {topDevices.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No active devices
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <h3 className="text-xl font-semibold mb-4">Efficiency Insights</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-start gap-3">
                    <TrendUp className="w-5 h-5 text-success mt-0.5" weight="fill" />
                    <div>
                      <div className="font-medium text-success mb-1">Great Progress!</div>
                      <div className="text-sm text-foreground/80">
                        You're using 18% less energy compared to last {timeRange}.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="flex items-start gap-3">
                    <ChartLine className="w-5 h-5 text-accent mt-0.5" weight="fill" />
                    <div>
                      <div className="font-medium text-accent mb-1">Peak Hours</div>
                      <div className="text-sm text-foreground/80">
                        Your highest usage is between 5-9 PM. Consider shifting some activities to off-peak hours.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-warning mt-0.5" weight="fill" />
                    <div>
                      <div className="font-medium text-warning mb-1">Optimization Tip</div>
                      <div className="text-sm text-foreground/80">
                        Schedule high-power devices during off-peak hours to save up to $15/month.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
