import { pricingIncludes } from '../data'
import { Eyebrow, Reveal } from './ui'

export function Pricing() {
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
