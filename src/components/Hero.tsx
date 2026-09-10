import { NanoHumanoidCanvas } from './NanoHumanoidCanvas'
import { ConnectorsBar } from './ConnectorsBar'

export function Hero({ visible = true }: { visible?: boolean }) {
  return (
    <section
      id="product"
      className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-transparent px-6 pt-20 pb-4 sm:pb-6 select-none"
    >
      {/* --- 3D Realistic Humanoid Nano-Dot Canvas (16k+ particles) --- */}
      {visible && <NanoHumanoidCanvas />}

      {/* Top spacer balancing fixed header */}
      <div className="h-4 sm:h-6 shrink-0 pointer-events-none" aria-hidden="true" />

      {/* --- Main Middle Area: Split Editorial Typography Framing the 3D Nano Humanoid --- */}
      <div data-layer-text className="relative z-20 mx-auto my-auto flex w-full max-w-[1560px] items-center px-6 sm:px-12 lg:px-20 will-change-transform">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
          {/* Left Column: Towering Editorial Headline */}
          <div className="flex flex-col items-start text-left pointer-events-none lg:max-w-lg">
            <h1 className="font-sans text-4xl sm:text-5xl md:text-5xl lg:text-[50px] xl:text-[62px] font-light tracking-[-0.03em] text-white leading-[0.94]">
              YOUR AI
              <br />
              <span
                style={{ fontFamily: 'var(--font-serif)' }}
                className="italic font-normal tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-300 whitespace-nowrap"
              >
                AGENT,
              </span>
            </h1>

            <p className="mt-6 max-w-sm sm:max-w-md text-sm sm:text-base leading-relaxed text-muted/80">
              AiConnect lets AI agents work across engineering software, documents, and professional tools —
            </p>
          </div>

          {/* Right Column: Towering Editorial Headline */}
          <div className="flex flex-col items-start lg:items-end text-left lg:text-right pointer-events-none lg:max-w-lg lg:ml-auto">
            <h1 className="font-sans text-4xl sm:text-5xl md:text-5xl lg:text-[50px] xl:text-[62px] font-light tracking-[-0.03em] text-white leading-[0.94]">
              <span className="whitespace-nowrap">WORKING IN</span>
              <br />
              <span
                style={{ fontFamily: 'var(--font-serif)' }}
                className="italic font-normal tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-400 to-teal-200 whitespace-nowrap"
              >
                YOUR SOFTWARE.
              </span>
            </h1>

            <p className="mt-6 max-w-sm sm:max-w-md text-sm sm:text-base leading-relaxed text-muted/80">
              while preserving your project progress across sessions and AI models.
            </p>
          </div>
        </div>
      </div>

      {/* --- Bottom Row: 9 Engineering Connectors and Growing --- */}
      <div data-layer-text className="relative z-20 w-full max-w-7xl mx-auto shrink-0 pb-1 sm:pb-2 will-change-transform">
        <ConnectorsBar />
      </div>
    </section>
  )
}
