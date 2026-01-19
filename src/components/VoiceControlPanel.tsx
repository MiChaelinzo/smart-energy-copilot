import { useState, useEffect } from 'react'
import { Microphone, MicrophoneSlash, Waveform, CheckCircle, XCircle, Info } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useVoiceCommands } from '@/hooks/useVoiceCommands'
import { Device, SmartScene } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

interface VoiceControlPanelProps {
  devices: Device[]
  scenes: SmartScene[]
  onDeviceToggle: (deviceId: string) => void
  onSceneToggle: (sceneId: string) => void
  isOpen: boolean
  onClose: () => void
}

export function VoiceControlPanel({
  devices,
  scenes,
  onDeviceToggle,
  onSceneToggle,
  isOpen,
  onClose
}: VoiceControlPanelProps) {
  const {
    isSupported,
    isListening,
    transcript,
    lastCommand,
    result,
    error,
    toggleListening
  } = useVoiceCommands(devices, scenes, onDeviceToggle, onSceneToggle)

  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (result) {
      setShowResult(true)
      const timer = setTimeout(() => setShowResult(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [result])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 bg-card/95 backdrop-blur border-border/50 shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Voice Control</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Speak commands to control your devices hands-free
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            {!isSupported && (
              <Alert className="bg-warning/10 border-warning/20">
                <Info className="w-4 h-4" />
                <AlertDescription>
                  Voice recognition is not supported in your browser. Please try Chrome, Edge, or Safari.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="bg-destructive/10 border-destructive/20">
                <XCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col items-center gap-6 py-8">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleListening}
                disabled={!isSupported}
                className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-destructive hover:bg-destructive/90 shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                    : 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <AnimatePresence mode="wait">
                  {isListening ? (
                    <motion.div
                      key="listening"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      className="flex items-center justify-center"
                    >
                      <MicrophoneSlash className="w-12 h-12 text-primary-foreground" weight="fill" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      className="flex items-center justify-center"
                    >
                      <Microphone className="w-12 h-12 text-primary-foreground" weight="fill" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {isListening && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-destructive"
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

              <div className="text-center space-y-2">
                <p className="text-lg font-medium">
                  {isListening ? 'Listening...' : 'Tap to speak'}
                </p>
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Waveform className="w-5 h-5 text-primary animate-pulse" weight="fill" />
                    <span className="text-sm text-muted-foreground">Processing speech...</span>
                  </motion.div>
                )}
              </div>
            </div>

            <AnimatePresence>
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-lg bg-secondary/50 border border-border"
                >
                  <p className="text-sm text-muted-foreground mb-1">You said:</p>
                  <p className="text-lg">{transcript}</p>
                </motion.div>
              )}

              {showResult && result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-lg border flex items-start gap-3 ${
                    result.action === 'unknown'
                      ? 'bg-warning/10 border-warning/20'
                      : 'bg-success/10 border-success/20'
                  }`}
                >
                  {result.action === 'unknown' ? (
                    <Info className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" weight="fill" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium mb-1">
                      {result.action === 'unknown' ? 'Command not recognized' : 'Command executed'}
                    </p>
                    <p className="text-sm text-muted-foreground">{result.response}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <p className="text-sm font-medium">Example commands:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'Turn on living room lights',
                  'Turn off all devices',
                  'Activate sleep mode',
                  'Show energy status',
                  'Turn on kitchen appliances',
                  'Deactivate away mode'
                ].map((command, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="justify-start py-2 px-3 text-sm font-normal"
                  >
                    "{command}"
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Connected devices:</span>
                <Badge variant="outline">{devices.length}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Available scenes:</span>
                <Badge variant="outline">{scenes.length}</Badge>
              </div>
              {lastCommand && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last command:</span>
                  <Badge variant="outline">
                    {new Date(lastCommand.timestamp).toLocaleTimeString()}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
