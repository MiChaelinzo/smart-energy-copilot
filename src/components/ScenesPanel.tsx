import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SmartScene, Device } from '@/types'
import { House, Moon, Sun, Desktop, Clock, Plus } from '@phosphor-icons/react'
import { useState } from 'react'

interface ScenesPanelProps {
  scenes: SmartScene[]
  devices: Device[]
  onSceneToggle: (sceneId: string) => void
}

export function ScenesPanel({ scenes, devices, onSceneToggle }: ScenesPanelProps) {
  const [newSceneOpen, setNewSceneOpen] = useState(false)

  const getSceneIcon = (iconName: string) => {
    const iconProps = { className: 'w-6 h-6', weight: 'fill' as const }
    switch (iconName) {
      case 'House':
        return <House {...iconProps} />
      case 'Moon':
        return <Moon {...iconProps} />
      case 'Sun':
        return <Sun {...iconProps} />
      case 'Desktop':
        return <Desktop {...iconProps} />
      default:
        return <House {...iconProps} />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Smart Scenes</h2>
          <p className="text-muted-foreground">Automated energy-saving routines</p>
        </div>
        
        <Dialog open={newSceneOpen} onOpenChange={setNewSceneOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-5 h-5" weight="bold" />
              Create Scene
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Scene</DialogTitle>
              <DialogDescription>
                Set up an automated energy-saving routine
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 text-center text-muted-foreground">
              Scene creation form would go here
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-foreground/90">Total Scenes</div>
            <Clock className="w-5 h-5 text-primary" weight="fill" />
          </div>
          <div className="text-3xl font-bold">{scenes.length}</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-success/20 to-accent/20 border-success/30">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-foreground/90">Active Scenes</div>
            <Sun className="w-5 h-5 text-success" weight="fill" />
          </div>
          <div className="text-3xl font-bold">{scenes.filter(s => s.active).length}</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent/20 to-primary/20 border-accent/30">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-foreground/90">Scheduled</div>
            <Clock className="w-5 h-5 text-accent" weight="fill" />
          </div>
          <div className="text-3xl font-bold">{scenes.filter(s => s.schedule).length}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenes.map(scene => (
          <SceneCard
            key={scene.id}
            scene={scene}
            devices={devices}
            onToggle={() => onSceneToggle(scene.id)}
            getIcon={getSceneIcon}
          />
        ))}
      </div>
    </div>
  )
}

interface SceneCardProps {
  scene: SmartScene
  devices: Device[]
  onToggle: () => void
  getIcon: (iconName: string) => React.ReactElement
}

function SceneCard({ scene, devices, onToggle, getIcon }: SceneCardProps) {
  const sceneDevices = devices.filter(d => scene.devices.includes(d.id))
  const totalPower = sceneDevices.reduce((sum, d) => sum + (d.isOn ? d.power : 0), 0)

  return (
    <Card className={`p-6 bg-card/50 backdrop-blur transition-all ${
      scene.active ? 'border-accent/50 shadow-lg shadow-accent/10' : 'border-border/50'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${scene.active ? 'bg-accent/20 text-accent' : 'bg-muted/50 text-muted-foreground'}`}>
            {getIcon(scene.icon)}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{scene.name}</h3>
            <p className="text-sm text-muted-foreground">{scene.description}</p>
          </div>
        </div>
        <Switch checked={scene.active} onCheckedChange={onToggle} />
      </div>

      {scene.schedule && (
        <div className="mb-4 p-3 rounded-lg bg-secondary/50 border border-border/50">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Scheduled:</span>
            <span className="text-muted-foreground">{scene.schedule.time}</span>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {scene.schedule.days.map(day => (
              <Badge key={day} variant="secondary" className="text-xs">
                {day}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Devices</span>
          <span className="font-medium">{sceneDevices.length} connected</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Estimated Impact</span>
          <span className="font-medium">
            {totalPower > 1000 ? `${(totalPower / 1000).toFixed(2)} kW` : `${totalPower.toFixed(0)} W`}
          </span>
        </div>

        {sceneDevices.length > 0 && (
          <div className="pt-3 border-t border-border/50">
            <div className="text-xs text-muted-foreground mb-2">Controlled Devices:</div>
            <div className="flex flex-wrap gap-1">
              {sceneDevices.slice(0, 4).map(device => (
                <Badge key={device.id} variant="outline" className="text-xs">
                  {device.name}
                </Badge>
              ))}
              {sceneDevices.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{sceneDevices.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
