import { useEffect, useRef, useState, type ReactNode } from "react"
import { motionValue, type MotionValue } from "motion/react"
import { Hero } from "./Hero"
import { GearSection } from "./GearSection"
import { CliffVillaSection } from "./CliffVillaSection"
import { SapBlueprintSection } from "./SapBlueprintSection"
import { HowItWorksSection } from "./HowItWorksSection"
import {
  ModelsSection,
  ConnectorsSection,
  SkillsSection,
  GuidesSection,
} from "./FeatureSections"
import { ConnectDiagram, GetStarted } from "./ClosingSections"
import { LayerProgressContext, useStoryPinEnabled } from "./LayerStage"
import { cancelSmoothScroll } from "../utils/useSmoothScroll"
import {
  scrollBridge,
  layerOpacity,
  layerLocalProgress,
  SCROLL_STATES,
  HERO_LAYER_COUNT,
  HERO_SCREENS,
  STORY_SCREENS,
  CUMULATIVE_SCREENS,
} from "../utils/scrollBridge"

interface LayerDef {
  id: string
  label: string
  render: (visible: boolean) => ReactNode
}

const LAYERS: LayerDef[] = [
  { id: "product", label: "Intro", render: (v) => <Hero visible={v} /> },
  {
    id: "engine",
    label: "Ansys CFX & FEA",
    render: (v) => <GearSection visible={v} />,
  },
  {
    id: "civil",
    label: "Revit BIM",
    render: (v) => <CliffVillaSection visible={v} />,
  },
  {
    id: "geospatial",
    label: "QGIS & SAP2000",
    render: (v) => <SapBlueprintSection visible={v} />,
  },
  { id: "how-it-works", label: "Handoff", render: () => <HowItWorksSection /> },
  { id: "models", label: "Models", render: () => <ModelsSection /> },
  {
    id: "connectors",
    label: "Connectors",
    render: () => <ConnectorsSection />,
  },
  { id: "skills", label: "Skills", render: () => <SkillsSection /> },
  { id: "guides", label: "Guides", render: () => <GuidesSection /> },
  { id: "how-it-connects", label: "Connect", render: () => <ConnectDiagram /> },
  { id: "pricing", label: "Pricing", render: () => <GetStarted /> },
]

const ANCHOR_LAYER: Record<string, number> = {
  "#product": 0,
  "#top": 0,
  "#engine": 1,
  "#civil": 2,
  "#architecture": 2,
  "#geospatial": 3,
  "#blueprint": 3,
  "#gis": 3,
  "#how-it-works": 4,
  "#models": 5,
  "#connectors": 6,
  "#skills": 7,
  "#guides": 8,
  "#how-it-connects": 9,
  "#pricing": 10,
  "#pro-card": 10,
  "#get-download": 10,
  "#download": 10,
}

export function ScrollCanvas() {
  const pinEnabled = useStoryPinEnabled()
  const activeCount = pinEnabled ? SCROLL_STATES : HERO_LAYER_COUNT
  const totalScreens = pinEnabled ? STORY_SCREENS : HERO_SCREENS

  const layerRefs = useRef<(HTMLElement | null)[]>([])
  const stickyRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeRef = useRef(0)
  const [nearKey, setNearKey] = useState("0")
  const nearRef = useRef("0")
  const [progressValues] = useState<MotionValue<number>[]>(() =>
    LAYERS.map(() => motionValue(0)),
  )

  const scrollToLayer = (index: number) => {
    const vh = window.innerHeight || 1
    cancelSmoothScroll()
    window.scrollTo({ top: CUMULATIVE_SCREENS[index] * vh, behavior: "smooth" })
  }

  // Map section anchors to scroll positions inside the sticky canvas
  useEffect(() => {
    if (!pinEnabled) return
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a")
      if (!a) return
      const href = a.getAttribute("href") ?? ""
      if (href === "/") {
        e.preventDefault()
        scrollToLayer(0)
        return
      }
      const hash = href.includes("#") ? `#${href.split("#")[1]}` : ""
      const index = ANCHOR_LAYER[hash]
      if (index === undefined) return
      e.preventDefault()
      scrollToLayer(index)
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinEnabled])

  useEffect(() => {
    let animId = 0
    const update = () => {
      animId = requestAnimationFrame(update)
      const p = scrollBridge.tick().smoothProgress

      const active = Math.max(0, Math.min(activeCount - 1, Math.round(p)))

      for (let i = 0; i < activeCount; i++) {
        const el = layerRefs.current[i]
        if (!el) continue
        const o = layerOpacity(p, i)
        el.style.opacity = o < 0.003 ? "0" : `${o.toFixed(3)}`
        el.style.visibility = o < 0.003 ? "hidden" : "visible"
        el.style.pointerEvents = "none"

        const drift = (i - p) * 48
        const scale = 1 - Math.min(0.04, Math.abs(i - p) * 0.04)
        const texts = el.querySelectorAll("[data-layer-text]")
        texts.forEach((t) => {
          const node = t as HTMLElement
          node.style.transform = `translate3d(0, ${drift.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`
        })
      }

      for (let i = 0; i < LAYERS.length; i++) {
        progressValues[i].set(layerLocalProgress(p, i))
      }

      // Active layer gets pointer events (buttons/tabs clickable)
      const activeEl = layerRefs.current[active]
      if (activeEl && layerOpacity(p, active) > 0.5) {
        activeEl.style.pointerEvents = "auto"
      }

      if (active !== activeRef.current) {
        activeRef.current = active
        setActiveIndex(active)
      }

      // Mount 3D canvases for nearby hero layers only
      const near: number[] = []
      for (let i = 0; i < Math.min(HERO_LAYER_COUNT, activeCount); i++) {
        if (Math.abs(p - i) < 1.0) near.push(i)
      }
      const key = near.join(",")
      if (key !== nearRef.current) {
        nearRef.current = key
        setNearKey(key)
      }

      // End-of-story release: fade the pinned canvas out while it unpins,
      // handing off to the footer without a hard cut.
      const sticky = stickyRef.current
      if (sticky) {
        const vh = window.innerHeight || 1
        const screens = window.scrollY / vh
        const release = Math.max(
          0,
          Math.min(1, screens - Math.max(0, totalScreens - 1)),
        )
        if (release > 0.001) {
          sticky.style.opacity = (1 - release * 0.9).toFixed(3)
        } else if (sticky.style.opacity !== "1") {
          sticky.style.opacity = "1"
        }
      }
    }
    update()
    return () => cancelAnimationFrame(animId)
  }, [activeCount, totalScreens, progressValues])

  const nearSet = new Set(nearKey.split(",").map(Number))
  const canvasVisible = (i: number) => nearSet.has(i)

  const railLayers = LAYERS.slice(0, activeCount)

  return (
    <>
      <div className="relative" style={{ height: `${totalScreens * 100}vh` }}>
        <div
          ref={stickyRef}
          className="sticky top-0 flex h-screen max-h-screen w-full flex-col overflow-hidden will-change-transform"
        >
          {LAYERS.slice(0, activeCount).map((layer, i) => (
            <section
              key={layer.id}
              id={i >= HERO_LAYER_COUNT ? layer.id : undefined}
              ref={(el) => {
                layerRefs.current[i] = el
              }}
              className="absolute inset-0 will-change-transform"
            >
              <LayerProgressContext.Provider value={progressValues[i]}>
                {layer.render(canvasVisible(i))}
              </LayerProgressContext.Provider>
            </section>
          ))}

          {/* Scroll progress rail */}
          <div className="absolute right-4 sm:right-6 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-2.5">
            {railLayers.map((layer, i) => (
              <button
                key={layer.id}
                onClick={() => scrollToLayer(i)}
                aria-label={`Go to ${layer.label}`}
                title={layer.label}
                className="group flex items-center gap-2"
              >
                <span
                  className={`hidden text-[10px] font-mono tracking-wider uppercase transition-opacity group-hover:opacity-100 ${
                    activeIndex === i
                      ? "text-sky-300 opacity-100"
                      : "text-white/40 opacity-0"
                  }`}
                >
                  {layer.label}
                </span>
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    activeIndex === i
                      ? "h-6 w-1.5 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                      : "h-1.5 w-1.5 bg-white/25 hover:bg-white/50"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {!pinEnabled && (
        <div className="relative z-20">
          {LAYERS.slice(HERO_LAYER_COUNT).map((layer) => (
            <section
              key={layer.id}
              id={layer.id}
              className="relative w-full scroll-mt-20 select-none"
            >
              {layer.render(false)}
            </section>
          ))}
        </div>
      )}
    </>
  )
}
