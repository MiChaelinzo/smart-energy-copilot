import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lightning, Gauge, ChartLine, CalendarCheck, Target, Sparkle, Plug, CheckCircle, Info } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { TuyaCredentials } from '@/types'
import { toast } from 'sonner'

interface WelcomeScreenProps {
  onComplete: () => void
  onCredentialsSave?: (credentials: TuyaCredentials) => void
}

const ONBOARDING_STEPS = [
  {
    icon: Lightning,
    title: 'Welcome to Smart Energy Copilot',
    description: 'Your AI-powered energy management assistant',
    content: 'Track, optimize, and reduce your energy consumption with intelligent insights and automation. Save up to 40% on energy bills while reducing your carbon footprint.',
    color: 'text-primary',
    type: 'intro' as const
  },
  {
    icon: Gauge,
    title: 'Real-Time Monitoring',
    description: 'Track your devices instantly',
    content: 'Monitor all your Tuya IoT devices in real-time. See power consumption, status updates, and get instant alerts when something needs attention.',
    color: 'text-accent',
    type: 'feature' as const
  },
  {
    icon: ChartLine,
    title: 'Smart Analytics',
    description: 'Understand your energy patterns',
    content: 'Visualize your energy usage with detailed charts and reports. Identify trends, peak usage times, and opportunities to save.',
    color: 'text-success',
    type: 'feature' as const
  },
  {
    icon: Target,
    title: 'Set Energy Goals',
    description: 'Achieve your sustainability targets',
    content: 'Set custom goals for energy reduction, cost savings, or carbon footprint. Track your progress and celebrate achievements.',
    color: 'text-warning',
    type: 'feature' as const
  },
  {
    icon: CalendarCheck,
    title: 'AI-Powered Automation',
    description: 'Schedule and optimize automatically',
    content: 'Create smart scenes and schedules. Let AI optimize your devices based on electricity rates, weather, and your preferences.',
    color: 'text-primary',
    type: 'feature' as const
  },
  {
    icon: Plug,
    title: 'Connect Your Tuya Devices',
    description: 'Optional: Set up your smart devices',
    content: 'Connect your Tuya IoT devices for automated energy management. You can skip this and add devices later from the settings.',
    color: 'text-accent',
    type: 'setup' as const
  }
]

export function WelcomeScreen({ onComplete, onCredentialsSave }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tuyaCredentials, setTuyaCredentials] = useState<TuyaCredentials>({
    accessId: '',
    accessKey: '',
    deviceId: '',
    uid: '',
    apiEndpoint: 'https://openapi.tuyaus.com'
  })
  
  const currentStepData = ONBOARDING_STEPS[currentStep]
  const IconComponent = currentStepData.icon
  const isSetupStep = currentStepData.type === 'setup'

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      if (isSetupStep && tuyaCredentials.accessId && tuyaCredentials.accessKey) {
        onCredentialsSave?.(tuyaCredentials)
        toast.success('Tuya credentials saved! You can start discovering devices.')
      }
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const handleSkipSetup = () => {
    toast.info('You can add Tuya devices later from the Tuya Devices tab')
    onComplete()
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(114,200,200,0.15),transparent_60%),radial-gradient(circle_at_80%_20%,rgba(100,150,255,0.12),transparent_50%)] pointer-events-none" />
      
      <div className="relative h-full flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-3xl my-8"
        >
          <Card className="border-2 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            
            <CardHeader className="text-center space-y-4 pt-8 pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center">
                    <div className={`relative p-6 rounded-2xl bg-gradient-to-br from-card to-secondary ${currentStepData.color}`}>
                      <IconComponent className="w-16 h-16" weight="duotone" />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-bold">
                      {currentStepData.title}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {currentStepData.description}
                    </CardDescription>
                  </div>
                </motion.div>
              </AnimatePresence>
            </CardHeader>

            <CardContent className="space-y-8 pb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {!isSetupStep ? (
                    <div className="text-center px-8">
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {currentStepData.content}
                      </p>
                    </div>
                  ) : (
                    <div className="px-8 space-y-6">
                      <p className="text-muted-foreground text-center leading-relaxed mb-6">
                        {currentStepData.content}
                      </p>
                      
                      <div className="bg-muted/30 border border-border rounded-lg p-4 flex gap-3">
                        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p className="font-medium text-foreground">How to get Tuya credentials:</p>
                          <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>Go to <a href="https://iot.tuya.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">iot.tuya.com</a> and create an account</li>
                            <li>Create a Cloud Project and get your Access ID and Access Key</li>
                            <li>Link your Tuya devices to your project</li>
                            <li>Copy your credentials here</li>
                          </ol>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="accessId">Access ID *</Label>
                          <Input
                            id="accessId"
                            placeholder="Enter your Tuya Access ID"
                            value={tuyaCredentials.accessId}
                            onChange={(e) => setTuyaCredentials({ ...tuyaCredentials, accessId: e.target.value })}
                            className="font-mono text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="accessKey">Access Key *</Label>
                          <Input
                            id="accessKey"
                            type="password"
                            placeholder="Enter your Tuya Access Key"
                            value={tuyaCredentials.accessKey}
                            onChange={(e) => setTuyaCredentials({ ...tuyaCredentials, accessKey: e.target.value })}
                            className="font-mono text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="deviceId">Device ID (Optional)</Label>
                            <Input
                              id="deviceId"
                              placeholder="Device ID"
                              value={tuyaCredentials.deviceId}
                              onChange={(e) => setTuyaCredentials({ ...tuyaCredentials, deviceId: e.target.value })}
                              className="font-mono text-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="uid">User ID (Optional)</Label>
                            <Input
                              id="uid"
                              placeholder="User ID"
                              value={tuyaCredentials.uid}
                              onChange={(e) => setTuyaCredentials({ ...tuyaCredentials, uid: e.target.value })}
                              className="font-mono text-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="apiEndpoint">API Endpoint</Label>
                          <Input
                            id="apiEndpoint"
                            placeholder="https://openapi.tuyaus.com"
                            value={tuyaCredentials.apiEndpoint}
                            onChange={(e) => setTuyaCredentials({ ...tuyaCredentials, apiEndpoint: e.target.value })}
                            className="font-mono text-sm"
                          />
                        </div>

                        {tuyaCredentials.accessId && tuyaCredentials.accessKey && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-sm text-success bg-success/10 border border-success/20 rounded-lg p-3"
                          >
                            <CheckCircle className="w-5 h-5" weight="fill" />
                            <span>Credentials ready! Click "Get Started" to complete setup.</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-2 py-4">
                {ONBOARDING_STEPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'w-8 bg-primary'
                        : 'w-2 bg-muted hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 px-4">
                <Button
                  variant="ghost"
                  onClick={isSetupStep ? handleSkipSetup : handleSkip}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isSetupStep ? 'Skip Setup' : 'Skip Tour'}
                </Button>

                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                    >
                      Previous
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleNext}
                    className="min-w-32 gap-2"
                    disabled={isSetupStep && currentStep === ONBOARDING_STEPS.length - 1 && !tuyaCredentials.accessId && !tuyaCredentials.accessKey}
                  >
                    {currentStep === ONBOARDING_STEPS.length - 1 ? (
                      <>
                        Get Started
                        <Sparkle weight="fill" />
                      </>
                    ) : (
                      'Next'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
