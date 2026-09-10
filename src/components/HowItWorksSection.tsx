import { useEffect, useRef, useState } from "react"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react"
import { useLayerProgress } from "./LayerStage"

export function HowItWorksSection() {
  const [selectedTargetModel, setSelectedTargetModel] =
    useState<"gpt" | "deepseek">("gpt")
  const [isHandoffAnimating, setIsHandoffAnimating] = useState(false)
  const [handoffSuccess, setHandoffSuccess] = useState(false)
  const timerRef = useRef<number | null>(null)

  const handleSimulateHandoff = (model: "gpt" | "deepseek") => {
    if (model === selectedTargetModel && handoffSuccess) return
    setSelectedTargetModel(model)
    setIsHandoffAnimating(true)
    setHandoffSuccess(false)

    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setIsHandoffAnimating(false)
      setHandoffSuccess(true)
    }, 1200)
  }

  // Scroll-driven demo: the canvas layer plays the handoff by itself.
  // Crossing 60% progress fires Claude→DeepSeek; scrolling back resets to GPT.
  const layerProgress = useLayerProgress()
  const idleProgress = useMotionValue(0)
  const autoZone = useRef<"idle" | "fired">("idle")

  useMotionValueEvent(layerProgress ?? idleProgress, "change", (v) => {
    if (v > 0.6 && autoZone.current === "idle") {
      autoZone.current = "fired"
      handleSimulateHandoff("deepseek")
    } else if (v < 0.3 && autoZone.current === "fired") {
      autoZone.current = "idle"
      handleSimulateHandoff("gpt")
    }
  })

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  const receiver =
    selectedTargetModel === "gpt"
      ? {
          name: "GPT-5.6",
          short: "GPT",
          logo: "/logos/logo-chatgpt.png",
          role: "Handover report",
          rows: ["loaded project state ✓", "resuming takeoff…"],
          accentBorder: "border-emerald-500/30",
          accentBg: "bg-emerald-500/[0.04]",
          accentText: "text-emerald-300",
          accentBadge:
            "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
          glow: "shadow-[0_0_40px_-8px_rgba(16,185,129,0.35)]",
        }
      : {
          name: "DeepSeek 4.1 Flash",
          short: "DeepSeek",
          logo: "/logos/logo-deepseek.png",
          role: "Stress check",
          rows: ["loaded project state ✓", "Validating load combos…"],
          accentBorder: "border-blue-500/30",
          accentBg: "bg-blue-500/[0.04]",
          accentText: "text-blue-300",
          accentBadge: "border-blue-500/30 bg-blue-500/15 text-blue-300",
          glow: "shadow-[0_0_40px_-8px_rgba(59,130,246,0.35)]",
        }

  return (
    <div className="flex h-full w-full items-center">
      <div className="w-full px-6 py-16 sm:px-12 md:px-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* LEFT: header */}
          <div className="relative">
            {/* Soft glow behind the headline */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -top-16 h-80 w-80 rounded-full bg-sky-500/[0.09] blur-3xl"
            />
            <p className="relative flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-sky-300">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_10px_2px_rgba(56,189,248,0.5)] animate-pulse" />
              How AiConnect works
            </p>

            <h2 className="relative mt-5 font-sans text-4xl sm:text-5xl lg:text-[60px] font-semibold tracking-[-0.03em] text-white leading-[1.0]">
              One project.
              <br />
              <span className="font-semibold tracking-[-0.03em] text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-300">
                Any AI. No rework.
              </span>
            </h2>

            <p className="relative mt-6 max-w-md text-[15px] sm:text-[17px] leading-relaxed text-white/75">
              Your project state lives apart from the chat. Close one model,
              open another —{" "}
              <span className="text-white">
                the work picks up where it stopped.
              </span>
            </p>

            {/* Model switcher lives with the copy now */}
            <div className="relative mt-8 flex items-center gap-2">
              <span className="mr-1 text-[13px] text-white/55">
                Try it with:
              </span>
              <button
                onClick={() => handleSimulateHandoff("gpt")}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-all ${
                  selectedTargetModel === "gpt"
                    ? "bg-emerald-400 text-black"
                    : "border border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
                }`}
              >
                GPT-5.6
              </button>
              <button
                onClick={() => handleSimulateHandoff("deepseek")}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-all ${
                  selectedTargetModel === "deepseek"
                    ? "bg-blue-400 text-black"
                    : "border border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
                }`}
              >
                DeepSeek 4.1 Flash
              </button>
            </div>

            <p className="relative mt-6 max-w-md text-[13px] leading-relaxed text-white/50">
              Close Claude, open {receiver.name}. Yesterday&apos;s modeling
              session becomes today&apos;s starting point.
            </p>
          </div>

          {/* RIGHT: session handoff window */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br from-[#080d18] via-[#0a1020] to-[#0c142a] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]"
          >
            {/* Slow drifting gradient wash */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/4 h-64 w-96 rounded-full bg-sky-500/[0.07] blur-3xl"
              animate={{ x: [0, 40, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Window title bar */}
            <div className="relative flex items-center justify-between border-b border-white/[0.07] px-6 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="font-mono text-[12px] tracking-wide text-white/50">
                  Progress Store — session handoff
                </span>
              </div>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_2px_rgba(56,189,248,0.6)]" />
              </span>
            </div>

            {/* Sender / conduit / receiver */}
            <div className="relative grid grid-cols-1 gap-3 p-5 sm:p-6 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
              {/* Claude — ended, deliberately faded */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 opacity-70 saturate-[0.65] transition-opacity duration-500 hover:opacity-90">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-white shadow-md">
                    <img
                      src="/logos/logo-claude.png"
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <div className="leading-tight">
                    <span className="block text-[14px] font-semibold text-white">
                      Claude
                    </span>
                    <span className="font-mono text-[10px] text-white/35">
                      Sonnet 5.0
                    </span>
                  </div>
                  <span className="rounded-full border border-white/[0.12] bg-white/[0.07] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white/50">
                    ended
                  </span>
                </div>
                <div className="space-y-2 font-mono text-[11.5px]">
                  {[
                    { text: "Tower-A_Structural.rvt", dot: "bg-white/30" },
                    { text: "framed 168 elements", dot: "bg-emerald-400/80" },
                    { text: "takeoff → 342 m³", dot: "bg-emerald-400/80" },
                  ].map((row) => (
                    <div
                      key={row.text}
                      className="flex items-center gap-2.5 rounded-lg border border-white/[0.04] bg-black/40 px-3 py-2 text-white/55"
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${row.dot}`}
                      />
                      {row.text}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 font-mono text-[10.5px] text-sky-300/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400/70" />
                  state pushed to store
                </div>
              </div>

              {/* Conduit — glowing store orb */}
              <div className="relative flex items-center justify-center px-1 md:flex-col md:py-2">
                {/* Mobile: horizontal line */}
                <svg
                  viewBox="0 0 120 24"
                  className="h-5 w-24 md:hidden"
                  aria-hidden="true"
                >
                  <line
                    x1="0"
                    y1="12"
                    x2="120"
                    y2="12"
                    stroke="#38bdf8"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeDasharray="1 5"
                    opacity="0.8"
                    style={{ animation: "dash-flow 1s linear infinite" }}
                  />
                  <circle
                    cx="60"
                    cy="12"
                    r="9"
                    fill="rgba(56,189,248,0.14)"
                    stroke="#38bdf8"
                    strokeWidth="1.6"
                  />
                  <circle
                    cx="60"
                    cy="12"
                    r="3.5"
                    fill="#38bdf8"
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(56,189,248,0.9))",
                    }}
                  />
                </svg>
                {/* Desktop: vertical line + prominent orb */}
                <svg
                  viewBox="0 0 32 150"
                  className="hidden h-full min-h-[200px] w-8 md:block"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient id="storeOrbGlow" cx="50%" cy="50%" r="50%">
                      <stop
                        offset="0%"
                        stopColor="#38bdf8"
                        stopOpacity="0.55"
                      />
                      <stop
                        offset="60%"
                        stopColor="#38bdf8"
                        stopOpacity="0.15"
                      />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <line
                    x1="16"
                    y1="0"
                    x2="16"
                    y2="150"
                    stroke="#38bdf8"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeDasharray="1 5"
                    opacity="0.8"
                    style={{ animation: "dash-flow 1s linear infinite" }}
                  />
                  <circle cx="16" cy="75" r="16" fill="url(#storeOrbGlow)" />
                  <circle
                    cx="16"
                    cy="75"
                    r="13"
                    fill="rgba(56,189,248,0.12)"
                    stroke="#38bdf8"
                    strokeWidth="1.6"
                  />
                  <circle
                    cx="16"
                    cy="75"
                    r="4.5"
                    fill="#7dd3fc"
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(125,211,252,1))",
                    }}
                  >
                    {isHandoffAnimating && (
                      <animate
                        attributeName="r"
                        values="4.5;10;4.5"
                        dur="0.8s"
                        repeatCount="indefinite"
                      />
                    )}
                  </circle>
                </svg>
                <span
                  className={`font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-300/80 max-md:hidden ${
                    isHandoffAnimating ? "animate-pulse" : ""
                  }`}
                >
                  store
                </span>
              </div>

              {/* Receiver — continuing, vivid with breathing glow */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTargetModel}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    boxShadow: isHandoffAnimating
                      ? selectedTargetModel === "gpt"
                        ? "0 0 60px -8px rgba(16,185,129,0.55)"
                        : "0 0 60px -8px rgba(59,130,246,0.55)"
                      : selectedTargetModel === "gpt"
                        ? [
                            "0 0 40px -8px rgba(16,185,129,0.35)",
                            "0 0 52px -8px rgba(16,185,129,0.5)",
                            "0 0 40px -8px rgba(16,185,129,0.35)",
                          ]
                        : [
                            "0 0 40px -8px rgba(59,130,246,0.35)",
                            "0 0 52px -8px rgba(59,130,246,0.5)",
                            "0 0 40px -8px rgba(59,130,246,0.35)",
                          ],
                  }}
                  exit={{ opacity: 0, x: -14 }}
                  transition={{
                    opacity: { duration: 0.3, ease: "easeOut" },
                    x: { duration: 0.3, ease: "easeOut" },
                    boxShadow: isHandoffAnimating
                      ? { duration: 0.4 }
                      : { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className={`rounded-2xl border p-5 ${receiver.accentBorder} ${receiver.accentBg}`}
                >
                  <div className="mb-4 flex items-center gap-2.5">
                    <motion.span
                      initial={{ scale: 0.7 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 18,
                      }}
                      className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-white shadow-md"
                    >
                      <img
                        src={receiver.logo}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-cover"
                      />
                    </motion.span>
                    <div className="leading-tight">
                      <span className="block text-[14px] font-semibold text-white">
                        {receiver.short}
                      </span>
                      <span className="font-mono text-[10px] text-white/35">
                        {receiver.role}
                      </span>
                    </div>
                    <span
                      className={`ml-auto rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${receiver.accentBadge}`}
                    >
                      continuing
                    </span>
                  </div>
                  <div className="space-y-2 font-mono text-[11.5px]">
                    {receiver.rows.map((row, i) => (
                      <motion.div
                        key={selectedTargetModel + row + String(handoffSuccess)}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{
                          opacity: isHandoffAnimating ? 0.4 : 1,
                          x: 0,
                        }}
                        transition={{ delay: 0.1 + i * 0.12, duration: 0.3 }}
                        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 ${
                          i === 0
                            ? `${receiver.accentBorder} border-l-2 bg-black/40 ${receiver.accentText}`
                            : "border-white/[0.04] bg-black/40 text-white/55"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            i === 0
                              ? selectedTargetModel === "gpt"
                                ? "bg-emerald-400"
                                : "bg-blue-400"
                              : "bg-amber-300/80 animate-pulse"
                          }`}
                        />
                        {row}
                      </motion.div>
                    ))}
                  </div>
                  <div
                    className={`mt-4 flex items-center gap-2 font-mono text-[10.5px] ${receiver.accentText}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                        selectedTargetModel === "gpt"
                          ? "bg-emerald-400"
                          : "bg-blue-400"
                      }`}
                    />
                    {handoffSuccess
                      ? "✓ handoff complete — no re-explaining"
                      : isHandoffAnimating
                        ? "loading saved state…"
                        : "resuming with full memory"}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom status pill */}
            <div className="relative flex justify-center px-5 pb-5 sm:px-6 sm:pb-6">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.07] bg-white/[0.02] px-4 py-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400 shadow-[0_0_8px_2px_rgba(56,189,248,0.5)] animate-pulse" />
                <span className="font-mono text-[10.5px] leading-relaxed text-white/55">
                  progress stored separately from the conversation — no restart
                  from zero
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
