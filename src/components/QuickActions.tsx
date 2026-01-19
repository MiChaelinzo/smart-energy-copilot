import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, Clock, CurrencyDollar, FileText, Sparkle } from '@phosphor-icons/react'

interface QuickActionsProps {
  onNavigate: (tab: string) => void
}

export function QuickActions({ onNavigate }: QuickActionsProps) {
  const actions = [
    {
      icon: Target,
      title: 'Set Energy Goals',
      description: 'Track progress towards savings targets',
      tab: 'goals',
      color: 'text-primary'
    },
    {
      icon: Clock,
      title: 'Schedule Devices',
      description: 'Automate your energy usage',
      tab: 'scheduler',
      color: 'text-accent-foreground'
    },
    {
      icon: CurrencyDollar,
      title: 'Analyze Costs',
      description: 'See detailed cost breakdowns',
      tab: 'costs',
      color: 'text-success'
    },
    {
      icon: FileText,
      title: 'View Reports',
      description: 'Download energy reports',
      tab: 'reports',
      color: 'text-warning'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkle className="w-5 h-5 text-primary" weight="fill" />
          <CardTitle>Quick Actions</CardTitle>
        </div>
        <CardDescription>Jump to key features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.tab}
              variant="outline"
              className="h-auto flex-col items-start gap-2 p-4 hover:bg-accent/10 hover:border-primary/50"
              onClick={() => onNavigate(action.tab)}
            >
              <action.icon className={`w-6 h-6 ${action.color}`} weight="fill" />
              <div className="text-left">
                <p className="font-semibold text-sm">{action.title}</p>
                <p className="text-xs text-muted-foreground font-normal">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
