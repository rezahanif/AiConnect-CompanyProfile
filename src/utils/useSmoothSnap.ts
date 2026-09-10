import { useEffect } from 'react'

// Hook to provide 120fps cinematic smooth section snapping and controlled auto-scroll
// Prevents abrupt wheel jumping, ensuring slow-mo particle morphing always plays smoothly and luxuriously
export function useSmoothSnap() {
  useEffect(() => {
    const TOTAL_SECTIONS = 4

    const getInitialSection = () => {
      if (window.location.hash === '#geospatial' || window.location.hash === '#blueprint' || window.location.hash === '#gis') return 3
      if (window.location.hash === '#civil' || window.location.hash === '#architecture') return 2
      if (window.location.hash === '#engine') return 1
      const vh = window.innerHeight
      const y = window.scrollY
      const idx = Math.round(y / vh)
      return Math.min(Math.max(0, idx), TOTAL_SECTIONS - 1)
    }

    let currentSection = getInitialSection()
    if (currentSection > 0) {
      window.scrollTo(0, currentSection * window.innerHeight)
    }
    let isAnimating = false
    let animStartTime = 0
    let startY = 0
    let targetY = 0
    let cooldownUntil = 0
    const duration = 2200 // 2.2s luxurious cinematic slow-motion transition

    // S-curve cubic easing: buttery gentle acceleration, fluid glide, soft cushioned landing
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const scrollToSection = (index: number) => {
      if (isAnimating) return
      const targetIndex = Math.min(Math.max(0, index), TOTAL_SECTIONS - 1)
      const vh = window.innerHeight
      currentSection = targetIndex
      startY = window.scrollY
      targetY = targetIndex * vh
      animStartTime = performance.now()
      isAnimating = true

      const step = (now: number) => {
        const elapsed = now - animStartTime
        const progress = Math.min(1, elapsed / duration)
        const eased = easeInOutCubic(progress)
        const currentY = startY + (targetY - startY) * eased

        window.scrollTo(0, currentY)

        if (progress < 1) {
          requestAnimationFrame(step)
        } else {
          window.scrollTo(0, targetY)
          isAnimating = false
          cooldownUntil = performance.now() + 400 // Guard against residual trackpad momentum
        }
      }

      requestAnimationFrame(step)
    }

    // Wheel listener - intercepts harsh mousewheel/trackpad flicks
    let wheelAccum = 0
    let wheelTimeout: any = null

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      const now = performance.now()
      if (isAnimating || now < cooldownUntil) {
        return
      }

      wheelAccum += e.deltaY

      clearTimeout(wheelTimeout)
      wheelTimeout = setTimeout(() => {
        wheelAccum = 0
      }, 160)

      if (wheelAccum > 36 && currentSection < TOTAL_SECTIONS - 1) {
        wheelAccum = 0
        scrollToSection(currentSection + 1)
      } else if (wheelAccum < -36 && currentSection > 0) {
        wheelAccum = 0
        scrollToSection(currentSection - 1)
      }
    }

    // Keyboard navigation (ArrowDown, ArrowUp, PageDown, PageUp, Space)
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = performance.now()
      if (isAnimating || now < cooldownUntil) return
      if (['ArrowDown', 'PageDown', ' '].includes(e.key) && currentSection < TOTAL_SECTIONS - 1) {
        e.preventDefault()
        scrollToSection(currentSection + 1)
      } else if (['ArrowUp', 'PageUp'].includes(e.key) && currentSection > 0) {
        e.preventDefault()
        scrollToSection(currentSection - 1)
      }
    }

    // Touch swipe navigation for trackpad/touch devices
    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const now = performance.now()
      if (isAnimating || now < cooldownUntil || e.changedTouches.length === 0) return
      const touchEndY = e.changedTouches[0].clientY
      const diff = touchStartY - touchEndY

      if (diff > 35 && currentSection < TOTAL_SECTIONS - 1) {
        scrollToSection(currentSection + 1)
      } else if (diff < -35 && currentSection > 0) {
        scrollToSection(currentSection - 1)
      }
    }

    // Intercept clicks on anchor tags (#product, #engine, #civil, #top)
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return
      const href = target.getAttribute('href')
      if (!href) return

      if (href === '#geospatial' || href === '#blueprint' || href === '#gis') {
        e.preventDefault()
        scrollToSection(3)
      } else if (href === '#civil' || href === '#architecture') {
        e.preventDefault()
        scrollToSection(2)
      } else if (href === '#engine') {
        e.preventDefault()
        scrollToSection(1)
      } else if (href === '#product' || href === '#top' || href === '/') {
        e.preventDefault()
        scrollToSection(0)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    document.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('click', handleClick)
    }
  }, [])
}
