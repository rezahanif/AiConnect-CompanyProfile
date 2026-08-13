import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

/* ------------------------------------------------------------------ */
/* Scroll reveal                                                       */
/* ------------------------------------------------------------------ */

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        })
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? 'in' : ''} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Brand + icons                                                       */
/* ------------------------------------------------------------------ */

function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
        <defs>
          <linearGradient id="bm" x1="4" y1="4" x2="28" y2="28">
            <stop stopColor="#a78bff" />
            <stop offset="1" stopColor="#5b8cff" />
          </linearGradient>
        </defs>
        <path
          d="M16 3.5 27.2 10v12L16 28.5 4.8 22V10L16 3.5Z"
          stroke="url(#bm)"
          strokeWidth="1.6"
          fill="rgba(139,107,255,0.10)"
        />
        <circle cx="16" cy="16" r="3.1" fill="url(#bm)" />
        <path d="M16 12.9V8M16 19.1V24M12.9 16H8M19.1 16H24" stroke="url(#bm)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="16" cy="8" r="1.5" fill="#a78bff" />
        <circle cx="16" cy="24" r="1.5" fill="#5b8cff" />
        <circle cx="8" cy="16" r="1.5" fill="#6fe0ff" />
        <circle cx="24" cy="16" r="1.5" fill="#a78bff" />
      </svg>
      <span className="text-[17px] font-extrabold tracking-tight text-text">
        Ai<span className="text-violet-bright">Connect</span>
      </span>
    </span>
  )
}

function IconApple(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} fill="currentColor" aria-hidden>
      <path d="M16.36 12.9c-.02-2.06 1.68-3.05 1.76-3.1-.96-1.4-2.45-1.6-2.98-1.62-1.27-.13-2.48.75-3.12.75-.64 0-1.64-.73-2.7-.71-1.39.02-2.67.81-3.38 2.05-1.44 2.5-.37 6.2 1.03 8.23.69.99 1.5 2.1 2.57 2.06 1.03-.04 1.42-.66 2.67-.66 1.24 0 1.6.66 2.69.64 1.11-.02 1.81-1.01 2.49-2 .78-1.15 1.1-2.26 1.12-2.31-.02-.01-2.15-.83-2.17-3.28ZM14.3 6.8c.57-.69.95-1.65.85-2.6-.82.03-1.81.54-2.4 1.23-.53.61-1 1.59-.87 2.52.91.07 1.85-.46 2.42-1.15Z" />
    </svg>
  )
}
function IconWindows(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} fill="currentColor" aria-hidden>
      <path d="M3 5.6 10.4 4.6v6.9H3V5.6ZM11.4 4.5 21 3.2v8.3h-9.6V4.5ZM3 12.5h7.4v6.9L3 18.4v-5.9ZM11.4 12.5H21v8.3l-9.6-1.3v-7Z" />
    </svg>
  )
}
function IconLinux(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} fill="currentColor" aria-hidden>
      <path d="M12 2.5c-2 0-3.3 1.6-3.3 3.9 0 1.2.1 2-.6 3.2-.7 1.3-2 2.4-2.6 3.9-.4 1-.2 1.9.4 2.2.2.9.1 1.6.6 2 .7.5 2 .3 3 .6.9.3 1.9.5 2.8.2.9-.3 1.4-1 2.4-1.3 1-.3 2 .1 2.6-.4.5-.4.4-1.2.6-2 .6-.4.7-1.3.3-2.2-.7-1.6-2-2.7-2.7-4-.6-1.1-.5-1.9-.5-3.1 0-2.3-1.4-4-3-4Zm-1.6 4c.4 0 .7.4.7.9s-.3.9-.7.9-.7-.4-.7-.9.3-.9.7-.9Zm3.1 0c.4 0 .7.4.7.9s-.3.9-.7.9-.7-.4-.7-.9.3-.9.7-.9Z" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Logo chip (abstract ecosystem marks, no trademarks reproduced)     */
/* ------------------------------------------------------------------ */

function LogoChip({
  label,
  glyph,
  tint,
}: {
  label: string
  glyph: string
  tint: string
}) {
  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap text-[15px] font-semibold text-muted transition-colors hover:text-text">
      <span
        className="grid h-8 w-8 place-items-center rounded-lg text-[13px] font-bold text-white"
        style={{ background: tint }}
      >
        {glyph}
      </span>
      {label}
    </span>
  )
}

const ecosystem = [
  { label: 'Revit', glyph: 'Rv', tint: 'linear-gradient(135deg,#3a86ff,#1b4fb0)' },
  { label: 'AutoCAD', glyph: 'Ac', tint: 'linear-gradient(135deg,#e04b4b,#8a1f1f)' },
  { label: 'QGIS', glyph: 'Qg', tint: 'linear-gradient(135deg,#3ec46d,#1f7a45)' },
  { label: 'ArcGIS', glyph: 'Ag', tint: 'linear-gradient(135deg,#4b7bec,#26408b)' },
  { label: 'SketchUp', glyph: 'Sk', tint: 'linear-gradient(135deg,#f5a623,#b5730a)' },
  { label: 'SAP2000', glyph: 'Sp', tint: 'linear-gradient(135deg,#7c5cff,#472fa8)' },
  { label: 'Metashape', glyph: 'Ms', tint: 'linear-gradient(135deg,#26c6da,#0d7d8c)' },
  { label: 'MS Office', glyph: 'Of', tint: 'linear-gradient(135deg,#e8663a,#a33d1a)' },
]

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

function DownloadButton({
  os,
  variant = 'ghost',
}: {
  os: 'macOS' | 'Windows' | 'Linux'
  variant?: 'primary' | 'ghost'
}) {
  const Icon = os === 'macOS' ? IconApple : os === 'Windows' ? IconWindows : IconLinux
  const base =
    'group inline-flex items-center gap-2.5 rounded-xl px-5 py-3 text-[15px] font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet/70'
  if (variant === 'primary') {
    return (
      <a
        href="#download"
        className={`${base} text-white shadow-[0_10px_40px_-10px_rgba(139,107,255,0.8)] hover:-translate-y-0.5`}
        style={{ background: 'linear-gradient(135deg,#a78bff,#5b8cff)' }}
      >
        <Icon className="h-[18px] w-[18px]" />
        Download for {os}
      </a>
    )
  }
  return (
    <a
      href="#download"
      className={`${base} border border-hairline bg-white/[0.03] text-text hover:-translate-y-0.5 hover:border-violet/50 hover:bg-white/[0.06]`}
    >
      <Icon className="h-[18px] w-[18px] text-muted transition-colors group-hover:text-violet-bright" />
      Download for {os}
    </a>
  )
}

/* ------------------------------------------------------------------ */
/* Section shell                                                       */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-violet-bright">
      <span className="h-1.5 w-1.5 rounded-full bg-violet-bright shadow-[0_0_10px_2px_rgba(167,139,255,0.7)]" />
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

const nav = ['Product', 'Connectors', 'Skills', 'Guides', 'Pricing']

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-hairline bg-ink/80 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <a href="#top" aria-label="AiConnect home">
          <BrandMark />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <a
              key={n}
              href={`#${n.toLowerCase()}`}
              className="text-[14px] font-medium text-muted transition-colors hover:text-text"
            >
              {n}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#download"
            className="rounded-xl px-4 py-2 text-[14px] font-semibold text-white shadow-[0_8px_28px_-10px_rgba(139,107,255,0.9)] transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#a78bff,#5b8cff)' }}
          >
            Download
          </a>
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-hairline text-text md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </button>
      </div>
      {open && (
        <div className="border-t border-hairline bg-ink/95 px-5 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {nav.map((n) => (
              <a
                key={n}
                href={`#${n.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-muted hover:bg-white/[0.04] hover:text-text"
              >
                {n}
              </a>
            ))}
            <a
              href="#download"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl px-4 py-3 text-center text-[15px] font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#a78bff,#5b8cff)' }}
            >
              Download
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

/* ------------------------------------------------------------------ */
/* Hero visual — mock desktop with app + Revit + Claude windows        */
/* ------------------------------------------------------------------ */

function WindowChrome({
  title,
  accent,
  children,
  className = '',
  style,
}: {
  title: string
  accent: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-hairline bg-surface/90 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur ${className}`}
      style={style}
    >
      <div className="flex items-center gap-2 border-b border-hairline bg-white/[0.02] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11px] text-muted">{title}</span>
        <span
          className="ml-auto h-1.5 w-1.5 rounded-full"
          style={{ background: accent, boxShadow: `0 0 10px 1px ${accent}` }}
        />
      </div>
      {children}
    </div>
  )
}

function FloatingObject({
  label,
  glyph,
  tint,
  className,
  delay,
  rotate = 0,
}: {
  label: string
  glyph: string
  tint: string
  className: string
  delay: number
  rotate?: number
}) {
  return (
    <div
      className={`animate-float absolute ${className}`}
      style={{ animationDelay: `${delay}s`, ['--r' as string]: `${rotate}deg` }}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <span
          className="grid h-10 w-10 place-items-center rounded-xl text-[15px] font-bold text-white"
          style={{ background: tint }}
        >
          {glyph}
        </span>
        <div className="pr-1">
          <div className="text-[13px] font-semibold text-text">{label}</div>
          <div className="font-mono text-[10px] text-muted">connected</div>
        </div>
      </div>
    </div>
  )
}

function HeroVisual() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-5xl">
      {/* glow */}
      <div
        className="animate-breathe pointer-events-none absolute -inset-x-10 -top-24 bottom-10 -z-10 blur-3xl"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 40%, rgba(139,107,255,0.5), transparent 70%), radial-gradient(40% 40% at 75% 60%, rgba(91,140,255,0.35), transparent 70%)',
        }}
      />

      <WindowChrome
        title="AiConnect — Desktop"
        accent="#a78bff"
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
                    <stop offset="1" stopColor="#5b8cff" stopOpacity="0.05" />
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
                <circle cx="150" cy="60" r="3" fill="#a78bff">
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

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section id="product" className="relative overflow-hidden px-5 pt-32 pb-8 md:px-8 md:pt-40">
      {/* background field */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(80% 60% at 50% -10%, rgba(139,107,255,0.28), transparent 60%), radial-gradient(50% 40% at 85% 20%, rgba(91,140,255,0.18), transparent 60%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(139,107,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,107,255,0.06) 1px, transparent 1px)',
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
              style={{ backgroundImage: 'linear-gradient(120deg,#a78bff 20%,#6fe0ff 90%)' }}
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
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <DownloadButton os="macOS" variant="primary" />
            <DownloadButton os="Windows" />
            <DownloadButton os="Linux" />
          </div>
          <p className="mt-4 font-mono text-[12px] text-muted">
            7-day free trial · Windows, macOS &amp; Linux
          </p>
        </Reveal>
      </div>

      <Reveal delay={200}>
        <HeroVisual />
      </Reveal>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Ecosystem strip                                                     */
/* ------------------------------------------------------------------ */

function EcosystemStrip() {
  return (
    <section className="relative px-5 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-center font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
            Works with the tools you already use
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="relative mt-8 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
              style={{ background: 'linear-gradient(90deg,var(--color-ink),transparent)' }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
              style={{ background: 'linear-gradient(270deg,var(--color-ink),transparent)' }}
            />
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {ecosystem.map((e) => (
                <LogoChip key={e.label} {...e} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Work with AI (intro band)                                           */
/* ------------------------------------------------------------------ */

function WorkWithAI() {
  return (
    <section className="relative px-5 py-24 md:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <Eyebrow>Real work, not just text</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Work with AI, not around it.
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-muted">
            AiConnect gives AI agents a bridge into the tools professionals
            already use — from BIM and CAD to GIS, photogrammetry, spreadsheets,
            and documents. Your agent operates against real software instead of
            producing disconnected text.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Feature section shell (alternating)                                 */
/* ------------------------------------------------------------------ */

function FeatureSection({
  id,
  eyebrow,
  title,
  body,
  visual,
  flip = false,
  children,
}: {
  id?: string
  eyebrow: string
  title: string
  body: string
  visual: ReactNode
  flip?: boolean
  children?: ReactNode
}) {
  return (
    <section id={id} className="relative px-5 py-16 md:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className={flip ? 'lg:order-2' : ''}>
          <div className="max-w-xl">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-[40px] sm:leading-[1.1]">
              {title}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-muted">{body}</p>
            {children}
          </div>
        </Reveal>
        <Reveal delay={120} className={flip ? 'lg:order-1' : ''}>
          {visual}
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Feature 1 — cross-model session                                     */
/* ------------------------------------------------------------------ */

function CrossModelVisual() {
  return (
    <WindowChrome title="Progress Store — session handoff" accent="#6fe0ff">
      <div className="p-5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3">
          {/* Claude */}
          <div className="rounded-xl border border-hairline bg-ink-2/70 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-[#d97757] text-[11px] font-bold text-white">C</span>
              <span className="text-[12.5px] font-semibold">Claude</span>
              <span className="ml-auto font-mono text-[9px] text-muted">ended</span>
            </div>
            <div className="space-y-2 font-mono text-[10px] text-muted">
              <div className="rounded-md bg-white/[0.03] px-2 py-1.5">edited Revit slabs</div>
              <div className="rounded-md bg-white/[0.03] px-2 py-1.5">takeoff → 312 m³</div>
            </div>
          </div>
          {/* arrow / store */}
          <div className="flex flex-col items-center justify-center px-1">
            <svg viewBox="0 0 40 120" className="h-full w-9" aria-hidden>
              <line x1="20" y1="0" x2="20" y2="120" stroke="#6fe0ff" strokeWidth="1.4" strokeDasharray="4 4" opacity="0.6" style={{ animation: 'dash-flow 1.2s linear infinite' }} />
              <circle cx="20" cy="60" r="12" fill="rgba(111,224,255,0.14)" stroke="#6fe0ff" strokeWidth="1.2" />
            </svg>
            <span className="mt-1 font-mono text-[8px] text-cyan">store</span>
          </div>
          {/* GPT */}
          <div className="rounded-xl border border-violet/30 bg-violet/[0.08] p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-[#10a37f] text-[11px] font-bold text-white">G</span>
              <span className="text-[12.5px] font-semibold">GPT</span>
              <span className="ml-auto font-mono text-[9px] text-violet-bright">continuing</span>
            </div>
            <div className="space-y-2 font-mono text-[10px]">
              <div className="rounded-md border border-violet/25 bg-violet/10 px-2 py-1.5 text-text">loaded project state</div>
              <div className="rounded-md bg-white/[0.03] px-2 py-1.5 text-muted">resuming takeoff…</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-hairline bg-white/[0.02] px-3.5 py-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_1px_var(--color-cyan)]" />
          <span className="font-mono text-[10.5px] text-muted">
            progress stored separately from the conversation — no restart from
            zero
          </span>
        </div>
      </div>
    </WindowChrome>
  )
}

/* ------------------------------------------------------------------ */
/* Feature 2 — model row                                               */
/* ------------------------------------------------------------------ */

const models = [
  { name: 'Claude', glyph: 'C', tint: '#d97757' },
  { name: 'GPT', glyph: 'G', tint: '#10a37f' },
  { name: 'GLM', glyph: 'Z', tint: '#3a86ff' },
  { name: 'DeepSeek', glyph: 'D', tint: '#7c5cff' },
]

function ModelRowVisual() {
  return (
    <div className="rounded-2xl border border-hairline bg-surface/70 p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
      <div className="grid grid-cols-4 gap-3">
        {models.map((m, i) => (
          <div key={m.name} className="text-center">
            <div
              className="mx-auto grid h-14 w-14 place-items-center rounded-2xl text-[18px] font-bold text-white"
              style={{ background: m.tint, boxShadow: `0 12px 30px -12px ${m.tint}` }}
            >
              {m.glyph}
            </div>
            <div className="mt-2 text-[12px] font-semibold">{m.name}</div>
            {i < models.length - 1 && (
              <div className="pointer-events-none absolute" aria-hidden />
            )}
          </div>
        ))}
      </div>
      {/* shared project-state layer */}
      <div className="relative mt-5">
        <svg viewBox="0 0 400 24" className="h-6 w-full" preserveAspectRatio="none" aria-hidden>
          {[50, 150, 250, 350].map((x) => (
            <line key={x} x1={x} y1="0" x2="200" y2="24" stroke="#8b6bff" strokeWidth="1" opacity="0.35" />
          ))}
        </svg>
      </div>
      <div className="rounded-xl border border-violet/25 bg-violet/[0.08] px-4 py-3 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-violet-bright">
          Shared project-state layer
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Feature 3 — connectors                                              */
/* ------------------------------------------------------------------ */

const mailtoHref =
  'mailto:?subject=' +
  encodeURIComponent('AiConnect connector request') +
  '&body=' +
  encodeURIComponent(
    'Software requested:\nWhy I need it:\nMy industry:\nOptional details:\n',
  )

function ConnectorGridVisual() {
  return (
    <div className="rounded-2xl border border-hairline bg-surface/70 p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ecosystem.map((e) => (
          <div
            key={e.label}
            className="group flex items-center gap-3 rounded-xl border border-hairline bg-white/[0.02] px-3.5 py-3 transition-colors hover:border-violet/40 hover:bg-white/[0.05]"
          >
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[13px] font-bold text-white"
              style={{ background: e.tint }}
            >
              {e.glyph}
            </span>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold">{e.label}</div>
              <div className="font-mono text-[9px] text-muted">connector</div>
            </div>
          </div>
        ))}
        <a
          href={mailtoHref}
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-violet/40 bg-violet/[0.05] px-3.5 py-3 text-[13px] font-semibold text-violet-bright transition-colors hover:bg-violet/10"
        >
          <span className="text-lg leading-none">+</span> Request a connector
        </a>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Feature 4 — skills showcase                                         */
/* ------------------------------------------------------------------ */

const skills = [
  { name: 'Engineering Progress Report', tag: 'Reporting' },
  { name: 'Quantity Takeoff', tag: 'BIM' },
  { name: 'Site Analysis', tag: 'GIS' },
  { name: 'BIM Review', tag: 'BIM' },
  { name: 'GIS Analysis', tag: 'Geospatial' },
  { name: 'Project Handover', tag: 'Workflow' },
]

function SkillShowcaseVisual() {
  return (
    <WindowChrome title="AiConnect — Skills" accent="#a78bff">
      <div className="relative p-5">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(139,107,255,0.12) 1px, transparent 1.4px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="relative grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {skills.map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between rounded-xl border border-hairline bg-ink-2/70 px-3.5 py-3 transition-colors hover:border-violet/40"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet/15">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-violet-bright" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
                  </svg>
                </span>
                <span className="text-[12.5px] font-semibold">{s.name}</span>
              </div>
              <span className="rounded-full bg-white/[0.05] px-2 py-0.5 font-mono text-[9px] text-muted">
                {s.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </WindowChrome>
  )
}

/* ------------------------------------------------------------------ */
/* Feature 5 — guides                                                  */
/* ------------------------------------------------------------------ */

const guideSteps = [
  'Overview',
  'Requirements',
  'Install',
  'Connect',
  'Example prompts',
  'Recommended workflows',
  'Troubleshooting',
]

function GuideShowcaseVisual() {
  return (
    <WindowChrome title="Connector guide — Revit" accent="#6fe0ff">
      <div className="grid grid-cols-[130px_1fr]">
        <div className="border-r border-hairline bg-white/[0.02] p-3">
          {guideSteps.map((g, i) => (
            <div
              key={g}
              className={`rounded-lg px-2.5 py-2 text-[11px] font-medium ${
                i === 3 ? 'bg-violet/15 text-violet-bright' : 'text-muted'
              }`}
            >
              {g}
            </div>
          ))}
        </div>
        <div className="p-5">
          <h4 className="text-[15px] font-bold">Connect the Revit connector</h4>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">
            Link AiConnect to your running Revit session so your AI agent can
            read and edit the active model.
          </p>
          <ol className="mt-4 space-y-2.5">
            {['Open Revit and load your project', 'Enable the AiConnect add-in', 'Approve the secure local link'].map(
              (step, i) => (
                <li key={step} className="flex items-start gap-3 text-[12px]">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-violet/40 font-mono text-[10px] text-violet-bright">
                    {i + 1}
                  </span>
                  <span className="text-muted">{step}</span>
                </li>
              ),
            )}
          </ol>
          <div className="mt-4 rounded-xl border border-hairline bg-ink-2/70 p-3 font-mono text-[10.5px] text-muted">
            <span className="text-cyan">prompt&gt;</span> “Generate a slab quantity
            takeoff for Level 2 and export to Excel.”
          </div>
        </div>
      </div>
    </WindowChrome>
  )
}

/* ------------------------------------------------------------------ */
/* Final value diagram                                                 */
/* ------------------------------------------------------------------ */

function ValueDiagram() {
  const Node = ({ label, tint }: { label: string; tint?: string }) => (
    <div
      className="rounded-xl border border-hairline bg-surface/80 px-4 py-2.5 text-[13px] font-semibold shadow-[0_16px_40px_-24px_rgba(0,0,0,0.9)]"
      style={tint ? { borderColor: tint, boxShadow: `0 16px 40px -24px ${tint}` } : undefined}
    >
      {label}
    </div>
  )
  const Connector = () => (
    <div className="mx-auto my-2 h-6 w-px bg-gradient-to-b from-violet/60 to-transparent" />
  )
  return (
    <div className="mx-auto mt-14 max-w-2xl text-center">
      <div className="inline-block"><Node label="PROJECT" tint="#a78bff" /></div>
      <Connector />
      <div className="flex flex-wrap items-center justify-center gap-3">
        {models.slice(0, 3).map((m) => (
          <Node key={m.name} label={m.name} />
        ))}
      </div>
      <Connector />
      <div className="inline-flex items-center gap-2 rounded-xl border border-violet/40 bg-violet/[0.1] px-5 py-3">
        <BrandMark size={22} />
      </div>
      <Connector />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Node label="Revit" />
        <Node label="QGIS" />
        <Node label="Excel" />
      </div>
      <Connector />
      <div className="inline-block"><Node label="Progress" tint="#6fe0ff" /></div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

const pricingIncludes = [
  'Full connector library',
  'Cross-model Progress Store',
  'Reusable engineering skills',
  'Complete connector guides',
  'Windows, macOS & Linux app',
]

function Pricing() {
  return (
    <section id="pricing" className="relative px-5 py-24 md:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <Eyebrow>Pricing</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
            One simple plan.
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
            Everything AiConnect offers, for one flat price. Start with a 7-day
            free trial.
          </p>
        </Reveal>
      </div>

      <Reveal delay={180}>
        <div className="relative mx-auto mt-12 max-w-md">
          <div
            className="animate-breathe pointer-events-none absolute -inset-6 -z-10 blur-3xl"
            style={{
              background:
                'radial-gradient(60% 60% at 50% 40%, rgba(139,107,255,0.35), transparent 70%)',
            }}
          />
          <div className="rounded-3xl border border-violet/30 bg-surface/80 p-8 shadow-[0_40px_100px_-40px_rgba(139,107,255,0.6)] backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet-bright">
                AiConnect Pro
              </span>
              <span className="rounded-full bg-violet/15 px-3 py-1 font-mono text-[10px] text-violet-bright">
                7-day free trial
              </span>
            </div>
            <div className="mt-6 flex items-end gap-1.5">
              <span className="text-6xl font-extrabold tracking-tight">$1</span>
              <span className="mb-2 text-[16px] font-medium text-muted">/ month</span>
            </div>
            <p className="mt-2 text-[13px] text-muted">Billed monthly. Cancel anytime.</p>

            <ul className="mt-7 space-y-3 text-left">
              {pricingIncludes.map((f) => (
                <li key={f} className="flex items-center gap-3 text-[14px]">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet/20">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 text-violet-bright" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="m5 12 5 5 9-11" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-muted">{f}</span>
                </li>
              ))}
            </ul>

            <a
              href="#download"
              className="mt-8 block rounded-xl px-5 py-3.5 text-center text-[15px] font-semibold text-white shadow-[0_12px_40px_-12px_rgba(139,107,255,0.9)] transition-transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#a78bff,#5b8cff)' }}
            >
              Start free trial
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                           */
/* ------------------------------------------------------------------ */

function FinalCTA() {
  return (
    <section id="download" className="relative overflow-hidden px-5 py-28 md:px-8">
      <div
        className="animate-breathe pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(55% 60% at 50% 50%, rgba(139,107,255,0.28), transparent 65%), radial-gradient(40% 50% at 70% 40%, rgba(111,224,255,0.14), transparent 65%)',
        }}
      />
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Start building with AI today.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto mt-5 max-w-xl text-[18px] leading-relaxed text-muted">
            Connect your tools. Keep your progress. Continue with the AI model
            that works best for you.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <DownloadButton os="macOS" variant="primary" />
            <DownloadButton os="Windows" />
            <DownloadButton os="Linux" />
          </div>
          <p className="mt-4 font-mono text-[12px] text-muted">7-day free trial</p>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  const cols: { title: string; links: string[] }[] = [
    { title: 'Product', links: ['Download', 'Connectors', 'Skills', 'Guides', 'Pricing'] },
    { title: 'Developer', links: ['LinkedIn', 'GitHub', 'Instagram'] },
    { title: 'Legal', links: ['Terms', 'Privacy', 'Licenses'] },
  ]
  return (
    <footer className="border-t border-hairline bg-ink-2/60 px-5 py-14 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted">
            Connect AI agents to the software that does the real work — and keep
            your progress across models.
          </p>
          <a
            href="#"
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-hairline bg-white/[0.03] px-4 py-2.5 text-[13px] font-semibold text-text transition-colors hover:border-violet/50 hover:bg-white/[0.06]"
          >
            <span className="text-violet-bright">♥</span> Support development
          </a>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              {c.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-[14px] text-muted transition-colors hover:text-text"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-hairline pt-6 text-[12px] text-muted sm:flex-row">
        <span>© 2026 AiConnect. All rights reserved.</span>
        <span className="font-mono">Works with compatible AI agents and models.</span>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  return (
    <div id="top" className="min-h-screen bg-ink text-text">
      <Header />
      <main>
        <Hero />
        <EcosystemStrip />
        <WorkWithAI />

        <FeatureSection
          id="connectors"
          eyebrow="Cross-model continuity"
          title="Continue where another AI stopped."
          body="Your project progress is stored separately from the AI conversation, so another model can pick up the work without starting from zero. We call it the Progress Store."
          visual={<CrossModelVisual />}
        />

        <FeatureSection
          eyebrow="Model choice"
          title="Use the AI model that fits the task."
          body="Switch between AI models without losing the project context that matters. AiConnect isn't owned by one AI company — it works with compatible AI agents and models."
          visual={<ModelRowVisual />}
          flip
        />

        <FeatureSection
          eyebrow="Connectors"
          title="Give AI access to the software that does the real work."
          body="Connect engineering software through an expanding connector library — BIM, CAD, GIS, photogrammetry, spreadsheets, and documents. Missing something you need?"
          visual={<ConnectorGridVisual />}
        >
          <a
            href={mailtoHref}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-hairline bg-white/[0.03] px-4 py-2.5 text-[14px] font-semibold text-text transition-colors hover:border-violet/50 hover:bg-white/[0.06]"
          >
            Request a connector →
          </a>
        </FeatureSection>

        <FeatureSection
          id="skills"
          eyebrow="Engineering skills"
          title="Skills built for real engineering work."
          body="Connectors are only part of the system. AiConnect also provides reusable workflows for the tasks you do repeatedly — download a guided workflow and let your agent run it."
          visual={<SkillShowcaseVisual />}
          flip
        />

        <FeatureSection
          id="guides"
          eyebrow="Complete guides"
          title="Know what to do, not just what to click."
          body="Every connector comes with guidance so anyone can understand how to work with the software through AI — no need to be an AI specialist to get started."
          visual={<GuideShowcaseVisual />}
        />

        <section className="relative px-5 py-24 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <Eyebrow>The whole system</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
                One project. Many tools. Any AI.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <ValueDiagram />
            </Reveal>
          </div>
        </section>

        <Pricing />

        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
