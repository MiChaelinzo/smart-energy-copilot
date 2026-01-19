import { useState, useEffect } from 'react'
import { Microphone, Waveform, CheckCircle, Info } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useVoiceCommands } from '@/hooks/useVoiceCommands'
import { Device, SmartScene } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

interface VoiceControlWidgetProps {
  devices: Device[]
  scenes: SmartScene[]
  onDeviceToggle: (deviceId: string) => void
  onSceneToggle: (sceneId: string) => void
}

export function VoiceControlWidget({
  devices,
  scenes,
  onDeviceToggle,
  onSceneToggle
}: VoiceControlWidgetProps) {
  const {
    isSupported,
    isListening,
    transcript,
    result,
    error,
    toggleListening
  } = useVoiceCommands(devices, scenes, onDeviceToggle, onSceneToggle)

  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    if (result || error) {
      setShowFeedback(true)
      const timer = setTimeout(() => setShowFeedback(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [result, error])

  if (!isSupported) {
    return (
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Microphone className="w-5 h-5" />
            Voice Control
          </CardTitle>
          <CardDescription>
            Voice recognition not supported in this browser
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Microphone className="w-5 h-5" />
          Voice Control
        </CardTitle>
        <CardDescription>
          Tap the button and speak a command
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleListening}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-destructive hover:bg-destructive/90 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg'
            }`}
          >
            <Microphone className="w-6 h-6 text-primary-foreground" weight="fill" />
            
            {isListening && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-destructive"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeOut'
                }}
              />
            )}
          </motion.button>

          <div className="flex-1 space-y-1">
            {isListening ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Waveform className="w-5 h-5 text-primary animate-pulse" weight="fill" />
                <span className="text-sm font-medium">Listening...</span>
              </motion.div>
            ) : (
              <p className="text-sm font-medium">Ready to listen</p>
            )}
            <p className="text-xs text-muted-foreground">
              {devices.length} devices • {scenes.length} scenes
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {transcript && !showFeedback && (
            <motion.div
              key="transcript"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1">You said:</p>
                <p className="text-sm">{transcript}</p>
              </div>
            </motion.div>
          )}

          {showFeedback && (result || error) && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className={`p-3 rounded-lg border flex items-start gap-2 ${
                  error
                    ? 'bg-destructive/10 border-destructive/20'
                    : result?.action === 'unknown'
                    ? 'bg-warning/10 border-warning/20'
                    : 'bg-success/10 border-success/20'
                }`}
              >
                {error ? (
                  <Info className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                ) : result?.action === 'unknown' ? (
                  <Info className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" weight="fill" />
                )}
                <p className="text-sm flex-1">
                  {error || result?.response}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Quick commands:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Turn on lights',
              'Activate sleep mode',
              'Show status'
            ].map((command, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs font-normal py-1"
              >
                "{command}"
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
