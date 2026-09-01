import { platformLabel, type PlatformName } from '../releases'
import { Eyebrow } from './ui'

const STEPS: { platform: PlatformName; steps: string[]; note: string }[] = [
  {
    platform: 'windows',
    steps: ['Download the installer', 'Open the installer and follow the setup steps', 'Launch AiConnect'],
    note: 'Installation steps may vary slightly by release format.',
  },
  {
    platform: 'macos',
    steps: ['Download the application', 'Open the downloaded image/application as appropriate', 'Install the application', 'Launch AiConnect'],
    note: 'Installation steps may vary slightly by release format.',
  },
  {
    platform: 'linux',
    steps: ['Await the first stable Linux package from the release pipeline', 'Install using the documented package format', 'Launch AiConnect'],
    note: 'The Linux package format is not finalized yet. We will not claim a format until the release pipeline publishes one.',
  },
]

export function InstallInstructions() {
  return (
    <section id="install" className="scroll-fade-in relative px-5 py-24 md:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <Eyebrow>Installation</Eyebrow>
        <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
          Install AiConnect.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-center text-muted">
          Choose your platform for step-by-step installation. Packaging
          details may be updated before the first stable release.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 text-left">
          {STEPS.map((s) => (
            <div key={s.platform} className="flex h-full flex-col rounded-2xl border border-hairline bg-surface/70 p-6">
              <h3 className="font-mono text-[12px] uppercase tracking-[0.18em] text-violet-bright">
                {platformLabel(s.platform)}
              </h3>
              <ol className="mt-5 space-y-3">
                {s.steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-[14px] leading-relaxed">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-violet/40 font-mono text-[10px] text-violet-bright">
                      {i + 1}
                    </span>
                    <span className="text-text">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 border-t border-hairline pt-4 text-[12.5px] leading-relaxed text-muted">
                {s.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
