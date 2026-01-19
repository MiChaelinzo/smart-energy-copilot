import { useState } from 'react'
import { DeviceSchedule, Device } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Clock, CalendarDots, Power, SlidersHorizontal, Trash } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface DeviceSchedulerProps {
  schedules: DeviceSchedule[]
  devices: Device[]
  onAddSchedule: (schedule: Omit<DeviceSchedule, 'id'>) => void
  onToggleSchedule: (scheduleId: string) => void
  onDeleteSchedule: (scheduleId: string) => void
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_LABELS: Record<string, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday'
}

export function DeviceScheduler({ schedules, devices, onAddSchedule, onToggleSchedule, onDeleteSchedule }: DeviceSchedulerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newSchedule, setNewSchedule] = useState({
    deviceId: '',
    name: '',
    action: 'on' as 'on' | 'off' | 'adjust',
    time: '12:00',
    days: [] as string[],
    enabled: true,
    settings: {
      temperature: 72,
      brightness: 80
    }
  })

  const handleSubmit = () => {
    if (!newSchedule.deviceId || !newSchedule.name || newSchedule.days.length === 0) return

    const device = devices.find(d => d.id === newSchedule.deviceId)
    if (!device) return

    onAddSchedule({
      ...newSchedule,
      settings: newSchedule.action === 'adjust' ? newSchedule.settings : undefined
    })

    setNewSchedule({
      deviceId: '',
      name: '',
      action: 'on',
      time: '12:00',
      days: [],
      enabled: true,
      settings: { temperature: 72, brightness: 80 }
    })
    setIsDialogOpen(false)
  }

  const toggleDay = (day: string) => {
    setNewSchedule(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }))
  }

  const getDeviceName = (deviceId: string) => {
    return devices.find(d => d.id === deviceId)?.name || 'Unknown Device'
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'on':
        return <Badge variant="default" className="bg-success hover:bg-success">Turn On</Badge>
      case 'off':
        return <Badge variant="secondary">Turn Off</Badge>
      case 'adjust':
        return <Badge variant="outline">Adjust</Badge>
      default:
        return <Badge>{action}</Badge>
    }
  }

  const selectedDevice = devices.find(d => d.id === newSchedule.deviceId)
  const showTemperature = selectedDevice?.type === 'hvac' && newSchedule.action === 'adjust'
  const showBrightness = selectedDevice?.type === 'light' && newSchedule.action === 'adjust'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Device Schedules</h2>
          <p className="text-muted-foreground">Automate your devices with custom schedules</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Device Schedule</DialogTitle>
              <DialogDescription>Set up automated actions for your devices</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-device">Device</Label>
                <Select value={newSchedule.deviceId} onValueChange={(value) => setNewSchedule({ ...newSchedule, deviceId: value })}>
                  <SelectTrigger id="schedule-device">
                    <SelectValue placeholder="Select a device" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.filter(d => d.type !== 'sensor').map(device => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.name} ({device.room})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule-name">Schedule Name</Label>
                <Input
                  id="schedule-name"
                  placeholder="e.g., Morning lights on"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule-action">Action</Label>
                  <Select value={newSchedule.action} onValueChange={(value: any) => setNewSchedule({ ...newSchedule, action: value })}>
                    <SelectTrigger id="schedule-action">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on">Turn On</SelectItem>
                      <SelectItem value="off">Turn Off</SelectItem>
                      <SelectItem value="adjust">Adjust Settings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule-time">Time</Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                  />
                </div>
              </div>

              {(showTemperature || showBrightness) && (
                <div className="space-y-2">
                  <Label>Settings</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {showTemperature && (
                      <div className="space-y-2">
                        <Label htmlFor="schedule-temperature">Temperature (°F)</Label>
                        <Input
                          id="schedule-temperature"
                          type="number"
                          value={newSchedule.settings.temperature}
                          onChange={(e) => setNewSchedule({
                            ...newSchedule,
                            settings: { ...newSchedule.settings, temperature: parseInt(e.target.value) }
                          })}
                        />
                      </div>
                    )}
                    {showBrightness && (
                      <div className="space-y-2">
                        <Label htmlFor="schedule-brightness">Brightness (%)</Label>
                        <Input
                          id="schedule-brightness"
                          type="number"
                          min="0"
                          max="100"
                          value={newSchedule.settings.brightness}
                          onChange={(e) => setNewSchedule({
                            ...newSchedule,
                            settings: { ...newSchedule.settings, brightness: parseInt(e.target.value) }
                          })}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Days</Label>
                <div className="grid grid-cols-7 gap-2">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        newSchedule.days.includes(day)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                disabled={!newSchedule.deviceId || !newSchedule.name || newSchedule.days.length === 0}
              >
                Create Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {schedules.map((schedule, index) => (
          <motion.div
            key={schedule.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${schedule.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                        {schedule.action === 'adjust' ? (
                          <SlidersHorizontal className="w-5 h-5 text-primary" />
                        ) : (
                          <Power className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{schedule.name}</h3>
                        <p className="text-sm text-muted-foreground">{getDeviceName(schedule.deviceId)}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {getActionBadge(schedule.action)}
                      <Badge variant="outline" className="gap-1">
                        <Clock className="w-3 h-3" />
                        {schedule.time}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <CalendarDots className="w-3 h-3" />
                        {schedule.days.length === 7 ? 'Every day' : schedule.days.join(', ')}
                      </Badge>
                      {schedule.settings && (
                        <Badge variant="secondary" className="gap-1">
                          {schedule.settings.temperature && `${schedule.settings.temperature}°F`}
                          {schedule.settings.brightness && `${schedule.settings.brightness}% brightness`}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={schedule.enabled}
                      onCheckedChange={() => onToggleSchedule(schedule.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDeleteSchedule(schedule.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {schedules.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No schedules yet</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Create automated schedules to optimize your energy usage throughout the day
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Schedule
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
