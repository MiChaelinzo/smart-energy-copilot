import { useEffect, useRef } from 'react'

interface TrailPoint {
  x: number
  y: number
  size: number
  hue: number
  life: number
}

export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trailRef = useRef<TrailPoint[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastMouseRef = useRef({ x: 0, y: 0, time: 0 })

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

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      const timeDelta = now - lastMouseRef.current.time
      
      if (timeDelta > 16) {
        const dx = e.clientX - lastMouseRef.current.x
        const dy = e.clientY - lastMouseRef.current.y
        const speed = Math.sqrt(dx * dx + dy * dy)
        const hue = 180 + (speed * 2) % 60
        
        trailRef.current.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.min(speed * 0.3 + 2, 12),
          hue: hue,
          life: 30
        })

        if (speed > 5) {
          for (let i = 0; i < 2; i++) {
            trailRef.current.push({
              x: e.clientX + (Math.random() - 0.5) * 20,
              y: e.clientY + (Math.random() - 0.5) * 20,
              size: Math.random() * 4 + 1,
              hue: hue + Math.random() * 30 - 15,
              life: 20
            })
          }
        }

        lastMouseRef.current = { x: e.clientX, y: e.clientY, time: now }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      trailRef.current = trailRef.current.filter(point => {
        point.life--
        
        if (point.life <= 0) return false

        const alpha = point.life / 30
        
        ctx.beginPath()
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2)
        
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, point.size
        )
        gradient.addColorStop(0, `hsla(${point.hue}, 85%, 65%, ${alpha * 0.7})`)
        gradient.addColorStop(0.5, `hsla(${point.hue}, 80%, 60%, ${alpha * 0.4})`)
        gradient.addColorStop(1, `hsla(${point.hue}, 75%, 55%, 0)`)
        
        ctx.fillStyle = gradient
        ctx.fill()

        if (point.life > 15 && Math.random() > 0.95) {
          ctx.beginPath()
          ctx.arc(point.x, point.y, point.size * 1.5, 0, Math.PI * 2)
          ctx.strokeStyle = `hsla(${point.hue}, 90%, 70%, ${alpha * 0.3})`
          ctx.lineWidth = 1
          ctx.stroke()
        }

        return true
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    />
  )
}
