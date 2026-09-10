import { AmbientDotsCanvas } from './AmbientDotsCanvas'

export function BackgroundOrbs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#06080d]"
    >


      {/* --- Full-Screen Continuous Starlight Nano-Dots (Three.js) --- */}
      <AmbientDotsCanvas />
    </div>
  )
}
