"use client"

import { useEffect, useRef } from "react"

interface AnimatedBackgroundProps {
  travelerType?: string
  className?: string
}

export default function AnimatedBackground({ travelerType = "default", className = "" }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Get a seed value from traveler type for consistent randomness
  const getSeed = (type: string | undefined): number => {
    if (!type) return 0

    return type.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  }

  // Get color theme based on traveler type
  const getColorTheme = (type: string | undefined) => {
    if (!type) return ["#8b5cf6", "#d946ef", "#ec4899"]

    const typeLower = type.toLowerCase()

    if (typeLower.includes("luxury") || typeLower.includes("premium")) {
      return ["#6366f1", "#8b5cf6", "#a855f7"] // Indigo to purple
    } else if (typeLower.includes("adventure") || typeLower.includes("explorer")) {
      return ["#f97316", "#f43f5e", "#ef4444"] // Orange to red
    } else if (typeLower.includes("cultural") || typeLower.includes("nomad")) {
      return ["#10b981", "#14b8a6", "#06b6d4"] // Emerald to cyan
    } else if (typeLower.includes("digital") || typeLower.includes("tech")) {
      return ["#8b5cf6", "#a855f7", "#d946ef"] // Purple to fuchsia
    } else if (typeLower.includes("beach") || typeLower.includes("ocean")) {
      return ["#0ea5e9", "#06b6d4", "#0891b2"] // Sky to cyan
    } else if (typeLower.includes("urban") || typeLower.includes("city")) {
      return ["#64748b", "#475569", "#334155"] // Slate shades
    } else if (typeLower.includes("aesthetic") || typeLower.includes("insta")) {
      return ["#d946ef", "#ec4899", "#f43f5e"] // Fuchsia to rose
    }

    // Default theme
    return ["#8b5cf6", "#d946ef", "#ec4899"] // Violet to pink
  }

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Determine colors based on traveler type
    let primaryColor = "#8b5cf6" // Default violet
    let secondaryColor = "#ec4899" // Default pink
    let accentColor = "#f97316" // Default orange

    // Customize colors based on traveler type
    const type = travelerType?.toLowerCase() || ""

    if (type.includes("luxury")) {
      primaryColor = "#6366f1" // indigo
      secondaryColor = "#3b82f6" // blue
      accentColor = "#a855f7" // purple
    } else if (type.includes("adventure") || type.includes("explorer")) {
      primaryColor = "#f97316" // orange
      secondaryColor = "#ef4444" // red
      accentColor = "#f59e0b" // amber
    } else if (type.includes("cultural") || type.includes("nomad")) {
      primaryColor = "#10b981" // emerald
      secondaryColor = "#14b8a6" // teal
      accentColor = "#22c55e" // green
    } else if (type.includes("digital")) {
      primaryColor = "#8b5cf6" // violet
      secondaryColor = "#a855f7" // purple
      accentColor = "#d946ef" // fuchsia
    } else if (type.includes("urban") || type.includes("city")) {
      primaryColor = "#64748b" // slate
      secondaryColor = "#6b7280" // gray
      accentColor = "#71717a" // zinc
    } else if (type.includes("beach")) {
      primaryColor = "#06b6d4" // cyan
      secondaryColor = "#3b82f6" // blue
      accentColor = "#6366f1" // indigo
    } else if (type.includes("food")) {
      primaryColor = "#f59e0b" // amber
      secondaryColor = "#eab308" // yellow
      accentColor = "#f97316" // orange
    } else if (type.includes("aesthetic")) {
      primaryColor = "#d946ef" // fuchsia
      secondaryColor = "#ec4899" // pink
      accentColor = "#f43f5e" // rose
    }

    // Convert hex to rgba
    const hexToRgba = (hex: string, alpha: number) => {
      const r = Number.parseInt(hex.slice(1, 3), 16)
      const g = Number.parseInt(hex.slice(3, 5), 16)
      const b = Number.parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, hexToRgba(primaryColor, 0.7))
    gradient.addColorStop(0.5, hexToRgba(secondaryColor, 0.5))
    gradient.addColorStop(1, hexToRgba(accentColor, 0.7))

    // Get colors based on traveler type
    const colors = getColorTheme(travelerType)
    const seed = getSeed(travelerType)

    // Create particles
    const particleCount = 50
    const particles: {
      x: number
      y: number
      radius: number
      color: string
      speedX: number
      speedY: number
      opacity: number
    }[] = []

    // Use seed to generate consistent random values
    const seededRandom = (min: number, max: number) => {
      const x = Math.sin(seed + particles.length) * 10000
      const r = x - Math.floor(x)
      return min + r * (max - min)
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: seededRandom(0, canvas.width),
        y: seededRandom(0, canvas.height),
        radius: seededRandom(2, 8),
        color: colors[Math.floor(seededRandom(0, colors.length))],
        speedX: seededRandom(-0.5, 0.5),
        speedY: seededRandom(-0.5, 0.5),
        opacity: seededRandom(0.1, 0.5),
      })
    }

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle =
          particle.color +
          Math.floor(particle.opacity * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    const setCanvasDimensions = () => {
      if (!canvasRef.current) return
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
    }

    window.addEventListener("resize", setCanvasDimensions)
    setCanvasDimensions()

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [travelerType])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 bg-gradient-to-br from-violet-500 via-purple-400 to-pink-500 ${className}`}
    />
  )
}
