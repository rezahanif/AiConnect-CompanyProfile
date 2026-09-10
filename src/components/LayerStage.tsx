import { createContext, useContext, useEffect, useState } from "react"
import { useMotionValue, useTransform, type MotionValue } from "motion/react"
import { isStoryPinEnabled } from "../utils/scrollBridge"

export function useStoryPinEnabled() {
  const [enabled, setEnabled] = useState(() => isStoryPinEnabled())

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setEnabled(desktop.matches && !reduce.matches)
    update()
    desktop.addEventListener("change", update)
    reduce.addEventListener("change", update)
    return () => {
      desktop.removeEventListener("change", update)
      reduce.removeEventListener("change", update)
    }
  }, [])

  return enabled
}

export const LayerProgressContext = createContext<MotionValue<number> | null>(
  null,
)

/** 0→1 progress of the enclosing canvas layer (null outside the pinned story). */
export function useLayerProgress() {
  return useContext(LayerProgressContext)
}

/** Scroll-linked parallax transform tied to the enclosing canvas layer. */
export function useLayerParallax(from: number, to: number) {
  const progress = useContext(LayerProgressContext)
  const fallback = useMotionValue(0)
  return useTransform(progress ?? fallback, [0, 1], [from, to])
}
