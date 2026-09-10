import { useEffect } from 'react'
import { LAYER_WEIGHTS, SCROLL_STATES, scrollBridge } from './scrollBridge'

// Wheel throttle with a "leash": intercepts mousewheel/trackpad deltas and
// drains a small burst budget instead of stacking momentum forever. The
// budget refills slowly, so a violent flick travels a bounded distance and
// then creeps — it can never fly to the bottom of the page. The glide is
// lerped and brakes harder the faster the flick. Touch and keyboard stay
// native.

let cancelController: (() => void) | null = null

/** Hand control back to native scrolling (used before anchor jumps). */
export function cancelSmoothScroll() {
  cancelController?.()
}

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const MAX_DELTA = 90 // px per wheel event — absorbs hard flicks
    const LERP_CALM = 0.12 // responsive when scrolling slowly
    const LERP_FAST = 0.05 // heavy resistance when flicking hard
    const SETTLE = 0.4 // px — snap when closer than this
    const BURST_SCREENS = 1.6 // distance one gesture may cover instantly
    const REGEN_SCREENS_PER_SEC = 0.8 // how fast the burst budget refills
    const LEAD_SCREENS = 1.8 // hard limit on target lead
    const BRAKE_RATE = 1800 // px/s of wheel input = full braking
    const REFERENCE_WEIGHT = 1.45 // scroll length of a typical closing section
    const MAX_REGION_SCALE = 1.6 // how much lighter the long 3D scenes feel

    let target = window.scrollY
    let current = window.scrollY
    let lastWheelAt = 0
    let animId = 0
    let wheelVel = 0
    let budget = window.innerHeight * BURST_SCREENS

    const vh = () => window.innerHeight || 800
    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight)

    // Longer sections (the four 3D scenes) get proportionally more budget so
    // one gesture covers a similar slice of a section everywhere.
    const regionScale = () => {
      const p = scrollBridge.getState().rawProgress
      const i = Math.max(0, Math.min(SCROLL_STATES - 1, Math.floor(p)))
      return Math.min(MAX_REGION_SCALE, LAYER_WEIGHTS[i] / REFERENCE_WEIGHT)
    }

    const cancel = () => {
      const y = window.scrollY
      target = y
      current = y
      wheelVel = 0
      budget = vh() * BURST_SCREENS * regionScale()
      lastWheelAt = performance.now()
    }
    cancelController = cancel

    const onWheel = (e: WheelEvent) => {
      // Let pinch-zoom / horizontal gestures through
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      e.preventDefault()

      let dy = e.deltaY
      // Normalize line/page deltas to px
      if (e.deltaMode === 1) dy *= 16
      else if (e.deltaMode === 2) dy *= window.innerHeight

      dy = Math.max(-MAX_DELTA, Math.min(MAX_DELTA, dy))

      // Burst budget: full when a gesture starts, refilled slowly while
      // momentum keeps firing, so dense trackpad momentum gets absorbed.
      const now = performance.now()
      const idle = Math.max(8, now - lastWheelAt)
      const scale = regionScale()
      const burst = vh() * BURST_SCREENS * scale
      if (idle > 300) budget = burst
      else
        budget = Math.min(
          burst,
          budget + vh() * REGEN_SCREENS_PER_SEC * scale * (idle / 1000),
        )

      const allowed = Math.min(Math.abs(dy), budget)
      budget -= allowed
      const step = Math.sign(dy) * allowed

      const rate = (allowed / idle) * 1000
      wheelVel += (rate - wheelVel) * 0.3

      const lead = vh() * LEAD_SCREENS * scale
      target = Math.max(
        0,
        Math.min(
          maxScroll(),
          Math.max(current - lead, Math.min(current + lead, target + step)),
        ),
      )
      lastWheelAt = now
    }

    const frame = () => {
      animId = requestAnimationFrame(frame)
      const now = performance.now()

      if (now - lastWheelAt > 160) {
        // No recent wheel input: adopt external scrolls
        // (anchor jumps, keyboard) instead of fighting them.
        const y = window.scrollY
        if (Math.abs(target - current) < 1) {
          target = y
          current = y
          return
        }
      }

      // Decay velocity; braking eases off as the flick settles
      wheelVel *= 0.94
      // Dynamic glide weight: calm = responsive, fast = heavy resistance
      const brake = Math.min(1, wheelVel / BRAKE_RATE)
      const lerp = LERP_CALM - brake * (LERP_CALM - LERP_FAST)

      const diff = target - current
      if (Math.abs(diff) < SETTLE) {
        if (current !== target) {
          current = target
          window.scrollTo(0, current)
        }
        return
      }
      current += diff * lerp
      window.scrollTo(0, current)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    animId = requestAnimationFrame(frame)

    return () => {
      cancelController = null
      window.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(animId)
    }
  }, [])
}
