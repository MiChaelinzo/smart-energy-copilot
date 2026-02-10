import { useMemo } from 'react'
import { Device, EnergyGoal } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FileText, Download, TrendUp, Lightning, CurrencyDollar, Leaf, Trophy, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface EnergyReportsProps {
  devices: Device[]
  goals: EnergyGoal[]
}

export function EnergyReports({ devices, goals }: EnergyReportsProps) {
  const reportData = useMemo(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const daysPassed = now.getDate()

    const totalPower = devices.reduce((sum, d) => sum + (d.isOn ? d.power : 0), 0)
    const dailyConsumption = (totalPower / 1000) * 24
    const monthlyConsumption = dailyConsumption * daysPassed
    const projectedMonthly = dailyConsumption * daysInMonth

    const RATE = 0.12
    const monthlyCost = monthlyConsumption * RATE
    const projectedCost = projectedMonthly * RATE

    const lastMonthConsumption = projectedMonthly * 1.12
    const savings = lastMonthConsumption - projectedMonthly
    const savingsPercent = (savings / lastMonthConsumption) * 100

    const carbonPerKwh = 0.92
    const carbonReduction = savings * carbonPerKwh

    const topDevices = [...devices]
      .sort((a, b) => b.power - a.power)
      .slice(0, 5)
      .map(d => ({
        name: d.name,
        consumption: ((d.power / 1000) * 24 * daysPassed).toFixed(1),
        cost: (((d.power / 1000) * 24 * daysPassed) * RATE).toFixed(2)
      }))

    const achievedGoals = goals.filter(g => g.achieved || (g.current / g.target) >= 1)

    const recommendations = [
      'Schedule your water heater to run during off-peak hours (9PM-8AM) to save ~¥15/month',
      'Your HVAC is the highest energy consumer. Consider setting it 2°F higher in summer',
      'Reduce phantom power by using smart outlets for entertainment systems',
      daysPassed > 15 && savingsPercent > 10 
        ? `Great job! You're on track to save ${savingsPercent.toFixed(0)}% this month`
        : 'Enable more automation scenes to optimize energy usage',
    ]

    const achievements = [
      achievedGoals.length > 0 && `Achieved ${achievedGoals.length} energy goal${achievedGoals.length > 1 ? 's' : ''}`,
      savingsPercent > 15 && 'Energy Champion: 15%+ reduction this month',
      devices.filter(d => d.status === 'online').length === devices.length && 'All devices online and monitored',
      monthlyCost < 150 && 'Budget Master: Kept monthly cost under ¥150',
    ].filter(Boolean)

    return {
      period: `${startOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} (${daysPassed} of ${daysInMonth} days)`,
      startDate: startOfMonth,
      endDate: now,
      totalConsumption: monthlyConsumption,
      projectedMonthly,
      totalCost: monthlyCost,
      projectedCost,
      savings,
      savingsPercent,
      carbonReduction,
      topDevices,
      recommendations,
      achievements,
      achievedGoals: achievedGoals.length,
      daysInMonth,
      daysPassed
    }
  }, [devices, goals])

  const handleDownloadReport = () => {
    const reportText = `
ENERGY REPORT
${reportData.period}
Generated: ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
Total Consumption: ${reportData.totalConsumption.toFixed(1)} kWh
Projected Monthly: ${reportData.projectedMonthly.toFixed(1)} kWh
Total Cost: ¥${reportData.totalCost.toFixed(2)}
Projected Cost: ¥${reportData.projectedCost.toFixed(2)}
Savings vs Last Month: ${reportData.savingsPercent.toFixed(1)}% (${reportData.savings.toFixed(1)} kWh)
Carbon Reduction: ${reportData.carbonReduction.toFixed(1)} kg CO₂

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOP ENERGY CONSUMERS
${reportData.topDevices.map((d, i) => `${i + 1}. ${d.name}: ${d.consumption} kWh (¥${d.cost})`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDATIONS
${reportData.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACHIEVEMENTS
${reportData.achievements.length > 0 ? reportData.achievements.map((a, i) => `🏆 ${a}`).join('\n') : 'No achievements this period'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Smart Energy Copilot
AI-Powered Energy Management
    `.trim()

    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `energy-report-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('Report downloaded successfully', {
      description: 'Your energy report has been saved'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Energy Reports</h2>
          <p className="text-muted-foreground">Comprehensive analysis of your energy usage</p>
        </div>
        <Button onClick={handleDownloadReport} className="gap-2">
          <Download className="w-4 h-4" />
          Download Report
        </Button>
      </div>

      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Monthly Report</CardTitle>
              <CardDescription className="text-base">{reportData.period}</CardDescription>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <FileText className="w-8 h-8 text-primary" weight="fill" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Usage</p>
              <p className="text-2xl font-bold">{reportData.totalConsumption.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">kWh</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Projected</p>
              <p className="text-2xl font-bold">{reportData.projectedMonthly.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">kWh</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Cost</p>
              <p className="text-2xl font-bold">¥{reportData.totalCost.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">this month</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Projected Cost</p>
              <p className="text-2xl font-bold">¥{reportData.projectedCost.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">monthly</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-success/10 border-success/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendUp className="w-5 h-5 text-success" weight="bold" />
                  <p className="text-sm font-medium text-success">Savings</p>
                </div>
                <p className="text-3xl font-bold">{reportData.savingsPercent.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {reportData.savings.toFixed(1)} kWh saved
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Leaf className="w-5 h-5 text-primary" weight="fill" />
                  <p className="text-sm font-medium text-primary">Carbon Reduced</p>
                </div>
                <p className="text-3xl font-bold">{reportData.carbonReduction.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground mt-1">kg CO₂</p>
              </CardContent>
            </Card>

            <Card className="bg-accent/10 border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-5 h-5 text-accent-foreground" weight="fill" />
                  <p className="text-sm font-medium text-accent-foreground">Goals Achieved</p>
                </div>
                <p className="text-3xl font-bold">{reportData.achievedGoals}</p>
                <p className="text-sm text-muted-foreground mt-1">of {goals.length} total</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightning className="w-5 h-5 text-primary" weight="fill" />
              <CardTitle>Top Energy Consumers</CardTitle>
            </div>
            <CardDescription>Devices using the most energy this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topDevices.map((device, index) => (
                <div key={device.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-sm text-muted-foreground">{device.consumption} kWh</p>
                    </div>
                  </div>
                  <p className="font-semibold">¥{device.cost}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkle className="w-5 h-5 text-primary" weight="fill" />
              <CardTitle>AI Recommendations</CardTitle>
            </div>
            <CardDescription>Personalized tips to optimize energy usage</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {reportData.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm">{rec}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {reportData.achievements.length > 0 && (
        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning" weight="fill" />
              <CardTitle>Achievements This Period</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {reportData.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background border border-warning/20"
                >
                  <Trophy className="w-5 h-5 text-warning flex-shrink-0" weight="fill" />
                  <p className="text-sm font-medium">{achievement}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
