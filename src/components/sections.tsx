import type { ReactNode } from 'react'
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

export function ValueDiagram() {
  const ACCENT = '#3b82f6'
  const Node = ({ label, primary = false }: { label: string; primary?: boolean }) => (
    <div
      className={`rounded-2xl border-2 px-6 py-3.5 text-[15px] font-bold tracking-wide shadow-lg transition-all duration-200 hover:scale-105 ${primary ? 'node-glow' : ''}`}
      style={{
        borderColor: primary ? ACCENT : 'rgba(255,255,255,0.15)',
        background: primary ? `${ACCENT}22` : 'rgba(255,255,255,0.05)',
        color: primary ? ACCENT : '#e2e4f0',
        boxShadow: primary ? `0 0 24px -4px ${ACCENT}50` : '0 4px 24px rgba(0,0,0,0.6)',
      }}
    >
      {label}
    </div>
  )
  const Connector = ({ delay = 0 }: { delay?: number }) => (
    <div className="mx-auto my-1.5 flex flex-col items-center">
      <svg viewBox="0 0 2 28" className="h-7 w-1 path-draw" style={{ animationDelay: `${delay}ms` }}>
        <line x1="1" y1="0" x2="1" y2="22" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      </svg>
      <svg viewBox="0 0 8 6" className="h-2 w-2 path-draw" style={{ animationDelay: `${delay + 200}ms` }} fill={ACCENT}>
        <path d="M4 6L0 0h8z" />
      </svg>
    </div>
  )
  return (
    <div className="mx-auto mt-14 max-w-2xl text-center">
      <div className="inline-block"><Node label="PROJECT" primary /></div>
      <Connector delay={100} />
      <div className="flex flex-wrap items-center justify-center gap-4">
        {models.slice(0, 3).map((m) => (
          <Node key={m.name} label={m.name} />
        ))}
      </div>
      <Connector delay={300} />
      <div className="inline-flex items-center gap-2.5 rounded-2xl border-2 px-7 py-3.5 shadow-lg" style={{ borderColor: `${ACCENT}88`, background: `${ACCENT}18`, boxShadow: `0 0 28px -4px ${ACCENT}50` }}>
        <BrandMark size={24} />
      </div>
      <Connector delay={500} />
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Node label="Revit" />
        <Node label="QGIS" />
        <Node label="Excel" />
      </div>
      <Connector delay={700} />
      <div className="inline-block"><Node label="Progress" primary /></div>
    </div>
  )
}

export { CrossModelVisual, ModelRowVisual, ConnectorGridVisual, SkillShowcaseVisual, GuideShowcaseVisual }
