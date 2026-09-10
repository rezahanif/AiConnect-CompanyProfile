import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CliffVilla3DCanvas } from './CliffVilla3DCanvas'

export function CliffVillaSection({ visible = true }: { visible?: boolean }) {
  const [pulseBurst, setPulseBurst] = useState(0)
  const [simStatus, setSimStatus] = useState<
    'idle' | 'scanning_gis' | 'fea_solving' | 'bim_assembling' | 'converged'
  >('idle')
  const [hasExecuted, setHasExecuted] = useState(false)
  const [simProgress, setSimProgress] = useState(0)
  const [currentLevel, setCurrentLevel] = useState('0/5')
  const [memberCount, setMemberCount] = useState(0)
  const [concreteVolume, setConcreteVolume] = useState('0')
  const [lodStatus, setLodStatus] = useState('INITIALIZING')
  const [currentStageText, setCurrentStageText] = useState('')
  const simTimerRef = useRef<any>(null)

  const handleRunSimulation = () => {
    if (simStatus !== 'idle' && simStatus !== 'converged') return
    clearInterval(simTimerRef.current)

    setHasExecuted(true)
    setPulseBurst((prev) => prev + 1)
    setSimStatus('scanning_gis')
    setSimProgress(0)
    setCurrentLevel('Level 0')
    setMemberCount(0)
    setConcreteVolume('0')
    setLodStatus('PROCESSING')
    setCurrentStageText('Phase 01: Footings & Grid Alignment (A-D, 1-3)')

    const start = performance.now()
    const duration = 7200 // 7.2s smooth construction sequence

    simTimerRef.current = setInterval(() => {
      const elapsed = performance.now() - start
      const progress = Math.min(100, (elapsed / duration) * 100)
      setSimProgress(progress)

      if (progress < 25) {
        // Stage 1: Footings & Foundation (0% - 25%)
        setSimStatus('scanning_gis')
        setCurrentStageText('Phase 01: Casting Foundation Footings & Grid Axes')
        const t = progress / 25
        setCurrentLevel('Level 0 (Footings)')
        setMemberCount(Math.floor(t * 24))
        setConcreteVolume((t * 48).toFixed(0))
        setLodStatus('LOD 200 (Foundations)')
      } else if (progress < 55) {
        // Stage 2: Columns Extrusion (25% - 55%)
        setSimStatus('fea_solving')
        setCurrentStageText('Phase 02: Extruding 12 Structural Columns (W14x90)')
        const t = (progress - 25) / 30
        const activeFloor = Math.min(5, Math.floor(t * 3) + 1)
        setCurrentLevel(`Level ${activeFloor} of 5`)
        setMemberCount(Math.floor(24 + t * 48))
        setConcreteVolume((48 + t * 110).toFixed(0))
        setLodStatus('LOD 300 (Framing)')
      } else if (progress < 85) {
        // Stage 3: Floor Girders & Secondary Joists (55% - 85%)
        setSimStatus('bim_assembling')
        setCurrentStageText('Phase 03: Framing Girders, Core Walls & Bracing')
        const t = (progress - 55) / 30
        setCurrentLevel('Level 5 (Roof Deck)')
        setMemberCount(Math.floor(72 + t * 96))
        setConcreteVolume((158 + t * 184).toFixed(0))
        setLodStatus('LOD 350 (Full Detailing)')
      } else {
        // Stage 4: Converged & Model Synchronized (85% - 100%)
        clearInterval(simTimerRef.current)
        setSimStatus('converged')
        setCurrentStageText('✓ Phase 04: Revit Structural Model Synchronized')
        setSimProgress(100)
        setCurrentLevel('All 5 Levels (18.0m)')
        setMemberCount(168)
        setConcreteVolume('342')
        setLodStatus('LOD 350 Certified')

        setTimeout(() => {
          setSimStatus('idle')
        }, 9000)
      }
    }, 50)
  }

  return (
    <section
      id="civil"
      className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-transparent px-6 py-4 sm:px-12 sm:py-5 select-none"
    >
      {/* --- CENTER STAGE: 3D High-End Revit Structural Skeleton Canvas --- */}
      <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center my-auto">
        {visible && (
          <CliffVilla3DCanvas
            pulseBurst={pulseBurst}
            simStatus={simStatus}
            simProgress={simProgress}
          />
        )}

        {/* --- LEFT OVERLAY: Revit Structural Narrative --- */}
        <div data-layer-text className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 z-20 flex max-w-sm sm:max-w-md lg:max-w-lg flex-col items-start text-left">
          {/* Eyebrow */}
          <div className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs tracking-[0.22em] uppercase text-sky-400">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>CASE STUDY 02 // BIM &amp; STRUCTURAL ENGINEERING</span>
          </div>

          {/* Main Title */}
          <h2 className="font-sans text-4xl sm:text-5xl lg:text-[56px] font-black tracking-[-0.035em] text-white leading-[0.94]">
            Autodesk Revit & SAP2000
            <br />
            Structural BIM
          </h2>

          {/* Lead Description - Rata Kanan Kiri (Justified) */}
          <p
            style={{ textAlign: 'justify' }}
            className="mt-4 font-sans text-sm sm:text-base lg:text-[16.5px] leading-relaxed text-muted/90 font-normal max-w-[360px] sm:max-w-[430px] text-justify"
          >
            Automate multi-story structural framing, column-beam connection grids, and parametric BIM families directly from AI agents. Extrude levels, verify reinforcement standards, and extract real-time Quantity Takeoff (QTO) schedules with zero manual drafting.
          </p>

          {/* Case Spec Pill */}
          <div className="mt-4 inline-flex items-center gap-2 font-mono text-[10.5px]">
            <span className="rounded border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-sky-300 font-medium">
              AUTODESK REVIT 2026
            </span>
            <span className="text-white/40">•</span>
            <span className="text-white/70">Parametric Structural Framing</span>
          </div>

          {/* High-Tech Capability Badges */}
          <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px]">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              5-Story Column Grid
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              Steel &amp; Rebar LOD 350
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Automated QTO Schedule
            </span>
          </div>

          {/* Real-Time Telemetry status indicator when active on left */}
          {simStatus !== 'idle' && (
            <div className="pointer-events-auto mt-4 inline-flex items-center gap-2 rounded-lg border border-sky-500/25 bg-black/60 px-3.5 py-1.5 font-mono text-[10.5px] text-sky-300 backdrop-blur-md">
              <span
                className={`h-1.5 w-1.5 rounded-full ${simStatus === 'converged'
                  ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                  : 'bg-sky-400 animate-ping'
                  }`}
              />
              <span className="font-semibold">{currentStageText}</span>
              <span className="text-white/40">({Math.round(simProgress)}%)</span>
            </div>
          )}
        </div>

        {/* --- RIGHT OVERLAY: AI Agent Desktop Window (Claude Sonnet + Revit MCP Connector) --- */}
        <div data-layer-text className="pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden lg:flex w-full max-w-[420px] xl:max-w-[450px] flex-col items-end text-left select-none">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full overflow-hidden rounded-2xl border border-white/[0.09] bg-[#090d18]/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          >
            {/* Window Chrome Header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                <span className="ml-2 font-mono text-[11px] text-white/50">AiConnect — Desktop</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_1px_#38bdf8]" />
                <span className="text-sky-400/90 font-medium">MCP:8788</span>
              </div>
            </div>

            {/* Agent Conversation Body */}
            <div className="p-4 space-y-3">
              {/* Agent Identifier Header */}
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-md bg-white shadow-sm">
                  <img
                    src="/logos/logo-claude.png"
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="text-[13px] font-semibold text-white/90">Claude · Sonnet 5.0</span>
                <span className="ml-auto rounded-full bg-sky-500/15 border border-sky-500/25 px-2 py-0.5 font-mono text-[9px] text-sky-300">
                  bim · agent
                </span>
              </div>

              {/* User Prompt Bubble with Interactive Action button */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-[12px] leading-relaxed text-white/80">
                <div className="mb-1.5 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-white/40" />
                    USER PROMPT
                  </span>
                  <span className="text-[9px] text-white/30">Just now</span>
                </div>
                <p className="text-white/85 text-[11.5px] leading-relaxed mb-3">
                  "Generate a 5-story parametric steel and concrete structural frame with 6m x 6m column bays, primary girders, and export Revit LOD 350 QTO schedule."
                </p>

                {/* GENERATE REVIT BIM Action Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRunSimulation}
                  className={`group relative w-full flex items-center justify-center gap-2 rounded-lg py-2 px-3 font-mono text-[10.5px] font-bold uppercase tracking-wider transition-all border ${simStatus === 'converged'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : simStatus === 'bim_assembling'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                      : simStatus === 'fea_solving'
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                        : simStatus === 'scanning_gis'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                          : 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white border-sky-400/30 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:from-sky-400 hover:to-blue-500'
                    }`}
                >
                  {simStatus === 'idle' && (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]" />
                      <span>GENERATE REVIT BIM STRUCTURE</span>
                      <span className="text-white/60 font-normal ml-0.5">↵</span>
                    </>
                  )}
                  {simStatus === 'scanning_gis' && (
                    <>
                      <span className="h-2 w-2 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                      <span>1/4 ALIGNING GRIDS &amp; FOOTINGS...</span>
                    </>
                  )}
                  {simStatus === 'fea_solving' && (
                    <>
                      <span className="h-2 w-2 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                      <span>2/4 EXTRUDING 12 COLUMN STACKS...</span>
                    </>
                  )}
                  {simStatus === 'bim_assembling' && (
                    <>
                      <span className="h-2 w-2 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                      <span>3/4 FRAMING GIRDERS &amp; SLABS...</span>
                    </>
                  )}
                  {simStatus === 'converged' && (
                    <>
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>LOD 350 GENERATED · RE-RUN</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Agent Response & Viewport Telemetry - Revealed ONLY after clicking RUN */}
              <AnimatePresence>
                {hasExecuted && (
                  <motion.div
                    initial={{ opacity: 0, y: 14, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="space-y-3 overflow-hidden"
                  >
                    {/* Agent Response & MCP Connector Execution Bubble */}
                    <div className="rounded-xl border border-sky-500/25 bg-sky-500/[0.07] p-3 text-[12px] leading-relaxed shadow-[0_0_20px_-5px_rgba(56,189,248,0.12)]">
                      <p className="text-white/90">
                        Invoking Revit API &amp; Dynamo connector: Placing 12 structural columns, primary W-shape girders, central shear core walls, and exporting real-time QTO volume schedules.
                      </p>
                      <div className="mt-2.5 flex items-center justify-between border-t border-sky-500/20 pt-2 font-mono text-[10px]">
                        <div className="flex items-center gap-2 text-sky-300">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${simStatus === 'converged'
                              ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                              : simStatus !== 'idle'
                                ? 'bg-sky-400 animate-pulse'
                                : 'bg-sky-400'
                              }`}
                          />
                          <span className="tracking-tight">
                            {simStatus === 'idle' && 'revit.connector · idle'}
                            {simStatus === 'scanning_gis' && 'revit.api · placing foundation footings'}
                            {simStatus === 'fea_solving' && 'revit.api · extruding structural columns'}
                            {simStatus === 'bim_assembling' && 'revit.api · framing girders & slabs'}
                            {simStatus === 'converged' && 'revit.qto · schedule exported to Excel'}
                          </span>
                        </div>
                        <span className="text-white/40">PID 8788</span>
                      </div>
                    </div>

                    {/* Revit Viewport & Live Telemetry Inspector */}
                    <div className="rounded-xl border border-white/[0.08] bg-[#070b16]/90 p-3">
                      <div className="mb-2 flex items-center justify-between font-mono text-[10px]">
                        <span className="text-white/50">Revit · CommercialStructure-BIM.rvt</span>
                        <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-sky-300">
                          BIM / STRUCTURAL
                        </span>
                      </div>

                      {/* Progress Bar & Phase Status */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span
                            className={`${simStatus === 'converged'
                              ? 'text-emerald-400 font-semibold'
                              : 'text-sky-300'
                              }`}
                          >
                            {currentStageText || 'Phase 00: Parametric Model Ready'}
                          </span>
                          <span className="text-white/40">{Math.round(simProgress)}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                          <motion.div
                            className={`h-full transition-all duration-75 ${simStatus === 'converged'
                              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.9)]'
                              : 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]'
                              }`}
                            style={{ width: `${simStatus === 'idle' ? 100 : simProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* 4-Tile Telemetry Metrics Grid */}
                      <div className="mt-2.5 grid grid-cols-2 gap-1.5 font-mono text-[9px]">
                        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-2 py-1 text-white/50">
                          Stories Extruded{' '}
                          <span className="float-right text-sky-300 font-semibold">
                            {currentLevel}
                          </span>
                        </div>
                        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-2 py-1 text-white/50">
                          Framing Elements{' '}
                          <span className="float-right text-white font-semibold">
                            {memberCount > 0 ? `${memberCount} Beams/Cols` : '168 Beams/Cols'}
                          </span>
                        </div>
                        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-2 py-1 text-white/50">
                          Concrete QTO Volume{' '}
                          <span className="float-right text-emerald-300 font-semibold">
                            {concreteVolume !== '0' ? `${concreteVolume} m³` : '342 m³'}
                          </span>
                        </div>
                        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-2 py-1 text-white/50">
                          Detailing LOD{' '}
                          <span className="float-right text-sky-300 font-semibold">
                            {lodStatus}
                          </span>
                        </div>
                      </div>

                      {/* AISC 360 / ACI 318 Structural Compliance Callout */}
                      <div className="mt-2 flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/[0.08] px-2.5 py-1.5 font-mono text-[9px]">
                        <span className="text-emerald-300 font-medium">AISC 360-22 / ACI 318 COMPLIANCE</span>
                        <span className="rounded bg-emerald-400/20 px-1.5 py-0.5 text-emerald-300 font-bold text-[8px]">
                          PASS (LOD 350 VERIFIED)
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress Store Footer Bar (AiConnect Brand Standard) */}
            <div className="flex items-center gap-2.5 border-t border-white/[0.07] bg-white/[0.015] px-4 py-2.5 font-mono text-[10px]">
              <span className="grid h-5 w-5 place-items-center rounded bg-sky-500/20 text-sky-300">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3 w-3 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 7c0-1.5 3.6-2.5 8-2.5s8 1 8 2.5-3.6 2.5-8 2.5S4 8.5 4 7Z" />
                  <path d="M4 7v10c0 1.5 3.6 2.5 8 2.5s8-1 8-2.5V7" />
                  <path d="M4 12c0 1.5 3.6 2.5 8 2.5s8-1 8-2.5" />
                </svg>
              </span>
              <span className="font-semibold text-white/90">Progress Store</span>
              <span className="text-white/40 hidden sm:inline">
                project state saved · portable across models
              </span>
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#28c840] shadow-[0_0_8px_1px_#28c840]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
