import { useState } from 'react'
import { Microphone } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

interface VoiceButtonProps {
  onClick: () => void
  isListening?: boolean
  className?: string
}

export function VoiceButton({ onClick, isListening = false, className = '' }: VoiceButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={className}
          >
            <Button
              onClick={onClick}
              size="lg"
              className={`relative rounded-full w-14 h-14 shadow-lg transition-all ${
                isListening
                  ? 'bg-destructive hover:bg-destructive/90 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              <Microphone className="w-6 h-6" weight="fill" />
              
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

              {!isListening && isHovered && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-6 px-2 text-xs font-medium shadow-md"
                >
                  Voice
                </Badge>
              )}
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <p className="font-medium">Voice Control</p>
          <p className="text-xs text-muted-foreground mt-1">
            {isListening ? 'Listening for commands...' : 'Click to control devices with your voice'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
