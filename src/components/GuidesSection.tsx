import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { guideSteps } from '../data'

const GUIDE_CONTENT: { heading: string; body: string[]; tip?: string; code?: string }[] = [
  {
    heading: 'What is AiConnect?',
    body: [
      'AiConnect connects AI agents to engineering software through a secure local daemon.',
      'Your AI drives real tools — Revit, Ansys, QGIS — instead of writing tutorials.',
    ],
  },
  {
    heading: 'What you need',
    body: [
      'Windows 10+, macOS 12+, or Linux. Python 3.10 or newer.',
      'An API key for a compatible model — Claude, GPT, DeepSeek, or GLM.',
    ],
  },
  {
    heading: 'Getting started',
    body: [
      'Download the installer for your platform below.',
      'Run it, follow the setup wizard, then launch AiConnect.',
    ],
    tip: 'Installation details may vary slightly per release format.',
  },
  {
    heading: 'Link your software',
    body: [
      'Open your target software and load a project.',
      'Enable the AiConnect add-in, then approve the secure local link on port 8788.',
    ],
    code: 'prompt> "Generate a slab quantity takeoff for Level 2 and export to Excel."',
  },
  {
    heading: 'Try it out',
    body: [
      'Start with a small task: a takeoff, a framing run, a BOQ export.',
      'Watch the agent work against real geometry, then scale up.',
    ],
    code: 'prompt> "Run a von Mises stress check on the gear train."',
  },
  {
    heading: 'Automate repeatable tasks',
    body: [
      'Download a Skill workflow from the library above.',
      'Your agent runs it end-to-end. Combine connectors for complex projects.',
    ],
  },
  {
    heading: 'Something wrong?',
    body: [
      'Check that port 8788 is not blocked by a firewall.',
      'Verify the add-in is enabled, then restart the AiConnect daemon.',
    ],
    tip: 'Still stuck? Request help via the connector email link.',
  },
]

export function GuidesSection() {
  const [active, setActive] = useState(3)

  return (
    <section
      id="guides"
      className="relative z-20 w-full px-6 py-32 sm:px-12 md:px-16 lg:py-44 select-none"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl scroll-fade-in">
          <p className="text-[13px] font-medium tracking-wide text-sky-300/90">
            Documentation
          </p>
          <h2 className="mt-4 font-sans text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-[-0.03em] text-white leading-[1.02]">
            Know what to do,
            <br />
            <span className="text-white/40">not just what to click.</span>
          </h2>
          <p className="mt-6 max-w-xl text-[15px] sm:text-base leading-relaxed text-white/55">
            Every connector ships with guidance — no AI expertise required to get started.
          </p>
        </div>

        <div className="mt-16 overflow-hidden rounded-[28px] border border-white/10 bg-[#080c15]/90 backdrop-blur-2xl shadow-[0_30px_90px_-30px_rgba(0,0,0,0.9)]">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            <div className="w-full shrink-0 border-b border-white/[0.07] p-4 lg:w-60 lg:border-b-0 lg:border-r">
              {guideSteps.map((step, i) => (
                <button
                  key={step}
                  onClick={() => setActive(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                    active === i
                      ? 'bg-white/[0.07] text-white'
                      : 'text-white/40 hover:bg-white/[0.03] hover:text-white/70'
                  }`}
                >
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-semibold ${
                      active === i
                        ? 'border-sky-400/60 bg-sky-500/15 text-sky-300'
                        : 'border-white/15 text-white/40'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="font-medium">{step}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="min-h-[320px] flex-1 p-7 sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/35">
                    Step {active + 1} — {guideSteps[active]}
                  </p>
                  <h3 className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight text-white">
                    {GUIDE_CONTENT[active].heading}
                  </h3>
                  <div className="mt-4 space-y-2.5">
                    {GUIDE_CONTENT[active].body.map((p) => (
                      <p key={p} className="text-sm sm:text-[15px] leading-relaxed text-white/60">
                        {p}
                      </p>
                    ))}
                  </div>
                  {GUIDE_CONTENT[active].code && (
                    <div className="mt-5 rounded-xl border border-white/[0.07] bg-black/40 p-4 font-mono text-[12px] leading-relaxed text-white/60">
                      <span className="text-sky-300">{GUIDE_CONTENT[active].code}</span>
                    </div>
                  )}
                  {GUIDE_CONTENT[active].tip && (
                    <div className="mt-4 border-l-2 border-sky-400/60 bg-sky-500/[0.06] px-4 py-3 text-[13px] leading-relaxed text-sky-200/80">
                      {GUIDE_CONTENT[active].tip}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
