import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  hue: number
  life: number
  maxLife: number
}

interface Connection {
  x1: number
  y1: number
  x2: number
  y2: number
  strength: number
}

export function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const mouseRef = useRef({ x: 0, y: 0, isActive: false })

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

    const createParticle = (x?: number, y?: number): Particle => {
      return {
        x: x ?? Math.random() * canvas.width,
        y: y ?? Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        hue: Math.random() * 60 + 170,
        life: 1,
        maxLife: Math.random() * 200 + 100
      }
    }

    for (let i = 0; i < 60; i++) {
      particlesRef.current.push(createParticle())
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, isActive: true }
    }

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    let time = 0

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.01

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, `hsla(${200 + Math.sin(time) * 20}, 70%, 15%, 0.02)`)
      gradient.addColorStop(0.5, `hsla(${180 + Math.cos(time * 0.7) * 20}, 60%, 18%, 0.02)`)
      gradient.addColorStop(1, `hsla(${210 + Math.sin(time * 0.5) * 20}, 65%, 16%, 0.02)`)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      connectionsRef.current = []

      particlesRef.current.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (mouseRef.current.isActive) {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 150) {
            const force = (150 - distance) / 150
            particle.vx += (dx / distance) * force * 0.1
            particle.vy += (dy / distance) * force * 0.1
          }
        }

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        particle.life--

        if (particle.life <= 0) {
          particlesRef.current[i] = createParticle()
        }

        particlesRef.current.forEach((other, j) => {
          if (i >= j) return

          const dx = other.x - particle.x
          const dy = other.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            const strength = (120 - distance) / 120
            connectionsRef.current.push({
              x1: particle.x,
              y1: particle.y,
              x2: other.x,
              y2: other.y,
              strength
            })
          }
        })
      })

      connectionsRef.current.forEach(connection => {
        ctx.beginPath()
        ctx.moveTo(connection.x1, connection.y1)
        ctx.lineTo(connection.x2, connection.y2)
        ctx.strokeStyle = `hsla(190, 70%, 60%, ${connection.strength * 0.2})`
        ctx.lineWidth = connection.strength * 1.5
        ctx.stroke()
      })

      particlesRef.current.forEach(particle => {
        const alpha = particle.life / particle.maxLife
        
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        )
        particleGradient.addColorStop(0, `hsla(${particle.hue}, 80%, 70%, ${alpha * 0.8})`)
        particleGradient.addColorStop(1, `hsla(${particle.hue}, 80%, 50%, 0)`)
        
        ctx.fillStyle = particleGradient
        ctx.fill()
      })

      if (mouseRef.current.isActive) {
        const glowSize = 80
        const glowGradient = ctx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, glowSize
        )
        glowGradient.addColorStop(0, 'hsla(190, 80%, 60%, 0.15)')
        glowGradient.addColorStop(0.5, 'hsla(200, 70%, 50%, 0.05)')
        glowGradient.addColorStop(1, 'hsla(210, 60%, 40%, 0)')
        
        ctx.fillStyle = glowGradient
        ctx.fillRect(
          mouseRef.current.x - glowSize,
          mouseRef.current.y - glowSize,
          glowSize * 2,
          glowSize * 2
        )
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
