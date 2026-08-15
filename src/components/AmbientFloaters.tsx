/**
 * Ambient floating logo glyphs (Revit / Claude / ArcGIS).
 *
 * Not currently rendered in the app — kept as an available component in
 * case the ambient background layer comes back. Self-contained (no
 * dependency on the removed FloatingObject): fixed viewport layer behind
 * content (z-0), pointer-events-none, glyph-only squares with drift
 * animation, hidden on small screens.
 */
const GLYPHS = [
  {
    label: 'Revit',
    glyph: 'Rv',
    tint: 'linear-gradient(135deg,#3a86ff,#1b4fb0)',
    position: 'left-[4%] top-[16%]',
    delay: 0,
    rotate: -4,
  },
  {
    label: 'Claude',
    glyph: 'C',
    tint: 'linear-gradient(135deg,#d97757,#a8471f)',
    position: 'right-[5%] top-[30%]',
    delay: 1.4,
    rotate: 5,
  },
  {
    label: 'ArcGIS',
    glyph: 'Ag',
    tint: 'linear-gradient(135deg,#4b7bec,#26408b)',
    position: 'left-[8%] bottom-[20%]',
    delay: 2.6,
    rotate: -2,
  },
]

function FloatingGlyph({
  glyph,
  tint,
  position,
  delay,
  rotate,
}: {
  glyph: string
  tint: string
  position: string
  delay: number
  rotate: number
}) {
  return (
    <div
      className={`absolute ${position} animate-float`}
      style={{ animationDelay: `${delay}s`, ['--r' as string]: `${rotate}deg` }}
    >
      <span
        className="grid h-12 w-12 place-items-center rounded-2xl text-[18px] font-bold text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)]"
        style={{ background: tint }}
      >
        {glyph}
      </span>
    </div>
  )
}

export function AmbientFloaters() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden sm:block"
    >
      {GLYPHS.map((g) => (
        <FloatingGlyph key={g.label} {...g} />
      ))}
    </div>
  )
}
