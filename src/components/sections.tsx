import type { ReactNode } from 'react'
import { ecosystem, guideSteps, mailtoHref, models, skills } from '../data'
import { BrandMark, Eyebrow, LogoChip, Reveal, WindowChrome } from './ui'

export function EcosystemStrip() {
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

export function WorkWithAI() {
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

/* Feature 1 — cross-model session ------------------------------------- */

function CrossModelVisual() {
  return (
    <WindowChrome title="Progress Store — session handoff" accent="#3b82f6">
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
              <line x1="20" y1="0" x2="20" y2="120" stroke="#3b82f6" strokeWidth="1.4" strokeDasharray="4 4" opacity="0.6" style={{ animation: 'dash-flow 1.2s linear infinite' }} />
              <circle cx="20" cy="60" r="12" fill="rgba(59,130,246,0.14)" stroke="#3b82f6" strokeWidth="1.2" />
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

/* Feature 2 — model row ------------------------------------------------ */

function ModelRowVisual() {
  return (
    <div className="rounded-2xl border border-hairline bg-surface/70 p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
      <div className="grid grid-cols-4 gap-3">
        {models.map((m) => (
          <div key={m.name} className="text-center">
            <div
              className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.06]"
              style={{ boxShadow: `0 12px 30px -12px ${m.tint}` }}
            >
              <img src={m.logo} alt={m.name} className="h-10 w-10 object-contain" />
            </div>
            <div className="mt-2 text-[12px] font-semibold">{m.name}</div>
          </div>
        ))}
      </div>
      {/* shared project-state layer */}
      <div className="relative mt-5">
        <svg viewBox="0 0 400 24" className="h-6 w-full" preserveAspectRatio="none" aria-hidden>
          {[50, 150, 250, 350].map((x) => (
            <line key={x} x1={x} y1="0" x2="200" y2="24" stroke="#3b82f6" strokeWidth="1" opacity="0.35" />
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

/* Feature 3 — connectors ----------------------------------------------- */

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
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-violet/40 bg-violet/[0.05] px-3.5 py-3 text-[13px] font-semibold text-violet-bright transition-colors hover:bg-violet/10"
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

/* Feature 5 — guides ----------------------------------------------------- */

function GuideShowcaseVisual() {
  return (
    <WindowChrome title="Connector guide — Revit" accent="#3b82f6">
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

/* Final value diagram ------------------------------------------------------ */

export function ValueDiagram() {
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
      <div className="inline-block"><Node label="PROJECT" tint="#3b82f6" /></div>
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
      <div className="inline-block"><Node label="Progress" tint="#3b82f6" /></div>
    </div>
  )
}

export { CrossModelVisual, ModelRowVisual, ConnectorGridVisual, SkillShowcaseVisual, GuideShowcaseVisual }
