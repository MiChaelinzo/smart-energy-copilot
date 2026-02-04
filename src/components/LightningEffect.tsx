import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LightningBolt {
  id: number
  startX: number
  startY: number
  segments: { x: number; y: number }[]
}

export function LightningEffect() {
  const [bolts, setBolts] = useState<LightningBolt[]>([])

  useEffect(() => {
    const generateBolt = (): LightningBolt => {
      const startX = Math.random() * window.innerWidth
      const startY = 0
      const segments: { x: number; y: number }[] = [{ x: startX, y: startY }]
      
      let currentX = startX
      let currentY = startY
      const targetY = Math.random() * window.innerHeight * 0.7 + 100
      
      while (currentY < targetY) {
        currentX += (Math.random() - 0.5) * 60
        currentY += Math.random() * 40 + 30
        segments.push({ x: currentX, y: currentY })
      }
      
      return {
        id: Date.now() + Math.random(),
        startX,
        startY,
        segments
      }
    }

    const triggerLightning = () => {
      if (Math.random() > 0.7) {
        const newBolt = generateBolt()
        setBolts(prev => [...prev, newBolt])
        
        setTimeout(() => {
          setBolts(prev => prev.filter(b => b.id !== newBolt.id))
        }, 500)
      }
    }

    const interval = setInterval(triggerLightning, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      <AnimatePresence>
        {bolts.map(bolt => (
          <motion.svg
            key={bolt.id}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, times: [0, 0.1, 0.3, 1] }}
          >
            <defs>
              <filter id={`glow-${bolt.id}`}>
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <motion.polyline
              points={bolt.segments.map(s => `${s.x},${s.y}`).join(' ')}
              fill="none"
              stroke="hsla(190, 100%, 70%, 0.9)"
              strokeWidth="3"
              filter={`url(#glow-${bolt.id})`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.15 }}
            />
            <motion.polyline
              points={bolt.segments.map(s => `${s.x},${s.y}`).join(' ')}
              fill="none"
              stroke="hsla(190, 100%, 90%, 0.6)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.15 }}
            />
            {bolt.segments.map((segment, i) => (
              i > 0 && Math.random() > 0.7 && (
                <motion.circle
                  key={i}
                  cx={segment.x}
                  cy={segment.y}
                  r="4"
                  fill="hsla(190, 100%, 80%, 0.8)"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.5, 0] }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                />
              )
            ))}
          </motion.svg>
        ))}
      </AnimatePresence>
    </div>
  )
}
