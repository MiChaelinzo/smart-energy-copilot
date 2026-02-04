import { useEffect, useRef } from 'react'

interface FloatingParticle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  hue: number
  opacity: number
  pulsePhase: number
}

export function FloatingEnergyParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<FloatingParticle[]>([])
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

    const createParticle = (): FloatingParticle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.5 - 0.2,
      hue: Math.random() * 40 + 180,
      opacity: Math.random() * 0.5 + 0.3,
      pulsePhase: Math.random() * Math.PI * 2
    })

    for (let i = 0; i < 100; i++) {
      particlesRef.current.push(createParticle())
    }

    let time = 0

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      time += 0.02

      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.pulsePhase += 0.05

        if (particle.x < -10) particle.x = canvas.width + 10
        if (particle.x > canvas.width + 10) particle.x = -10
        if (particle.y < -10) {
          particle.y = canvas.height + 10
          particle.x = Math.random() * canvas.width
        }

        const pulse = Math.sin(particle.pulsePhase) * 0.5 + 0.5
        const currentSize = particle.size * (0.7 + pulse * 0.6)
        const currentOpacity = particle.opacity * (0.6 + pulse * 0.4)

        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentSize * 2
        )
        gradient.addColorStop(0, `hsla(${particle.hue}, 90%, 70%, ${currentOpacity})`)
        gradient.addColorStop(0.5, `hsla(${particle.hue}, 80%, 60%, ${currentOpacity * 0.5})`)
        gradient.addColorStop(1, `hsla(${particle.hue}, 70%, 50%, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, currentSize * 2, 0, Math.PI * 2)
        ctx.fill()

        if (pulse > 0.9) {
          ctx.strokeStyle = `hsla(${particle.hue}, 95%, 75%, ${currentOpacity * 0.4})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, currentSize * 3, 0, Math.PI * 2)
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
      style={{ zIndex: 2 }}
    />
  )
}
