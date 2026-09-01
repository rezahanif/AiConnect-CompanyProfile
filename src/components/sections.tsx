import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ecosystem, guideSteps, mailtoHref, models, skills } from '../data'
import { BrandMark, Eyebrow, LogoChip, Reveal, WindowChrome } from './ui'

export function EcosystemStrip() {
  const items = [...ecosystem, ...ecosystem]
  return (
    <section className="relative px-5 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-center font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
          9 engineering connectors and growing
        </p>
        <div className="relative mt-8 overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-x-10 hover:[animation-play-state:paused]">
            {items.map((e, i) => (
              <LogoChip key={`${e.label}-${i}`} {...e} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function WorkWithAI() {
  return (
    <section className="relative px-5 py-24 md:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <Eyebrow>Direct software access</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Work with AI, not around it.
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-center text-muted">
            AiConnect gives AI agents a bridge into the tools professionals
            already use — from BIM and CAD to GIS, photogrammetry, spreadsheets,
            and documents. Your agent operates against real software instead of
            producing tutorials.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* Feature section shell (alternating) --------------------------------- */

export function FeatureSection({
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
    <section id={id} className="scroll-fade-in relative px-5 py-16 md:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={flip ? 'lg:order-2' : ''}>
          <div className="max-w-xl">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight transition-colors duration-200 hover:text-violet-bright sm:text-[40px] sm:leading-[1.1]">
              {title}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-justify text-muted">{body}</p>
            {children}
          </div>
        </div>
        <div className={flip ? 'lg:order-1' : ''}>
          {visual}
        </div>
      </div>
    </section>
  )
}

/* Feature 1 — cross-model session ------------------------------------- */

function CrossModelVisual() {
  return (
    <WindowChrome title="Progress Store — session handoff" accent="#3b82f6">
      <div className="p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
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
          {/* arrow / store — vertical on md+, horizontal on mobile */}
          <div className="hidden md:flex flex-col items-center justify-center px-1">
            <svg viewBox="0 0 40 120" className="h-full w-9" aria-hidden>
              <line x1="20" y1="0" x2="20" y2="120" stroke="#3b82f6" strokeWidth="1.4" strokeDasharray="4 4" opacity="0.6" style={{ animation: 'dash-flow 1.2s linear infinite' }} />
              <circle cx="20" cy="60" r="12" fill="rgba(59,130,246,0.14)" stroke="#3b82f6" strokeWidth="1.2" />
            </svg>
            <span className="mt-1 font-mono text-[8px] text-cyan">store</span>
          </div>
          <div className="flex md:hidden items-center justify-center gap-2 py-2">
            <svg viewBox="0 0 120 40" className="w-20 h-5" aria-hidden>
              <line x1="0" y1="20" x2="120" y2="20" stroke="#3b82f6" strokeWidth="1.4" strokeDasharray="4 4" opacity="0.6" style={{ animation: 'dash-flow 1.2s linear infinite' }} />
              <circle cx="60" cy="20" r="12" fill="rgba(59,130,246,0.14)" stroke="#3b82f6" strokeWidth="1.2" />
            </svg>
            <span className="font-mono text-[8px] text-cyan">store</span>
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

/* Feature 2 — model row ------------------------------------------------ */

function ModelRowVisual() {
  return (
    <div className="rounded-2xl border border-hairline bg-surface/70 p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
      <div className="grid grid-cols-4 gap-3">
        {models.map((m) => (
          <div key={m.name} className="text-center">
            <div
              className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border-2 bg-white/[0.04] backdrop-blur-sm transition-all duration-200 hover:scale-110"
              style={{ borderColor: `${m.tint}66`, boxShadow: `0 12px 30px -12px ${m.tint}` }}
            >
              <img src={m.logo} alt={m.name} className="h-10 w-10 object-contain" />
            </div>
            <div className="mt-2.5 text-[12px] font-semibold">{m.name}</div>
          </div>
        ))}
      </div>

      {/* Animated Branched Bus Tree Lines */}
      <div className="relative my-2">
        <svg viewBox="0 0 400 44" className="h-11 w-full" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="treeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Base Static Circuit Track */}
          <path
            d="M 50 20 L 350 20"
            stroke="rgba(59,130,246,0.3)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <line x1="50" y1="0" x2="50" y2="20" stroke="rgba(59,130,246,0.3)" strokeWidth="2" strokeLinecap="round" />
          <line x1="150" y1="0" x2="150" y2="20" stroke="rgba(59,130,246,0.3)" strokeWidth="2" strokeLinecap="round" />
          <line x1="250" y1="0" x2="250" y2="20" stroke="rgba(59,130,246,0.3)" strokeWidth="2" strokeLinecap="round" />
          <line x1="350" y1="0" x2="350" y2="20" stroke="rgba(59,130,246,0.3)" strokeWidth="2" strokeLinecap="round" />
          <line x1="200" y1="20" x2="200" y2="44" stroke="rgba(59,130,246,0.3)" strokeWidth="2" strokeLinecap="round" />

          {/* 2. Animated Flow Streams Converging to Center */}
          <path
            d="M 50 0 L 50 20 L 200 20 L 200 44"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
            style={{ animation: 'dash-flow 1.2s linear infinite' }}
          />
          <path
            d="M 150 0 L 150 20 L 200 20 L 200 44"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
            style={{ animation: 'dash-flow 1.2s linear infinite' }}
          />
          <path
            d="M 250 0 L 250 20 L 200 20 L 200 44"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
            style={{ animation: 'dash-flow 1.2s linear infinite' }}
          />
          <path
            d="M 350 0 L 350 20 L 200 20 L 200 44"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
            style={{ animation: 'dash-flow 1.2s linear infinite' }}
          />

          {/* 3. Junction Nodes with Glow */}
          <circle cx="50" cy="20" r="3" fill="#3b82f6" />
          <circle cx="150" cy="20" r="3" fill="#3b82f6" />
          <circle cx="250" cy="20" r="3" fill="#3b82f6" />
          <circle cx="350" cy="20" r="3" fill="#3b82f6" />
          
          {/* Central Convergence Hub Node */}
          <circle cx="200" cy="20" r="4.5" fill="#60a5fa" filter="url(#glow)" />
          <circle cx="200" cy="20" r="2.5" fill="#ffffff" />

          {/* Bottom Arrow pointing into state layer */}
          <polygon points="196,40 204,40 200,44" fill="#60a5fa" />
        </svg>
      </div>

      <div className="rounded-xl border border-violet/30 bg-violet/[0.08] px-4 py-3.5 text-center shadow-[0_0_24px_rgba(59,130,246,0.2)]">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-bright">
          Shared project-state layer
        </span>
      </div>
    </div>
  )
}

/* Feature 3 — connectors ----------------------------------------------- */

function ConnectorGridVisual() {
  return (
    <div className="rounded-2xl border border-hairline bg-surface/70 p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ecosystem.map((e, i) => (
          <div
            key={e.label}
            className="group connector-card flex items-center gap-3 rounded-xl border border-hairline bg-white/[0.02] px-3.5 py-3 transition-all duration-200 hover:border-violet/40 hover:bg-white/[0.05]"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.06]"
            >
              {e.logo
                ? <img src={e.logo} alt={e.label} className="h-7 w-7 object-contain" />
                : <span className="text-[13px] font-bold text-white" style={{ background: e.tint }}>{e.glyph}</span>
              }
            </span>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold">{e.label}</div>
              <div className="font-mono text-[9px] text-muted">connector</div>
            </div>
          </div>
        ))}
        <a
          href={mailtoHref}
          className="connector-card flex items-center justify-center gap-2 rounded-xl border border-solid border-violet/60 bg-violet/15 px-3.5 py-3 text-[13px] font-semibold text-violet-bright transition-all duration-200 hover:bg-violet/25 hover:border-violet/80"
          style={{ animationDelay: `${ecosystem.length * 50}ms` }}
        >
          <span className="text-lg leading-none">+</span> Request a connector
        </a>
      </div>
    </div>
  )
}

/* Feature 4 — skills showcase ------------------------------------------- */

function SkillShowcaseVisual() {
  return (
    <WindowChrome title="AiConnect — Skills" accent="#3b82f6">
      <div className="relative p-5">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(59,130,246,0.12) 1px, transparent 1.4px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="relative grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {skills.map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between rounded-xl border border-hairline bg-ink-2/70 px-3.5 py-3 transition-all duration-200 hover:border-violet/40 hover:bg-ink-2/90"
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

/* Feature 5 — guides ----------------------------------------------------- */

function GuideShowcaseVisual() {
  return (
    <WindowChrome title="Connector guide — Revit" accent="#3b82f6">
      <div className="grid grid-cols-[130px_1fr]">
        <div className="border-r border-hairline bg-white/[0.02] p-3">
          {guideSteps.map((g, i) => (
            <div
              key={g}
              className={`rounded-lg px-2.5 py-2 text-[11px] font-medium ${i === 3 ? 'bg-violet/15 text-violet-bright' : 'text-muted'
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

/* Final value diagram ------------------------------------------------------ */

interface NodeRect { cx: number; cy: number; w: number; h: number }

interface TimelineEntry {
  start: number
  end: number
  activate: string[]
}

const TIMELINE: TimelineEntry[] = [
  { start: 0, end: 600, activate: ['project'] },
  { start: 600, end: 1200, activate: ['model-0'] },
  { start: 750, end: 1350, activate: ['model-1'] },
  { start: 900, end: 1500, activate: ['model-2'] },
  { start: 1500, end: 2200, activate: ['aiconnect'] },
  { start: 2200, end: 2800, activate: ['tool-0'] },
  { start: 2350, end: 2950, activate: ['tool-1'] },
  { start: 2500, end: 3100, activate: ['tool-2'] },
  { start: 3100, end: 3800, activate: ['progress'] },
]

interface Segment {
  path: string
  start: number
  end: number
}

const CYCLE = 4500
const PAUSE = 1200
const NODE_BG = '#0a0e18'

const bottomOf = (r: NodeRect) => ({ x: r.cx, y: r.cy + r.h / 2 })
const topOf = (r: NodeRect) => ({ x: r.cx, y: r.cy - r.h / 2 })

export function ValueDiagram() {
  const ACCENT = '#3b82f6'
  const [rects, setRects] = useState<Record<string, NodeRect>>({})
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set())
  const [w, setW] = useState(0)
  const [h, setH] = useState(0)
  const [measured, setMeasured] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [packetPos, setPacketPos] = useState<{ x: number; y: number } | null>(null)
  const [packetOpacity, setPacketOpacity] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const projectRef = useRef<HTMLDivElement>(null)
  const modelRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]
  const aiconnectRef = useRef<HTMLDivElement>(null)
  const toolRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]
  const progressRef = useRef<HTMLDivElement>(null)
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const fullPathRef = useRef<SVGPathElement | null>(null)
  const segmentsRef = useRef<Segment[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setW(entry.contentRect.width)
      setH(entry.contentRect.height)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (w === 0 || h === 0) return
    const container = containerRef.current
    if (!container) return
    const cr = container.getBoundingClientRect()
    const out: Record<string, NodeRect> = {}
    const allRefs = [
      { id: 'project', ref: projectRef },
      ...modelRefs.map((ref, i) => ({ id: `model-${i}`, ref })),
      { id: 'aiconnect', ref: aiconnectRef },
      ...toolRefs.map((ref, i) => ({ id: `tool-${i}`, ref })),
      { id: 'progress', ref: progressRef },
    ]
    for (const { id, ref } of allRefs) {
      const el = ref.current
      if (el) {
        const r = el.getBoundingClientRect()
        out[id] = { cx: r.left - cr.left + r.width / 2, cy: r.top - cr.top + r.height / 2, w: r.width, h: r.height }
      }
    }
    setRects(out)
    setMeasured(true)
  }, [w, h])

  useEffect(() => {
    if (reducedMotion || !measured) return
    let start = 0

    const tick = (now: number) => {
      if (start === 0) start = now
      const elapsed = (now - start) % (CYCLE + PAUSE)
      const inPause = elapsed >= CYCLE

      if (inPause) {
        setActiveNodes(new Set())
        setPacketPos(null)
        setPacketOpacity(0)
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const t = elapsed

      const nodes = new Set<string>()
      for (const entry of TIMELINE) {
        if (t >= entry.start && t < entry.end) {
          for (const id of entry.activate) nodes.add(id)
        }
      }
      setActiveNodes(nodes)

      const fp = fullPathRef.current
      if (fp) {
        const len = fp.getTotalLength()
        const progress = Math.min(t / CYCLE, 1)
        const pt = fp.getPointAtLength(progress * len)
        setPacketPos({ x: pt.x, y: pt.y })
        const fadeIn = Math.min(t / 300, 1)
        const fadeOut = Math.max(1 - (t - (CYCLE - 500)) / 500, 0)
        setPacketOpacity(t > CYCLE - 500 ? fadeOut : fadeIn)
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [reducedMotion, measured])

  const buildSegments = (): Segment[] => {
    const p = rects
    if (!p.project || !p.aiconnect || !p.progress) return []

    const projBot = bottomOf(p.project)
    const modTop = [0, 1, 2].map(i => topOf(p[`model-${i}`]))
    const modBot = [0, 1, 2].map(i => bottomOf(p[`model-${i}`]))
    const aiTop = topOf(p.aiconnect)
    const aiBot = bottomOf(p.aiconnect)
    const toolTop = [0, 1, 2].map(i => topOf(p[`tool-${i}`]))
    const toolBot = [0, 1, 2].map(i => bottomOf(p[`tool-${i}`]))
    const progTop = topOf(p.progress)

    const branchY1 = (projBot.y + modTop[0].y) / 2
    const convergeY1 = (modBot[0].y + aiTop.y) / 2
    const branchY2 = (aiBot.y + toolTop[0].y) / 2
    const convergeY2 = (toolBot[0].y + progTop.y) / 2

    const segments: Segment[] = []

    // ── Full trunk path (single packet route through center) ──
    const fullD = [
      `M${projBot.x},${projBot.y}`,
      `L${projBot.x},${branchY1}`,
      `L${modTop[1].x},${branchY1}`,
      `L${modTop[1].x},${modTop[1].y}`,
      `L${modBot[1].x},${modBot[1].y}`,
      `L${modBot[1].x},${convergeY1}`,
      `L${aiTop.x},${convergeY1}`,
      `L${aiTop.x},${aiTop.y}`,
      `L${aiBot.x},${aiBot.y}`,
      `L${aiBot.x},${branchY2}`,
      `L${toolTop[1].x},${branchY2}`,
      `L${toolTop[1].x},${toolTop[1].y}`,
      `L${toolBot[1].x},${toolBot[1].y}`,
      `L${toolBot[1].x},${convergeY2}`,
      `L${progTop.x},${convergeY2}`,
      `L${progTop.x},${progTop.y}`,
    ].join(' ')

    // ── Phase 1: Project bottom → branch ──
    segments.push({ path: `M${projBot.x},${projBot.y}L${projBot.x},${branchY1}`, start: 0, end: 600 })

    // ── Phase 2: Branch → top of each AI model ──
    segments.push({ path: `M${projBot.x},${branchY1}L${modTop[0].x},${branchY1}L${modTop[0].x},${modTop[0].y}`, start: 600, end: 1200 })
    segments.push({ path: `M${projBot.x},${branchY1}L${modTop[1].x},${branchY1}L${modTop[1].x},${modTop[1].y}`, start: 750, end: 1350 })
    segments.push({ path: `M${projBot.x},${branchY1}L${modTop[2].x},${branchY1}L${modTop[2].x},${modTop[2].y}`, start: 900, end: 1500 })

    // ── Phase 3: Bottom of each AI model → converge → top of AiConnect ──
    segments.push({ path: `M${modBot[0].x},${modBot[0].y}L${modBot[0].x},${convergeY1}L${aiTop.x},${convergeY1}`, start: 1500, end: 2200 })
    segments.push({ path: `M${modBot[1].x},${modBot[1].y}L${modBot[1].x},${convergeY1}L${aiTop.x},${convergeY1}`, start: 1500, end: 2200 })
    segments.push({ path: `M${modBot[2].x},${modBot[2].y}L${modBot[2].x},${convergeY1}L${aiTop.x},${convergeY1}`, start: 1500, end: 2200 })
    segments.push({ path: `M${aiTop.x},${convergeY1}L${aiTop.x},${aiTop.y}`, start: 2000, end: 2200 })

    // ── Phase 4: AiConnect bottom → branch ──
    segments.push({ path: `M${aiBot.x},${aiBot.y}L${aiBot.x},${branchY2}`, start: 2200, end: 2800 })

    // ── Phase 5: Branch → top of each tool ──
    segments.push({ path: `M${aiBot.x},${branchY2}L${toolTop[0].x},${branchY2}L${toolTop[0].x},${toolTop[0].y}`, start: 2200, end: 2800 })
    segments.push({ path: `M${aiBot.x},${branchY2}L${toolTop[1].x},${branchY2}L${toolTop[1].x},${toolTop[1].y}`, start: 2350, end: 2950 })
    segments.push({ path: `M${aiBot.x},${branchY2}L${toolTop[2].x},${branchY2}L${toolTop[2].x},${toolTop[2].y}`, start: 2500, end: 3100 })

    // ── Phase 6: Bottom of each tool → converge → top of Progress ──
    segments.push({ path: `M${toolBot[0].x},${toolBot[0].y}L${toolBot[0].x},${convergeY2}L${progTop.x},${convergeY2}`, start: 3100, end: 3800 })
    segments.push({ path: `M${toolBot[1].x},${toolBot[1].y}L${toolBot[1].x},${convergeY2}L${progTop.x},${convergeY2}`, start: 3100, end: 3800 })
    segments.push({ path: `M${toolBot[2].x},${toolBot[2].y}L${toolBot[2].x},${convergeY2}L${progTop.x},${convergeY2}`, start: 3100, end: 3800 })
    segments.push({ path: `M${progTop.x},${convergeY2}L${progTop.x},${progTop.y}`, start: 3600, end: 3800 })

    return [{ path: fullD, start: 0, end: CYCLE }, ...segments.slice(1)]
  }

  const segments = measured ? buildSegments() : []
  segmentsRef.current = segments

  const fullPathD = segments.length > 0 ? segments[0].path : ''

  const nodeStyle = (id: string, primary = false): React.CSSProperties => {
    const active = activeNodes.has(id)
    if (active) {
      return primary
        ? { borderColor: '#3b82f6', background: NODE_BG, boxShadow: '0 0 28px -2px rgba(59,130,246,0.55)' }
        : { borderColor: 'rgba(59,130,246,0.55)', background: NODE_BG, boxShadow: '0 0 18px -2px rgba(59,130,246,0.35)' }
    }
    return primary
      ? { borderColor: 'rgba(255,255,255,0.15)', background: NODE_BG, boxShadow: '0 4px 24px rgba(0,0,0,0.6)' }
      : { borderColor: 'rgba(255,255,255,0.15)', background: NODE_BG, boxShadow: '0 4px 24px rgba(0,0,0,0.6)' }
  }

  return (
    <div ref={containerRef} className="relative mx-auto mt-14 max-w-2xl text-center">
      {/* Ambient glow behind the flowchart */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '120%',
          height: '120%',
          background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.03) 40%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      {measured && w > 0 && h > 0 && (
        <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="pointer-events-none absolute inset-0" preserveAspectRatio="none" style={{ zIndex: 0 }} aria-hidden>
          <defs>
            <filter id="vp-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <radialGradient id="vp-grad">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </radialGradient>
          </defs>

          {segments.slice(1).map((seg, i) => (
            <path key={`bg-${i}`} d={seg.path} stroke={ACCENT} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.1" />
          ))}
          {segments.slice(1).map((seg, i) => (
            <path key={`fg-${i}`} ref={(el) => { pathRefs.current[i] = el }} d={seg.path} stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45" strokeDasharray="6 6" style={{ animation: 'dash-flow 1.2s linear infinite' }} />
          ))}
          {fullPathD && packetPos && packetOpacity > 0 && (
            <g style={{ opacity: packetOpacity }}>
              <circle cx={packetPos.x} cy={packetPos.y} r="8" fill="url(#vp-grad)" opacity="0.3" filter="url(#vp-glow)" />
              <circle cx={packetPos.x} cy={packetPos.y} r="3" fill="#93c5fd" opacity="0.85" />
              <circle cx={packetPos.x} cy={packetPos.y} r="1.5" fill="#dbeafe" opacity="1" />
            </g>
          )}
        </svg>
      )}

      <div className="relative" style={{ zIndex: 1 }}>
        <div className="inline-block" ref={projectRef}>
          <div className="rounded-2xl border-2 px-6 py-3.5 text-[15px] font-bold tracking-wide shadow-lg transition-all duration-300 hover:scale-105" style={nodeStyle('project', true)}>PROJECT</div>
        </div>
        <div className="mx-auto my-1.5 h-5" />
        <div className="flex flex-wrap items-center justify-center gap-4">
          {models.slice(0, 3).map((m, i) => (
            <div key={m.name} ref={modelRefs[i]}>
              <div className="rounded-2xl border-2 px-6 py-3.5 text-[15px] font-bold tracking-wide shadow-lg transition-all duration-300 hover:scale-105" style={nodeStyle(`model-${i}`)}>{m.name}</div>
            </div>
          ))}
        </div>
        <div className="mx-auto my-1.5 h-5" />
        <div className="inline-flex items-center gap-2.5 rounded-2xl border-2 px-7 py-3.5 shadow-lg transition-all duration-300" ref={aiconnectRef} style={nodeStyle('aiconnect')}>
          <BrandMark size={24} />
        </div>
        <div className="mx-auto my-1.5 h-5" />
        <div className="flex flex-wrap items-center justify-center gap-4">
          {['Revit', 'QGIS', 'Excel'].map((label, i) => (
            <div key={label} ref={toolRefs[i]}>
              <div className="rounded-2xl border-2 px-6 py-3.5 text-[15px] font-bold tracking-wide shadow-lg transition-all duration-300 hover:scale-105" style={nodeStyle(`tool-${i}`)}>{label}</div>
            </div>
          ))}
        </div>
        <div className="mx-auto my-1.5 h-5" />
        <div className="inline-block" ref={progressRef}>
          <div className="rounded-2xl border-2 px-6 py-3.5 text-[15px] font-bold tracking-wide shadow-lg transition-all duration-300 hover:scale-105" style={nodeStyle('progress', true)}>Progress</div>
        </div>
      </div>
    </div>
  )
}

export { CrossModelVisual, ModelRowVisual, ConnectorGridVisual, SkillShowcaseVisual, GuideShowcaseVisual }
