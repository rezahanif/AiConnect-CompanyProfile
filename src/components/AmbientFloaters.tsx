import { FloatingObject } from './ui'

/**
 * Ambient floating ecosystem chips — a fixed, non-interactive background
 * layer (Copilot-style): above the page background, behind all content,
 * never clipped by section overflow. pointer-events-none so content stays
 * clickable. Hidden on small screens to keep mobile readable.
 */
export function AmbientFloaters() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden sm:block"
    >
      <FloatingObject
        label="Revit"
        glyph="Rv"
        tint="linear-gradient(135deg,#3a86ff,#1b4fb0)"
        className="left-[4%] top-[16%]"
        delay={0}
        rotate={-4}
      />
      <FloatingObject
        label="Claude"
        glyph="C"
        tint="linear-gradient(135deg,#d97757,#a8471f)"
        className="right-[5%] top-[30%]"
        delay={1.4}
        rotate={5}
      />
      <FloatingObject
        label="ArcGIS"
        glyph="Ag"
        tint="linear-gradient(135deg,#4b7bec,#26408b)"
        className="left-[8%] bottom-[20%]"
        delay={2.6}
        rotate={-2}
      />
    </div>
  )
}
