import { pricingIncludes } from '../data'

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative z-20 w-full px-6 py-32 sm:px-12 md:px-16 lg:py-44 select-none"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl scroll-fade-in">
          <p className="text-[13px] font-medium tracking-wide text-sky-300/90">
            Pricing
          </p>
          <h2 className="mt-4 font-sans text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-[-0.03em] text-white leading-[1.02]">
            Simple pricing,
            <br />
            <span className="text-white/40">no surprises.</span>
          </h2>
          <p className="mt-6 max-w-xl text-[15px] sm:text-base leading-relaxed text-white/55">
            Everything included. Start with a 3-day free trial.
          </p>
        </div>

        <div className="download-entrance mx-auto mt-16 max-w-md">
          <div className="rounded-[28px] border border-sky-500/30 bg-[#0a101d]/90 p-8 shadow-[0_40px_100px_-40px_rgba(56,189,248,0.35)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/60 sm:p-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
                AiConnect Pro
              </span>
              <span className="rounded-full bg-sky-500/15 px-3 py-1 text-[11px] font-medium text-sky-300">
                3 days trial
              </span>
            </div>

            <div className="mt-6 flex items-end gap-1.5">
              <span className="text-6xl font-bold tracking-tight text-white">$1.5</span>
              <span className="mb-2 text-base font-medium text-white/45">/ month</span>
            </div>
            <p className="mt-2 text-[13px] text-white/40">Billed monthly. Cancel anytime.</p>

            <ul className="mt-7 space-y-3">
              {pricingIncludes.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sky-500/20">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 text-sky-300" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="m5 12 5 5 9-11" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="leading-relaxed text-white/65">{f}</span>
                </li>
              ))}
            </ul>

            <a
              href="#download"
              className="btn-glow mt-8 block rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3.5 text-center text-[15px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              Start free trial
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
