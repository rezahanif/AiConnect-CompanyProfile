import { mailtoHref } from '../data'

const PLATFORMS: { name: string; accent: string; steps: string[]; note: string }[] = [
  {
    name: 'macOS',
    accent: 'text-sky-300',
    steps: ['Download the application', 'Open the downloaded image', 'Drag to Applications, then launch'],
    note: 'Requires macOS 12 or newer.',
  },
  {
    name: 'Windows',
    accent: 'text-emerald-300',
    steps: ['Download the installer', 'Open it and follow the setup steps', 'Launch AiConnect'],
    note: 'Requires Windows 10 or newer.',
  },
  {
    name: 'Linux',
    accent: 'text-indigo-300',
    steps: ['Download the package once published', 'Install via your package manager', 'Launch AiConnect'],
    note: 'Package format finalized at first stable release.',
  },
]

export function DownloadSection() {
  return (
    <section
      id="download"
      className="relative z-20 w-full px-6 py-32 sm:px-12 md:px-16 lg:py-44 select-none"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl scroll-fade-in">
          <p className="text-[13px] font-medium tracking-wide text-sky-300/90">
            Get started
          </p>
          <h2 className="mt-4 font-sans text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-[-0.03em] text-white leading-[1.02]">
            Ready to connect AI
            <br />
            <span className="text-white/40">to your software?</span>
          </h2>
          <p className="mt-6 max-w-xl text-[15px] sm:text-base leading-relaxed text-white/55">
            Download AiConnect. Free for 3 days — no card required.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left: CTA */}
          <div className="flex flex-col items-start justify-center">
            <div className="download-entrance flex flex-wrap items-center gap-3">
              <a
                href="#download"
                className="btn-glow inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-3.5 text-[15px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
              >
                Download AiConnect
              </a>
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-[14px] font-medium text-white/90 transition-all duration-200 hover:border-white/30 hover:bg-white/[0.08]"
              >
                Request a connector →
              </a>
            </div>
            <p className="mt-6 font-mono text-xs text-white/40">
              v1.0.3 · 3-day trial · Windows, macOS &amp; Linux
            </p>
            <div className="mt-5 flex items-center gap-4 text-white/35">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-label="macOS">
                  <path d="M16.36 12.9c-.02-2.06 1.68-3.05 1.76-3.1-.96-1.4-2.45-1.6-2.98-1.62-1.27-.13-2.48.75-3.12.75-.64 0-1.64-.73-2.7-.71-1.39.02-2.67.81-3.38 2.05-1.44 2.5-.37 6.2 1.03 8.23.69.99 1.5 2.1 2.57 2.06 1.03-.04 1.42-.66 2.67-.66 1.24 0 1.6.66 2.69.64 1.11-.02 1.81-1.01 2.49-2 .78-1.15 1.1-2.26 1.12-2.31-.02-.01-2.15-.83-2.17-3.28ZM14.3 6.8c.57-.69.95-1.65.85-2.6-.82.03-1.81.54-2.4 1.23-.53.61-1 1.59-.87 2.52.91.07 1.85-.46 2.42-1.15Z" />
                </svg>
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-label="Windows">
                  <path d="M3 5.6 10.4 4.6v6.9H3V5.6ZM11.4 4.5 21 3.2v8.3h-9.6V4.5ZM3 12.5h7.4v6.9L3 18.4v-5.9ZM11.4 12.5H21v8.3l-9.6-1.3v-7Z" />
                </svg>
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-label="Linux">
                  <path d="M12 2.5c-2 0-3.3 1.6-3.3 3.9 0 1.2.1 2-.6 3.2-.7 1.3-2 2.4-2.6 3.9-.4 1-.2 1.9.4 2.2.2.9.1 1.6.6 2 .7.5 2 .3 3 .6.9.3 1.9.5 2.8.2.9-.3 1.4-1 2.4-1.3 1-.3 2 .1 2.6-.4.5-.4.4-1.2.6-2 .6-.4.7-1.3.3-2.2-.7-1.6-2-2.7-2.7-4-.6-1.1-.5-1.9-.5-3.1 0-2.3-1.4-4-3-4Z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Right: install steps */}
          <div className="flex flex-col gap-4">
            {PLATFORMS.map((p) => (
              <div
                key={p.name}
                className="scroll-fade-in rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors duration-200 hover:border-white/20"
              >
                <h3 className={`text-xs font-semibold uppercase tracking-[0.18em] ${p.accent}`}>
                  {p.name}
                </h3>
                <ol className="mt-4 space-y-2.5">
                  {p.steps.map((s, i) => (
                    <li key={s} className="flex items-start gap-3 text-sm leading-relaxed">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-white/20 text-[10px] font-semibold text-white/60">
                        {i + 1}
                      </span>
                      <span className="text-white/75">{s}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 border-t border-white/[0.06] pt-3 text-xs leading-relaxed text-white/40">
                  {p.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
