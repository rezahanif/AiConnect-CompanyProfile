import { ecosystem } from '../data'

export function ConnectorsBar() {
  const items = [...ecosystem, ...ecosystem]

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Title Tagline */}
      <p className="text-center font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.25em] text-white/60 select-none mb-3 sm:mb-3.5 drop-shadow-sm">
        9 engineering connectors and growing
      </p>

      {/* Infinite Seamless Marquee Strip */}
      <div className="relative w-full max-w-7xl overflow-hidden py-1">
        {/* Left & Right Soft Vignette Gradients */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#06080d] via-[#06080d]/80 to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#06080d] via-[#06080d]/80 to-transparent z-10"
        />

        <div className="animate-marquee flex w-max items-center gap-x-8 sm:gap-x-11 hover:[animation-play-state:paused]">
          {items.map((item, i) => (
            <div
              key={`${item.label}-${i}`}
              className="group inline-flex items-center gap-2.5 sm:gap-3 whitespace-nowrap cursor-default"
            >
              {/* Icon Box with Dark Studio Backdrop & Crisp Hairline Border */}
              <div className="grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-lg bg-[#0a0e17]/85 border border-white/[0.12] backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all duration-200 group-hover:border-white/25 group-hover:bg-[#121824] group-hover:scale-105">
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt={item.label}
                    className="h-5 w-5 sm:h-5.5 sm:w-5.5 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span
                    className="text-[12px] font-bold text-white"
                    style={{ background: item.tint }}
                  >
                    {item.glyph}
                  </span>
                )}
              </div>
              {/* Connector Label */}
              <span className="font-sans text-[13.5px] sm:text-[14.5px] font-medium tracking-tight text-white/80 transition-colors duration-200 group-hover:text-white">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
