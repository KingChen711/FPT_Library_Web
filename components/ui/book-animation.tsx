"use client"

import React, { useCallback, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { BookUp } from "lucide-react"

const BookAnimation = () => {
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)

  const animationSequence = useCallback(async () => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.offsetHeight

      // Move up halfway (only half of the container height)
      await controls.start({
        y: `-${containerHeight / 8}px`,
        transition: { duration: 1 },
      })

      // Pause for 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Move up the rest of the way while fading out
      await controls.start({
        y: `-${containerHeight}px`,
        opacity: 0,
        transition: { duration: 1 },
      })

      // Instantly move back to the bottom without being visible
      await controls.start({
        y: `${containerHeight}px`,
        opacity: 0,
        transition: { duration: 0 },
      })

      // Fade in at the bottom
      await controls.start({ opacity: 1, transition: { duration: 0.5 } })

      // Start the sequence again
      animationSequence()
    }
  }, [controls])

  useEffect(() => {
    animationSequence()
  }, [animationSequence])

  return (
    <div
      ref={containerRef}
      className="relative flex h-2/3 w-full items-center justify-center overflow-hidden rounded-md border bg-accent shadow-lg"
    >
      <motion.div
        animate={controls}
        initial={{ y: "100%", opacity: 1 }}
        style={{ position: "absolute", bottom: 0 }}
      >
        <BookUp size={200} strokeWidth={1} />
      </motion.div>
    </div>
  )
}

export default BookAnimation
