/**
 * Ambient background layer — fixed, non-interactive, behind all content
 * (z-0 vs content z-10). Glyph-free: soft blurred glow orbs in brand /
 * ecosystem tints drift slowly. pointer-events-none so content stays
 * clickable. Hidden on small screens.
 */
const ORBS = [
  {
    tint: "rgba(59,130,246,0.16)",
    position: "left-[6%] top-[14%]",
    delay: 0,
  },
  {
    tint: "rgba(217,119,87,0.12)",
    position: "right-[8%] top-[28%]",
    delay: 1.4,
  },
  {
    tint: "rgba(75,123,236,0.14)",
    position: "left-[10%] bottom-[18%]",
    delay: 2.6,
  },
]

export function AmbientFloaters() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden sm:block"
    >
      {ORBS.map((o, i) => (
        <div
          key={i}
          className={`animate-float absolute ${o.position}`}
          style={{ animationDelay: `${o.delay}s` }}
        >
          <div
            className="h-48 w-48 rounded-full blur-3xl"
            style={{ background: o.tint }}
          />
        </div>
      ))}
    </div>
  )
}
