import { footerCols } from "../data"
import { DownloadPicker } from "./Download"
import { BrandMark, Reveal } from "./ui"

export function FinalCTA() {
  return (
    <section
      id="download"
      className="relative overflow-hidden px-5 py-28 md:px-8"
    >
      <div
        className="animate-breathe pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 60% at 50% 50%, rgba(59,130,246,0.35), transparent 65%), radial-gradient(40% 50% at 70% 40%, rgba(59,130,246,0.18), transparent 65%)",
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
        <span className="font-mono">
          Works with compatible AI agents and models.
        </span>
      </div>
    </footer>
  )
}
