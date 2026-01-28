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

/* ---------- merge refs safely ---------- */

function useMergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return useMemo(() => {
    return (node: T | null) => {
      for (const ref of refs) {
        if (!ref) continue
        if (typeof ref === "function") ref(node)
        else if (typeof ref === "object" && "current" in ref) {
          try {
            ;(ref as React.MutableRefObject<T | null>).current = node
          } catch {}
        }
      }
    }
  }, refs)
}

/* ---------- responsive radius ---------- */

function useResponsiveValue(base: number, mobile: number) {
  const [v, setV] = useState(base)

  useEffect(() => {
    if (typeof window === "undefined") return
    const update = () => setV(window.innerWidth < 768 ? mobile : base)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [base, mobile])

  return v
}

/* ---------- viewport height ---------- */

function useViewportHeight() {
  const [h, setH] = useState(800)

  useEffect(() => {
    if (typeof window === "undefined") return
    const update = () => setH(window.innerHeight)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return h
}

/* ---------- props ---------- */

export interface RadialScrollGalleryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: (hoveredIndex: number | null) => ReactNode[]
  scrollDuration?: number
  visiblePercentage?: number
  baseRadius?: number
  mobileRadius?: number
  onItemSelect?: (index: number) => void
  direction?: "ltr" | "rtl"
  disabled?: boolean
}

/* ================= COMPONENT ================= */

export const RadialScrollGallery = forwardRef<
  HTMLDivElement,
  RadialScrollGalleryProps
>(
  (
    {
      children,
      scrollDuration = 2500,
      visiblePercentage = 45,
      baseRadius = 850,
      mobileRadius = 650,
      className = "",
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

    const [childSize, setChildSize] =
      useState<{ w: number; h: number } | null>(null)

    const currentRadius = useResponsiveValue(baseRadius, mobileRadius)
    const viewportHeight = useViewportHeight()

    const circleDiameter = currentRadius * 2

    const isMobile =
      typeof window !== "undefined" && window.innerWidth < 768

    const { visibleDecimal, hiddenDecimal } = useMemo(() => {
      const v = Math.max(0.1, Math.min(1, visiblePercentage / 100))
      return { visibleDecimal: v, hiddenDecimal: 1 - v }
    }, [visiblePercentage])

    const childrenNodes = useMemo(() => {
      const effective = hoveredIndex ?? activeIndex
      return React.Children.toArray(children(effective))
    }, [children, hoveredIndex, activeIndex])

    const childrenCount = childrenNodes.length

    /* ---------- size observer ---------- */

    useEffect(() => {
      if (!childRef.current) return

      const ro = new ResizeObserver((e) => {
        const r = e[0].contentRect
        setChildSize({ w: r.width, h: r.height })
        ScrollTrigger.refresh()
      })

      ro.observe(childRef.current)
      return () => ro.disconnect()
    }, [childrenCount])

    useEffect(() => {
      const t = setTimeout(() => ScrollTrigger.refresh(), 300)
      return () => clearTimeout(t)
    }, [currentRadius, childrenCount, viewportHeight])

    /* ---------- GSAP rotation ---------- */

    useGSAP(
      () => {
        if (!pinRef.current || !containerRef.current || childrenCount === 0)
          return

        const snapStep =
          childrenCount > 1 ? 1 / (childrenCount - 1) : 1

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
            pin: pinRef.current,
            start: "top top",
            end: `+=${scrollDuration}`,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: (v) => {
                if (childrenCount <= 1) return 0

                const diff = v / snapStep - snapIndex
                const threshold = isMobile ? 0.35 : 0.55

                if (diff > threshold)
                  snapIndex = Math.min(
                    childrenCount - 1,
                    snapIndex + 1
                  )
                else if (diff < -threshold)
                  snapIndex = Math.max(0, snapIndex - 1)

                return snapIndex * snapStep
              },
              duration: isMobile
                ? { min: 0.35, max: 0.7 }
                : { min: 0.18, max: 0.45 },
              ease: isMobile ? "power2.out" : "power3.out",
            },
            onUpdate: (self) => {
              const idx = Math.round(self.progress / snapStep)
              const clamped = Math.max(
                0,
                Math.min(childrenCount - 1, idx)
              )

              setActiveIndex(clamped)

              pointerInsideRef.current
                ? setHoveredIndex(clamped)
                : setHoveredIndex(null)
            },
          },
        })
      },
      { scope: pinRef }
    )

    if (!childrenCount) return null

    const round = (n: number) => Math.round(n * 1000) / 1000

    /* ---------- compact mobile height ---------- */

    const visibleAreaHeight = childSize
      ? isMobile
          ? viewportHeight * 1.2
          : circleDiameter * visibleDecimal + childSize.h + 260
      : isMobile
      ? viewportHeight * 0.45
      : circleDiameter * visibleDecimal + 340

    /* ================= RENDER ================= */

    return (
      <div
        className="relative w-full"
        style={{
  minHeight: isMobile ? viewportHeight : scrollDuration + viewportHeight,
}}

      >
        <div
          ref={mergedRef}
          className={`sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden ${className}`}
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
            className="relative w-full overflow-shown"
            style={{
              height: `${visibleAreaHeight}px`,
              ...(isMobile
                ? {}
                : {
                    maskImage:
                      "linear-gradient(to top, transparent 0%, black 40%, black 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to top, transparent 0%, black 40%, black 100%)",
                  }),
            }}
          >
            <ul
              ref={containerRef}
              className="absolute left-1/2 -translate-x-1/2 list-none p-0 will-change-transform"
              dir={direction}
              style={{
                width: circleDiameter,
                height: circleDiameter,
                bottom: isMobile
                  ? -currentRadius * 0.15
                  : -(circleDiameter * hiddenDecimal),
              }}
            >
              {childrenNodes.map((child, i) => {
                const angle =
                  (i / childrenCount) * 2 * Math.PI - Math.PI / 2

                const delta = Math.abs(i - activeIndex)
                const isVisibleMobile = !isMobile || delta <= 1

                let x = currentRadius * Math.cos(angle)
                const y = currentRadius * Math.sin(angle)
                if (direction === "rtl") x = -x

                const rot = (angle * 180) / Math.PI

                const isActive =
                  hoveredIndex !== null
                    ? hoveredIndex === i
                    : activeIndex === i

                return (
                  <li
                    key={i}
                    ref={i === 0 ? childRef : null}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      zIndex: isActive ? 100 : 10,
                      transform: `translate(-50%, -50%) translate3d(${round(
                        x
                      )}px, ${round(y)}px, 0) rotate(${round(
                        rot + 90
                      )}deg)`,
                    }}
                  >
                    <div
                      onClick={() =>
                        !disabled && onItemSelect?.(i)
                      }
                      className={`
                        transition-all duration-500 ease-out will-change-transform
                        ${
                          isVisibleMobile
                            ? isActive
                              ? "scale-[1.38] -translate-y-25 sm:scale-[1.58] sm:-translate-y-40 z-20"
                              : "scale-100 opacity-65 blur-[1px]"
                            : "scale-75 opacity-0 pointer-events-none"
                        }
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
      </div>
    )
  }
)

RadialScrollGallery.displayName = "RadialScrollGallery"
