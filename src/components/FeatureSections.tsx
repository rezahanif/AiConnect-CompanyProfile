import { useEffect, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ecosystem, guideSteps, mailtoHref, models, skills } from "../data"
import { useLayerParallax, useStoryPinEnabled } from "./LayerStage"

/* Shared zigzag shell -------------------------------------------------- */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-sky-300">
      {children}
    </span>
  )
}

function FeatureShell({
  eyebrow,
  titleA,
  titleB,
  body,
  visual,
  flip = false,
  singleLine = false,
  children,
}: {
  eyebrow: string
  titleA: string
  titleB: string
  body: string
  visual: ReactNode
  flip?: boolean
  singleLine?: boolean
  children?: ReactNode
}) {
  const pinEnabled = useStoryPinEnabled()
  const textY = useLayerParallax(70, -70)
  const visualY = useLayerParallax(-50, 50)

  return (
    <div className="flex h-full w-full items-center">
      <div className="w-full px-6 py-16 sm:px-12 md:px-16">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <motion.div
            style={pinEnabled ? { y: textY } : undefined}
            className={`will-change-transform ${flip ? "lg:order-2" : ""}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Eyebrow>{eyebrow}</Eyebrow>
              <h2 className="mt-6 font-sans text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.05]">
                {singleLine ? (
                  <>
                    {titleA}{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-300">
                      {titleB}
                    </span>
                  </>
                ) : (
                  <>
                    {titleA}
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-300">
                      {titleB}
                    </span>
                  </>
                )}
              </h2>
              <p className="mt-5 max-w-xl text-[15px] sm:text-[17px] leading-relaxed text-white/60">
                {body}
              </p>
              {children}
            </motion.div>
          </motion.div>
          <motion.div
            style={pinEnabled ? { y: visualY } : undefined}
            className={`will-change-transform ${flip ? "lg:order-1" : ""}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {visual}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* Section 1 — model choice ---------------------------------------------- */

function ModelChoiceVisual() {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#0a0f1c]/90 p-6 sm:p-8 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
      <div className="flex items-start justify-between gap-2">
        {models.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, scale: 0.6, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: i * 0.1,
            }}
            className="group relative flex flex-1 flex-col items-center text-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3 + i * 0.45,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.35,
              }}
            >
              <div
                className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border-2 bg-white/[0.04] transition-all duration-200 group-hover:scale-115 sm:h-[72px] sm:w-[72px]"
                style={{
                  borderColor: `${m.tint}66`,
                  boxShadow: `0 12px 30px -12px ${m.tint}`,
                }}
              >
                {m.logo ? (
                  <img
                    src={m.logo}
                    alt={m.name}
                    className="h-10 w-10 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {m.glyph}
                  </span>
                )}
              </div>
            </motion.div>
            <div className="mt-2.5 text-[12px] font-semibold text-white/85">
              {m.name}
            </div>
            {/* Tooltip */}
            <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-lg border border-white/10 bg-black/80 px-2.5 py-1 font-mono text-[10px] text-white/80 opacity-0 backdrop-blur transition-all duration-200 group-hover:-top-10 group-hover:opacity-100">
              {m.name} · ready
            </span>
          </motion.div>
        ))}
      </div>

      {/* Circuit bus with sequential node pulses */}
      <div className="relative my-2" aria-hidden="true">
        <svg
          viewBox="0 0 400 44"
          className="h-11 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M 50 20 L 350 20"
            stroke="rgba(56,189,248,0.3)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="20"
            stroke="rgba(56,189,248,0.3)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="150"
            y1="0"
            x2="150"
            y2="20"
            stroke="rgba(56,189,248,0.3)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="250"
            y1="0"
            x2="250"
            y2="20"
            stroke="rgba(56,189,248,0.3)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="350"
            y1="0"
            x2="350"
            y2="20"
            stroke="rgba(56,189,248,0.3)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="200"
            y1="20"
            x2="200"
            y2="44"
            stroke="rgba(56,189,248,0.3)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 50 0 L 50 20 L 200 20 L 200 44"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="1 5"
            fill="none"
            style={{ animation: "dash-flow 1s linear infinite" }}
          />
          <path
            d="M 350 0 L 350 20 L 200 20 L 200 44"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="1 5"
            fill="none"
            style={{ animation: "dash-flow 1s linear infinite" }}
          />
          {[50, 150, 250, 350].map((cx, i) => (
            <motion.circle
              key={cx}
              cx={cx}
              cy={20}
              r={4}
              fill="#38bdf8"
              animate={{ opacity: [0.35, 1, 0.35], r: [3, 5, 3] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
          ))}
          <circle
            cx="200"
            cy="20"
            r="4.5"
            fill="#7dd3fc"
            style={{ filter: "drop-shadow(0 0 6px rgba(125,211,252,1))" }}
          />
          <polygon points="196,40 204,40 200,44" fill="#38bdf8" />
        </svg>
      </div>

      <motion.div
        className="rounded-xl border border-sky-500/25 bg-sky-500/[0.07] px-4 py-3 text-center"
        animate={{
          boxShadow: [
            "0 0 0px rgba(56,189,248,0)",
            "0 0 24px -4px rgba(56,189,248,0.35)",
            "0 0 0px rgba(56,189,248,0)",
          ],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
          Shared project-state layer
        </span>
      </motion.div>
    </div>
  )
}

/* Section 2 — connectors ------------------------------------------------- */

const CONNECTOR_PICK = ["Revit", "QGIS", "SAP2000", "MS Project", "AutoCAD"]

function ConnectorGridVisual() {
  const items = CONNECTOR_PICK.map(
    (label) => ecosystem.find((e) => e.label === label)!,
  ).filter(Boolean)
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#0a0f1c]/90 p-5 sm:p-6 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((e, i) => (
          <motion.div
            key={e.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.45,
              delay: i * 0.07,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -5 }}
            className="group flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 transition-colors duration-200 hover:border-sky-500/40 hover:bg-white/[0.05] hover:shadow-[0_0_28px_-6px_rgba(56,189,248,0.4)]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/[0.12] bg-[#0a0e17]/85">
              {e.logo ? (
                <img
                  src={e.logo}
                  alt={e.label}
                  className="h-6 w-6 object-contain transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <span className="text-[13px] font-bold text-white">
                  {e.glyph}
                </span>
              )}
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">
                {e.label}
              </div>
              <div className="font-mono text-[10px] text-white/40">
                connector
              </div>
            </div>
          </motion.div>
        ))}
        <motion.a
          href={mailtoHref}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.45,
            delay: items.length * 0.07,
            ease: [0.16, 1, 0.3, 1],
          }}
          whileHover={{ y: -5 }}
          className="group flex items-center justify-center gap-2 rounded-2xl border border-dashed border-sky-500/40 bg-sky-500/[0.06] px-4 py-3.5 text-sm font-semibold text-sky-300 transition-colors duration-200 hover:bg-sky-500/[0.12]"
        >
          <span className="text-lg leading-none transition-transform duration-300 group-hover:rotate-90">
            +
          </span>
          Request one
        </motion.a>
      </div>
    </div>
  )
}

/* Section 3 — skills ------------------------------------------------------ */

function SkillShowcaseVisual() {
  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        initial={{ opacity: 0, rotateX: 10, y: 30 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0f1c]/90 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
      >
        {/* dot-grid backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(56,189,248,0.14) 1px, transparent 1.4px)",
            backgroundSize: "22px 22px",
          }}
        />
        {/* Window bar */}
        <div className="relative flex items-center justify-between border-b border-white/[0.07] px-6 py-3">
          <span className="font-mono text-[12px] tracking-wide text-white/50">
            AiConnect — Skills
          </span>
          <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_2px_rgba(56,189,248,0.5)] animate-pulse" />
        </div>
        <div className="relative grid grid-cols-1 gap-2.5 p-5 sm:grid-cols-2 sm:p-6">
          {skills.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
              whileHover={{ y: -3, borderColor: "rgba(56,189,248,0.4)" }}
              className="group flex items-center justify-between gap-2 rounded-xl border border-white/[0.07] bg-black/40 px-3.5 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sky-500/15 transition-transform duration-200 group-hover:rotate-12">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-sky-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
                  </svg>
                </span>
                <span className="truncate text-[12.5px] font-semibold text-white/90">
                  {s.name}
                </span>
              </div>
              <span className="shrink-0 rounded-full bg-white/[0.05] px-2 py-0.5 font-mono text-[9px] text-white/40 transition-colors group-hover:bg-sky-500/20 group-hover:text-sky-300">
                {s.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* Section 4 — guides ------------------------------------------------------- */

const GUIDE_BODY: {
  heading: string
  lines: string[]
  steps?: string[]
  prompt?: string
}[] = [
  {
    heading: "What AiConnect does",
    lines: [
      "Links AI agents to live engineering software through a local daemon.",
      "Your agent drives real tools — not tutorials, not screenshots.",
    ],
  },
  {
    heading: "What you need",
    lines: [
      "Windows 10+, macOS 12+, or Linux. Python 3.10 or newer.",
      "An API key for a compatible model — Claude, GPT, DeepSeek, or GLM.",
    ],
  },
  {
    heading: "Get it running",
    lines: [
      "Download the installer for your platform, run it, launch AiConnect.",
    ],
  },
  {
    heading: "Connect the Revit connector",
    lines: [
      "Link AiConnect to your running Revit session so your agent can read and edit the active model.",
    ],
    steps: [
      "Open Revit and load your project",
      "Enable the AiConnect add-in",
      "Approve the secure local link",
    ],
  },
  {
    heading: "Copy, paste, run",
    lines: [
      "Start with a small task. Watch the agent work against real geometry, then scale up.",
    ],
    prompt: "Generate a slab quantity takeoff for Level 2 and export to Excel.",
  },
  {
    heading: "Work smarter",
    lines: [
      "Pair connectors with Skills — takeoff in Revit, analyze in QGIS, report in Excel.",
      "Automate whatever you do twice.",
    ],
  },
  {
    heading: "Stuck? Start here",
    lines: [
      "Check that port 8788 is open.",
      "Verify the add-in is enabled, then restart the daemon.",
    ],
  },
]

function Typewriter({
  text,
  speed = 16,
}: {
  text: string
  speed?: number
}) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    const id = setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          clearInterval(id)
          return v
        }
        return v + 2
      })
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return (
    <span>
      {text.slice(0, n)}
      <span className="animate-pulse text-sky-300">▍</span>
    </span>
  )
}

function GuideShowcaseVisual() {
  const [active, setActive] = useState(3)
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0f1c]/90 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-3">
        <span className="font-mono text-[12px] tracking-wide text-white/50">
          Connector guide — Revit
        </span>
        <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_2px_rgba(56,189,248,0.5)] animate-pulse" />
      </div>
      <div className="grid grid-cols-[150px_1fr] sm:grid-cols-[170px_1fr]">
        {/* Sidebar with progress rail */}
        <div className="relative border-r border-white/[0.07] bg-white/[0.015] p-3">
          <div
            className="absolute bottom-3 left-3 top-3 w-px bg-white/[0.07]"
            aria-hidden="true"
          />
          <motion.div
            className="absolute left-3 top-3 w-px bg-gradient-to-b from-sky-400 to-blue-500 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
            aria-hidden="true"
            animate={{
              height: `calc(${((active + 1) / guideSteps.length) * 100}% - 24px)`,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          />
          {guideSteps.map((g, i) => (
            <button
              key={g}
              onClick={() => setActive(i)}
              className={`relative mb-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[11.5px] font-medium transition-all duration-200 ${
                i === active
                  ? "bg-sky-500/15 text-sky-300"
                  : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
              }`}
            >
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border font-mono text-[9px] transition-colors ${
                  i === active
                    ? "border-sky-400/60 text-sky-300"
                    : "border-white/15 text-white/35"
                }`}
              >
                {i + 1}
              </span>
              <span className="leading-tight">{g}</span>
            </button>
          ))}
        </div>
        {/* Content */}
        <div className="min-h-[300px] p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                Step {active + 1} — {guideSteps[active]}
              </p>
              <h4 className="mt-2 text-[17px] font-bold text-white">
                {GUIDE_BODY[active].heading}
              </h4>
              <div className="mt-2.5 space-y-1.5">
                {GUIDE_BODY[active].lines.map((l) => (
                  <p
                    key={l}
                    className="text-[12.5px] leading-relaxed text-white/55"
                  >
                    {l}
                  </p>
                ))}
              </div>
              {GUIDE_BODY[active].steps && (
                <ol className="mt-4 space-y-2.5">
                  {GUIDE_BODY[active].steps!.map((s, i) => (
                    <motion.li
                      key={s}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      className="flex items-start gap-3 text-[12.5px]"
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-sky-500/40 font-mono text-[10px] text-sky-300">
                        {i + 1}
                      </span>
                      <span className="text-white/60">{s}</span>
                    </motion.li>
                  ))}
                </ol>
              )}
              {GUIDE_BODY[active].prompt && (
                <div className="mt-4 rounded-xl border border-white/[0.07] bg-black/40 p-3.5 font-mono text-[11px] leading-relaxed text-white/60">
                  <span className="text-sky-300">prompt&gt; </span>
                  <Typewriter text={`"${GUIDE_BODY[active].prompt}"`} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* Exported sections --------------------------------------------------------- */

export function ModelsSection() {
  return (
    <FeatureShell
      eyebrow="Model choice"
      titleA="Use the AI model"
      titleB="that fits the task."
      body="Switch models without losing context. AiConnect isn't owned by any AI company — Claude for drafting, DeepSeek for math, GPT for handover. The project follows you."
      visual={<ModelChoiceVisual />}
    />
  )
}

export function ConnectorsSection() {
  return (
    <FeatureShell
      eyebrow="Connectors"
      titleA="Give AI access to"
      titleB="the software that does the real work."
      body="BIM, CAD, GIS, photogrammetry, spreadsheets, documents — through a connector library that keeps growing. Need something missing? Just request it."
      visual={<ConnectorGridVisual />}
      flip
    >
      <motion.a
        href={mailtoHref}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_-6px_rgba(59,130,246,0.45)]"
      >
        Request a connector →
      </motion.a>
    </FeatureShell>
  )
}

export function SkillsSection() {
  return (
    <FeatureShell
      eyebrow="Reusable workflows"
      titleA="Repeat once,"
      titleB="automate forever."
      body="Connectors are only half the system. Skills are ready-made workflows for recurring jobs — download one, hand it to your agent, done."
      visual={<SkillShowcaseVisual />}
    />
  )
}

export function GuidesSection() {
  return (
    <FeatureShell
      eyebrow="Complete guides"
      titleA="Know what to do,"
      titleB="not just what to click."
      body="Every connector ships with guidance. Anyone can drive software through AI — no AI-specialist badge required."
      visual={<GuideShowcaseVisual />}
      flip
      singleLine
    />
  )
}
