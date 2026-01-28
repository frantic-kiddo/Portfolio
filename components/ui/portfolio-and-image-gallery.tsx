"use client"

import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

function useMergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) return null
    return (node: T) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(node)
        } else if (ref != null) {
          ;(ref as React.MutableRefObject<T | null>).current = node
        }
      })
    }
  }, [refs])
}

function useResponsiveValue(baseValue: number, mobileValue: number) {
  const [value, setValue] = useState(baseValue)

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      setValue(window.innerWidth < 768 ? mobileValue : baseValue)
    }

    handleResize()

    let timeoutId: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 100)
    }

    window.addEventListener("resize", debouncedResize)
    return () => {
      window.removeEventListener("resize", debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [baseValue, mobileValue])

  return value
}

export interface RadialScrollGalleryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: (hoveredIndex: number | null) => ReactNode[]
  scrollDuration?: number
  visiblePercentage?: number
  baseRadius?: number
  mobileRadius?: number
  startTrigger?: string
  onItemSelect?: (index: number) => void
  direction?: "ltr" | "rtl"
  disabled?: boolean
}

export const RadialScrollGallery = forwardRef<
  HTMLDivElement,
  RadialScrollGalleryProps
>(
  (
    {
      children,
      scrollDuration = 2500,
      visiblePercentage = 45,
      baseRadius = 550,
      mobileRadius = 220,
      className = "",
      startTrigger = "center center",
      onItemSelect,
      direction = "ltr",
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const pinRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLUListElement>(null)
    const childRef = useRef<HTMLLIElement>(null)

    const mergedRef = useMergeRefs(ref, pinRef)

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const pointerInsideRef = useRef(false)
    const [childSize, setChildSize] = useState<{ w: number; h: number } | null>(
      null
    )
    const [isMounted, setIsMounted] = useState(false)

    const currentRadius = useResponsiveValue(baseRadius, mobileRadius)
    const circleDiameter = currentRadius * 2

    const { visibleDecimal, hiddenDecimal } = useMemo(() => {
      const clamped = Math.max(10, Math.min(100, visiblePercentage))
      const v = clamped / 100
      return { visibleDecimal: v, hiddenDecimal: 1 - v }
    }, [visiblePercentage])

    const childrenNodes = useMemo(() => {
      const effective = hoveredIndex ?? activeIndex
      return React.Children.toArray(children(effective))
    }, [children, hoveredIndex, activeIndex])
    const childrenCount = childrenNodes.length

    useEffect(() => {
      setIsMounted(true)

      if (!childRef.current) return

      const observer = new ResizeObserver((entries) => {
        let hasChanged = false
        for (const entry of entries) {
          setChildSize({
            w: entry.contentRect.width,
            h: entry.contentRect.height,
          })
          hasChanged = true
        }
        if (hasChanged) {
          ScrollTrigger.refresh()
        }
      })

      observer.observe(childRef.current)
      return () => observer.disconnect()
    }, [childrenCount])

    useEffect(() => {
      if (isMounted) {
        ScrollTrigger.refresh()
      }
    }, [isMounted, childrenCount, currentRadius])

    useGSAP(
      () => {
        if (!pinRef.current || !containerRef.current || childrenCount === 0)
          return

        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches

        if (!prefersReducedMotion) {
          gsap.fromTo(
            containerRef.current.children,
            { scale: 0, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 1.2,
              ease: "back.out(1.2)",
              stagger: 0.05,
              scrollTrigger: {
                trigger: pinRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          )

          const snapStep = childrenCount > 1 ? 1 / (childrenCount - 1) : 1
          const rotationDeg =
            childrenCount > 1
              ? (-360 * (childrenCount - 1)) / childrenCount
              : 0
          let snapIndex = 0

          gsap.to(containerRef.current, {
            rotation: rotationDeg,
            ease: "none",
            scrollTrigger: {
              trigger: pinRef.current,
              pin: true,
              start: startTrigger,
              end: `+=${scrollDuration}`,
              scrub: 1,
              snap: {
                snapTo: (value) => {
                  if (childrenCount <= 1) return 0
                  const floatIndex = value / snapStep
                  const diff = floatIndex - snapIndex

                  // Require a meaningful scroll before advancing a card.
                  if (diff > 0.55) snapIndex = Math.min(childrenCount - 1, snapIndex + 1)
                  else if (diff < -0.55) snapIndex = Math.max(0, snapIndex - 1)

                  return snapIndex * snapStep
                },
                duration: { min: 0.2, max: 0.45 },
                delay: 0.08,
                ease: "power3.out",
              },
              invalidateOnRefresh: true,
              onRefresh: () => {
                snapIndex = 0
                setActiveIndex(0)
                setHoveredIndex(pointerInsideRef.current ? 0 : null)
              },
              onUpdate: (self) => {
                const raw = Math.round(self.progress / snapStep)
                const index = Math.min(childrenCount - 1, Math.max(0, raw))
                setActiveIndex(index)
                if (pointerInsideRef.current) setHoveredIndex(index)
                else setHoveredIndex(null)
              },
            },
          })
        }
      },
      {
        scope: pinRef,
        dependencies: [
          scrollDuration,
          currentRadius,
          startTrigger,
          childrenCount,
        ],
      }
    )

    if (childrenCount === 0) return null

    const round = (value: number) => Math.round(value * 1000) / 1000

    const scaleFactor = 1.35
    const calculatedBuffer = childSize
      ? childSize.h * scaleFactor - childSize.h + 120
      : 150

    const visibleAreaHeight = childSize
      ? circleDiameter * visibleDecimal + childSize.h / 2 + calculatedBuffer
      : circleDiameter * visibleDecimal + 200

    return (
      <div
        ref={mergedRef}
        className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden ${className}`}
        onMouseEnter={() => {
          pointerInsideRef.current = true
          setHoveredIndex(activeIndex)
        }}
        onMouseLeave={() => {
          pointerInsideRef.current = false
          setHoveredIndex(null)
        }}
        {...rest}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: `${visibleAreaHeight}px`,
            maskImage:
              "linear-gradient(to top, transparent 0%, black 40%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, black 40%, black 100%)",
          }}
        >
          <ul
            ref={containerRef}
            className={`
              absolute left-1/2 m-0 list-none p-0 -translate-x-1/2 will-change-transform
              transition-opacity duration-500 ease-out
              ${disabled ? "pointer-events-none opacity-50 grayscale" : ""}
              opacity-100
            `}
            dir={direction}
            style={{
              width: circleDiameter,
              height: circleDiameter,
              bottom: -(circleDiameter * hiddenDecimal),
            }}
          >
            {childrenNodes.map((child, index) => {
              const angle = (index / childrenCount) * 2 * Math.PI - Math.PI / 2
              let x = currentRadius * Math.cos(angle)
              const y = currentRadius * Math.sin(angle)

              if (direction === "rtl") {
                x = -x
              }

              const rotationAngle = (angle * 180) / Math.PI
              const isHovered = hoveredIndex === index
              const isAnyHovered = hoveredIndex !== null
              const isActive =
                hoveredIndex !== null ? isHovered : activeIndex === index
              return (
                <li
                  key={index}
                  ref={index === 0 ? childRef : null}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    zIndex: isActive ? 100 : 10,
                    transform: `translate(-50%, -50%) translate3d(${round(
                      x
                    )}px, ${round(y)}px, 0) rotate(${round(
                      rotationAngle + 90
                    )}deg)`,
                  }}
                >
                  <div
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    onClick={() => !disabled && onItemSelect?.(index)}
                    onKeyDown={(e) => {
                      if (disabled) return
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        onItemSelect?.(index)
                      }
                    }}
                    onMouseEnter={() => !disabled && setHoveredIndex(index)}
                    onMouseLeave={() => !disabled && setHoveredIndex(null)}
                    onFocus={() => !disabled && setHoveredIndex(index)}
                    onBlur={() => !disabled && setHoveredIndex(null)}
                    className={`
                      block cursor-pointer text-left outline-none
                      rounded-xl transition-all duration-500 ease-out will-change-transform
                      ${isActive ? "scale-125 -translate-y-8" : "scale-100"}
                      ${
                        isAnyHovered
                          ? !isHovered
                            ? "blur-[2px] opacity-40 grayscale"
                            : "blur-0 opacity-100"
                          : isActive
                          ? "blur-0 opacity-100"
                          : "blur-[2px] opacity-40 grayscale"
                      }
                      focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                    `}
                  >
                    {child}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
)

RadialScrollGallery.displayName = "RadialScrollGallery"
