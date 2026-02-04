import { useEffect, useRef } from 'react'

interface EnergyOrb {
  x: number
  y: number
  radius: number
  hue: number
  pulseSpeed: number
  driftX: number
  driftY: number
  time: number
}

export function EnergyPulse() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const orbsRef = useRef<EnergyOrb[]>([])
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

    const createOrb = (): EnergyOrb => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 100 + 50,
      hue: Math.random() * 40 + 170,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      driftX: (Math.random() - 0.5) * 0.2,
      driftY: (Math.random() - 0.5) * 0.2,
      time: Math.random() * Math.PI * 2
    })

    for (let i = 0; i < 5; i++) {
      orbsRef.current.push(createOrb())
    }

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      orbsRef.current.forEach(orb => {
        orb.time += orb.pulseSpeed
        orb.x += orb.driftX
        orb.y += orb.driftY

        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius

        const pulseScale = 0.5 + Math.sin(orb.time) * 0.3
        const currentRadius = orb.radius * pulseScale

        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, currentRadius
        )
        
        const alpha = 0.08 + Math.sin(orb.time) * 0.03
        gradient.addColorStop(0, `hsla(${orb.hue}, 80%, 60%, ${alpha})`)
        gradient.addColorStop(0.4, `hsla(${orb.hue}, 70%, 55%, ${alpha * 0.6})`)
        gradient.addColorStop(0.7, `hsla(${orb.hue}, 60%, 50%, ${alpha * 0.3})`)
        gradient.addColorStop(1, `hsla(${orb.hue}, 50%, 45%, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, currentRadius, 0, Math.PI * 2)
        ctx.fill()

        if (Math.sin(orb.time) > 0.9) {
          ctx.strokeStyle = `hsla(${orb.hue}, 90%, 70%, ${alpha * 0.5})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(orb.x, orb.y, currentRadius * 0.8, 0, Math.PI * 2)
          ctx.stroke()
        }
      })

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
