import { motion } from "motion/react"
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import logoUrl from "../assets/logo.webp"

/* Scroll reveal ------------------------------------------------------ */

export function Reveal({
  children,
  delay = 0,
  className = "",
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
      className={`reveal ${shown ? "in" : ""} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* Brand + icons ------------------------------------------------------ */

export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <span className="inline-flex select-none">
      <img
        src={logoUrl}
        alt="AiConnect"
        style={{ height: size }}
        className="w-auto"
        draggable={false}
      />
    </span>
  )
}

function IconApple(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={props.className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M16.36 12.9c-.02-2.06 1.68-3.05 1.76-3.1-.96-1.4-2.45-1.6-2.98-1.62-1.27-.13-2.48.75-3.12.75-.64 0-1.64-.73-2.7-.71-1.39.02-2.67.81-3.38 2.05-1.44 2.5-.37 6.2 1.03 8.23.69.99 1.5 2.1 2.57 2.06 1.03-.04 1.42-.66 2.67-.66 1.24 0 1.6.66 2.69.64 1.11-.02 1.81-1.01 2.49-2 .78-1.15 1.1-2.26 1.12-2.31-.02-.01-2.15-.83-2.17-3.28ZM14.3 6.8c.57-.69.95-1.65.85-2.6-.82.03-1.81.54-2.4 1.23-.53.61-1 1.59-.87 2.52.91.07 1.85-.46 2.42-1.15Z" />
    </svg>
  )
}
function IconWindows(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={props.className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M3 5.6 10.4 4.6v6.9H3V5.6ZM11.4 4.5 21 3.2v8.3h-9.6V4.5ZM3 12.5h7.4v6.9L3 18.4v-5.9ZM11.4 12.5H21v8.3l-9.6-1.3v-7Z" />
    </svg>
  )
}
function IconLinux(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={props.className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.5c-2 0-3.3 1.6-3.3 3.9 0 1.2.1 2-.6 3.2-.7 1.3-2 2.4-2.6 3.9-.4 1-.2 1.9.4 2.2.2.9.1 1.6.6 2 .7.5 2 .3 3 .6.9.3 1.9.5 2.8.2.9-.3 1.4-1 2.4-1.3 1-.3 2 .1 2.6-.4.5-.4.4-1.2.6-2 .6-.4.7-1.3.3-2.2-.7-1.6-2-2.7-2.7-4-.6-1.1-.5-1.9-.5-3.1 0-2.3-1.4-4-3-4Zm-1.6 4c.4 0 .7.4.7.9s-.3.9-.7.9-.7-.4-.7-.9.3-.9.7-.9Zm3.1 0c.4 0 .7.4.7.9s-.3.9-.7.9-.7-.4-.7-.9.3-.9.7-.9Z" />
    </svg>
  )
}

export type OS = "macOS" | "Windows" | "Linux"

export type DownloadState = "loading" | "available" | "unavailable" | "error"

export function DownloadButton({
  os,
  variant = "ghost",
  state = "available",
  release,
  selected = false,
  archLine,
  onSelect,
}: {
  os: OS
  variant?: "primary" | "ghost"
  state?: DownloadState
  release?: { version: string downloadUrl?: string }
  selected?: boolean
  archLine?: string
  onSelect?: () => void
}) {
  const Icon =
    os === "macOS" ? IconApple : os === "Windows" ? IconWindows : IconLinux
  const [hover, setHover] = useState(false)
  const base =
    "group inline-flex items-center gap-2.5 rounded-xl px-5 py-3 text-[15px] font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet/70"
  const ariaLabel = `Download AiConnect for ${os}`

  if (state === "loading") {
    return (
      <span
        aria-busy="true"
        aria-label={`Checking releases for ${os}`}
        className={`${base} border border-hairline bg-white/[0.02] text-muted opacity-70`}
      >
        <Icon className="h-[18px] w-[18px]" />
        Checking for {os}…
      </span>
    )
  }

  if (state === "unavailable" || state === "error") {
    return (
      <span
        aria-disabled="true"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className={`${base} group cursor-default border border-hairline bg-white/[0.02] text-muted`}
      >
        <Icon className="h-6 w-6 shrink-0" />
        <span className="flex flex-col items-start leading-tight">
          <span className="whitespace-nowrap">
            {os} release currently unavailable
          </span>
          <motion.span
            initial={false}
            animate={hover ? "show" : "hide"}
            variants={{
              hide: { opacity: 0, height: 0 },
              show: { opacity: 1, height: "auto" },
            }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <a
              href="#install"
              onClick={onSelect}
              tabIndex={hover ? 0 : -1}
              className="whitespace-nowrap text-[12px] font-medium text-violet-bright underline underline-offset-2 hover:text-text"
            >
              View installation instructions
            </a>
          </motion.span>
        </span>
      </span>
    )
  }

  const primary = variant === "primary" || selected
  if (primary) {
    return (
      <a
        href={release?.downloadUrl ?? "#download"}
        aria-label={ariaLabel}
        onClick={onSelect}
        className={`${base} text-white shadow-[0_10px_40px_-10px_rgba(59,130,246,0.35)] hover:-translate-y-0.5`}
        style={{ background: "linear-gradient(135deg,#3b82f6,#3b82f6)" }}
      >
        <Icon className="h-[18px] w-[18px]" />
        <span className="flex flex-col items-start leading-tight">
          <span>Download for {os}</span>
          <span className="font-mono text-[10px] font-normal opacity-80">
            {release?.version ? `v${release.version}` : ""}
            {archLine ? ` · ${archLine}` : ""}
          </span>
        </span>
      </a>
    )
  }
  return (
    <a
      href={release?.downloadUrl ?? "#download"}
      aria-label={ariaLabel}
      onClick={onSelect}
      className={`${base} border border-hairline bg-white/[0.03] text-text hover:-translate-y-0.5 hover:border-violet/50 hover:bg-white/[0.06]`}
    >
      <Icon className="h-[18px] w-[18px] text-muted transition-colors group-hover:text-violet-bright" />
      <span className="flex flex-col items-start leading-tight">
        <span>Download for {os}</span>
        <span className="font-mono text-[10px] font-normal text-muted">
          {release?.version ? `v${release.version}` : ""}
        </span>
      </span>
    </a>
  )
}

/* Logo chip (abstract ecosystem marks, no trademarks reproduced) ------ */

export function LogoChip({
  label,
  glyph,
  tint,
  logo,
}: {
  label: string
  glyph: string
  tint: string
  logo?: string
}) {
  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap text-[15px] font-semibold text-muted transition-colors hover:text-text">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.06]">
        {logo ? (
          <img src={logo} alt={label} className="h-6 w-6 object-contain" />
        ) : (
          <span
            className="text-[13px] font-bold text-white"
            style={{ background: tint }}
          >
            {glyph}
          </span>
        )}
      </span>
      {label}
    </span>
  )
}

/* Section shell ------------------------------------------------------ */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-violet-bright">
      <span className="h-1.5 w-1.5 rounded-full bg-violet-bright shadow-[0_0_10px_2px_rgba(59,130,246,0.35)]" />
      {children}
    </span>
  )
}

/* Window chrome (mock desktop surfaces) ------------------------------ */

export function WindowChrome({
  title,
  accent,
  children,
  className = "",
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
