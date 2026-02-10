import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Device } from '@/types'
import {
  Calculator,
  TrendUp,
  TrendDown,
  CurrencyDollar,
  Lightning,
  CalendarBlank,
  ArrowsLeftRight,
  Lightbulb,
  CheckCircle
} from '@phosphor-icons/react'
import { calculateDailyConsumption, calculateCost, formatCurrency, formatEnergy, formatCarbon } from '@/lib/utils'

interface SavingsCalculatorProps {
  devices: Device[]
  onApplySchedule?: (deviceId: string, schedule: any) => void
}

export function SavingsCalculator({ devices, onApplySchedule }: SavingsCalculatorProps) {
  const [selectedScenario, setSelectedScenario] = useState<'schedule' | 'upgrade' | 'behavior'>('schedule')
  const [scheduleReduction, setScheduleReduction] = useState([30])
  const [upgradeEfficiency, setUpgradeEfficiency] = useState([25])
  const [behaviorChange, setBehaviorChange] = useState([15])

  const currentTotalPower = devices.reduce((sum, d) => sum + (d.isOn ? d.power : 0), 0)
  const currentDailyKwh = calculateDailyConsumption(currentTotalPower)
  const currentMonthlyCost = calculateCost(currentDailyKwh * 30)
  const currentYearlyCost = currentMonthlyCost * 12
  const currentMonthlyCarbon = currentDailyKwh * 30 * 0.92

  const calculateScheduleSavings = () => {
    const reductionPercent = scheduleReduction[0] / 100
    const newDailyKwh = currentDailyKwh * (1 - reductionPercent)
    const newMonthlyCost = calculateCost(newDailyKwh * 30)
    const monthlySavings = currentMonthlyCost - newMonthlyCost
    const yearlySavings = monthlySavings * 12
    const carbonReduction = (currentDailyKwh - newDailyKwh) * 30 * 0.92

    return {
      monthlySavings,
      yearlySavings,
      carbonReduction,
      paybackMonths: 0,
      description: `By optimizing your device schedules to run during off-peak hours and reducing unnecessary runtime`
    }
  }

  const calculateUpgradeSavings = () => {
    const efficiencyGain = upgradeEfficiency[0] / 100
    const upgradeCost = 800
    const newDailyKwh = currentDailyKwh * (1 - efficiencyGain)
    const newMonthlyCost = calculateCost(newDailyKwh * 30)
    const monthlySavings = currentMonthlyCost - newMonthlyCost
    const yearlySavings = monthlySavings * 12
    const paybackMonths = Math.ceil(upgradeCost / monthlySavings)
    const carbonReduction = (currentDailyKwh - newDailyKwh) * 30 * 0.92

    return {
      monthlySavings,
      yearlySavings,
      carbonReduction,
      paybackMonths,
      upgradeCost,
      description: `Replacing ${Math.ceil(devices.length * 0.4)} high-consumption devices with energy-efficient models`
    }
  }

  const calculateBehaviorSavings = () => {
    const reductionPercent = behaviorChange[0] / 100
    const newDailyKwh = currentDailyKwh * (1 - reductionPercent)
    const newMonthlyCost = calculateCost(newDailyKwh * 30)
    const monthlySavings = currentMonthlyCost - newMonthlyCost
    const yearlySavings = monthlySavings * 12
    const carbonReduction = (currentDailyKwh - newDailyKwh) * 30 * 0.92

    return {
      monthlySavings,
      yearlySavings,
      carbonReduction,
      paybackMonths: 0,
      description: `Through simple behavioral changes like turning off unused devices and adjusting thermostat settings`
    }
  }

  const getSavingsData = () => {
    switch (selectedScenario) {
      case 'schedule':
        return calculateScheduleSavings()
      case 'upgrade':
        return calculateUpgradeSavings()
      case 'behavior':
        return calculateBehaviorSavings()
    }
  }

  const savingsData = getSavingsData()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/20">
          <Calculator className="w-6 h-6 text-primary" weight="fill" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Savings Calculator</h2>
          <p className="text-muted-foreground text-sm">
            Explore potential savings from different energy optimization strategies
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Current Usage Baseline</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Lightning className="w-4 h-4" />
                  Daily Usage
                </div>
                <div className="text-2xl font-bold">{formatEnergy(currentDailyKwh)}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <CurrencyDollar className="w-4 h-4" />
                  Monthly Cost
                </div>
                <div className="text-2xl font-bold">{formatCurrency(currentMonthlyCost)}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 col-span-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <CalendarBlank className="w-4 h-4" />
                  Yearly Cost
                </div>
                <div className="text-2xl font-bold">{formatCurrency(currentYearlyCost)}</div>
              </div>
            </div>
          </div>

          <Separator />

          <Tabs value={selectedScenario} onValueChange={(v) => setSelectedScenario(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-4 mt-4">
              <div>
                <Label className="text-base mb-3 block">Runtime Reduction</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={scheduleReduction}
                    onValueChange={setScheduleReduction}
                    min={10}
                    max={50}
                    step={5}
                    className="flex-1"
                  />
                  <Badge variant="outline" className="text-base font-semibold min-w-[60px] justify-center">
                    {scheduleReduction[0]}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Reduce device runtime by scheduling during off-peak hours and eliminating unnecessary usage
                </p>
              </div>
            </TabsContent>

            <TabsContent value="upgrade" className="space-y-4 mt-4">
              <div>
                <Label className="text-base mb-3 block">Efficiency Improvement</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={upgradeEfficiency}
                    onValueChange={setUpgradeEfficiency}
                    min={15}
                    max={60}
                    step={5}
                    className="flex-1"
                  />
                  <Badge variant="outline" className="text-base font-semibold min-w-[60px] justify-center">
                    {upgradeEfficiency[0]}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Energy efficiency gains from upgrading to modern, energy-efficient appliances
                </p>
              </div>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-4 mt-4">
              <div>
                <Label className="text-base mb-3 block">Usage Reduction</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={behaviorChange}
                    onValueChange={setBehaviorChange}
                    min={5}
                    max={30}
                    step={5}
                    className="flex-1"
                  />
                  <Badge variant="outline" className="text-base font-semibold min-w-[60px] justify-center">
                    {behaviorChange[0]}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Consumption reduction through behavioral changes and energy-conscious habits
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success/10 via-card to-card border-success/30">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-success/20">
                <TrendUp className="w-6 h-6 text-success" weight="fill" />
              </div>
              <h3 className="text-lg font-semibold">Projected Savings</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-card border border-success/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Monthly Savings</span>
                  <TrendDown className="w-5 h-5 text-success" />
                </div>
                <div className="text-3xl font-bold text-success">
                  {formatCurrency(savingsData.monthlySavings)}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-success/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Yearly Savings</span>
                  <CalendarBlank className="w-5 h-5 text-success" />
                </div>
                <div className="text-3xl font-bold text-success">
                  {formatCurrency(savingsData.yearlySavings)}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-success/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Carbon Reduction</span>
                  <Lightbulb className="w-5 h-5 text-success" weight="fill" />
                </div>
                <div className="text-xl font-bold text-success">
                  {formatCarbon(savingsData.carbonReduction)}/mo
                </div>
              </div>

              {savingsData.paybackMonths > 0 && (
                <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">ROI Timeline</span>
                    <ArrowsLeftRight className="w-5 h-5 text-warning" />
                  </div>
                  <div className="text-2xl font-bold text-warning">
                    {savingsData.paybackMonths} months
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Investment: {formatCurrency((savingsData as any).upgradeCost)}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {savingsData.description}
              </p>
              
              <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" weight="fill" />
                <p className="text-sm">
                  Based on your current usage of <strong>{formatEnergy(currentDailyKwh)}</strong> per day
                  and an average rate of <strong>¥0.12/kWh</strong>
                </p>
              </div>
            </div>

            {selectedScenario === 'schedule' && (
              <Button className="w-full gap-2" size="lg">
                <CalendarBlank className="w-5 h-5" />
                Create Optimized Schedule
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
