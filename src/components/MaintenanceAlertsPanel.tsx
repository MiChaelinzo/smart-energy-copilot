import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MaintenanceAlert } from '@/types'
import { 
  WarningCircle, 
  Wrench, 
  TrendDown, 
  Calendar, 
  CheckCircle,
  XCircle,
  Info
} from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'
import { ensureDate } from '@/lib/utils'

interface MaintenanceAlertsPanelProps {
  alerts: MaintenanceAlert[]
  onAcknowledge: (alertId: string) => void
  onDismiss: (alertId: string) => void
}

export function MaintenanceAlertsPanel({ 
  alerts, 
  onAcknowledge,
  onDismiss 
}: MaintenanceAlertsPanelProps) {
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    if (a.acknowledged !== b.acknowledged) return a.acknowledged ? 1 : -1
    return severityOrder[a.severity] - severityOrder[b.severity]
  })

  const activeAlerts = alerts.filter(a => !a.acknowledged)
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length
  const highCount = activeAlerts.filter(a => a.severity === 'high').length
  const mediumCount = activeAlerts.filter(a => a.severity === 'medium').length

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-destructive'
      case 'high':
        return 'text-warning'
      case 'medium':
        return 'text-accent'
      default:
        return 'text-muted-foreground'
    }
  }

  const getSeverityBadgeVariant = (severity: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (severity) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5" weight="fill" />
      case 'high':
        return <WarningCircle className="w-5 h-5" weight="fill" />
      case 'medium':
        return <Info className="w-5 h-5" weight="fill" />
      default:
        return <CheckCircle className="w-5 h-5" weight="fill" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'efficiency':
        return <TrendDown className="w-4 h-4" />
      case 'lifespan':
        return <Calendar className="w-4 h-4" />
      default:
        return <Wrench className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-destructive/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-3xl font-bold text-destructive">{criticalCount}</p>
              </div>
              <XCircle className="w-8 h-8 text-destructive" weight="fill" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-3xl font-bold text-warning">{highCount}</p>
              </div>
              <WarningCircle className="w-8 h-8 text-warning" weight="fill" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Medium</p>
                <p className="text-3xl font-bold text-accent">{mediumCount}</p>
              </div>
              <Info className="w-8 h-8 text-accent" weight="fill" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-success/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">All Active</p>
                <p className="text-3xl font-bold text-foreground">{activeAlerts.length}</p>
              </div>
              <Wrench className="w-8 h-8 text-success" weight="fill" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {sortedAlerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="w-16 h-16 text-success mb-4" weight="fill" />
              <p className="text-lg font-semibold mb-2">All Systems Optimal</p>
              <p className="text-muted-foreground text-center max-w-md">
                No maintenance alerts detected. All devices are operating efficiently.
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedAlerts.map(alert => (
            <Card 
              key={alert.id} 
              className={`${alert.acknowledged ? 'opacity-60' : ''} transition-opacity`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={getSeverityBadgeVariant(alert.severity)} className="gap-1">
                        {getSeverityIcon(alert.severity)}
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        {getTypeIcon(alert.type)}
                        {alert.type.replace('-', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(ensureDate(alert.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <CardTitle className={`${getSeverityColor(alert.severity)}`}>
                      {alert.title}
                    </CardTitle>
                    <CardDescription className="font-medium">
                      Device: {alert.deviceName}
                    </CardDescription>
                  </div>
                  {!alert.acknowledged && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAcknowledge(alert.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDismiss(alert.id)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-foreground mb-1">{alert.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      Prediction Confidence
                    </p>
                    <p className="text-sm font-semibold">{alert.confidence}%</p>
                  </div>
                  <Progress value={alert.confidence} className="h-2" />
                </div>

                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <TrendDown className="w-4 h-4 text-accent" weight="bold" />
                    Prediction
                  </p>
                  <p className="text-sm text-muted-foreground">{alert.prediction}</p>
                </div>

                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-primary" weight="bold" />
                    Recommended Action
                  </p>
                  <p className="text-sm text-foreground">{alert.recommendation}</p>
                  {alert.estimatedDate && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                      <Calendar className="w-3 h-3" />
                      Action recommended by: {ensureDate(alert.estimatedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {alert.acknowledged && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                    <CheckCircle className="w-3 h-3" weight="fill" />
                    Acknowledged
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
