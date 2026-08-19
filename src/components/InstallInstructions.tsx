import { platformLabel, type PlatformName } from "../releases"
import { Eyebrow, Reveal } from "./ui"

const STEPS: { platform: PlatformName steps: string[] note: string }[] = [
  {
    platform: "windows",
    steps: [
      "Download the installer",
      "Open the installer and follow the setup steps",
      "Launch AiConnect",
    ],
    note: "Installation steps may vary slightly by release format.",
  },
  {
    platform: "macos",
    steps: [
      "Download the application",
      "Open the downloaded image/application as appropriate",
      "Install the application",
      "Launch AiConnect",
    ],
    note: "Installation steps may vary slightly by release format.",
  },
  {
    platform: "linux",
    steps: [
      "Await the first stable Linux package from the release pipeline",
      "Install using the documented package format",
      "Launch AiConnect",
    ],
    note: "The Linux package format is not finalized yet. We will not claim a format until the release pipeline publishes one.",
  },
]

export function InstallInstructions() {
  return (
    <section id="install" className="relative px-5 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <Eyebrow>Installation</Eyebrow>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Install AiConnect.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-muted">
            Pick your platform below for the general installation flow. Exact
            packaging may change until the first stable release ships.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <Reveal key={s.platform} delay={100}>
              <div className="flex h-full flex-col rounded-2xl border border-hairline bg-surface/70 p-6">
                <h3 className="font-mono text-[12px] uppercase tracking-[0.18em] text-violet-bright">
                  {platformLabel(s.platform)}
                </h3>
                <ol className="mt-5 space-y-3">
                  {s.steps.map((step, i) => (
                    <li
                      key={step}
                      className="flex items-start gap-3 text-[14px] leading-relaxed"
                    >
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
