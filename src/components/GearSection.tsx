import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Gear3DCanvas } from './Gear3DCanvas'

export function GearSection({ visible = true }: { visible?: boolean }) {
  const [pulseBurst, setPulseBurst] = useState(0)
  const [simStatus, setSimStatus] = useState<
    'idle' | 'exploding' | 'building_g1' | 'mating_g2' | 'locking_g3' | 'solving' | 'converged'
  >('idle')
  const [hasExecuted, setHasExecuted] = useState(false)
  const [simProgress, setSimProgress] = useState(0)
  const [nodeCount, setNodeCount] = useState(0)
  const [solverRpm, setSolverRpm] = useState(0)
  const [stressValue, setStressValue] = useState('0.00')
  const [residualExp, setResidualExp] = useState('1.00e-1')
  const [currentStageText, setCurrentStageText] = useState('')
  const simTimerRef = useRef<any>(null)

  const handleRunSimulation = () => {
    if (simStatus !== 'idle' && simStatus !== 'converged') return
    clearInterval(simTimerRef.current)

    setHasExecuted(true)
    setPulseBurst((prev) => prev + 1)
    setSimStatus('exploding')
    setSimProgress(0)
    setNodeCount(0)
    setSolverRpm(0)
    setStressValue('0.00')
    setResidualExp('INITIALIZING')
    setCurrentStageText('Phase 01: Exploded CAD Component Disassembly')

    const start = performance.now()
    const duration = 7200 // 7.2s authentic slow-mo deconstruct & build-from-scratch sequence

    simTimerRef.current = setInterval(() => {
      const elapsed = performance.now() - start
      const progress = Math.min(100, (elapsed / duration) * 100)
      setSimProgress(progress)

      if (progress < 14) {
        // Stage 1: Quantum Nano-Particle Dissolution into Floating Ambient Orbs (0% - 14%)
        setSimStatus('exploding')
        setCurrentStageText('Phase 01: Nano-Orb Dissolution into Floating Ambient Field')
        setNodeCount(Math.floor(progress * 2500))
        setSolverRpm(Math.floor((1 - progress / 14) * 450))
        setStressValue('0.00')
        setResidualExp('DISSOLVING')
      } else if (progress < 44) {
        // Stage 2: Sun Gear (22T) slowly gathers from ambient orbs (14% - 44%)
        setSimStatus('building_g1')
        setCurrentStageText('Phase 02: Gathering Sun Gear (22T) from Ambient Orbs')
        const t = (progress - 14) / 30
        setNodeCount(Math.floor(t * 54200))
        setSolverRpm(Math.floor(t * 350))
        setStressValue((t * 24.5).toFixed(2))
        setResidualExp('1.00e-1')
      } else if (progress < 68) {
        // Stage 3: Planetary Gear (14T) slowly gathers & meshes (44% - 68%)
        setSimStatus('mating_g2')
        setCurrentStageText('Phase 03: Gathering Planetary Gear (14T) & Involute Mating')
        const t = (progress - 44) / 24
        setNodeCount(Math.floor(54200 + t * 48000))
        setSolverRpm(Math.floor(350 + t * 450))
        setStressValue((24.5 + t * 42.0).toFixed(2))
        setResidualExp('3.50e-2')
      } else if (progress < 84) {
        // Stage 4: Satellite Pinion (10T) slowly gathers & locks (68% - 84%)
        setSimStatus('locking_g3')
        setCurrentStageText('Phase 04: Gathering Satellite Pinion (10T) & Train Lock')
        const t = (progress - 68) / 16
        setNodeCount(Math.floor(102200 + t * 40600))
        setSolverRpm(Math.floor(800 + t * 600))
        setStressValue((66.5 + t * 45.0).toFixed(2))
        setResidualExp('8.20e-3')
      } else if (progress < 96) {
        // Stage 5: Dynamic Torque Test & von Mises Heatmap (84% - 96%)
        setSimStatus('solving')
        setCurrentStageText('Phase 05: Dynamic Torque Test & von Mises Heatmap')
        const t = (progress - 84) / 12
        setNodeCount(142800)
        setSolverRpm(Math.floor(1400 + t * 2000)) // Ramps to 3,400 RPM
        setStressValue((111.5 + t * 137.02).toFixed(2)) // Ramps to 248.52 MPa
        const resVal = Math.max(1e-5, 1e-3 * Math.pow(0.01, t))
        setResidualExp(resVal.toExponential(2))
      } else {
        // Stage 6: Converged (96% - 100%)
        clearInterval(simTimerRef.current)
        setSimStatus('converged')
        setCurrentStageText('✓ Phase 06: Solution Converged (Residual < 1e-6)')
        setSimProgress(100)
        setNodeCount(142800)
        setSolverRpm(1200)
        setStressValue('248.52')
        setResidualExp('< 8.42e-7')

        setTimeout(() => {
          setSimStatus('idle')
        }, 9000)
      }
    }, 50)
  }

  return (
    <section
      id="engine"
      className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-transparent px-6 py-4 sm:px-12 sm:py-5 select-none"
    >




      {/* --- CENTER STAGE: 3D High-End Kinetic Gears & Orbital Gimbals --- */}
      <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center my-auto">
        {visible && <Gear3DCanvas pulseBurst={pulseBurst} />}

        {/* --- LEFT OVERLAY: Ansys & Mechanical FEA Simulation --- */}
        <div data-layer-text className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 z-20 flex max-w-sm sm:max-w-md lg:max-w-lg flex-col items-start text-left">
          {/* Eyebrow */}
          <div className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs tracking-[0.22em] uppercase text-sky-400">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>CASE STUDY 01 // MECHANICAL &amp; CFD</span>
          </div>

          {/* Main Title - Enlarged & High Impact */}
          <h2 className="font-sans text-4xl sm:text-5xl lg:text-[56px] font-black tracking-[-0.035em] text-white leading-[0.94]">
            Ansys CFX &amp;
            <br />
            FEA Solvers
          </h2>

          {/* Lead Description - Rata Kanan Kiri (Justified) */}
          <p
            style={{ textAlign: 'justify' }}
            className="mt-4 font-sans text-sm sm:text-base lg:text-[16.5px] leading-relaxed text-muted/90 font-normal max-w-[360px] sm:max-w-[430px] text-justify"
          >
            Drive Ansys CFX fluid dynamics and finite element structural simulations directly from AI agents via MCP. Automate involute gear meshing, inspect von Mises stress contours, and extract solver metrics in real-time.
          </p>

          {/* Case Spec Pill */}
          <div className="mt-4 inline-flex items-center gap-2 font-mono text-[10.5px]">
            <span className="rounded border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-sky-300 font-medium">
              ANSYS CFX-PRE
            </span>
            <span className="text-white/40">•</span>
            <span className="text-white/70">Involute Gear Transmission FEA</span>
          </div>

          {/* High-Tech Capability Badges */}
          <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px]">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              142,800 Conformal Mesh
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Transient Dynamics
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              Claude MCP Driver
            </span>
          </div>

          {/* Real-Time FEA Telemetry status indicator when active on left */}
          {simStatus !== 'idle' && (
            <div className="pointer-events-auto mt-4 inline-flex items-center gap-2 rounded-lg border border-sky-500/25 bg-black/60 px-3.5 py-1.5 font-mono text-[10.5px] text-sky-300 backdrop-blur-md">
              <span className={`h-1.5 w-1.5 rounded-full ${simStatus === 'converged' ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-sky-400 animate-ping'}`} />
              <span className="font-semibold">{currentStageText}</span>
              <span className="text-white/40">({Math.round(simProgress)}%)</span>
            </div>
          )}
        </div>

        {/* --- RIGHT OVERLAY: AI Agent Desktop Window (Claude Sonnet + Ansys MCP Connector) --- */}
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
                <span className="h-1.5 w-1.5 rounded-full bg-[#3b82f6] shadow-[0_0_8px_1px_#3b82f6]" />
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
                <span className="ml-auto rounded-full bg-violet-500/15 border border-violet-500/25 px-2 py-0.5 font-mono text-[9px] text-violet-300">
                  agent
                </span>
              </div>

              {/* User Prompt Bubble with Interactive RUN SIMULATION button */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-[12px] leading-relaxed text-white/80">
                <div className="mb-1.5 flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-white/40" />
                    USER PROMPT
                  </span>
                  <span className="text-[9px] text-white/30">Just now</span>
                </div>
                <p className="text-white/85 text-[11.5px] leading-relaxed mb-3">
                  "Update the 22T planetary gear mesh to high-density TET4 elements, run 1200 RPM contact dynamics in Ansys, and verify von Mises yield stress."
                </p>

                {/* RUN SIMULATION Action Button inside the prompt */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRunSimulation}
                  className={`group relative w-full flex items-center justify-center gap-2 rounded-lg py-2 px-3 font-mono text-[10.5px] font-bold uppercase tracking-wider transition-all border ${simStatus === 'converged'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : simStatus === 'solving'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                        : simStatus === 'mating_g2' || simStatus === 'locking_g3'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : simStatus !== 'idle'
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                            : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-sky-400/30 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:from-sky-400 hover:to-blue-500'
                    }`}
                >
                  {simStatus === 'idle' && (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]" />
                      <span>RUN SIMULATION VIA CLAUDE</span>
                      <span className="text-white/60 font-normal ml-0.5">↵</span>
                    </>
                  )}
                  {simStatus === 'exploding' && (
                    <>
                      <span className="h-2 w-2 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                      <span>1/5 DISSOLVING PARTICLES...</span>
                    </>
                  )}
                  {simStatus === 'building_g1' && (
                    <>
                      <span className="h-2 w-2 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                      <span>2/5 MESHING SUN GEAR (22T)...</span>
                    </>
                  )}
                  {simStatus === 'mating_g2' && (
                    <>
                      <span className="h-2 w-2 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                      <span>3/5 DOCKING PLANETARY GEAR...</span>
                    </>
                  )}
                  {simStatus === 'locking_g3' && (
                    <>
                      <span className="h-2 w-2 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                      <span>4/5 LOCKING PINION GEAR...</span>
                    </>
                  )}
                  {simStatus === 'solving' && (
                    <>
                      <span className="h-2 w-2 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
                      <span>5/5 EVALUATING DYNAMICS (1200 RPM)...</span>
                    </>
                  )}
                  {simStatus === 'converged' && (
                    <>
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>SOLVER CONVERGED · RE-RUN</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Agent Response & Ansys Solver Viewport - Revealed ONLY after clicking RUN SIMULATION */}
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
                        Opening the Ansys CFX &amp; Mechanical connector — meshing 142,800 elements, running transient dynamic solver, and recomputing tooth contact stresses.
                      </p>
                      <div className="mt-2.5 flex items-center justify-between border-t border-sky-500/20 pt-2 font-mono text-[10px]">
                        <div className="flex items-center gap-2 text-sky-300">
                          <span className={`h-1.5 w-1.5 rounded-full ${simStatus === 'converged'
                              ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                              : simStatus !== 'idle'
                                ? 'bg-sky-400 animate-pulse'
                                : 'bg-sky-400'
                            }`} />
                          <span className="tracking-tight">
                            {simStatus === 'idle' && 'ansys.connector · writing'}
                            {simStatus === 'exploding' && 'ansys.connector · decomposing geometry'}
                            {simStatus === 'building_g1' && 'ansys.connector · meshing Sun Gear (22T)'}
                            {simStatus === 'mating_g2' && 'ansys.connector · mating Planetary (14T)'}
                            {simStatus === 'locking_g3' && 'ansys.connector · locking Pinion (10T)'}
                            {simStatus === 'solving' && 'ansys.cfx.solver · transient solving 1200 RPM'}
                            {simStatus === 'converged' && 'ansys.connector · converged (residual < 1e-6)'}
                          </span>
                        </div>
                        <span className="text-white/40">PID 8788</span>
                      </div>
                    </div>

                    {/* Ansys Solver Viewport & Live Telemetry Inspector */}
                    <div className="rounded-xl border border-white/[0.08] bg-[#070b16]/90 p-3">
                      <div className="mb-2 flex items-center justify-between font-mono text-[10px]">
                        <span className="text-white/50">Ansys CFX · GearTrain-FEA.wbpj</span>
                        <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-sky-300">
                          FEA / DYNAMICS
                        </span>
                      </div>

                      {/* Progress Bar & Phase Status */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className={`${simStatus === 'converged' ? 'text-emerald-400 font-semibold' : simStatus === 'solving' ? 'text-rose-400' : 'text-sky-300'
                            }`}>
                            {currentStageText || 'Phase 00: Model Pre-check Ready'}
                          </span>
                          <span className="text-white/40">{Math.round(simProgress)}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                          <motion.div
                            className={`h-full transition-all duration-75 ${simStatus === 'converged'
                                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.9)]'
                                : simStatus === 'solving'
                                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                                  : simStatus === 'mating_g2' || simStatus === 'locking_g3'
                                    ? 'bg-gradient-to-r from-sky-500 via-amber-400 to-orange-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                                    : 'bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.8)]'
                              }`}
                            style={{ width: `${simStatus === 'idle' ? 100 : simProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* 4-Tile Telemetry Metrics Grid (Revit Viewport Style) */}
                      <div className="mt-2.5 grid grid-cols-2 gap-1.5 font-mono text-[9px]">
                        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-2 py-1 text-white/50">
                          TET4 Elements <span className="float-right text-sky-300 font-semibold">{nodeCount > 0 ? nodeCount.toLocaleString() : '142,800'}</span>
                        </div>
                        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-2 py-1 text-white/50">
                          Dynamics <span className="float-right text-white font-semibold">{solverRpm > 0 ? solverRpm : 1200} RPM</span>
                        </div>
                        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-2 py-1 text-white/50">
                          von Mises Peak <span className={`float-right font-semibold ${parseFloat(stressValue) > 200 ? 'text-rose-400' : parseFloat(stressValue) > 80 ? 'text-amber-300' : 'text-sky-300'
                            }`}>{parseFloat(stressValue) > 0 ? stressValue : '248.52'} MPa</span>
                        </div>
                        <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-2 py-1 text-white/50">
                          Residual <span className={`float-right font-semibold ${simStatus === 'converged' ? 'text-emerald-400' : 'text-sky-300'}`}>{simStatus !== 'idle' ? residualExp : '< 8.42e-7'}</span>
                        </div>
                      </div>

                      {/* Hotspot Safety Factor Callout */}
                      <div className="mt-2 flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/[0.08] px-2.5 py-1.5 font-mono text-[9px]">
                        <span className="text-emerald-300 font-medium">HOTSPOT: NODE #84219</span>
                        <span className="rounded bg-emerald-400/20 px-1.5 py-0.5 text-emerald-300 font-bold text-[8px]">
                          PASS (S.F. 1.29)
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress Store Footer Bar (AiConnect Brand Standard) */}
            <div className="flex items-center gap-2.5 border-t border-white/[0.07] bg-white/[0.015] px-4 py-2.5 font-mono text-[10px]">
              <span className="grid h-5 w-5 place-items-center rounded bg-violet-500/20 text-violet-300">
                <svg viewBox="0 0 24 24" className="h-3 w-3 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7c0-1.5 3.6-2.5 8-2.5s8 1 8 2.5-3.6 2.5-8 2.5S4 8.5 4 7Z" />
                  <path d="M4 7v10c0 1.5 3.6 2.5 8 2.5s8-1 8-2.5V7" />
                  <path d="M4 12c0 1.5 3.6 2.5 8 2.5s8-1 8-2.5" />
                </svg>
              </span>
              <span className="font-semibold text-white/90">Progress Store</span>
              <span className="text-white/40 hidden sm:inline">project state saved · portable across models</span>
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#28c840] shadow-[0_0_8px_1px_#28c840]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
