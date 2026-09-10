import { useEffect, useRef, useState } from "react"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "motion/react"
import { pricingIncludes } from "../data"
import { useLayerProgress, useStoryPinEnabled } from "./LayerStage"

/* Shared bits ------------------------------------------------------------ */

function Eyebrow({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-sky-300">
      {children}
    </span>
  )
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* Blok 1 — How it connects ------------------------------------------------ */

const FLOW_MODELS = ["Claude", "GPT", "GLM"]
const FLOW_SOFTWARE = ["Revit", "QGIS", "Excel"]

function FlowNode({
  label,
  hint,
  primary = false,
  hub = false,
  delay = 0,
}: {
  label: string
  hint?: string
  primary?: boolean
  hub?: boolean
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 14 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay }}
      whileHover={{ y: -4, scale: 1.04 }}
      title={hint}
      className={`group relative cursor-default rounded-2xl border-2 px-6 py-3.5 text-[15px] font-bold tracking-wide transition-colors ${
        hub
          ? "border-sky-400/70 bg-sky-500/[0.12] text-white shadow-[0_0_36px_-6px_rgba(56,189,248,0.55)]"
          : primary
            ? "border-sky-500/50 bg-sky-500/[0.1] text-sky-200 shadow-[0_0_28px_-6px_rgba(56,189,248,0.45)]"
            : "border-white/15 bg-white/[0.04] text-white/85 hover:border-sky-500/40"
      }`}
    >
      {hub && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              "0 0 24px -6px rgba(56,189,248,0.4)",
              "0 0 44px -4px rgba(56,189,248,0.65)",
              "0 0 24px -6px rgba(56,189,248,0.4)",
            ],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {label}
      {hint && (
        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-black/80 px-2.5 py-1 font-mono text-[10px] font-medium normal-case tracking-normal text-white/80 opacity-0 backdrop-blur transition-all duration-200 group-hover:-top-10 group-hover:opacity-100">
          {hint}
        </span>
      )}
    </motion.div>
  )
}

function FlowLink({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay }}
      className="relative mx-auto flex w-8 flex-col items-center"
      aria-hidden="true"
    >
      <svg viewBox="0 0 8 30" className="h-7 w-2">
        <line
          x1="4"
          y1="0"
          x2="4"
          y2="30"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 5"
          opacity="0.85"
          style={{ animation: "dash-flow 0.9s linear infinite" }}
        />
      </svg>
      {/* traveling pulse */}
      <motion.span
        className="absolute h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_10px_3px_rgba(56,189,248,0.7)]"
        animate={{ top: ["-2px", "26px"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay }}
      />
      <svg
        viewBox="0 0 10 7"
        className="h-1.5 w-2.5 -mt-0.5"
        fill="#38bdf8"
        opacity="0.9"
      >
        <path d="M5 7 0 0h10z" />
      </svg>
    </motion.div>
  )
}

export function ConnectDiagram() {
  return (
    <div className="flex h-full w-full items-center">
      <div className="mx-auto w-full max-w-2xl px-6 py-12 text-center sm:px-12 md:px-16">
        <Reveal>
          <Eyebrow>How it connects</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 font-sans text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
            How it
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-300">
              connects.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-5 max-w-xl text-[15px] sm:text-base leading-relaxed text-white/55">
            Project in, progress out — models and software plugged into one
            living loop.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col items-center">
          <FlowNode
            label="PROJECT"
            primary
            hint="Your files, models & decisions"
            delay={0}
          />
          <FlowLink delay={0.1} />
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {FLOW_MODELS.map((m, i) => (
              <FlowNode
                key={m}
                label={m}
                hint={`${m} · swappable anytime`}
                delay={0.15 + i * 0.12}
              />
            ))}
          </div>
          <FlowLink delay={0.5} />
          <FlowNode
            label="AiConnect"
            hub
            hint="Local daemon · 127.0.0.1:8788"
            delay={0.55}
          />
          <FlowLink delay={0.65} />
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {FLOW_SOFTWARE.map((s, i) => (
              <FlowNode
                key={s}
                label={s}
                hint={`${s} · native bridge`}
                delay={0.7 + i * 0.12}
              />
            ))}
          </div>
          <FlowLink delay={1.0} />
          <FlowNode
            label="Progress"
            primary
            hint="Saved state · portable across models"
            delay={1.05}
          />
        </div>
      </div>
    </div>
  )
}

/* Blok 2 — Get started: pricing + download + install ------------------------ */

type OSKey = "windows" | "macos" | "linux"

const WINDOWS_INSTALLER_URL =
  "https://github.com/rezahanif/AICONNECT-RELEASE/releases/download/v1.0.3/AI.CONNECT_1.0.3_x64-setup.exe"

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.6c-2.7 0-4.6 2-4.6 4.6v2.2H6.3c-.9 0-1.6.7-1.6 1.6v8.4c0 .9.7 1.6 1.6 1.6h11.4c.9 0 1.6-.7 1.6-1.6V11c0-.9-.7-1.6-1.6-1.6h-1.1V7.2c0-2.6-1.9-4.6-4.6-4.6Zm-2.6 6.8V7.2c0-1.6 1.1-2.8 2.6-2.8s2.6 1.2 2.6 2.8v2.2H9.4Zm2.6 4.2c.9 0 1.6.7 1.6 1.6 0 .6-.3 1.1-.8 1.4v1.7a.8.8 0 0 1-1.6 0v-1.7c-.5-.3-.8-.8-.8-1.4 0-.9.7-1.6 1.6-1.6Z" />
    </svg>
  )
}

const OS_META: {
  key: OSKey
  label: string
  short: string
}[] = [
  { key: "windows", label: "Download for Windows", short: "Windows" },
  { key: "macos", label: "Download for macOS", short: "macOS" },
  { key: "linux", label: "Download for Linux", short: "Linux" },
]

function detectOS(): OSKey {
  if (typeof navigator === "undefined") return "windows"
  const p = (navigator.platform || "").toLowerCase()
  const ua = (navigator.userAgent || "").toLowerCase()
  if (p.includes("mac") || ua.includes("mac os")) return "macos"
  if (p.includes("linux") || ua.includes("linux")) return "linux"
  return "windows"
}

const INSTALL: {
  os: string
  accent: string
  steps: string[]
  note: string
}[] = [
  {
    os: "Windows",
    accent: "text-sky-300",
    steps: [
      "Download the installer",
      "Open the installer and follow the setup steps",
      "Launch AiConnect",
    ],
    note: "Installation steps may vary slightly by release format.",
  },
  {
    os: "macOS",
    accent: "text-emerald-300",
    steps: [
      "Download the application",
      "Open the downloaded image and drag to Applications",
      "Launch AiConnect",
    ],
    note: "Requires macOS 12 or newer.",
  },
  {
    os: "Linux",
    accent: "text-indigo-300",
    steps: [
      "Download the package once published",
      "Install via your package manager",
      "Launch AiConnect",
    ],
    note: "Package format is finalized at first stable release.",
  },
]

/* Kotak 1 — pricing card */

function ProCard({ onStartTrial }: { onStartTrial?: () => void }) {
  return (
    <div id="pro-card" className="relative scroll-mt-28">
      {/* glow wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 rounded-[40px] bg-sky-500/[0.07] blur-3xl"
      />
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="relative rounded-[28px] border border-sky-500/30 bg-[#0a101d]/90 p-8 shadow-[0_40px_100px_-40px_rgba(56,189,248,0.4)] backdrop-blur-2xl sm:p-10"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
            AiConnect Pro
          </span>
          <motion.span
            animate={{ opacity: [1, 0.75, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-full bg-sky-500/15 px-3 py-1 text-[11px] font-medium text-sky-300"
          >
            2 weeks trial
          </motion.span>
        </div>

        <div className="mt-6 flex items-end gap-1.5">
          <span className="text-6xl font-bold tracking-tight text-white">
            $1.5
          </span>
          <span className="mb-2 text-base font-medium text-white/45">
            / month
          </span>
        </div>
        <p className="mt-2 text-[13px] text-white/40">
          Billed monthly. Cancel anytime.
        </p>

        <ul className="mt-7 space-y-3">
          {pricingIncludes.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: 0.2 + i * 0.08 }}
              className="flex items-start gap-3 text-sm"
            >
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sky-500/20">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3 w-3 text-sky-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    d="m5 12 5 5 9-11"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="leading-relaxed text-white/65">{f}</span>
            </motion.li>
          ))}
        </ul>

        <motion.a
          href="#get-download"
          onClick={onStartTrial}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 block rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3.5 text-center text-[15px] font-semibold text-white shadow-[0_12px_40px_-10px_rgba(56,189,248,0.55)]"
        >
          Start free trial
        </motion.a>
      </motion.div>
    </div>
  )
}

/* Kotak 2 — download */

function DownloadBox({ attractSignal = 0 }: { attractSignal?: number }) {
  const [os, setOs] = useState<OSKey>("windows")
  const [attract, setAttract] = useState(false)
  useEffect(() => {
    setOs(detectOS())
  }, [])

  // "Start free trial" nudge: after the scroll lands, show the only
  // downloadable platform and gently float its button a couple of times.
  useEffect(() => {
    if (!attractSignal) return
    setOs("windows")
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setAttract(true)
    const t = window.setTimeout(() => setAttract(false), 5600)
    return () => window.clearTimeout(t)
  }, [attractSignal])

  const primary = OS_META.find((o) => o.key === os)!
  const attractWindows = attract && os === "windows"

  return (
    <div
      id="get-download"
      className="scroll-mt-28 rounded-[24px] border border-white/10 bg-[#0a0f1c]/90 p-6 sm:p-8 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
    >
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
        Download
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {OS_META.map((o, i) => (
          <motion.button
            key={o.key}
            onClick={() => {
              setOs(o.key)
              setAttract(false)
            }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className={`rounded-xl px-4 py-2 text-[13px] font-semibold transition-all duration-200 ${
              os === o.key
                ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-[0_8px_28px_-8px_rgba(56,189,248,0.6)]"
                : "border border-white/10 bg-white/[0.03] text-white/55 hover:border-white/25 hover:text-white"
            }`}
          >
            {o.short}
          </motion.button>
        ))}
      </div>

      <div className="relative mt-5">
        {attractWindows && (
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0.45, scale: 1 }}
            animate={{ opacity: 0, scale: 1.045 }}
            transition={{ duration: 1.9, repeat: 2, ease: "easeOut", delay: 0.6 }}
            className="pointer-events-none absolute inset-0 rounded-2xl border border-sky-300/60 shadow-[0_0_36px_4px_rgba(56,189,248,0.35)]"
          />
        )}
        <AnimatePresence mode="wait">
          {os === "windows" ? (
            <motion.a
              key={os}
              href={WINDOWS_INSTALLER_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={
                attractWindows
                  ? {
                      opacity: 1,
                      scale: 1,
                      y: [0, -6, 0],
                      boxShadow: [
                        "0 16px 50px -12px rgba(56,189,248,0.65)",
                        "0 26px 64px -14px rgba(125,211,252,0.95)",
                        "0 16px 50px -12px rgba(56,189,248,0.65)",
                      ],
                    }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={
                attractWindows
                  ? { duration: 1.9, repeat: 2, ease: "easeInOut", delay: 0.6 }
                  : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
              }
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setAttract(false)}
              className="flex w-full flex-col items-center rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-10 py-4 text-white shadow-[0_16px_50px_-12px_rgba(56,189,248,0.65)]"
            >
              <span className="text-[17px] font-bold">{primary.label}</span>
              <span className="font-mono text-[11px] text-white/70">
                v1.0.3 · x64 installer
              </span>
            </motion.a>
          ) : (
            <motion.div
              key={os}
              aria-disabled="true"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-full cursor-not-allowed flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] px-10 py-4 text-white/50"
            >
              <span className="flex items-center gap-2 text-[17px] font-bold">
                <LockIcon className="h-4 w-4" />
                {primary.label}
              </span>
              <span className="font-mono text-[11px] text-white/40">
                Locked · coming soon
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 font-mono text-[12px] tracking-wide text-white/40">
        Latest version · 1.0.3 &nbsp;|&nbsp; 2 weeks trial · Windows, macOS
        &amp; Linux
      </p>
    </div>
  )
}

/* Kotak 3 — install */

function InstallBox() {
  const [tab, setTab] = useState(0)
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#0a0f1c]/90 p-6 sm:p-8 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
        Installation
      </p>
      {/* Tabs */}
      <div className="mt-4 flex gap-2 rounded-xl border border-white/[0.07] bg-black/30 p-1.5">
        {INSTALL.map((t, i) => (
          <button
            key={t.os}
            onClick={() => setTab(i)}
            className={`relative flex-1 rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors duration-200 ${
              tab === i ? "text-white" : "text-white/45 hover:text-white/75"
            }`}
          >
            {tab === i && (
              <motion.span
                layoutId="install-tab-merged"
                className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/10"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{t.os}</span>
          </button>
        ))}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-6"
        >
          <div className="flex items-center gap-2.5">
            <p
              className={`font-mono text-[11px] font-semibold uppercase tracking-[0.2em] ${INSTALL[tab].accent}`}
            >
              {INSTALL[tab].os}
            </p>
            {INSTALL[tab].os !== "Windows" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                <LockIcon className="h-3 w-3" />
                Locked
              </span>
            )}
          </div>
          <ol className="mt-4 space-y-3">
            {INSTALL[tab].steps.map((s, i) => (
              <motion.li
                key={s}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.09, duration: 0.3 }}
                className="flex items-start gap-3 text-[14px] leading-relaxed"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-sky-500/40 font-mono text-[11px] font-semibold text-sky-300">
                  {i + 1}
                </span>
                <span className="text-white/80">{s}</span>
              </motion.li>
            ))}
          </ol>
          <p className="mt-6 border-t border-white/[0.07] pt-4 text-[12.5px] leading-relaxed text-white/40">
            {INSTALL[tab].note}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* Merged section — pinned so the left copy holds while the right stack glides */

export function GetStarted() {
  const rightRef = useRef<HTMLDivElement>(null)
  const pinEnabled = useStoryPinEnabled()
  const layerProgress = useLayerProgress()
  const fallback = useMotionValue(0)
  const [overflow, setOverflow] = useState(0)
  const [trialNudge, setTrialNudge] = useState(0)

  useEffect(() => {
    if (!pinEnabled) {
      setOverflow(0)
      return
    }
    const measure = () => {
      const right = rightRef.current
      if (!right) return
      const usable = window.innerHeight - 168
      const next = Math.max(0, right.offsetHeight - usable)
      setOverflow(next)
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [pinEnabled])

  const stackY = useTransform(layerProgress ?? fallback, [0.5, 0.95], [
    0,
    -overflow,
  ])
  const leftY = useTransform(layerProgress ?? fallback, [0.5, 0.95], [25, -35])

  return (
    <div className="h-full w-full">
      <div className="grid w-full items-start gap-10 px-6 pt-24 sm:px-12 md:px-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        {/* LEFT: header, held in place while the stack glides */}
        <motion.div
          style={pinEnabled ? { y: leftY } : undefined}
          className="will-change-transform lg:pt-10"
        >
          <Reveal>
            <Eyebrow>Pricing</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-sans text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-[-0.03em] text-white leading-[1.02]">
              Simple pricing,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-300">
                ready to run.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-md text-[15px] sm:text-base leading-relaxed text-white/55">
              One plan, everything included. Start with a 2-week free trial,
              grab the installer for your OS, and follow three steps.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <motion.a
              href="#pro-card"
              onClick={() => setTrialNudge((n) => n + 1)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_-6px_rgba(59,130,246,0.45)]"
            >
              Start free trial
            </motion.a>
          </Reveal>
        </motion.div>

        {/* RIGHT: stacked boxes — pinned stage, gliding upward as you scroll */}
        <motion.div
          ref={rightRef}
          style={pinEnabled ? { y: stackY } : undefined}
          className="flex flex-col gap-6 pb-10 will-change-transform"
        >
          <Reveal delay={0}>
            <ProCard onStartTrial={() => setTrialNudge((n) => n + 1)} />
          </Reveal>
          <Reveal delay={0.08}>
            <DownloadBox attractSignal={trialNudge} />
          </Reveal>
          <Reveal delay={0.16}>
            <InstallBox />
          </Reveal>
        </motion.div>
      </div>
    </div>
  )
}
