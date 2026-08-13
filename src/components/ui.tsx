import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/* Scroll reveal ------------------------------------------------------ */

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        })
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? 'in' : ''} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* Brand + icons ------------------------------------------------------ */

export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
        <defs>
          <linearGradient id="bm" x1="4" y1="4" x2="28" y2="28">
            <stop stopColor="#a78bff" />
            <stop offset="1" stopColor="#5b8cff" />
          </linearGradient>
        </defs>
        <path
          d="M16 3.5 27.2 10v12L16 28.5 4.8 22V10L16 3.5Z"
          stroke="url(#bm)"
          strokeWidth="1.6"
          fill="rgba(139,107,255,0.10)"
        />
        <circle cx="16" cy="16" r="3.1" fill="url(#bm)" />
        <path d="M16 12.9V8M16 19.1V24M12.9 16H8M19.1 16H24" stroke="url(#bm)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="16" cy="8" r="1.5" fill="#a78bff" />
        <circle cx="16" cy="24" r="1.5" fill="#5b8cff" />
        <circle cx="8" cy="16" r="1.5" fill="#6fe0ff" />
        <circle cx="24" cy="16" r="1.5" fill="#a78bff" />
      </svg>
      <span className="text-[17px] font-extrabold tracking-tight text-text">
        Ai<span className="text-violet-bright">Connect</span>
      </span>
    </span>
  )
}

function IconApple(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} fill="currentColor" aria-hidden>
      <path d="M16.36 12.9c-.02-2.06 1.68-3.05 1.76-3.1-.96-1.4-2.45-1.6-2.98-1.62-1.27-.13-2.48.75-3.12.75-.64 0-1.64-.73-2.7-.71-1.39.02-2.67.81-3.38 2.05-1.44 2.5-.37 6.2 1.03 8.23.69.99 1.5 2.1 2.57 2.06 1.03-.04 1.42-.66 2.67-.66 1.24 0 1.6.66 2.69.64 1.11-.02 1.81-1.01 2.49-2 .78-1.15 1.1-2.26 1.12-2.31-.02-.01-2.15-.83-2.17-3.28ZM14.3 6.8c.57-.69.95-1.65.85-2.6-.82.03-1.81.54-2.4 1.23-.53.61-1 1.59-.87 2.52.91.07 1.85-.46 2.42-1.15Z" />
    </svg>
  )
}
function IconWindows(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} fill="currentColor" aria-hidden>
      <path d="M3 5.6 10.4 4.6v6.9H3V5.6ZM11.4 4.5 21 3.2v8.3h-9.6V4.5ZM3 12.5h7.4v6.9L3 18.4v-5.9ZM11.4 12.5H21v8.3l-9.6-1.3v-7Z" />
    </svg>
  )
}
function IconLinux(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} fill="currentColor" aria-hidden>
      <path d="M12 2.5c-2 0-3.3 1.6-3.3 3.9 0 1.2.1 2-.6 3.2-.7 1.3-2 2.4-2.6 3.9-.4 1-.2 1.9.4 2.2.2.9.1 1.6.6 2 .7.5 2 .3 3 .6.9.3 1.9.5 2.8.2.9-.3 1.4-1 2.4-1.3 1-.3 2 .1 2.6-.4.5-.4.4-1.2.6-2 .6-.4.7-1.3.3-2.2-.7-1.6-2-2.7-2.7-4-.6-1.1-.5-1.9-.5-3.1 0-2.3-1.4-4-3-4Zm-1.6 4c.4 0 .7.4.7.9s-.3.9-.7.9-.7-.4-.7-.9.3-.9.7-.9Zm3.1 0c.4 0 .7.4.7.9s-.3.9-.7.9-.7-.4-.7-.9.3-.9.7-.9Z" />
    </svg>
  )
}

export type OS = 'macOS' | 'Windows' | 'Linux'

export function DownloadButton({
  os,
  variant = 'ghost',
}: {
  os: OS
  variant?: 'primary' | 'ghost'
}) {
  const Icon = os === 'macOS' ? IconApple : os === 'Windows' ? IconWindows : IconLinux
  const base =
    'group inline-flex items-center gap-2.5 rounded-xl px-5 py-3 text-[15px] font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet/70'
  if (variant === 'primary') {
    return (
      <a
        href="#download"
        className={`${base} text-white shadow-[0_10px_40px_-10px_rgba(139,107,255,0.8)] hover:-translate-y-0.5`}
        style={{ background: 'linear-gradient(135deg,#a78bff,#5b8cff)' }}
      >
        <Icon className="h-[18px] w-[18px]" />
        Download for {os}
      </a>
    )
  }
  return (
    <a
      href="#download"
      className={`${base} border border-hairline bg-white/[0.03] text-text hover:-translate-y-0.5 hover:border-violet/50 hover:bg-white/[0.06]`}
    >
      <Icon className="h-[18px] w-[18px] text-muted transition-colors group-hover:text-violet-bright" />
      Download for {os}
    </a>
  )
}

/* Logo chip (abstract ecosystem marks, no trademarks reproduced) ------ */

export function LogoChip({
  label,
  glyph,
  tint,
}: {
  label: string
  glyph: string
  tint: string
}) {
  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap text-[15px] font-semibold text-muted transition-colors hover:text-text">
      <span
        className="grid h-8 w-8 place-items-center rounded-lg text-[13px] font-bold text-white"
        style={{ background: tint }}
      >
        {glyph}
      </span>
      {label}
    </span>
  )
}

/* Section shell ------------------------------------------------------ */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-violet-bright">
      <span className="h-1.5 w-1.5 rounded-full bg-violet-bright shadow-[0_0_10px_2px_rgba(167,139,255,0.7)]" />
      {children}
    </span>
  )
}

/* Window chrome (mock desktop surfaces) ------------------------------ */

export function WindowChrome({
  title,
  accent,
  children,
  className = '',
  style,
}: {
  title: string
  accent: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-hairline bg-surface/90 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur ${className}`}
      style={style}
    >
      <div className="flex items-center gap-2 border-b border-hairline bg-white/[0.02] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11px] text-muted">{title}</span>
        <span
          className="ml-auto h-1.5 w-1.5 rounded-full"
          style={{ background: accent, boxShadow: `0 0 10px 1px ${accent}` }}
        />
      </div>
      {children}
    </div>
  )
}

export function FloatingObject({
  label,
  glyph,
  tint,
  className,
  delay,
  rotate = 0,
}: {
  label: string
  glyph: string
  tint: string
  className: string
  delay: number
  rotate?: number
}) {
  return (
    <div
      className={`animate-float absolute ${className}`}
      style={{ animationDelay: `${delay}s`, ['--r' as string]: `${rotate}deg` }}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <span
          className="grid h-10 w-10 place-items-center rounded-xl text-[15px] font-bold text-white"
          style={{ background: tint }}
        >
          {glyph}
        </span>
        <div className="pr-1">
          <div className="text-[13px] font-semibold text-text">{label}</div>
          <div className="font-mono text-[10px] text-muted">connected</div>
        </div>
      </div>
    </div>
  )
}
