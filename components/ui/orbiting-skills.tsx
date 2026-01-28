"use client"

import React, { memo, useEffect, useId, useMemo, useState } from "react"

type GlowColor = "cyan" | "purple"

interface SkillConfig {
  id: string
  orbitRadius: number
  size: number
  speed: number
  phaseShift: number
  glowColor: GlowColor
  label: string
  proficiency?: string
  icon: React.ComponentType<{ className?: string }>
  iconMode?: "stroke" | "fill"
  iconStrokeWidth?: number
}

interface OrbitingSkillProps {
  config: SkillConfig
  angle: number
}

interface GlowingOrbitPathProps {
  radius: number
  glowColor?: GlowColor
  animationDelay?: number
}

function HologramIcon({
  Icon,
  mode,
  strokeWidth,
}: {
  Icon: React.ComponentType<{ className?: string; stroke?: any; fill?: any }>
  mode: "stroke" | "fill"
  strokeWidth?: number
}) {
  const gradientId = useId()
  const base = <Icon className="h-full w-full" />
  const originalChildren = (base.props as any).children
  const childrenArray = Array.isArray(originalChildren)
    ? originalChildren
    : originalChildren
      ? [originalChildren]
      : []

  return React.cloneElement(
    base as any,
    mode === "fill"
      ? {
          stroke: "none",
          fill: `url(#${gradientId})`,
          className: "h-full w-full [filter:drop-shadow(0_0_10px_rgba(255,255,255,0.12))]",
        }
      : {
          stroke: `url(#${gradientId})`,
          fill: "none",
          strokeWidth: strokeWidth ?? (base.props as any).strokeWidth,
          vectorEffect: "non-scaling-stroke",
          className: "h-full w-full [filter:drop-shadow(0_0_10px_rgba(255,255,255,0.12))]",
        },
    [
      <defs key="defs">
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f8f7ff" />
          <stop offset="18%" stopColor="#8af1ff" />
          <stop offset="36%" stopColor="#b18cff" />
          <stop offset="54%" stopColor="#ff8bd1" />
          <stop offset="72%" stopColor="#8af1ff" />
          <stop offset="100%" stopColor="#f8f7ff" />
          <animate attributeName="x1" dur="6s" values="0%;100%;0%" repeatCount="indefinite" />
          <animate attributeName="x2" dur="6s" values="100%;200%;100%" repeatCount="indefinite" />
        </linearGradient>
      </defs>,
      ...childrenArray,
    ]
  )
}

const OrbitingSkill = memo(({ config, angle }: OrbitingSkillProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const { orbitRadius, size, icon: Icon, label, proficiency, iconMode = "stroke", iconStrokeWidth } = config

  const x = Math.cos(angle) * orbitRadius
  const y = Math.sin(angle) * orbitRadius

  return (
    <div
      className="absolute left-1/2 top-1/2 transition-transform duration-300 ease-out"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        zIndex: isHovered ? 20 : 10,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={[
          "relative flex h-full w-full cursor-pointer items-center justify-center rounded-full p-2 transition-transform duration-300",
          isHovered ? "scale-110" : "",
        ].join(" ")}
        style={{
          filter: isHovered ? "drop-shadow(0 0 18px rgba(255,255,255,0.22))" : undefined,
        }}
      >
        <HologramIcon Icon={Icon} mode={iconMode} strokeWidth={iconStrokeWidth} />
        {isHovered ? (
          <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900/95 px-2 py-1 text-xs text-white backdrop-blur-sm">
            {proficiency ? `${label} — ${proficiency}` : label}
          </div>
        ) : null}
      </div>
    </div>
  )
})
OrbitingSkill.displayName = "OrbitingSkill"

const GlowingOrbitPath = memo(
  ({ radius, glowColor = "cyan", animationDelay = 0 }: GlowingOrbitPathProps) => {
    // Keep the glow strictly white so it blends with any background shader.
    const colors = {
      primary: "rgba(255, 255, 255, 0.22)",
      secondary: "rgba(255, 255, 255, 0.10)",
      border: "rgba(255, 255, 255, 0.18)",
    }

    return (
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          animationDelay: `${animationDelay}s`,
        }}
      >
        <div
          className="absolute inset-0 animate-pulse rounded-full"
          style={{
            background: `radial-gradient(circle, transparent 30%, ${colors.secondary} 70%, ${colors.primary} 100%)`,
            boxShadow: `0 0 60px ${colors.primary}, inset 0 0 60px ${colors.secondary}`,
            animation: "pulse 4s ease-in-out infinite",
            animationDelay: `${animationDelay}s`,
          }}
        />

        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `1px solid ${colors.border}`,
            boxShadow: `inset 0 0 20px ${colors.secondary}`,
          }}
        />
      </div>
    )
  }
)
GlowingOrbitPath.displayName = "GlowingOrbitPath"

export type OrbitingSkillItem = {
  id: string
  label: string
  proficiency?: string
  icon: React.ComponentType<{ className?: string }>
  iconMode?: "stroke" | "fill"
  iconStrokeWidth?: number
  ring?: "inner" | "outer"
  size?: number
}

export type OrbitingSkillsProps = {
  skills: OrbitingSkillItem[]
  className?: string
}

export default function OrbitingSkills({ skills, className }: OrbitingSkillsProps) {
  const [time, setTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    let animationFrameId: number
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime
      setTime((prevTime) => prevTime + deltaTime)
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isPaused])

  const computedSkillsConfig = useMemo<SkillConfig[]>(() => {
    const inner = skills.filter((s) => (s.ring ?? "outer") === "inner")
    const outer = skills.filter((s) => (s.ring ?? "outer") === "outer")

    const build = (items: OrbitingSkillItem[], orbitRadius: number, speed: number, glowColor: GlowColor) =>
      items.map((skill, index) => {
        const phaseShift = (2 * Math.PI * index) / Math.max(items.length, 1)
        return {
          id: skill.id,
          orbitRadius,
          size: skill.size ?? 42,
          speed,
          phaseShift,
          glowColor,
          label: skill.label,
          proficiency: skill.proficiency,
          icon: skill.icon,
          iconMode: skill.iconMode ?? "stroke",
          iconStrokeWidth: skill.iconStrokeWidth,
        }
      })

    return [
      ...build(inner, 72, 0.9, "cyan"),
      ...build(outer, 112, -0.55, "purple"),
    ]
  }, [skills])

  const orbitConfigs: Array<{ radius: number; glowColor: GlowColor; delay: number }> = [
    { radius: 72, glowColor: "cyan", delay: 0 },
    { radius: 112, glowColor: "purple", delay: 1.5 },
  ]

  return (
    <div
      className={[
        "relative flex w-full items-center justify-center overflow-visible bg-transparent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="relative flex h-[220px] w-[220px] items-center justify-center sm:h-[240px] sm:w-[240px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {orbitConfigs.map((config) => (
          <GlowingOrbitPath
            key={`path-${config.radius}`}
            radius={config.radius}
            glowColor={config.glowColor}
            animationDelay={config.delay}
          />
        ))}

        {computedSkillsConfig.map((config) => {
          const angle = time * config.speed + (config.phaseShift || 0)
          return <OrbitingSkill key={config.id} config={config} angle={angle} />
        })}
      </div>
    </div>
  )
}
