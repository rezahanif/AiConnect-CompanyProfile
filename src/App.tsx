import { useEffect } from "react"
import { BackgroundOrbs } from "./components/BackgroundOrbs"
import { StickyAtmosphericLight } from "./components/StickyAtmosphericLight"
import { Header } from "./components/Header"
import { ScrollCanvas } from "./components/ScrollCanvas"
import { Footer } from "./components/Footer"
import { useSmoothScroll } from "./utils/useSmoothScroll"

export default function App() {
  useSmoothScroll()

  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".scroll-fade-in"))
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("visible"))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible")
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div
      id="top"
      className="relative min-h-screen bg-[#06080d] text-text selection:bg-sky-500/30 selection:text-sky-200"
    >
      {/* Dedicated Seamless Ambient Orbs & Starlight Particles Layer */}
      <BackgroundOrbs />
      {/* Sticky Atmospheric Volumetric Light Beam (Upper-Left to Center) */}
      <StickyAtmosphericLight />

      <div className="relative z-10">
        <Header />
        <main>
          {/* One continuous crossfade story: Hero -> Ansys -> Revit -> QGIS ->
              How it works -> Models -> Connectors -> Skills -> Guides ->
              Connect -> Pricing. Mobile falls back to a stacked flow. */}
          <ScrollCanvas />
          <Footer />
        </main>
      </div>
    </div>
  )
}
