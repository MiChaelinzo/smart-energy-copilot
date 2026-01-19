import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Device, DeviceType } from '@/types'
import {
  Lightbulb,
  Fan,
  DeviceMobile,
  Plug,
  Circle,
  Lightning
} from '@phosphor-icons/react'
import { useState } from 'react'

interface DevicesPanelProps {
  devices: Device[]
  onDeviceToggle: (deviceId: string) => void
}

export function DevicesPanel({ devices, onDeviceToggle }: DevicesPanelProps) {
  const [filter, setFilter] = useState<'all' | DeviceType>('all')

  const filteredDevices = filter === 'all'
    ? devices
    : devices.filter(d => d.type === filter)

  const devicesByRoom = filteredDevices.reduce((acc, device) => {
    if (!acc[device.room]) acc[device.room] = []
    acc[device.room].push(device)
    return acc
  }, {} as Record<string, Device[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Device Management</h2>
          <p className="text-muted-foreground">Control and monitor your IoT devices</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {(['all', 'light', 'hvac', 'appliance', 'outlet', 'sensor'] as const).map((type) => (
            <Badge
              key={type}
              variant={filter === type ? 'default' : 'outline'}
              className="cursor-pointer capitalize"
              onClick={() => setFilter(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-foreground/90">Total Devices</div>
            <Lightning className="w-5 h-5 text-primary" weight="fill" />
          </div>
          <div className="text-3xl font-bold">{devices.length}</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-success/20 to-accent/20 border-success/30">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-foreground/90">Online</div>
            <Circle className="w-5 h-5 text-success" weight="fill" />
          </div>
          <div className="text-3xl font-bold">{devices.filter(d => d.status === 'online').length}</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-warning/20 to-accent/20 border-warning/30">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-foreground/90">Active</div>
            <Lightning className="w-5 h-5 text-warning" weight="fill" />
          </div>
          <div className="text-3xl font-bold">{devices.filter(d => d.isOn).length}</div>
        </Card>
      </div>

      {Object.entries(devicesByRoom).map(([room, roomDevices]) => (
        <div key={room} className="space-y-4">
          <h3 className="text-xl font-semibold">{room}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roomDevices.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggle={() => onDeviceToggle(device.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

interface DeviceCardProps {
  device: Device
  onToggle: () => void
}

function DeviceCard({ device, onToggle }: DeviceCardProps) {
  const [brightness, setBrightness] = useState(device.settings?.brightness || 100)
  const [temperature, setTemperature] = useState(device.settings?.temperature || 72)

  const getDeviceIcon = (type: DeviceType) => {
    const iconProps = { className: 'w-6 h-6', weight: 'fill' as const }
    switch (type) {
      case 'light':
        return <Lightbulb {...iconProps} />
      case 'hvac':
        return <Fan {...iconProps} />
      case 'appliance':
        return <DeviceMobile {...iconProps} />
      case 'outlet':
        return <Plug {...iconProps} />
      case 'sensor':
        return <Circle {...iconProps} />
    }
  }

  const getStatusColor = () => {
    if (device.status === 'offline') return 'text-destructive'
    if (device.status === 'error') return 'text-warning'
    return device.isOn ? 'text-success' : 'text-muted-foreground'
  }

  return (
    <Card className={`p-6 bg-card/50 backdrop-blur border-border/50 transition-all ${
      device.isOn ? 'border-accent/50 shadow-lg shadow-accent/10' : ''
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${device.isOn ? 'bg-accent/20 text-accent' : 'bg-muted/50 text-muted-foreground'}`}>
            {getDeviceIcon(device.type)}
          </div>
          <div>
            <h4 className="font-semibold">{device.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
              <span className="text-xs text-muted-foreground capitalize">{device.status}</span>
            </div>
          </div>
        </div>
        <Switch
          checked={device.isOn}
          onCheckedChange={onToggle}
          disabled={device.status !== 'online'}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Power Usage</span>
          <span className="text-sm font-medium">
            {device.power > 1000
              ? `${(device.power / 1000).toFixed(2)} kW`
              : `${device.power.toFixed(0)} W`}
          </span>
        </div>

        {device.type === 'light' && device.isOn && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Brightness</span>
              <span className="text-sm font-medium">{brightness}%</span>
            </div>
            <Slider
              value={[brightness]}
              onValueChange={(values) => setBrightness(values[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        )}

        {device.type === 'hvac' && device.isOn && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Temperature</span>
              <span className="text-sm font-medium">{temperature}°F</span>
            </div>
            <Slider
              value={[temperature]}
              onValueChange={(values) => setTemperature(values[0])}
              min={60}
              max={85}
              step={1}
              className="w-full"
            />
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2">
          Last updated: {new Date(device.lastUpdate).toLocaleTimeString()}
        </div>
      </div>
    </Card>
  )
}
