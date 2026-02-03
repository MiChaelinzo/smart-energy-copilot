import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lightning, Gauge, ChartLine, CalendarCheck, Target, Sparkle, Plug, CheckCircle, Info, Lightbulb, Sun, Moon, Thermometer, Power, Drop, Wind } from '@phosphor-icons/react'
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

const ENERGY_SAVING_TIPS = [
  {
    icon: Lightbulb,
    title: 'LED Lighting',
    tip: 'Switch to LED bulbs to reduce lighting costs by up to 75% and last 25 times longer than incandescent bulbs.',
    savings: 'Save $225/year',
    color: 'from-amber-500/20 to-yellow-500/20',
    iconColor: 'text-amber-500'
  },
  {
    icon: Thermometer,
    title: 'Smart Thermostat',
    tip: 'Set your thermostat 7-10°F lower for 8 hours a day to save up to 10% annually on heating and cooling.',
    savings: 'Save $180/year',
    color: 'from-red-500/20 to-orange-500/20',
    iconColor: 'text-red-500'
  },
  {
    icon: Power,
    title: 'Unplug Devices',
    tip: 'Phantom power from devices on standby can account for 5-10% of your electricity bill. Unplug or use smart plugs.',
    savings: 'Save $100/year',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500'
  },
  {
    icon: Sun,
    title: 'Peak Hours',
    tip: 'Run major appliances during off-peak hours (typically 9 PM - 6 AM) to take advantage of lower electricity rates.',
    savings: 'Save $150/year',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-500'
  },
  {
    icon: Drop,
    title: 'Water Heating',
    tip: 'Lower your water heater temperature to 120°F and insulate the tank to reduce energy consumption by 4-9%.',
    savings: 'Save $95/year',
    color: 'from-teal-500/20 to-emerald-500/20',
    iconColor: 'text-teal-500'
  },
  {
    icon: Wind,
    title: 'Air Leaks',
    tip: 'Seal air leaks around windows and doors to prevent up to 30% of heating and cooling energy loss.',
    savings: 'Save $200/year',
    color: 'from-indigo-500/20 to-blue-500/20',
    iconColor: 'text-indigo-500'
  },
  {
    icon: Moon,
    title: 'Sleep Mode',
    tip: 'Enable power-saving modes on computers and electronics. A computer in sleep mode uses 85% less energy.',
    savings: 'Save $50/year',
    color: 'from-slate-500/20 to-gray-500/20',
    iconColor: 'text-slate-500'
  }
]

export function WelcomeScreen({ onComplete, onCredentialsSave }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % ENERGY_SAVING_TIPS.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

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
      
      <motion.div 
        className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-success"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      />

      <div className="relative h-full flex flex-col items-center justify-center p-4 overflow-y-auto gap-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-3xl"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card/80 to-secondary/60 backdrop-blur-lg border border-border/50 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTipIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="p-6"
              >
                {(() => {
                  const tip = ENERGY_SAVING_TIPS[currentTipIndex]
                  const TipIcon = tip.icon
                  return (
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${tip.color} backdrop-blur-sm border border-border/30 flex-shrink-0`}>
                        <TipIcon className={`w-8 h-8 ${tip.iconColor}`} weight="duotone" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-semibold text-lg text-foreground">{tip.title}</h3>
                          <span className="px-3 py-1 rounded-full bg-success/20 text-success text-xs font-medium whitespace-nowrap">
                            {tip.savings}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {tip.tip}
                        </p>
                      </div>
                    </div>
                  )
                })()}
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 px-4 py-2">
              {ENERGY_SAVING_TIPS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTipIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentTipIndex
                      ? 'w-6 bg-primary'
                      : 'w-1.5 bg-muted hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`View tip ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-3xl"
        >
          <Card className="border-2 shadow-2xl overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: '200% 100%' }}
            />
            
            <CardHeader className="text-center space-y-4 pt-8 pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-4"
                >
                  <motion.div 
                    className="flex justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`relative p-6 rounded-2xl bg-gradient-to-br from-card to-secondary ${currentStepData.color}`}>
                      <motion.div
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                      >
                        <IconComponent className="w-16 h-16" weight="duotone" />
                      </motion.div>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl"
                        animate={{ 
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                  </motion.div>
                  
                  <div className="space-y-2">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <CardTitle className="text-3xl font-bold">
                        {currentStepData.title}
                      </CardTitle>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <CardDescription className="text-lg">
                        {currentStepData.description}
                      </CardDescription>
                    </motion.div>
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
                    <motion.div 
                      className="text-center px-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {currentStepData.content}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="px-8 space-y-6">
                      <p className="text-muted-foreground text-center leading-relaxed mb-6">
                        {currentStepData.content}
                      </p>
                      
                      <motion.div 
                        className="bg-muted/30 border border-border rounded-lg p-4 flex gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
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
                      </motion.div>

                      <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div 
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label htmlFor="accessId">Access ID *</Label>
                          <Input
                            id="accessId"
                            placeholder="Enter your Tuya Access ID"
                            value={tuyaCredentials.accessId}
                            onChange={(e) => setTuyaCredentials({ ...tuyaCredentials, accessId: e.target.value })}
                            className="font-mono text-sm"
                          />
                        </motion.div>

                        <motion.div 
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label htmlFor="accessKey">Access Key *</Label>
                          <Input
                            id="accessKey"
                            type="password"
                            placeholder="Enter your Tuya Access Key"
                            value={tuyaCredentials.accessKey}
                            onChange={(e) => setTuyaCredentials({ ...tuyaCredentials, accessKey: e.target.value })}
                            className="font-mono text-sm"
                          />
                        </motion.div>

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
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="flex items-center gap-2 text-sm text-success bg-success/10 border border-success/20 rounded-lg p-3"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.5 }}
                            >
                              <CheckCircle className="w-5 h-5" weight="fill" />
                            </motion.div>
                            <span>Credentials ready! Click "Get Started" to complete setup.</span>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-2 py-4">
                {ONBOARDING_STEPS.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'w-8 bg-primary'
                        : 'w-2 bg-muted hover:bg-muted-foreground/50'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>

              <motion.div 
                className="flex items-center justify-between gap-4 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  variant="ghost"
                  onClick={isSetupStep ? handleSkipSetup : handleSkip}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isSetupStep ? 'Skip Setup' : 'Skip Tour'}
                </Button>

                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                      >
                        Previous
                      </Button>
                    </motion.div>
                  )}
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
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
                  </motion.div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
