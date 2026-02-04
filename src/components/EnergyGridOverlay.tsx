import { useEffect, useRef } from 'react'

export function EnergyGridOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let time = 0
    const gridSize = 50

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      time += 0.02

      ctx.strokeStyle = `hsla(190, 60%, 50%, ${0.03 + Math.sin(time) * 0.02})`
      ctx.lineWidth = 1

      for (let x = 0; x < canvas.width; x += gridSize) {
        const offset = Math.sin(time + x * 0.01) * 5
        ctx.beginPath()
        ctx.moveTo(x, 0)
        
        for (let y = 0; y < canvas.height; y += 20) {
          const wave = Math.sin(time + x * 0.01 + y * 0.01) * 3
          ctx.lineTo(x + wave + offset, y)
        }
        
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        const offset = Math.cos(time + y * 0.01) * 5
        ctx.beginPath()
        ctx.moveTo(0, y)
        
        for (let x = 0; x < canvas.width; x += 20) {
          const wave = Math.cos(time + x * 0.01 + y * 0.01) * 3
          ctx.lineTo(x, y + wave + offset)
        }
        
        ctx.stroke()
      }

      const pulseCount = 8
      for (let i = 0; i < pulseCount; i++) {
        const pulseX = (canvas.width / pulseCount) * i + (time * 50) % (canvas.width / pulseCount)
        const pulseY = canvas.height / 2 + Math.sin(time + i) * 100
        
        const gradient = ctx.createRadialGradient(
          pulseX, pulseY, 0,
          pulseX, pulseY, 30
        )
        gradient.addColorStop(0, 'hsla(190, 80%, 60%, 0.15)')
        gradient.addColorStop(1, 'hsla(190, 80%, 60%, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(pulseX, pulseY, 30, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
