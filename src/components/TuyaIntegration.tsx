import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TuyaCredentials, TuyaDevice, Device } from '@/types'
import { Lightning, Link, CheckCircle, Warning, Plus, Trash, DeviceMobile, PlugsConnected } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface TuyaIntegrationProps {
  credentials: TuyaCredentials | null
  onCredentialsSave: (credentials: TuyaCredentials) => void
  onDiscoverDevices: () => Promise<TuyaDevice[]>
  onAddDevice: (device: TuyaDevice) => void
  onRemoveDevice: (deviceId: string) => void
  connectedDevices: TuyaDevice[]
}

export function TuyaIntegration({
  credentials,
  onCredentialsSave,
  onDiscoverDevices,
  onAddDevice,
  onRemoveDevice,
  connectedDevices
}: TuyaIntegrationProps) {
  const [accessId, setAccessId] = useState(credentials?.accessId || '')
  const [accessKey, setAccessKey] = useState(credentials?.accessKey || '')
  const [uid, setUid] = useState(credentials?.uid || '')
  const [apiEndpoint, setApiEndpoint] = useState(credentials?.apiEndpoint || 'https://openapi.tuyaus.com')
  const [isConnecting, setIsConnecting] = useState(false)
  const [discoveredDevices, setDiscoveredDevices] = useState<TuyaDevice[]>([])
  const [showApiDialog, setShowApiDialog] = useState(false)

  const handleSaveCredentials = async () => {
    if (!accessId || !accessKey) {
      toast.error('Please enter both Access ID and Access Key')
      return
    }

    setIsConnecting(true)
    try {
      const newCredentials: TuyaCredentials = {
        accessId,
        accessKey,
        uid: uid || undefined,
        apiEndpoint: apiEndpoint || 'https://openapi.tuyaus.com'
      }
      
      onCredentialsSave(newCredentials)
      toast.success('Tuya credentials saved successfully')
    } catch (error) {
      toast.error('Failed to save credentials')
      console.error(error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDiscoverDevices = async () => {
    if (!credentials?.accessId || !credentials?.accessKey) {
      toast.error('Please configure Tuya credentials first')
      return
    }

    setIsConnecting(true)
    try {
      const devices = await onDiscoverDevices()
      setDiscoveredDevices(devices)
      
      if (devices.length === 0) {
        toast.info('No devices found. Make sure devices are paired in the Tuya Smart app.')
      } else {
        toast.success(`Found ${devices.length} Tuya device${devices.length > 1 ? 's' : ''}`)
      }
    } catch (error) {
      toast.error('Failed to discover devices. Check your credentials.')
      console.error(error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleAddDevice = (device: TuyaDevice) => {
    onAddDevice(device)
    setDiscoveredDevices(prev => prev.filter(d => d.tuyaId !== device.tuyaId))
    toast.success(`Added ${device.name} to your devices`)
  }

  const isConnected = Boolean(credentials?.accessId && credentials?.accessKey)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lightning className="w-6 h-6 text-primary" weight="fill" />
              </div>
              <div>
                <CardTitle>Tuya Cloud Integration</CardTitle>
                <CardDescription>Connect your Tuya IoT devices for real-time energy monitoring</CardDescription>
              </div>
            </div>
            {isConnected && (
              <Badge variant="default" className="bg-success text-success-foreground">
                <CheckCircle className="w-4 h-4 mr-1" weight="fill" />
                Connected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-4 mt-4">
              <Alert>
                <Link className="w-4 h-4" />
                <AlertDescription>
                  Get your Tuya Cloud credentials from the Tuya IoT Platform at{' '}
                  <a 
                    href="https://iot.tuya.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    iot.tuya.com
                  </a>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="access-id">Access ID / Client ID</Label>
                  <Input
                    id="access-id"
                    type="text"
                    placeholder="Enter your Tuya Access ID"
                    value={accessId}
                    onChange={(e) => setAccessId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="access-key">Access Key / Client Secret</Label>
                  <Input
                    id="access-key"
                    type="password"
                    placeholder="Enter your Tuya Access Key"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uid">User ID (Optional)</Label>
                  <Input
                    id="uid"
                    type="text"
                    placeholder="Your Tuya account UID"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-endpoint">API Endpoint</Label>
                  <Input
                    id="api-endpoint"
                    type="text"
                    placeholder="https://openapi.tuyaus.com"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Choose based on your data center: US, EU, CN, or IN
                  </p>
                </div>

                <Button 
                  onClick={handleSaveCredentials} 
                  disabled={isConnecting || !accessId || !accessKey}
                  className="w-full"
                >
                  {isConnecting ? 'Connecting...' : 'Save Credentials'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="devices" className="space-y-4 mt-4">
              {!isConnected ? (
                <Alert>
                  <Warning className="w-4 h-4" />
                  <AlertDescription>
                    Please configure your Tuya credentials in the Setup tab first.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Connected Devices</h3>
                      <p className="text-sm text-muted-foreground">
                        {connectedDevices.length} device{connectedDevices.length !== 1 ? 's' : ''} connected
                      </p>
                    </div>
                    <Button onClick={handleDiscoverDevices} disabled={isConnecting}>
                      <Plus className="w-4 h-4 mr-2" />
                      Discover Devices
                    </Button>
                  </div>

                  {connectedDevices.length > 0 && (
                    <div className="space-y-2">
                      {connectedDevices.map((device) => (
                        <Card key={device.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-accent/10">
                                  {device.type === 'light' ? (
                                    <DeviceMobile className="w-5 h-5 text-accent" />
                                  ) : (
                                    <PlugsConnected className="w-5 h-5 text-accent" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{device.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {device.type}
                                    </Badge>
                                    <Badge 
                                      variant={device.online ? 'default' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {device.online ? 'Online' : 'Offline'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveDevice(device.id)}
                              >
                                <Trash className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {discoveredDevices.length > 0 && (
                    <div className="space-y-2 mt-6">
                      <h3 className="font-semibold">Discovered Devices</h3>
                      {discoveredDevices.map((device) => (
                        <Card key={device.tuyaId}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-muted">
                                  {device.type === 'light' ? (
                                    <DeviceMobile className="w-5 h-5" />
                                  ) : (
                                    <PlugsConnected className="w-5 h-5" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{device.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {device.category || device.type}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleAddDevice(device)}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="help" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Getting Started</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Create an account at <a href="https://iot.tuya.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">iot.tuya.com</a></li>
                    <li>Create a new Cloud Project in the Tuya IoT Platform</li>
                    <li>Subscribe to required API services (Device Management, IoT Core)</li>
                    <li>Get your Access ID and Access Key from the project overview</li>
                    <li>Link your Tuya Smart app account to the cloud project</li>
                    <li>Enter credentials in the Setup tab and discover devices</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Supported Devices</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Smart Plugs with energy monitoring</li>
                    <li>Smart lights and switches</li>
                    <li>HVAC controllers and thermostats</li>
                    <li>Energy monitoring sensors</li>
                    <li>Smart appliances (if supported)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">API Endpoints by Region</h3>
                  <ul className="list-none space-y-1 text-sm">
                    <li><code className="bg-muted px-2 py-1 rounded">https://openapi.tuyaus.com</code> - Americas</li>
                    <li><code className="bg-muted px-2 py-1 rounded">https://openapi.tuyaeu.com</code> - Europe</li>
                    <li><code className="bg-muted px-2 py-1 rounded">https://openapi.tuyacn.com</code> - China</li>
                    <li><code className="bg-muted px-2 py-1 rounded">https://openapi.tuyain.com</code> - India</li>
                  </ul>
                </div>

                <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      View API Documentation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tuya API Documentation</DialogTitle>
                      <DialogDescription>
                        Learn more about Tuya Cloud API integration
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm">
                        For detailed API documentation, visit the official Tuya developer portal:
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open('https://developer.tuya.com/en/docs/iot', '_blank')}
                      >
                        Open Documentation
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
