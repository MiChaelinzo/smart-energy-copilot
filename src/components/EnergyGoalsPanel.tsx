import { useState } from 'react'
import { EnergyGoal } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Target, TrendUp, Leaf, CurrencyDollar, Lightning, Trophy, CheckCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface EnergyGoalsPanelProps {
  goals: EnergyGoal[]
  onAddGoal: (goal: Omit<EnergyGoal, 'id' | 'current' | 'achieved'>) => void
  onDeleteGoal: (goalId: string) => void
}

export function EnergyGoalsPanel({ goals, onAddGoal, onDeleteGoal }: EnergyGoalsPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: '',
    type: 'usage' as 'usage' | 'cost' | 'carbon',
    target: 0,
    period: 'monthly' as 'daily' | 'weekly' | 'monthly'
  })

  const handleSubmit = () => {
    const now = new Date()
    let startDate = new Date()
    let endDate = new Date()

    if (newGoal.period === 'daily') {
      endDate = new Date(now)
    } else if (newGoal.period === 'weekly') {
      startDate = new Date(now.setDate(now.getDate() - now.getDay()))
      endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 6)
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    }

    onAddGoal({
      ...newGoal,
      startDate,
      endDate
    })

    setNewGoal({ name: '', type: 'usage', target: 0, period: 'monthly' })
    setIsDialogOpen(false)
  }

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'usage': return <Lightning className="w-5 h-5" weight="fill" />
      case 'cost': return <CurrencyDollar className="w-5 h-5" weight="fill" />
      case 'carbon': return <Leaf className="w-5 h-5" weight="fill" />
      default: return <Target className="w-5 h-5" />
    }
  }

  const getGoalUnit = (type: string) => {
    switch (type) {
      case 'usage': return 'kWh'
      case 'cost': return '$'
      case 'carbon': return 'kg CO₂'
      default: return ''
    }
  }

  const achievedGoals = goals.filter(g => g.achieved || (g.current / g.target) >= 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Energy Goals</h2>
          <p className="text-muted-foreground">Track your progress towards energy efficiency targets</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Energy Goal</DialogTitle>
              <DialogDescription>Set a new target to track your energy savings</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  placeholder="e.g., Reduce monthly cost"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-type">Goal Type</Label>
                <Select value={newGoal.type} onValueChange={(value: any) => setNewGoal({ ...newGoal, type: value })}>
                  <SelectTrigger id="goal-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usage">Energy Usage (kWh)</SelectItem>
                    <SelectItem value="cost">Cost ($)</SelectItem>
                    <SelectItem value="carbon">Carbon Reduction (kg CO₂)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-period">Time Period</Label>
                <Select value={newGoal.period} onValueChange={(value: any) => setNewGoal({ ...newGoal, period: value })}>
                  <SelectTrigger id="goal-period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-target">Target Value</Label>
                <Input
                  id="goal-target"
                  type="number"
                  placeholder="0"
                  value={newGoal.target || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, target: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!newGoal.name || newGoal.target <= 0}>
                Create Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {achievedGoals.length > 0 && (
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <Trophy className="w-6 h-6 text-success" weight="fill" />
              </div>
              <div>
                <CardTitle>Achievements Unlocked</CardTitle>
                <CardDescription>You've achieved {achievedGoals.length} goal{achievedGoals.length > 1 ? 's' : ''}!</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {achievedGoals.map(goal => (
                <Badge key={goal.id} variant="outline" className="gap-2 px-3 py-1.5 border-success/30 text-success">
                  <CheckCircle className="w-4 h-4" weight="fill" />
                  {goal.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal, index) => {
          const progress = Math.min((goal.current / goal.target) * 100, 100)
          const isAchieved = goal.achieved || progress >= 100
          const remainingDays = Math.ceil((goal.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={isAchieved ? 'border-success/50 shadow-lg shadow-success/10' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isAchieved ? 'bg-success/20' : 'bg-primary/10'}`}>
                        {isAchieved ? (
                          <Trophy className="w-5 h-5 text-success" weight="fill" />
                        ) : (
                          <span className="text-primary">{getGoalIcon(goal.type)}</span>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        <CardDescription className="capitalize">{goal.period} goal</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold">
                          {goal.type === 'cost' && '$'}{goal.current.toFixed(1)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          of {goal.type === 'cost' && '$'}{goal.target} {getGoalUnit(goal.type)}
                        </p>
                      </div>
                      <Badge variant={isAchieved ? 'default' : 'secondary'} className={isAchieved ? 'bg-success hover:bg-success' : ''}>
                        {progress.toFixed(0)}%
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <TrendUp className="w-4 h-4" />
                      {remainingDays > 0 ? `${remainingDays} days left` : 'Period ended'}
                    </span>
                    {isAchieved && (
                      <Badge variant="outline" className="gap-1 border-success/30 text-success">
                        <CheckCircle className="w-3 h-3" weight="fill" />
                        Achieved
                      </Badge>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDeleteGoal(goal.id)}
                  >
                    Delete Goal
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {goals.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Set energy goals to track your progress and stay motivated
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
