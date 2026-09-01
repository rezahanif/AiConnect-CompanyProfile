import { footerCols } from '../data'
import { DownloadPicker } from './Download'
import { BrandMark, Reveal } from './ui'

export function FinalCTA() {
  return (
    <section id="download" className="relative overflow-hidden px-5 py-28 md:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <DownloadPicker />
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-ink-2/60 px-5 py-14 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted">
            Connect AI agents to your engineering software. Keep your project
            context across sessions.
          </p>
          <a
            href="#"
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-hairline bg-white/[0.03] px-4 py-2.5 text-[13px] font-semibold text-text transition-all duration-200 hover:border-violet/40 hover:bg-violet/10 hover:shadow-[0_4px_16px_-4px_rgba(59,130,246,0.3)]"
          >
            <span className="text-violet-bright">♥</span> Support development
          </a>
        </div>
        {footerCols.map((c) => (
          <div key={c.title}>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              {c.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[14px] text-muted transition-colors hover:text-text"
                  >
                    {l.label}
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
