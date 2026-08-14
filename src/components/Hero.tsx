import { DownloadPicker } from './Download'
import { Eyebrow, FloatingObject, Reveal, WindowChrome } from './ui'

function HeroVisual() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-5xl">
      {/* glow */}
      <div
        className="animate-breathe pointer-events-none absolute -inset-x-10 -top-24 bottom-10 -z-10 blur-3xl"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 40%, rgba(59,130,246,0.35), transparent 70%), radial-gradient(40% 40% at 75% 60%, rgba(59,130,246,0.2), transparent 70%)',
        }}
      />

      <WindowChrome
        title="AiConnect — Desktop"
        accent="#3b82f6"
        className="relative z-10"
      >
        <div className="grid grid-cols-1 gap-px bg-hairline md:grid-cols-[1.1fr_1fr]">
          {/* Left: agent conversation */}
          <div className="bg-ink-2/70 p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-[#d97757] text-[11px] font-bold text-white">
                C
              </span>
              <span className="text-[13px] font-semibold">Claude · Sonnet</span>
              <span className="ml-auto rounded-full bg-violet/15 px-2 py-0.5 font-mono text-[10px] text-violet-bright">
                agent
              </span>
            </div>
            <div className="space-y-3 text-[12.5px] leading-relaxed">
              <div className="rounded-xl border border-hairline bg-white/[0.03] px-3.5 py-2.5 text-muted">
                Update the level-2 slab thickness to 250mm and refresh the
                quantity takeoff.
              </div>
              <div className="rounded-xl border border-violet/25 bg-violet/10 px-3.5 py-2.5">
                <span className="text-text">
                  Opening the Revit connector — editing 14 floor elements and
                  recomputing volumes.
                </span>
                <div className="mt-2 flex items-center gap-2 font-mono text-[10px] text-violet-bright">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-bright" />
                  revit.connector · writing
                </div>
              </div>
            </div>
          </div>
          {/* Right: Revit viewport mock */}
          <div className="relative bg-[#0b0f1c] p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[11px] text-muted">
                Revit · Tower-A.rvt
              </span>
              <span className="rounded-md bg-[#3a86ff]/20 px-2 py-0.5 font-mono text-[10px] text-[#7db0ff]">
                BIM
              </span>
            </div>
            <div className="relative h-44 overflow-hidden rounded-xl border border-hairline bg-gradient-to-br from-[#0d1428] to-[#0a0d1c]">
              <svg viewBox="0 0 260 170" className="h-full w-full" aria-hidden>
                <defs>
                  <linearGradient id="floor" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#3a86ff" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#3b82f6" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3].map((i) => (
                  <g key={i} transform={`translate(0 ${i * 20})`} opacity={1 - i * 0.12}>
                    <path
                      d="M60 90 L150 60 L210 82 L120 112 Z"
                      fill="url(#floor)"
                      stroke="#6fa0ff"
                      strokeWidth="0.8"
                    />
                  </g>
                ))}
                <path d="M60 90 L60 40 M150 60 L150 10 M210 82 L210 32 M120 112 L120 62" stroke="#6fa0ff" strokeWidth="0.8" opacity="0.5" />
                <circle cx="150" cy="60" r="3" fill="#3b82f6">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>
              <div className="absolute bottom-2 left-3 font-mono text-[10px] text-[#7db0ff]">
                Level 2 · slab 250mm · updated
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[10px]">
              <div className="rounded-lg border border-hairline bg-white/[0.02] px-2.5 py-1.5 text-muted">
                Concrete <span className="float-right text-text">312 m³</span>
              </div>
              <div className="rounded-lg border border-hairline bg-white/[0.02] px-2.5 py-1.5 text-muted">
                Elements <span className="float-right text-text">14</span>
              </div>
            </div>
          </div>
        </div>
        {/* Progress store bar */}
        <div className="flex items-center gap-3 border-t border-hairline bg-white/[0.02] px-5 py-3">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-violet/20">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-violet-bright" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7c0-1.5 3.6-2.5 8-2.5s8 1 8 2.5-3.6 2.5-8 2.5S4 8.5 4 7Z" />
              <path d="M4 7v10c0 1.5 3.6 2.5 8 2.5s8-1 8-2.5V7" />
              <path d="M4 12c0 1.5 3.6 2.5 8 2.5s8-1 8-2.5" />
            </svg>
          </span>
          <span className="text-[12px] font-semibold text-text">Progress Store</span>
          <span className="font-mono text-[11px] text-muted">
            project state saved · portable across models
          </span>
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#28c840] shadow-[0_0_8px_1px_#28c840]" />
        </div>
      </WindowChrome>

      {/* floating ecosystem objects */}
      <FloatingObject
        label="Revit"
        glyph="Rv"
        tint="linear-gradient(135deg,#3a86ff,#1b4fb0)"
        className="-left-4 top-10 hidden sm:block"
        delay={0}
        rotate={-4}
      />
      <FloatingObject
        label="Claude"
        glyph="C"
        tint="linear-gradient(135deg,#d97757,#a8471f)"
        className="-right-6 top-24 hidden sm:block"
        delay={1.4}
        rotate={5}
      />
      <FloatingObject
        label="ArcGIS"
        glyph="Ag"
        tint="linear-gradient(135deg,#4b7bec,#26408b)"
        className="-bottom-6 left-16 hidden sm:block"
        delay={2.6}
        rotate={-2}
      />
    </div>
  )
}

export function Hero() {
  return (
    <section id="product" className="relative overflow-hidden px-5 pt-32 pb-8 md:px-8 md:pt-40">
      {/* background field */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(80% 60% at 50% -10%, rgba(59,130,246,0.35), transparent 60%), radial-gradient(50% 40% at 85% 20%, rgba(59,130,246,0.2), transparent 60%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(70% 60% at 50% 0%, #000, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 0%, #000, transparent 75%)',
        }}
      />

      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow>AI-native engineering workspace</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-[68px]">
            Build with AI.
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(120deg,#3b82f6 20%,#3b82f6 90%)' }}
            >
              Continue without losing context.
            </span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-[17px] leading-relaxed text-muted md:text-[19px]">
            AiConnect lets AI agents work across engineering software, documents,
            and professional tools — while preserving your project progress
            across sessions and AI models.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <DownloadPicker showVersion />
        </Reveal>
      </div>

      <Reveal delay={200}>
        <HeroVisual />
      </Reveal>
    </section>
  )
}
