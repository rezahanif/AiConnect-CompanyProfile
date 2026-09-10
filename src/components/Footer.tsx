import { footerCols, mailtoHref } from '../data'
import { BrandMark } from './Header'

export function Footer() {
  return (
    <footer
      id="footer"
      className="relative z-20 min-h-screen w-full flex flex-col justify-between border-t border-white/[0.08] bg-[#06080d]/90 px-6 py-12 sm:px-12 sm:py-16 md:px-16 backdrop-blur-2xl select-none"
    >
      {/* Top subtle radiant glow divider */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-px left-1/2 h-[1px] w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-500/35 to-transparent"
      />

      <div className="mx-auto w-full max-w-7xl flex-1 flex flex-col justify-center">
        {/* Pre-Footer CTA Card */}
        <div
          id="download"
          className="relative mb-14 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-12 backdrop-blur-md"
        >
          {/* Subtle ambient lighting inside card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl"
          />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <span className="inline-block font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-400">
                Next-Gen Engineering Workflow
              </span>
              <h3 className="mt-3 font-sans text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Ready to connect AI to your software?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                Connect AI agents to your engineering software. Keep your project
                context across sessions without losing decisions or work in progress.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="#get-download"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_-6px_rgba(59,130,246,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-4px_rgba(59,130,246,0.6)] active:scale-95"
              >
                Download AiConnect
              </a>
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-3 text-[14px] font-medium text-white/90 transition-all duration-200 hover:border-white/30 hover:bg-white/[0.08] hover:text-white active:scale-95"
              >
                Request a connector →
              </a>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns Grid */}
        <div className="grid gap-10 sm:gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand & Mission Statement */}
          <div className="flex flex-col items-start">
            <a href="#top" aria-label="AiConnect home" className="transition-opacity hover:opacity-90">
              <BrandMark size={38} />
            </a>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted">
              Connect AI agents to your engineering software. Keep your project
              context across sessions.
            </p>
            <a
              href="#"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-[13px] font-semibold text-text transition-all duration-200 hover:border-sky-500/40 hover:bg-sky-500/10 hover:shadow-[0_4px_16px_-4px_rgba(59,130,246,0.3)] active:scale-95"
            >
              <span className="text-rose-400">♥</span> Support development
            </a>
          </div>

          {/* Dynamic 3 Columns from footerCols */}
          {footerCols.map((c) => (
            <div key={c.title}>
              <h4 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                {c.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => {
                  const isExternal = l.href.startsWith('http')
                  return (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="group inline-flex items-center gap-1 text-[14px] text-muted transition-all duration-200 hover:text-white hover:translate-x-0.5"
                      >
                        <span>{l.label}</span>
                        {isExternal && (
                          <span className="text-xs text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/70">
                            ↗
                          </span>
                        )}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Legal & Compatibility Row */}
      <div className="mx-auto mt-12 w-full max-w-7xl flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-6 text-[12px] text-muted sm:flex-row">
        <span>© 2026 AiConnect. All rights reserved.</span>
        <div className="flex items-center gap-6 font-mono text-[11px] text-muted/70">
          <span>Works with compatible AI agents and models.</span>
          <a
            href="#top"
            className="inline-flex items-center gap-1 text-white/60 transition-colors hover:text-white"
          >
            <span>Top</span>
            <span>↑</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
