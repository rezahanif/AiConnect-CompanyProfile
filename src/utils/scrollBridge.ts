// Cinematic Scroll Progress Bridge with Inertia Damping
// One continuous story: Hero -> Ansys -> Revit -> QGIS -> How it works ->
// Models -> Connectors -> Skills -> Guides -> Connect -> Pricing.
// Applies smooth lerp damping (0.055) for weighted, slow-mo cinematic transitions.

export const HERO_LAYER_COUNT = 4

// Viewport-heights of scroll per layer. The four 3D scenes keep the original
// 2.5 screens; the closing story layers are shorter so the page never stalls.
export const LAYER_WEIGHTS = [
  2.5, 2.5, 2.5, 2.5, 1.75, 1.45, 1.45, 1.45, 1.45, 1.6, 1.9,
]

export const SCROLL_STATES = LAYER_WEIGHTS.length

// Legacy: screens per hero section (kept for the non-pinned fallback).
export const VH_PER_SECTION = 2.5

export const HERO_SCREENS = HERO_LAYER_COUNT * VH_PER_SECTION
export const STORY_SCREENS = LAYER_WEIGHTS.reduce((sum, w) => sum + w, 0)

// Scroll position (in screens) where each layer sits at progress `index`.
export const CUMULATIVE_SCREENS: number[] = LAYER_WEIGHTS.reduce<number[]>(
  (acc, w) => {
    acc.push(acc[acc.length - 1] + w)
    return acc
  },
  [0],
)

export const FADE_START = 0.28
export const FADE_END = 0.55

export function isStoryPinEnabled(): boolean {
  if (typeof window === "undefined") return false
  return (
    window.matchMedia("(min-width: 1024px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function progressFromScreens(screens: number, story: boolean): number {
  if (!story) {
    return Math.max(0, Math.min(HERO_LAYER_COUNT - 1, screens / VH_PER_SECTION))
  }
  let acc = 0
  for (let i = 0; i < SCROLL_STATES - 1; i++) {
    const weight = LAYER_WEIGHTS[i]
    if (screens < acc + weight) {
      return i + Math.max(0, (screens - acc) / weight)
    }
    acc += weight
  }
  return SCROLL_STATES - 1
}

interface ScrollState {
  rawHeroDisperse: number
  rawGearAssemble: number
  smoothHeroDisperse: number
  smoothGearAssemble: number
  // Continuous page progress: 0 = Hero, 1 = Ansys, ... 10 = Pricing.
  rawProgress: number
  smoothProgress: number
}

class ScrollBridge {
  private state: ScrollState = {
    rawHeroDisperse: 0,
    rawGearAssemble: 0,
    smoothHeroDisperse: 0,
    smoothGearAssemble: 0,
    rawProgress: 0,
    smoothProgress: 0,
  }

  private isListening = false
  private damping = 0.055
  private lastTickTime = 0
  private storyEnabled = false

  constructor() {
    if (typeof window !== "undefined") {
      this.init()
    }
  }

  private readRaw = () => {
    const vh = window.innerHeight || 800
    const screens = (window.scrollY || 0) / Math.max(vh, 1)
    const p = progressFromScreens(screens, this.storyEnabled)
    this.state.rawProgress = p
    const legacy = Math.max(0, Math.min(1, p))
    this.state.rawHeroDisperse = legacy
    this.state.rawGearAssemble = legacy
  }

  private init() {
    if (this.isListening) return
    this.isListening = true
    this.storyEnabled = isStoryPinEnabled()

    window.addEventListener("scroll", this.readRaw, { passive: true })
    window.addEventListener("resize", this.readRaw, { passive: true })

    const desktop = window.matchMedia("(min-width: 1024px)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMode = () => {
      this.storyEnabled = desktop.matches && !reduce.matches
      this.readRaw()
    }
    desktop.addEventListener("change", updateMode)
    reduce.addEventListener("change", updateMode)

    this.readRaw()
  }

  // Called in WebGL requestAnimationFrame loops
  public tick(): ScrollState {
    const now = performance.now()
    // Avoid double-damping if called by multiple canvases in the same RAF frame (< 4ms apart)
    if (now - this.lastTickTime < 4) {
      return this.state
    }
    this.lastTickTime = now

    const s = this.state
    // Legacy hero/gear smoothing (unchanged)
    s.smoothHeroDisperse += (s.rawHeroDisperse - s.smoothHeroDisperse) * 0.055
    s.smoothGearAssemble += (s.rawGearAssemble - s.smoothGearAssemble) * 0.055
    // Weighted slow-mo exponential inertia smoothing (drives layer crossfade)
    s.smoothProgress += (s.rawProgress - s.smoothProgress) * this.damping
    if (Math.abs(s.rawProgress - s.smoothProgress) < 0.0004) {
      s.smoothProgress = s.rawProgress
    }

    return s
  }

  public getState(): ScrollState {
    return this.state
  }
}

export const scrollBridge = new ScrollBridge()

// Opacity of state `index` given continuous progress `p` (for Phase 2 crossfade).
// Dead-zone curve: the outgoing layer fully fades out BEFORE the incoming
// layer starts fading in, so two text layers are never visible together.
// d in [-0.28, +0.28] -> fully visible (small scrolls change nothing)
// d in [-0.55, -0.28)  -> fading in (smoothstep)
// d in (+0.28, +0.55]  -> fading out (smoothstep)
// otherwise           -> hidden
function smooth01(t: number): number {
  const c = Math.max(0, Math.min(1, t))
  return c * c * (3 - 2 * c)
}

export function layerOpacity(p: number, index: number): number {
  const d = p - index
  if (d <= -FADE_END || d >= FADE_END) return 0
  if (d >= -FADE_START && d <= FADE_START) return 1
  if (d < -FADE_START) return smooth01((d + FADE_END) / (FADE_END - FADE_START))
  return smooth01((FADE_END - d) / (FADE_END - FADE_START))
}

// Local 0..1 progress of layer `index` across its visible crossfade window.
export function layerLocalProgress(p: number, index: number): number {
  return Math.max(0, Math.min(1, (p - index + FADE_END) / (FADE_END * 2)))
}

// Scroll presence of section `index` given continuous progress `p`.
// 1 when arrived (at rest: identical to legacy behaviour), 0 when a full
// section away. Drives particle disperse/assemble inside the 3D canvases so
// shapes dissolve into ambient orbs while leaving and reform while arriving.
const PRESENCE_FULL = 0.1
const PRESENCE_GONE = 0.55

export function sectionPresence(p: number, index: number): number {
  const d = Math.abs(p - index)
  if (d <= PRESENCE_FULL) return 1
  if (d >= PRESENCE_GONE) return 0
  return 1 - smooth01((d - PRESENCE_FULL) / (PRESENCE_GONE - PRESENCE_FULL))
}
