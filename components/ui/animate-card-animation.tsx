"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export type AnimatedCardItem = {
  id: number
  title: string
  description: string
  image: string
}

const positionStyles = [
  { scale: 1, y: 12 },
  { scale: 0.95, y: -16 },
  { scale: 0.9, y: -44 },
]

const exitAnimation = {
  y: 340,
  scale: 1,
  zIndex: 10,
}

const enterAnimation = {
  y: -16,
  scale: 0.9,
}

function CardContent({ item }: { item: AnimatedCardItem }) {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="-outline-offset-1 flex h-[200px] w-full items-center justify-center overflow-hidden rounded-xl outline outline-black/10 dark:outline-white/10">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          className="h-full w-full select-none object-cover"
        />
      </div>
      <div className="flex w-full items-center justify-between gap-2 px-3 pb-6">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium text-foreground">
            {item.title}
          </span>
          <span className="text-muted-foreground">{item.description}</span>
        </div>
        <button className="flex h-10 shrink-0 cursor-pointer select-none items-center gap-0.5 rounded-full bg-foreground pl-4 pr-3 text-sm font-medium text-background">
          Read
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
          >
            <path d="M9.5 18L15.5 12L9.5 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function AnimatedCard({
  item,
  index,
  isAnimating,
}: {
  item: AnimatedCardItem
  index: number
  isAnimating: boolean
}) {
  const { scale, y } = positionStyles[index] ?? positionStyles[2]
  const zIndex = index === 0 && isAnimating ? 10 : 3 - index

  const exitAnim = index === 0 ? exitAnimation : undefined
  const initialAnim = index === 2 ? enterAnimation : undefined

  return (
    <motion.div
      key={item.id}
      initial={initialAnim}
      animate={{ y, scale }}
      exit={exitAnim}
      transition={{
        type: "spring",
        duration: 1,
        bounce: 0,
      }}
      style={{
        zIndex,
        left: "50%",
        x: "-50%",
        bottom: 0,
      }}
      className="absolute flex h-[280px] w-[324px] items-center justify-center overflow-hidden rounded-t-xl border-x border-t border-border bg-card p-1 shadow-lg will-change-transform sm:w-[512px]"
    >
      <CardContent item={item} />
    </motion.div>
  )
}

export default function AnimatedCardStack({
  items,
  className,
}: {
  items: AnimatedCardItem[]
  className?: string
}) {
  const [cards, setCards] = useState(items.slice(0, 3))
  const [isAnimating, setIsAnimating] = useState(false)
  const [cursor, setCursor] = useState(3)
  const cooldownRef = useRef(false)

  useEffect(() => {
    setCards(items.slice(0, 3))
    setCursor(3)
  }, [items])

  const advance = () => {
    if (isAnimating || items.length <= 3) return
    setIsAnimating(true)

    const nextIndex = cursor % items.length
    const nextItem = items[nextIndex]
    setCards([...cards.slice(1), nextItem])
    setCursor((prev) => prev + 1)

    window.setTimeout(() => setIsAnimating(false), 350)
  }

  const handleWheel = (event: React.WheelEvent) => {
    if (cooldownRef.current) return
    if (Math.abs(event.deltaY) < 8) return
    event.preventDefault()
    cooldownRef.current = true
    advance()
    window.setTimeout(() => {
      cooldownRef.current = false
    }, 450)
  }

  return (
    <div
      className={`flex w-full flex-col items-center justify-center pt-2 ${className ?? ""}`}
      onWheel={handleWheel}
    >
      <div className="relative h-[380px] w-full overflow-hidden sm:w-[644px]">
        <AnimatePresence initial={false}>
          {cards.slice(0, 3).map((card, index) => (
            <AnimatedCard
              key={card.id}
              item={card}
              index={index}
              isAnimating={isAnimating}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-10 -mt-px flex w-full items-center justify-center border-t border-border py-4">
        <button
          onClick={advance}
          className="flex h-9 cursor-pointer select-none items-center justify-center gap-1 overflow-hidden rounded-lg border border-border bg-background px-3 font-medium text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-[0.98]"
        >
          Next
        </button>
      </div>
    </div>
  )
}
