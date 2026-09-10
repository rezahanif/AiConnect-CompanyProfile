import { ecosystem, models, skills, mailtoHref } from '../data'

export function EcosystemSection() {
  return (
    <section
      id="connectors"
      className="relative z-20 w-full px-6 py-32 sm:px-12 md:px-16 lg:py-44 select-none"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="max-w-2xl scroll-fade-in">
          <p className="text-[13px] font-medium tracking-wide text-sky-300/90">
            Works with what you already use
          </p>
          <h2 className="mt-4 font-sans text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-[-0.03em] text-white leading-[1.02]">
            The tools. The models.
            <br />
            <span className="text-white/40">The workflows.</span>
          </h2>
          <p className="mt-6 max-w-xl text-[15px] sm:text-base leading-relaxed text-white/55">
            Nine engineering connectors, four AI models, six reusable workflows —
            all sharing one project state.
          </p>
        </div>

        {/* Connectors grid card */}
        <div className="mt-16 overflow-hidden rounded-[28px] border border-white/10 bg-[#080c15]/90 backdrop-blur-2xl shadow-[0_30px_90px_-30px_rgba(0,0,0,0.9)]">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] px-7 py-6 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-white">
                9 connectors and growing
              </h3>
              <p className="mt-1.5 text-sm text-white/50">
                BIM, CAD, GIS, photogrammetry, spreadsheets, documents.
              </p>
            </div>
            <a
              href={mailtoHref}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-200 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
            >
              Request a connector →
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 p-7 sm:grid-cols-3 sm:p-10">
            {ecosystem.map((e, i) => (
              <div
                key={e.label}
                className="connector-card flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05]"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/[0.12] bg-[#0a0e17]/85">
                  {e.logo ? (
                    <img src={e.logo} alt={e.label} className="h-6 w-6 object-contain" loading="lazy" />
                  ) : (
                    <span className="text-[13px] font-bold text-white">{e.glyph}</span>
                  )}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">{e.label}</div>
                  <div className="text-[11px] text-white/40">connector</div>
                </div>
              </div>
            ))}
            <a
              href={mailtoHref}
              className="connector-card flex items-center justify-center gap-2 rounded-2xl border border-dashed border-sky-500/40 bg-sky-500/[0.06] px-4 py-3.5 text-sm font-semibold text-sky-300 transition-all duration-200 hover:bg-sky-500/[0.12]"
              style={{ animationDelay: `${ecosystem.length * 50}ms` }}
            >
              <span className="text-lg leading-none">+</span> Request one
            </a>
          </div>
        </div>

        {/* Models + Skills */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Models */}
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-8">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/35">
              4 models supported
            </p>
            <div className="mt-6 flex items-start justify-between gap-2">
              {models.map((m) => (
                <div key={m.name} className="flex flex-1 flex-col items-center text-center">
                  <div
                    className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl border-2 bg-white/[0.04] transition-all duration-200 hover:scale-110 sm:h-16 sm:w-16"
                    style={{ borderColor: `${m.tint}66`, boxShadow: `0 12px 30px -12px ${m.tint}` }}
                  >
                    {m.logo ? (
                      <img src={m.logo} alt={m.name} className="h-9 w-9 object-contain" loading="lazy" />
                    ) : (
                      <span className="text-lg font-bold text-white">{m.glyph}</span>
                    )}
                  </div>
                  <div className="mt-2.5 text-[12px] font-semibold text-white/85">{m.name}</div>
                </div>
              ))}
            </div>

            {/* Circuit bus */}
            <div className="relative my-3" aria-hidden="true">
              <svg viewBox="0 0 400 44" className="h-11 w-full" preserveAspectRatio="none">
                <path d="M 50 20 L 350 20" stroke="rgba(56,189,248,0.3)" strokeWidth="2" strokeLinecap="round" fill="none" />
                <line x1="50" y1="0" x2="50" y2="20" stroke="rgba(56,189,248,0.3)" strokeWidth="2" strokeLinecap="round" />
                <line x1="150" y1="0" x2="150" y2="20" stroke="rgba(56,189,248,0.3)" strokeWidth="2" strokeLinecap="round" />
                <line x1="250" y1="0" x2="250" y2="20" stroke="rgba(56,189,248,0.3)" strokeWidth="2" strokeLinecap="round" />
                <line x1="350" y1="0" x2="350" y2="20" stroke="rgba(56,189,248,0.3)" strokeWidth="2" strokeLinecap="round" />
                <line x1="200" y1="20" x2="200" y2="44" stroke="rgba(56,189,248,0.3)" strokeWidth="2" strokeLinecap="round" />
                {['M 50 0 L 50 20 L 200 20 L 200 44', 'M 150 0 L 150 20 L 200 20 L 200 44', 'M 250 0 L 250 20 L 200 20 L 200 44', 'M 350 0 L 350 20 L 200 20 L 200 44'].map((d) => (
                  <path key={d} d={d} stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 6" fill="none" style={{ animation: 'dash-flow 1.2s linear infinite' }} />
                ))}
                <circle cx="50" cy="20" r="3" fill="#38bdf8" />
                <circle cx="150" cy="20" r="3" fill="#38bdf8" />
                <circle cx="250" cy="20" r="3" fill="#38bdf8" />
                <circle cx="350" cy="20" r="3" fill="#38bdf8" />
                <circle cx="200" cy="20" r="4.5" fill="#38bdf8" className="node-glow" />
                <circle cx="200" cy="20" r="2.5" fill="#ffffff" />
                <polygon points="196,40 204,40 200,44" fill="#38bdf8" />
              </svg>
            </div>

            <div className="rounded-xl border border-sky-500/25 bg-sky-500/[0.07] px-4 py-3 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                Shared project-state layer
              </span>
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.02] p-8">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/35">
              6 reusable workflows
            </p>
            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {skills.map((s, i) => (
                <div
                  key={s.name}
                  className="connector-card flex items-center justify-between gap-2 rounded-xl border border-white/[0.07] bg-black/30 px-3.5 py-3 transition-all duration-200 hover:border-sky-500/30"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sky-500/15">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-sky-300" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
                      </svg>
                    </span>
                    <span className="truncate text-[12.5px] font-semibold text-white/90">{s.name}</span>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-white/40">
                    {s.tag}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[13px] text-white/40">
              Download a workflow, let your agent run it end-to-end.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
