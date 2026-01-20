import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightning, Gauge, ChartLine, CalendarCheck, Target, Sparkle } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface WelcomeScreenProps {
  onComplete: () => void
}

const ONBOARDING_STEPS = [
  {
    icon: Lightning,
    title: 'Welcome to Smart Energy Copilot',
    description: 'Your AI-powered energy management assistant',
    content: 'Track, optimize, and reduce your energy consumption with intelligent insights and automation.',
    color: 'text-primary'
  },
  {
    icon: Gauge,
    title: 'Real-Time Monitoring',
    description: 'Track your devices instantly',
    content: 'Monitor all your devices in real-time. See power consumption, status updates, and get instant alerts when something needs attention.',
    color: 'text-accent'
  },
  {
    icon: ChartLine,
    title: 'Smart Analytics',
    description: 'Understand your energy patterns',
    content: 'Visualize your energy usage with detailed charts and reports. Identify trends, peak usage times, and opportunities to save.',
    color: 'text-success'
  },
  {
    icon: Target,
    title: 'Set Energy Goals',
    description: 'Achieve your sustainability targets',
    content: 'Set custom goals for energy reduction, cost savings, or carbon footprint. Track your progress and celebrate achievements.',
    color: 'text-warning'
  },
  {
    icon: CalendarCheck,
    title: 'Automate Your Home',
    description: 'Schedule and optimize automatically',
    content: 'Create smart scenes and schedules. Let AI optimize your devices based on electricity rates and your preferences.',
    color: 'text-primary'
  }
]

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const currentStepData = ONBOARDING_STEPS[currentStep]
  const IconComponent = currentStepData.icon

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
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
      
      <div className="relative h-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-3xl"
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
                  className="text-center px-8"
                >
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {currentStepData.content}
                  </p>
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
                  onClick={handleSkip}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Skip Tour
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
